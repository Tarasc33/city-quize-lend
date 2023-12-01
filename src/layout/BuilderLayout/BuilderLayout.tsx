import {useContext} from "react"
import {ThemeContext} from "../../../pages/_app"
import {useRouter} from "next/router"
import Link from "next/link";

const BuilderLayout = ({ children }) => {
  const contextValue = useContext(ThemeContext)
  const router = useRouter()

  return (
    <div>
      <nav >
        <ul>
          <li><Link href="/">Головна</Link></li>
          <li>
            <Link href="/builder/settings">{contextValue.authObj.isAuthenticated ? contextValue.authObj.userName : null}</Link>
          </li>
          <li><button onClick={()=> {
            contextValue.setAuthObject(prevState => ({
              ...prevState,
              isAuthenticated: false,
              userName: '',
              userId: '',
              email: '',
              token: ''
            }))
            router.push('/')
          }}>Log out</button></li>
        </ul>
      </nav>
      {children}
    </div>
  )
}

export default BuilderLayout
