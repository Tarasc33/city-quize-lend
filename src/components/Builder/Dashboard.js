import {useEffect, useState} from "react"
import Builder from "./Builder"
import PersonalInformation from "./steps/PersonalInformation/PersonalInformation"
import Education from "./steps/Education/Education"
import {ref, serverTimestamp, set} from "firebase/database"
import {v4 as uuid} from "uuid";
import {db} from "../db/firebase"
import {showNotification} from "../../helpers/showNotification"
import {useRouter} from "next/router"
import {useContext} from "react"
import {RegionContext, ThemeContext} from "../../../pages/_app"

const initialData = {
  id: '',
  regionName: '',
  time: serverTimestamp(),
  status: false,
  like: 0,
  reports: 0,
  questions: [],
  quizTitle: '',
  quizSynopsis: '',
  nrOfQuestions: '20',
  userId: '',
  userName: '',
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
  },
  completeQuizCount: 0,
}

const Board = (props) => {
  const router = useRouter()
  const regionItemId = router.query.data

  const contextValue = useContext(ThemeContext)
  const contextRegion = useContext(RegionContext)
  // const mapState = ({user, data}) => ({
  //   websiteExists: data.websiteExists,
  //   website: data.website,
  //   currentUser: user.currentUser,
  //   ready: data.website?.ready,
  //   loading: data.loading
  // })

  //const {websiteExists, website, currentUser, ready, loading} = useSelector(mapState)

  const [values, setValues] = useState(initialData)
  console.log(values, 'values')
  const [editedValues, setEditedValues] = useState({})
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({})
  //const [dataLoading, setDataLoading] = useState(!websiteExists && loading)

  //const userId = currentUser?.user?._id

  useEffect(() => {
    //if (website && dataLoading) {
    //setValues([])
    //setDataLoading(false)
    //}
  }, [])

  const addFieldItem = (item, field) => {
    setValues({...values, [field]: [...values[field], item]})
    setEditedValues({...editedValues, [field]: [...values[field], item]})
  }

  const updateFieldItem = (item, field) => {
    console.log(item, field, 'item, field')
    const array = [...values[field]]
    array[array.findIndex(arrayItem =>
      arrayItem._id ?
        arrayItem._id === item._id :
        arrayItem.id === item.id
    )] = item
    setValues({...values, [field]: array})
    setEditedValues({...editedValues, [field]: array})
  }

  const removeFieldItem = (index, field) => {
    const array = [...values[field]]
    array.splice(index, 1)
    setValues({...values, [field]: array})
    setEditedValues({...editedValues, [field]: array})
  }

  const steps = [
    {
      label: "Загальна інфомація",
      content:
        <PersonalInformation
          values={values}
          setValues={(field, value) => {
            const updatedValues = {...values, [field]: value}
            const editValues = {...editedValues, [field]: value}
            field !== 'socialNetworks' && updatedValues.socialNetworks?.forEach(network => network.updated = false)
            setValues(updatedValues)
            setEditedValues(editValues)
          }}
          errors={errors}
          setErrors={setErrors}
        />,
    },
    {
      label: "Створення запитаннь",
      content:
        <Education
          values={values}
          setValues={setValues}
          addEducationItem={(item) => addFieldItem(item, 'questions')}
          updateEducationItem={(item) => updateFieldItem(item, 'questions')}
          removeEducationItem={(index) => removeFieldItem(index, 'questions')}
          errors={errors}
          setErrors={props.setErrors}
        />
    },
  ]

  const submit = () => {
    console.log('submit')
    const regionId = uuid()
    const data = {
      id: regionId,
      regionName: contextRegion?.region,
      time: serverTimestamp(),
      status: false,
      like: values.like,
      reports: values.reports,
      questions: values.questions,
      quizTitle: values.quizTitle,
      quizSynopsis: values.quizSynopsis || '',
      nrOfQuestions: values.nrOfQuestions,
      userId: contextValue.authObj.userId,
      userName: contextValue.authObj.userName,
      appLocale: {
        "landingHeaderText": "<questionLength> запитань",
        "question": "",
        "startQuizBtn": "Розпочати тест",
        "resultFilterAll": "Всі",
        "resultFilterCorrect": "Правильні",
        "resultFilterIncorrect": "Не правильні",
        "prevQuestionBtn": "Назад",
        "nextQuestionBtn": "Продовжити",
        "resultPageHeaderText": "Ви завершили тест. Ви набрали <correctIndexLength> з <questionLength> питань."
      },
      completeQuizCount: 0,
    }

    set(ref(db, 'regions/' + contextRegion?.region + '/' + regionId), data).then(() => {
      set(ref(db, 'users/' + contextValue.authObj.userId + '/' + regionId), data).then(() => {
        setLoading(false)
        setValues(initialData)
        showNotification("Ваш квест зараз розглядається нашою командою. Після схвалення воно буде опубліковане і доступне на карті.", 'success')
      }).then(() => {
        router.push(`/quest/${regionId}?data=${contextRegion.region}`)
      })
    })
  }

  return (
    <Builder
      values={values}
      loading={false}
      content={steps}
      submit={() => submit()}
    />
  )
}

export default Board
