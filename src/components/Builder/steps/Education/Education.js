import {useState, useEffect, useContext} from "react"
import Input from "../../inputs/Input"
import {v4 as uuid} from "uuid"
import TextArea from "../../inputs/TextArea"
import Compressor from "compressorjs"
import {ref, getDownloadURL, getStorage, uploadBytes} from "firebase/storage"
import {RegionContext, ThemeContext} from "../../../../../pages/_app"


const Education = ({
                     addEducationItem,
                     updateEducationItem,
                     removeEducationItem,
                     errors,
                     validate,
                     values,
                     setValues
                   }) => {

  const initialProject = {
    id: uuid(),
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

  const [dataInput, setDataInput] = useState(initialProject)
  const [openModal, setOpenModal] = useState(false)
  const [variant, setVariant] = useState('')
  const [variantsArray, setVariantsArray] = useState(dataInput.editing ? values.answers : [])
  const [imagesPreviewUrls, setImagesPreviewUrls] = useState('')

  const contextRegion = useContext(RegionContext)
  const contextValue = useContext(ThemeContext)


  const handleChange = (fieldName, value) => {
    // errors[fieldName] && validate(fieldName, dataInput)
    const updatedValues = {...dataInput, [fieldName]: value}
    setDataInput(updatedValues)
  }

  const inputChangeVariant = (e) => setVariant(e.target.value)

  const inputSubmitVariant = (e) => {
    e.preventDefault()
    if (variant.trim()) {
      setVariantsArray([...variantsArray, variant])
      setValues({...values, answers: variantsArray})
      setVariant('')
    }
  }

  const handleDelete = (index) => {
    setVariantsArray(variantsArray.filter((_, i) => i !== index))
  }

  useEffect(() => {
    setDataInput({...dataInput, answers: variantsArray})
  }, [variantsArray])


  const handleImageChange = (e) => {
    const acceptedFiles = e.target.files
    console.log(acceptedFiles)
    const imageFile = acceptedFiles[0]
    console.log(imageFile)


    const createObjectURL = (file) => {
      if (window.webkitURL) {
        return window.webkitURL.createObjectURL(file)
      } else if (window.URL && window.URL.createObjectURL) {
        return window.URL.createObjectURL(file)
      }
    }

    new Compressor(imageFile, {
      convertTypes: ['image/png', 'image/webp', 'image/heic', 'image/heif', 'image/bmp', 'image/svg', 'image/tif', 'image/tiff', 'image/gif', 'image/raw'],
      convertSize: 0,
      maxWidth: 500,
      maxHeight: 500,
      success: (results) => {
        Array.from(acceptedFiles)?.map((file) => {
          setImagesPreviewUrls(createObjectURL(file))
          const storage = getStorage();
          const storageRef = ref(storage, `questions/images/${contextRegion.region}/${contextValue.authObj.userId}/${file.name}`)
          uploadBytes(storageRef, results, "data_url").then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              handleChange('questionPic', url)
            })
          })
        })
      },
      error(err) {
        console.log(err)
      }
    })
  }

  return (
    <div>
      {values?.questions?.length > 0 ?
        <>
          <h4>Список запитань</h4>
          <div className="my-quest-container">
            {values?.questions?.map((item, index) => {
                return (
                  <div className="builder-question">
                    <div key={index}>
                      <h4>Запитання: {item.question}</h4>
                      <div>
                        <h5>Варіанти відповідей</h5>
                        {item?.answers.map((item, index) => {
                          return (
                            <ul key={index}>
                              <li>{item}</li>
                            </ul>
                          )
                        })}
                      </div>
                      <p>Номер правильної відповіді: {item.correctAnswer}</p>
                      <h4>Пояснення до відповіді: {item.explanation}</h4>
                      <h4>Кількість балів: {item.point}</h4>
                      {item.questionPic ?
                        <img
                          width='100'
                          height='100'
                          src={item.questionPic}
                          alt=""
                        /> : null
                      }
                      <button type="button" onClick={() => {
                        setOpenModal(!openModal)
                        setDataInput({...item, editing: true})
                      }}>Редагувати
                      </button>
                      <button type="button" onClick={() => {
                        removeEducationItem(index)
                      }}>x
                      </button>
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </>
        : null
      }
      <form onSubmit={(event) => {
        event.preventDefault()
        if (dataInput.editing) {
          updateEducationItem({...dataInput, editing: false})
        } else {
          addEducationItem(dataInput)
        }
        setDataInput(initialProject)
        setImagesPreviewUrls('')
        setOpenModal(!openModal)
      }}>
        <div className="block-two-row mobile">
          <div>
            <Input
              placeholder="Вкажіть запитання"
              label="Запитання:"
              name="question"
              type="text"
              required
              value={dataInput?.question || ""}
              error={errors.question}
              handleChange={(event) => handleChange('question', event.target.value)}
            />
          </div>
        </div>
        <div className="block-two-row mobile">
          <div className="Variants">
            <h5>Варіанти відповідей</h5>
            <div className="Variants">
              <input
                className="input form-input"
                type="text"
                value={variant}
                label=""
                onChange={inputChangeVariant}
                placeholder="Вкажіть варіанти відповідей"
              />
              <button type="button" onClick={inputSubmitVariant}>+ Додати</button>
            </div>
            <ol style={{width: '50%', display: 'flex', flexDirection: 'column'}}>
              {dataInput?.answers?.map((task, index) => (
                <li key={index}>
                  <span>{task}</span>
                  <button className="delate" style={{marginLeft: '50px'}} type="button"
                          onClick={() => handleDelete(index)}>x
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div>
          <Input
            placeholder="Вкажіть номер правильної відповіді"
            label="Правильна відповідь: "
            name="correctAnswer"
            type="number"
            required
            value={dataInput?.correctAnswer || ""}
            error={errors.correctAnswer}
            handleChange={(event) => handleChange('correctAnswer', event.target.value)}
          />
        </div>
        <div>
          <TextArea
            placeholder="Вкажіть пояснення до відповіді"
            label="Пояснення до відповіді"
            name="explanation"
            type="text"
            value={dataInput?.explanation || ""}
            error={errors.explanation}
            handleChange={(event) => handleChange('explanation', event.target.value)}
          />
        </div>
        <div>
          <Input
            placeholder="Вкажіть кількість балів за це питання"
            label="Kількість балів:"
            name="point"
            type="number"
            value={dataInput?.point || ""}
            error={errors.point}
            handleChange={(event) => handleChange('point', event.target.value)}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <p>Додати картинку</p>
          <input
            id="fotoUploader"
            type="file"
            name="avatarUploader"
            onChange={(e) => handleImageChange(e)}
            accept="image/*, .heic, .heif"
          />
          <label htmlFor="fotoUploader"></label>
          {imagesPreviewUrls || dataInput.questionPic ?
            <img
              width='100'
              height='100'
              src={imagesPreviewUrls || dataInput.questionPic || ''}
              alt=""
            /> : null
          }
        </div>
        <button
          className="btn btn-continue"
          style={{marginTop: '20px'}}
          type="submit"
          onClick={() => setVariantsArray([])}
        >
          {dataInput?.editing ? 'Підтвердити редагування' : 'Додати питання'}
        </button>
      </form>
    </div>
  )
}

export default Education
