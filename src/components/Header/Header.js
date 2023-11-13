const Header = ({setModal, setIsOpen, setDisableReportBtn, setRecaptcha}) => {
  return (
    <header className="header flex items-center justify-end h-20 p-8">
      <button
        type="button"
        onClick={() => {
          setModal(true)
          setIsOpen(true)
          setDisableReportBtn(false)
          setRecaptcha(false)
        }}
        className="add-btn w-[200px] h-10 overflow-x-hidden overflow-y-auto z-51 fixed top-0 right-0 text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
        + Додай бажання!
      </button>
    </header>
  )
}

export default Header
