import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"

export const showNotification = (
  content,
  type,
) => {
  const defaultOptions = {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 5000,
  }
  switch (type) {
    case "success":
      toast.success(content, {
        ...defaultOptions,
        style: {
          color: '#000000',
          fontSize: "0.75rem",
          borderRadius: "14px",
        },
        progressStyle: {
          backgroundColor: 'rgb(147, 51, 234)',
        },
      })
      break
    default:
      break
  }
}
