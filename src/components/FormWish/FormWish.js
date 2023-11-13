import ReCAPTCHA from "react-google-recaptcha"

const FormWish = ({setModal, setIsOpen, setLoading, submit, setSubmitting,
  setFormData, formData, error, loading, setError, reCaptcha, setRecaptcha
  }) => {

  const isProduction = process.env.NODE_ENV === 'production'
  const siteKey = isProduction ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

  return (
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
              <input
                className="w-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                id="title"
                maxLength={25}
                placeholder="Вкажіть текст"
                value={formData.title}
                onChange={(event) => {
                  setFormData({...formData, title: event.target.value})
                }}
              />
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
        <button type="submit"
                disabled={reCaptcha === false}
                className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
          {!loading ? 'Відправити' : 'Відправлення...'}
        </button>
      </div>
    </form>
  )
}

export default FormWish
