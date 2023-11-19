import React, {useState, useRef, useEffect, Fragment} from 'react'
import ReCAPTCHA from "react-google-recaptcha"
import {child, get, ref} from "firebase/database"
import {db} from "../../src/components/db/firebase"
import {useRouter} from "next/router"
import {v4 as uuid} from "uuid"

// {
//   "question": "How can you access the state of a component from inside of a member function?",
//   "questionType": "text",
//   "questionPic": "https://dummyimage.com/600x400/000/fff&text=X", // if you need to display Picture in Question
//   "answerSelectionType": "single",
//   "answers": [
//   "this.getState()",
//   "this.prototype.stateValue",
//   "this.state",
//   "this.values"
// ],
//   "correctAnswer": "3",
//   "messageForCorrectAnswer": "Correct answer. Good job.",
//   "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
//   "explanation": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
//   "point": "20"
// },

const initialQuestion = {
  id: '',
  question: '',
  questionType: 'text',
  questionPic: '',
  answerSelectionType: 'single',
  answers: [],
  correctAnswer: '',
  messageForCorrectAnswer: 'Відповідь правильна!. Хороша робота.',
  messageForIncorrectAnswer: 'Відповідь не правильна',
  explanation: '',
  point: '1'
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
        <button className="stepper-footer-btn"
                onClick={previousStepHandler}>{stepperContent[currentTabIndex - 1].label}</button>
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

let Stepper = ({
                 isRightToLeftLanguage,
                 isVertical,
                 isInline,
                 stepperContent,
                 submitStepper,
                 reCaptcha,
                 submit,
                 submitQuizToUserData
               }) => {
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
    //submitQuizToUserData()
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
                   setLoading,
                   submit,
                   setSubmitting,
                   setFormData,
                   formData,
                   error,
                   reCaptcha,
                   setRecaptcha,
                   arrayQuestions,
                   setArrayQuestions,
                   regionItemId,
                   submitQuizToUserData
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

  const [addrtype, setAddrtype] = useState(["single"])
  //const Add = addrtype.map(Add => Add)
  const handleAddrTypeChange = (event) => setQuestionsData({...questionsData, answerSelectionType: event.target.value})

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
    setQuestionsData({...questionsData, answers: variantsArray})
    setArrayQuestions((prevArray) => [...prevArray, questionsData])
    setQuestionsData(initialQuestion)
    setVariantsArray([])
  }

  useEffect(() => {
    const id = uuid()
    setQuestionsData({...questionsData, answers: variantsArray, id: id})
  }, [variantsArray])

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
    setIsSecondStepLoading(true)
    await timeout(3000)
    setIsSecondStepLoading(false)
  };

  console.log(arrayQuestions)

  const stepperContent = [
    {
      label: 'Крок 1',
      content: (
        <form>
          <div>
            <label>
              Назва квесту
              <input
                className="input"
                type="text"
                id="titleQuestions"
                placeholder="Вкажіть назву квесту"
                value={formData.titleQuestions}
                onChange={(event) => {
                  setFormData({...formData, titleQuestions: event.target.value})
                }}
              />
            </label>
          </div>
          <div>
            <label>
              Опис квесту
              <textarea
                className="input input-textarea"
                id="quizSynopsis"
                maxLength={256}
                placeholder="Вкажіть опис квесту"
                value={formData.quizSynopsis}
                onChange={(event) => {
                  setFormData({...formData, quizSynopsis: event.target.value})
                }}
              />
            </label>
          </div>
          <label>
            <input
              type="checkbox"
              checked={acceptFirstTerms.checked}
              onChange={firstTermsHandler}
            />{' '}
            Так, назву підтверджую
          </label>
        </form>
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
            {arrayQuestions.length > 0 ?
              <div>
                <h4>Список запитань</h4>
                {arrayQuestions.map((item, index) => {
                    return (
                      <>
                        <div key={index}>
                          <h4>Запитання: {item.question}</h4>
                          <div>
                            <h5>Варіанти відповідей</h5>
                            {item.answers.map((item, index) => {
                              return (
                                <ul key={index}>
                                  <li>{item}</li>
                                </ul>
                              )
                            })}
                          </div>
                          <p>Номер правильної відповіді: {item.correctAnswer}</p>
                        </div>
                        <button onClick={() => {
                          setArrayQuestions(arrayQuestions.filter((_, i) => i !== index))
                        }}>x</button>
                      </>
                    )
                  }
                )}

              </div> : null
            }
            <div>
              <label>
                Запитання
                <input
                  className="input"
                  type="text"
                  id="question"
                  placeholder="Вкажіть запитання"
                  required
                  value={questionsData.question}
                  onChange={(event) => {
                    setQuestionsData({...questionsData, question: event.target.value})
                  }}
                />
              </label>
            </div>
            <div>
              <label>
                Тип питання
                <select
                  onChange={e => handleAddrTypeChange(e)}
                  className="browser-default custom-select">
                  {
                    addrtype.map((item, key) => <option key={key} value={key}>{item}</option>)
                  }
                </select>
              </label>
            </div>
            <h4>Варіанти відповідей</h4>
            <div>
              <input
                className="input"
                type="text"
                value={variant}
                onChange={inputChangeVariant}
                placeholder="Вкажіть варіанти відповідей"
              />
              <button type="button" onClick={inputSubmitVariant}>+ Додати</button>
            </div>
            <ul>
              {variantsArray.map((task, index) => (
                <li key={index}>
                  {task}
                  <button onClick={() => handleDelete(index)}>x</button>
                </li>
              ))}
            </ul>
            <h4>Правильна відповідь</h4>
            <div>
              <label>Відповідь
                <input
                  className=""
                  type="text"
                  required
                  id="correctAnswer"
                  placeholder="Вкажіть правильну відповідь"
                  value={questionsData.correctAnswer}
                  onChange={(event) => {
                    setQuestionsData({...questionsData, correctAnswer: event.target.value})
                  }}
                />
              </label>
            </div>
            <button type="submit" className="">
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
      <Stepper stepperContent={stepperContent} submitStepper={submitStepper} submit={submit} reCaptcha={reCaptcha}
               submitQuizToUserData={submitQuizToUserData}/>
    </div>
  )
}

export default Builder
