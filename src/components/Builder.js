import React, {useState, useRef, useEffect, Fragment} from 'react'
import ReCAPTCHA from "react-google-recaptcha"
import {child, get, ref} from "firebase/database"
import {db} from "../../src/components/db/firebase"
import {useRouter} from "next/router"
import {useContext} from "react"
import {RegionContext} from "../../pages/_app"

const initialQuestion = {
  id: '',
  question: '',
  status: false,
  trueAnswer: '',
  variants: []
}

let Step = ({
              indicator,
              label,
              navigateToStepHandler,
              index,
              isActive,
              isComplete,
              isWarning,
              isError,
              isRightToLeftLanguage,
            }) => {
  const classes = [''];

  if (isActive) {
    classes.push('is-active');
  }
  if (isComplete) {
    classes.push('is-complete');
  }
  if (isWarning) {
    classes.push('is-warning');
  }
  if (isError) {
    classes.push('is-error');
  }
  if (isRightToLeftLanguage) {
    classes.push('rightToLeft');
  }

  return (
    <div className={`stepper-step ${classes.join(' ')}`}>
      <div className="stepper-indicator">
				<span
          className="stepper-indicator-info"
          onClick={isComplete || isError ? () => navigateToStepHandler(index) : null}
        >
					{isComplete ? (
            <svg className="stepper-tick" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490">
              <path d="M452.253 28.326L197.831 394.674 29.044 256.875 0 292.469l207.253 169.205L490 54.528z"/>
            </svg>
          ) : (
            indicator
          )}
				</span>
      </div>
      <div className="stepper-label">{label}</div>
    </div>
  );
};


let StepperHead = ({
                     stepperContent,
                     navigateToStepHandler,
                     isVertical,
                     isInline,
                     isRightToLeftLanguage,
                     currentTabIndex,
                   }) => (
  <div
    className={`stepper-head ${isVertical ? 'vertical-stepper-head' : ''} ${
      isInline ? 'inline-stepper-head' : ''
    }`}
  >
    {stepperContent.map((el, i) => (
      <Step
        key={i}
        index={i}
        navigateToStepHandler={navigateToStepHandler}
        isActive={i === currentTabIndex}
        isComplete={el.isComplete}
        isWarning={el.isWarning}
        isError={el.isError}
        isRightToLeftLanguage={isRightToLeftLanguage}
        indicator={i + 1}
        label={el.label}
      />
    ))}
  </div>
)

let StepperFooter = ({
                       isPrevBtn,
                       previousStepHandler,
                       isLastStep,
                       nextStepHandler,
                       submitHandler,
                       stepperContent,
                       currentTabIndex,
                       reCaptcha,
                     }) => {
  const submitCurrentStep = async () => {
    await stepperContent[currentTabIndex].clicked();
    nextStepHandler();
  };

  return (
    <div
      className="stepper-footer"
      style={{justifyContent: isPrevBtn ? 'space-between' : 'flex-end'}}
    >
      {isPrevBtn && (
        <button className="stepper-footer-btn" onClick={previousStepHandler}>{stepperContent[currentTabIndex - 1].label}</button>
      )}
      <button
        className={`stepper-footer-btn ${isLastStep ? 'success' : 'primary'}`}
        onClick={
          isLastStep
            ? submitHandler
            : stepperContent[currentTabIndex].clicked
              ? submitCurrentStep
              : nextStepHandler
        }
        disabled={
          (isLastStep
            ? stepperContent.some((el) => !el.isComplete)
            : !stepperContent[currentTabIndex].isComplete) ||
          stepperContent[currentTabIndex].isLoading
        }
      >
        {isLastStep ? 'Відправити' : `${stepperContent[currentTabIndex + 1].label} >`}
      </button>
    </div>
  )
}

let Stepper = ({isRightToLeftLanguage, isVertical, isInline, stepperContent, submitStepper, reCaptcha, submit}) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0),
    isLastStep = currentTabIndex === stepperContent.length - 1,
    isPrevBtn = currentTabIndex !== 0;

  const navigateToStepHandler = (index) => {
    if (index !== currentTabIndex) {
      setCurrentTabIndex(index);
    }
  };

  const nextStepHandler = () => {
    setCurrentTabIndex((prev) => {
      if (prev !== stepperContent.length - 1) {
        return prev + 1;
      }
    });
  };

  const previousStepHandler = () => {
    setCurrentTabIndex((prev) => prev - 1);
  };

  const submitHandler = () => {
    submitStepper()
    submit()
  };

  return (
    <div className="stepper-wrapper">
      <div style={{display: isVertical ? 'flex' : 'block'}}>
        <StepperHead
          stepperContent={stepperContent}
          navigateToStepHandler={navigateToStepHandler}
          isVertical={isVertical}
          isInline={isInline}
          currentTabIndex={currentTabIndex}
          isRightToLeftLanguage={isRightToLeftLanguage}
        />
        <div className="stepper-body">
          {stepperContent.map((el, i) => (
            <Fragment key={i}>{i === currentTabIndex && el.content}</Fragment>
          ))}
        </div>
      </div>
      <StepperFooter
        isPrevBtn={isPrevBtn}
        previousStepHandler={previousStepHandler}
        isLastStep={isLastStep}
        nextStepHandler={nextStepHandler}
        submitHandler={submitHandler}
        stepperContent={stepperContent}
        currentTabIndex={currentTabIndex}
        reCaptcha={reCaptcha}
      />
    </div>
  )
}

