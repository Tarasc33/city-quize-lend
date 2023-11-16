import { useRouter } from 'next/router'
import {v4 as uuid} from "uuid"
import {ref, serverTimestamp, set} from "firebase/database"
import {db} from "@/components/db/firebase"
import {getRandomColor, randomIntFromInterval} from "@/helpers/functions"
import {showNotification} from "@/helpers/showNotification"
import {useRef, useState} from "react"
import {ToastContainer} from "react-toastify"
import Builder from "@/components/Builder"
import '../src/app/globals.css'

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
  const countryItemId = router.query.data
  console.log(countryItemId)


  const targetRef = useRef()
  const tasksRef = ref(db)

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

    set(ref(db, 'regions/' + countryItemId + '/' + regionId), {
      id: regionId,
      regionName: countryItemId,
      time: serverTimestamp(),
      title: formData.title,
      status: false,
      sizeTitle: randomIntFromInterval(1, 7),
      color: getRandomColor(),
      like: initialFormData.like,
      reports: initialFormData.reports,
      questions: arrayQuestions,
      titleQuestions: formData.titleQuestions
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
      //fetchAllCloudData()
      showNotification("Вашe бажання зараз розглядається нашою командою. Після схвалення воно буде опубліковане і доступне на карті.", 'success')
      setModal(false)
      setIsOpen(false)
      setError('')
      setSubmitting(false)
    })
  }

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
        countryItemId={countryItemId}
      />
      <ToastContainer/>
    </>
  )
}

export default BuilderPage
