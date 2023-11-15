import ReCAPTCHA from "react-google-recaptcha"
import {useState, useRef, useEffect} from "react"
import {get, ref, child} from "firebase/database"
import {db} from "@/components/db/firebase"
import {useRouter} from "next/router";

const initialQuestion = {
  id: '',
  question: '',
  status: false,
  trueAnswer: '',
  variants: []
}

const FormWish = ({
                    setModal, setIsOpen, setLoading, submit, setSubmitting,
                    setFormData, formData, error, loading, setError, reCaptcha, setRecaptcha, arrayQuestions, setArrayQuestions, countryItemId
                  }) => {

  const targetRef = useRef()
  const tasksRef = ref(db)
  const router = useRouter()

  const isProduction = process.env.NODE_ENV === 'production'
  const siteKey = isProduction ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

  console.log(arrayQuestions, 'arrayQuestions')

  const [questionsData, setQuestionsData] = useState(initialQuestion)
  const [variant, setVariant] = useState('')
  const [variantsArray, setVariantsArray] = useState([])

  const [regionData, setRegionData] = useState([])

console.log(regionData, 'regionData')


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
    const getFormApp = async (countryItemId) => {
      try {
        get(child(tasksRef, `regions/${countryItemId}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setRegionData(snapshot.val())
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
      getFormApp(countryItemId).catch((error) => {
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

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitting(true)
          if (formData.title.length === 0) {
            setError('Поле не може бути пустим...')
          } else {
            setLoading(true)
            submit()
          }
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
          <button
            type="button"
            onClick={() => {
              setModal(false)
              setIsOpen(false)
              setError('')
              setSubmitting(false)
              setRecaptcha(false)
            }}
            className="text-white mr-3 bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:hover:bg-gray-700 dark:focus:ring-gray-900">
            Закрити
          </button>
          <button
                  onClick={submit}
                  disabled={reCaptcha === false}
                  className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
            {!loading ? 'Відправити' : 'Відправлення...'}
          </button>
        </div>
      </form>
      <input
        className="w-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        id="titleQuestions"
        placeholder="Вкажіть тему"
        value={formData.titleQuestions}
        onChange={(event) => {
          setFormData({...formData, titleQuestions: event.target.value})
        }}
      />
      <input
        className="w-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        id="question"
        placeholder="Вкажіть запитання"
        value={formData.question}
        onChange={(event) => {
          setQuestionsData({...questionsData, question: event.target.value})
        }}
      />
      <form>
        <input type="text" value={variant} onChange={inputChangeVariant} placeholder="Enter a task" />
        <button type="button" onClick={inputSubmitVariant}>Add task</button>
      </form>
      <ul>
        {variantsArray.map((task, index) => (
          <li key={index}>
            {task}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        className="w-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        id="trueAnswer"
        placeholder="Вкажіть відповідь"
        value={formData.question}
        onChange={(event) => {
          setQuestionsData({...questionsData, trueAnswer: event.target.value})
        }}
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
        Додати
      </button>
    </>
  )
}

export default FormWish
