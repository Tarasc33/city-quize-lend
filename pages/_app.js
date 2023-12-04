import PrimaryLayout from "../src/layout/PrimaryLayout/PrimaryLayout"
import QuestLayout from "../src/layout/QuestLayout/QuestLayout"
import BuilderLayout from "../src/layout/BuilderLayout/BuilderLayout"
import { useRouter } from "next/router"
import AuthStateWrapper from "../src/components/Auth/AuthStateWrapper"
import { createContext, useState, useMemo } from 'react'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: 'normal',
  subsets: ['latin'],
})

const initialState = {
  token: "",
  isError: false,
  errorMessage: "",
  userId: "",
  userName: "",
  email: "",
  isAuthenticated: false,
}

export const ThemeContext = createContext(initialState);
export const RegionContext = createContext('')
export const QuizObjectContext = createContext({})

export default function MyApp({Component, pageProps}) {
  const router = useRouter()
  const [authObj, setAuthObject] = useState(initialState)
  const [region, setRegion] = useState('default')
  const [quizObject, setQuizObject] = useState({})

  const contextValue = useMemo(() => ({ authObj, setAuthObject }), [authObj, setAuthObject])
  const contextRegion = useMemo(() => ({ region, setRegion }), [region, setRegion])
  const contextQuizObject = useMemo(() => ({ quizObject, setQuizObject }), [quizObject, setQuizObject])

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      {router.pathname.includes('dashboard') ? (
        <RegionContext.Provider value={contextRegion}>
          <ThemeContext.Provider value={contextValue}>
            <PrimaryLayout>
              <Component {...pageProps} />
            </PrimaryLayout>
          </ThemeContext.Provider>
        </RegionContext.Provider>
      ) : router.pathname.includes('builder') ? (
        <QuizObjectContext.Provider value={contextQuizObject}>
          <RegionContext.Provider value={contextRegion}>
            <ThemeContext.Provider value={contextValue}>
              <AuthStateWrapper>
                <BuilderLayout>
                  <Component {...pageProps} />
                </BuilderLayout>
              </AuthStateWrapper>
            </ThemeContext.Provider>
          </RegionContext.Provider>
        </QuizObjectContext.Provider>
      ) : router.pathname.includes('quest') ? (
        <QuestLayout>
          <Component {...pageProps} />
        </QuestLayout>
      ) : router.pathname.includes('auth') ? (
        <ThemeContext.Provider value={contextValue}>
          <AuthStateWrapper>
            <PrimaryLayout>
              <Component {...pageProps} />
            </PrimaryLayout>
          </AuthStateWrapper>
        </ThemeContext.Provider>
      ) : (
        <RegionContext.Provider value={contextRegion}>
          <PrimaryLayout>
            <Component {...pageProps} />
          </PrimaryLayout>
        </RegionContext.Provider>
      )}
    </>
  )
}
