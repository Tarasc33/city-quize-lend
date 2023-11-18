import {auth, GoogleProvider} from "../../db/firebase"
import {ThemeContext} from "../../../../pages/_app"

import {useContext} from "react"
import {useRouter} from "next/router"

const Login = () => {
  const contextValue = useContext(ThemeContext)
  const router = useRouter()

  return (
    <div>
      <div>
        <h3>Login</h3>
        <>
          <button
            onClick={ async () => {
                await auth.signInWithPopup(GoogleProvider)
                  .then((response) => {
                    console.log(response)
                      contextValue.setAuthObject(prevState => ({
                        ...prevState,
                        isAuthenticated: true,
                        userName: response.user?.displayName,
                        userId: response.user?.uid,
                        email: response.user?.email,
                        token: response.user?.idToken
                      }))
                  }).then(() => {})
                      router.push(`/builder?data=${encodeURIComponent(router?.query?.data)}`)
                  .catch(error => console.log(error))
              }
            }
          >Log in with Google</button>
        </>
      </div>
    </div>
  )
}

export default Login
