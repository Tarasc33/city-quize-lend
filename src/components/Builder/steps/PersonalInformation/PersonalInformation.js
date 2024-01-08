import Input from "../../inputs/Input"
import TextArea from "../../inputs/TextArea"

const PersonalInformation = ({values, setValues, errors}) => {

  const handleChange = (fieldName, value) => {
    setValues(fieldName, value)
  }

  return (
    <form>
      <div className="block-two-row mobile center">
        <div>
          <Input
            placeholder="Вкажіть назву квесту"
            name="quizTitle"
            label="Назва квесту"
            type="text"
            value={values?.quizTitle || ""}
            handleChange={(event) => handleChange('quizTitle', event.target.value)}
            require
          />
        </div>
      </div>
      <div>
        <TextArea
          placeholder="Вкажіть інформацію про квест"
          name="quizSynopsis"
          type="text"
          label="Опис квесту"
          value={values.quizSynopsis || ""}
          error={errors.quizSynopsis}
          handleChange={(event) => handleChange('quizSynopsis', event.target.value)}
        />
      </div>
    </form>
  )
}

export default PersonalInformation
