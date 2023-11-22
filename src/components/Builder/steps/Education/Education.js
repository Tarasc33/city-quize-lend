import {useState, useEffect} from "react"
import Input from "../../inputs/Input"
import {v4 as uuid} from "uuid"

const Education = ({addEducationItem, updateEducationItem, removeEducationItem, errors, validate, values, setValues}) => {

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
  const [variantsArray, setVariantsArray] = useState([])


  console.log(variantsArray, variant)
  console.log(dataInput, 'dataInput')


  const handleChange = (fieldName, value) => {
    errors[fieldName] && validate(fieldName, dataInput)
    const updatedValues = {...dataInput, [fieldName]: value}
    setDataInput(updatedValues)
  }

  const inputChangeVariant = (e) => setVariant(e.target.value)

  const inputSubmitVariant = (e) => {
    e.preventDefault()
    if (variant.trim()) {
      setVariantsArray([...variantsArray, variant])
      setVariant('')
    }
  }

  const handleDelete = (index) => {
    setVariantsArray(variantsArray.filter((_, i) => i !== index))
  }

  useEffect(() => {
    setDataInput({...dataInput, answers: variantsArray})
  }, [variantsArray])

  return (
    <div>
      {values?.questions?.length > 0 ?
        <div>
          <h4>Список запитань</h4>
          {values?.questions?.map((item, index) => {
              return (
                <>
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
                  </div>
                  <button type="button" onClick={() => {
                    setOpenModal(!openModal)
                    setDataInput({...item, editing: true})
                  }}>Edit</button>
                  <button type="button" onClick={() => {removeEducationItem(index)}}>x</button>
                </>
              )
            }
          )}

        </div> : null
      }
      <form onSubmit={(event) => {
        event.preventDefault()
        dataInput.editing ?
          updateEducationItem({...dataInput, editing: false}) :
          addEducationItem(dataInput)
        setDataInput(initialProject)
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
          <div>
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
              {dataInput?.answers?.map((task, index) => (
                <li key={index}>
                  {task}
                  <button type="button" onClick={() => handleDelete(index)}>x</button>
                </li>
              ))}
            </ul>
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
        <button
          className="btn btn-continue"
          type="submit"
          onClick={()=> setVariantsArray([])}
          //disabled={isDisabled}
        >
          {dataInput?.editing ? 'Редагувати' : 'Додати'}
        </button>
      </form>
    </div>
  )
}

export default Education
