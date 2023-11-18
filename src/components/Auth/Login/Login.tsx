import {auth, GoogleProvider} from "../../db/firebase"
import {RegionContext, ThemeContext} from "../../../../pages/_app"

import {useContext, useState} from "react"
import {useRouter} from "next/router"
import {useEffect} from "react"

const Login = () => {
  const contextValue = useContext(ThemeContext)
  const router = useRouter()
  //const [url, setUrl] = useState('')
  const contextRegion = useContext(RegionContext)

  // useEffect(() => {
  //   if (router.isReady) {
  //     setUrl(router.query.data)
  //   }
  // }, [router.isReady])

  return (
    <div>
      <div>
        <h3>Login</h3>
        <>
          <button
            onClick={ async () => {
                await auth.signInWithPopup(GoogleProvider)
                  .then((response) => {
                    const { user, credential } = response
                    contextValue.setAuthObject(prevState => ({
                      ...prevState,
                      isAuthenticated: true,
                      userName: user!.displayName,
                      userId: user!.uid,
                      email: user!.email,
                    }))
                      if (auth.currentUser) {
                        return auth.currentUser.getIdToken()
                      }
                  }).then(() => {})
                      router.push(`/builder?data=${contextRegion.region}`)
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
