import {useContext} from "react"
import {ThemeContext} from "../../../pages/_app"
import {useRouter} from "next/router"

const BuilderLayout = ({ children }) => {
  const contextValue = useContext(ThemeContext)
  const router = useRouter()

  console.log(contextValue, 'contextValue BuilderLayout')
  return (
    <div>
      <h1>{contextValue.authObj.isAuthenticated ? contextValue.authObj.userName : null}</h1>
      <button onClick={()=> {
        contextValue.setAuthObject(prevState => ({
          ...prevState,
          isAuthenticated: false,
          userName: '',
          userId: '',
          email: '',
          token: ''
        }))
        router.push('/')
      }}>Log out</button>
      {children}
    </div>
  )
}

export default BuilderLayout
