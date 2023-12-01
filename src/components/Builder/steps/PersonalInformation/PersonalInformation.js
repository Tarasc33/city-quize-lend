import Input from "../../inputs/Input"
import TextArea from "../../inputs/TextArea"

const PersonalInformation = ({values, setValues, errors}) => {

  const handleChange = (fieldName, value) => {
    setValues(fieldName, value)
  }

  return (
    <form>
      <h4 className="form-section-title">Назва квесту</h4>
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
        <h4 className="form-section-title">Опис квесту</h4>
        <TextArea
          placeholder="Вкажіть інформацію про квест"
          name="quizSynopsis"
          type="text"
          value={values.quizSynopsis || ""}
          error={errors.quizSynopsis}
          handleChange={(event) => handleChange('quizSynopsis', event.target.value)}
        />
      </div>
    </form>
  )
}

export default PersonalInformation
