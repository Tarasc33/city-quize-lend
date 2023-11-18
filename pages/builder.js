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

    set(ref(db, 'regions/' +  contextRegion.region + '/' + regionId), {
      id: regionId,
      regionName: contextRegion.region,
      time: serverTimestamp(),
      title: formData.title,
      status: false,
      like: initialFormData.like,
      reports: initialFormData.reports,
      questions: arrayQuestions,
      titleQuestions: formData.titleQuestions,
      userId: contextValue.authObj.userId,
      userName: contextValue.authObj.userName,
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