const Builder = ({
                   setLoading, submit, setSubmitting,
                   setFormData, formData, error, reCaptcha, setRecaptcha, arrayQuestions, setArrayQuestions, regionItemId
                 }) => {

  const [acceptFirstTerms, setAcceptFirstTerms] = useState({
      checked: false,
      touched: false,
    }),
    [acceptSecondTerms, setAcceptSecondTerms] = useState({
      checked: false,
      touched: false,
    }),
    [acceptThirdTerms, setAcceptThirdTerms] = useState({
      checked: false,
      touched: false,
    }),
    [isSecondStepLoading, setIsSecondStepLoading] = useState(false)


  const targetRef = useRef()
  const tasksRef = ref(db)
  const router = useRouter()

  const isProduction = process.env.NODE_ENV === 'production'
  const siteKey = isProduction ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'


  const [questionsData, setQuestionsData] = useState(initialQuestion)
  const [variant, setVariant] = useState('')
  const [variantsArray, setVariantsArray] = useState([])

  const [regionData, setRegionData] = useState([])

  console.log(regionData, 'regionData')

  const contextRegion = useContext(RegionContext)
  console.log(contextRegion, 'builder')


  const inputChangeVariant = (e) => {
    setVariant(e.target.value)
  }

  const inputSubmitVariant = (e) => {
    e.preventDefault()
    if (variant.trim()) {
      setVariantsArray([...variantsArray, variant]);
      setVariant('')
    }
  }

  const handleDelete = (index) => {
    setVariantsArray(variantsArray.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    setQuestionsData({ ...questionsData, variants: variantsArray })
    setArrayQuestions((prevArray) => [...prevArray, questionsData])
    setQuestionsData(initialQuestion)
    setVariantsArray([])
  }

  useEffect(() => {
    setQuestionsData({ ...questionsData, variants: variantsArray })
  }, [variantsArray])



  // useEffect(() => {
  //   setLoadingDb(true)
  //   onValue(tasksRef, (snapshot) => {
  //     const data = snapshot.val()
  //     if (data !== undefined) {
  //       const dataArray = Object.keys(data?.cloud || {}).length > 0 ? Object.values(data.cloud) : []
  //       setDataCloud(dataArray)
  //     }
  //   })
  //   fetchAllCloudData()
  // }, [])

  // const fetchAllCloudData = () => {
  //   get(tasksRef).then((snapshot) => {
  //     const data = snapshot.val()
  //     if (data !== undefined) {
  //       const dataArray = Object.keys(data?.cloud || {}).length > 0 ? Object.values(data.cloud) : []
  //       setData // const [formData, setFormData] = useState(initialFormData)
  //   // const [loading, setLoading] = useState(false)
  //   // const [isOpen, setIsOpen] = useState(false)
  //   //
  //   // const [error, setError] = useState('')
  //   // const [submitting, setSubmitting] = useState(false)
  //   // const [reCaptcha, setRecaptcha] = useState(false)Cloud(dataArray)
  //       setLoadingDb(false)
  //     }
  //   }).catch((err) => {
  //     console.error(err)
  //   })
  // }

  useEffect(() => {
    const getFormApp = async (regionItemId) => {
      try {
        get(child(tasksRef, `regions/${regionItemId}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const dataArray = Object.keys(snapshot.val() || {}).length > 0 ? Object.values(snapshot.val()) : []
            setRegionData(dataArray)
          } else {
            console.log("No data available")
          }
        }).catch((err) => {
          console.error(err)
        })
      } catch (error) {
        console.log(error)
      }
    }

    if (router.isReady) {
      getFormApp(regionItemId).catch((error) => {
        console.log(error)
      })
    }
  }, [router.isReady, router.query.form])

  // useEffect(() => {
  //   document.body.classList.toggle('modal-open', isOpen)
  // }, [isOpen])



  // useEffect(() => {
  //   if (submitting) setError(validation(formData.title))
  // }, [formData.title])

  const firstTermsHandler = () => {
    setAcceptFirstTerms((prev) => ({checked: !prev.checked, touched: true}));
  };

  const secondTermsHandler = () => {
    setAcceptSecondTerms((prev) => ({checked: !prev.checked, touched: true}));
  };

  const thirdTermsHandler = () => {
    setAcceptThirdTerms((prev) => ({checked: !prev.checked, touched: true}));
  };

  //for demo purposes only
  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const secondStepAsyncFunc = async () => {
    //it can be an API call
    setIsSecondStepLoading(true);
    await timeout(3000);
    setIsSecondStepLoading(false);
    console.log('second step clicked');
  };

  const stepperContent = [
    {
      label: 'Крок 1',
      content: (
        <div>
          <input
            className="w-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            id="titleQuestions"
            placeholder="Вкажіть назву кавеста"
            value={formData.titleQuestions}
            onChange={(event) => {
              setFormData({...formData, titleQuestions: event.target.value})
            }}
          />
          <label>
            <input
              type="checkbox"
              checked={acceptFirstTerms.checked}
              onChange={firstTermsHandler}
            />{' '}
            Так, назву підтверджую
          </label>
        </div>
      ),
      isError: !acceptFirstTerms.checked && acceptFirstTerms.touched,
      isComplete: acceptFirstTerms.checked,
    },
    {
      label: 'Крок 2',
      content: (
        <div>
          <form onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }
          }>
          <input
            className="w-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            id="question"
            placeholder="Вкажіть запитання"
            required
            value={questionsData.question}
            onChange={(event) => {
              setQuestionsData({...questionsData, question: event.target.value})
            }}
          />
          <div>
            <input type="text" value={variant} onChange={inputChangeVariant} placeholder="Вкадіть варіанти відповідей" />
            <button type="button" onClick={inputSubmitVariant}>Додати варіант</button>
          </div>
          <ul>
            {variantsArray.map((task, index) => (
              <li key={index}>
                {task}
                <button onClick={() => handleDelete(index)}>x</button>
              </li>
            ))}
          </ul>
          <input
            className="w-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            required
            id="trueAnswer"
            placeholder="Вкажіть правильну відповідь"
            value={questionsData.trueAnswer}
            onChange={(event) => {
              setQuestionsData({...questionsData, trueAnswer: event.target.value})
            }}
          />
          <button
            type="submit"
            className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
            + Додати питання
          </button>
          </form>
          <label>
            <input
              type="checkbox"
              checked={acceptSecondTerms.checked}
              onChange={secondTermsHandler}
            />{' '}
            Так, запитання підтверджую
          </label>
        </div>
      ),
      clicked: () => secondStepAsyncFunc(),
      isLoading: isSecondStepLoading,
      isError: !acceptSecondTerms.checked && acceptSecondTerms.touched,
      isComplete: acceptSecondTerms.checked,
    },
    {
      label: 'Крок 3',
      content: (
        <div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setSubmitting(true)
                //if (formData.title.length === 0) {
                //setError('Поле не може бути пустим...')
              //} else {
                setLoading(true)
                submit()
              //}
            }
            }>
            <div className="card">
              <div className="card-body">
                <div className="form-group">
                  <div className="mb-4 relative">
                    {/*<input*/}
                    {/*  className="w-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"*/}
                    {/*  type="text"*/}
                    {/*  id="title"*/}
                    {/*  maxLength={25}*/}
                    {/*  placeholder="Вкажіть запитання"*/}
                    {/*  value={formData.title}*/}
                    {/*  onChange={(event) => {*/}
                    {/*    setFormData({...formData, title: event.target.value})*/}
                    {/*  }}*/}
                    {/*/>*/}
                    {error ? <p
                      className="text-sm absolute top-12 text-red-900 font-bold bg-white rounded-lg p-1">{error}</p> : null}
                    <ReCAPTCHA
                      className="mt-9"
                      sitekey={siteKey}
                      onChange={() => setRecaptcha(!reCaptcha)}
                    />
                  </div>
                </div>
              </div>
              {/*<button*/}
              {/*  className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:hover:bg-purple-700 dark:focus:ring-purple-900">*/}
              {/*  {!loading ? 'Відправити' : 'Відправлення...'}*/}
              {/*</button>*/}
            </div>
          </form>
          <label>
            <input
              type="checkbox"
              checked={acceptThirdTerms.checked}
              onChange={thirdTermsHandler}
            />{' '}
            Так, підтверджую відправку
          </label>
        </div>
      ),
      isError: !acceptThirdTerms.checked && acceptThirdTerms.touched,
      isComplete: acceptThirdTerms.checked,
    },
  ];

  const submitStepper = () => {
    console.log('submitted')
  }

  return (
    <div className="container">
      <h2>Конструктор квесту</h2>
      <Stepper stepperContent={stepperContent} submitStepper={submitStepper} submit={submit} reCaptcha={reCaptcha}/>
    </div>
  )
}

export default Builder
