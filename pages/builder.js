import { useRouter,  } from 'next/router'
import {v4 as uuid} from "uuid"
import {ref, serverTimestamp, set} from "firebase/database"
import {db} from "../src/components/db/firebase"
import {showNotification} from "../src/helpers/showNotification"
import {useRef, useState, useContext, useEffect} from "react"
import {ToastContainer} from "react-toastify"
import Builder from "../src/components/Builder"
import '../src/app/globals.css'
import {RegionContext, ThemeContext} from "./_app"

const initialFormData = {
  id: '',
  title: '',
  fontStyle: 'normal',
  status: false,
  sizeTitle: 1,
  color: '#0a0a0a',
  like: 0,
  reports: 0,
  titleQuestions: ''
}

const BuilderPage = () => {
  const router = useRouter()
  const regionItemId = router.query.data

  const contextValue = useContext(ThemeContext)
  const contextRegion = useContext(RegionContext)
  console.log(contextRegion.region, 'builder')

  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)


  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reCaptcha, setRecaptcha] = useState(false)

  const [arrayQuestions, setArrayQuestions] = useState([])

  const submit = () => {
    const regionId = uuid()

    // export const quiz =  {
    //   "quizTitle": "React Quiz Component Demo",
    //   "quizSynopsis": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim",
    //   "nrOfQuestions": "4",
    //   "questions": [
    //     {
    //       "question": "How can you access the state of a component from inside of a member function?",
    //       "questionType": "text",
    //       "questionPic": "https://dummyimage.com/600x400/000/fff&text=X", // if you need to display Picture in Question
    //       "answerSelectionType": "single",
    //       "answers": [
    //         "this.getState()",
    //         "this.prototype.stateValue",
    //         "this.state",
    //         "this.values"
    //       ],
    //       "correctAnswer": "3",
    //       "messageForCorrectAnswer": "Correct answer. Good job.",
    //       "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
    //       "explanation": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    //       "point": "20"
    //     },
    //     {
    //       "question": "ReactJS is developed by _____?",
    //       "questionType": "text",
    //       "answerSelectionType": "single",
    //       "answers": [
    //         "Google Engineers",
    //         "Facebook Engineers"
    //       ],
    //       "correctAnswer": "2",
    //       "messageForCorrectAnswer": "Correct answer. Good job.",
    //       "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
    //       "explanation": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    //       "point": "20"
    //     },
    //     {
    //       "question": "ReactJS is an MVC based framework?",
    //       "questionType": "text",
    //       "answerSelectionType": "single",
    //       "answers": [
    //         "True",
    //         "False"
    //       ],
    //       "correctAnswer": "2",
    //       "messageForCorrectAnswer": "Correct answer. Good job.",
    //       "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
    //       "explanation": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    //       "point": "10"
    //     },
    //     {
    //       "question": "Which of the following concepts is/are key to ReactJS?",
    //       "questionType": "text",
    //       "answerSelectionType": "single",
    //       "answers": [
    //         "Component-oriented design",
    //         "Event delegation model",
    //         "Both of the above",
    //       ],
    //       "correctAnswer": "3",
    //       "messageForCorrectAnswer": "Correct answer. Good job.",
    //       "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
    //       "explanation": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    //       "point": "30"
    //     },
    //     {
    //       "question": "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    //       "questionType": "photo",
    //       "answerSelectionType": "single",
    //       "answers": [
    //         "https://dummyimage.com/600x400/000/fff&text=A",
    //         "https://dummyimage.com/600x400/000/fff&text=B",
    //         "https://dummyimage.com/600x400/000/fff&text=C",
    //         "https://dummyimage.com/600x400/000/fff&text=D"
    //       ],
    //       "correctAnswer": "1",
    //       "messageForCorrectAnswer": "Correct answer. Good job.",
    //       "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
    //       "explanation": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    //       "point": "20"
    //     },
    //     {
    //       "question": "What are the advantages of React JS?",
    //       "questionType": "text",
    //       "answerSelectionType": "multiple",
    //       "answers": [
    //         "React can be used on client and as well as server side too",
    //         "Using React increases readability and makes maintainability easier. Component, Data patterns improves readability and thus makes it easier for manitaining larger apps",
    //         "React components have lifecycle events that fall into State/Property Updates",
    //         "React can be used with any other framework (Backbone.js, Angular.js) as it is only a view layer"
    //       ],
    //       "correctAnswer": [1, 2, 4],
    //       "messageForCorrectAnswer": "Correct answer. Good job.",
    //       "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
    //       "explanation": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    //       "point": "20"
    //     },
    //   ]
    // }


    set(ref(db, 'regions/' +  contextRegion.region + '/' + regionId), {
      id: regionId,
      regionName: contextRegion.region,
      time: serverTimestamp(),
      title: formData.title,
      status: false,
      like: initialFormData.like,
      reports: initialFormData.reports,
      questions: arrayQuestions,
      quizTitle: formData.titleQuestions,
      quizSynopsis: formData.quizSynopsis,
      nrOfQuestions: '20',
      userId: contextValue.authObj.userId,
      userName: contextValue.authObj.userName,
      appLocale: {
        "landingHeaderText": "<questionLength> запитань",
        "question": "",
        "startQuizBtn": "Розпочати тест",
        "resultFilterAll": "Всі",
        "resultFilterCorrect": "Правильні",
        "resultFilterIncorrect": "Не правильні",
        "prevQuestionBtn": "Попереднє",
        "nextQuestionBtn": "Наступне",
        "resultPageHeaderText": "Ви завершили тест. Ви набрали <correctIndexLength> з <questionLength> питань."
      }
    }).then(() => {
      setLoading(false)
      setFormData({
        id: '',
        title: '',
        status: false,
        sizeTitle: 1,
        color: '#0a0a0a',
        reports: 0,
      })
      showNotification("Ваш квест зараз розглядається нашою командою. Після схвалення воно буде опубліковане і доступне на карті.", 'success')
      setModal(false)
      setIsOpen(false)
      setError('')
      setSubmitting(false)
    }).then(() => {
      router.push('/')
    })
  }

  useEffect(() => {
     if (contextRegion.region === 'default' || contextRegion.region === undefined) {
       router.push('/')
     }
   }, [])

  return (
    <>
      <Builder
        submit={submit}
        setModal={setModal}
        setIsOpen={setIsOpen}
        setLoading={setLoading}
        setSubmitting={setSubmitting}
        setFormData={setFormData}
        formData={formData}
        error={error}
        loading={loading}
        setError={setError}
        reCaptcha={reCaptcha}
        setRecaptcha={setRecaptcha}
        setArrayQuestions={setArrayQuestions}
        arrayQuestions={arrayQuestions}
        regionItemId={regionItemId}
      />
      <ToastContainer/>
    </>
  )
}

export default BuilderPage
