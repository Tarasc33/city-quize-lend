const Modal = ({children}) => {
  return (
    <section
      className="justify-center items-center bg-[#667] opacity-75 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none px-4">
      <div>
        {children}
      </div>
    </section>
  )
}

export default Modal
