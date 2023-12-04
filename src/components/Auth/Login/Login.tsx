import {auth, GoogleProvider} from "../../db/firebase"
import {ThemeContext} from "../../../../pages/_app"

import {useContext, useState} from "react"
import {useRouter} from "next/router"

const Login = () => {
  const contextValue = useContext(ThemeContext)
  const router = useRouter()
  const [loading, setLoadingDb] = useState(false)

  return (
    <div>
      <div className="auth-container">
        <h3>Вхід/Реєстрація</h3>
        <button
          className="button-login"
          onClick={async () => {
            setLoadingDb(true)
            await auth.signInWithPopup(GoogleProvider)
              .then((response) => {
                const {user, credential} = response
                contextValue.setAuthObject(prevState => ({
                  ...prevState,
                  isAuthenticated: true,
                  userName: user!.displayName,
                  userId: user!.uid,
                  email: user!.email,
                }))
                setLoadingDb(false)
              }).then(async () => {
                if (auth.currentUser) {
                  const tokenId = await auth.currentUser.getIdToken()
                  contextValue.setAuthObject(prevState => ({
                    ...prevState,
                    token: tokenId || ''
                  }))
                  return auth.currentUser.getIdToken()
                }
              }).then(() => {
                router.push(`/builder`)
              }).catch(error => console.log(error))
          }
          }
        >
          {loading ? 'Завантаження...' : 'Увійти через Google'}
        </button>
      </div>
    </div>
  )
}

export default Login
