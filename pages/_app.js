import PrimaryLayout from "../src/layout/PrimaryLayout/PrimaryLayout"
import QuestLayout from "../src/layout/QuestLayout/QuestLayout"
import BuilderLayout from "../src/layout/BuilderLayout/BuilderLayout"
import { useRouter } from "next/router"
import AuthStateWrapper from "../src/components/Auth/AuthStateWrapper"
import { createContext, useState, useMemo } from 'react'

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

export default function MyApp({Component, pageProps}) {
  const router = useRouter()
  const [authObj, setAuthObject] = useState(initialState)
  const [region, setRegion] = useState('default')

  const contextValue = useMemo(() => ({ authObj, setAuthObject }), [authObj, setAuthObject])
  const contextRegion = useMemo(() => ({ region, setRegion }), [region, setRegion])

  return (
    <>
      {router.pathname.includes('dashboard') ? (
        <RegionContext.Provider value={contextRegion}>
          <ThemeContext.Provider value={contextValue}>
            <PrimaryLayout>
              <Component {...pageProps} />
            </PrimaryLayout>
          </ThemeContext.Provider>
        </RegionContext.Provider>
      ) : router.pathname.includes('builder') ? (
        <RegionContext.Provider value={contextRegion}>
          <ThemeContext.Provider value={contextValue}>
            <AuthStateWrapper>
              <BuilderLayout>
                <Component {...pageProps} />
              </BuilderLayout>
            </AuthStateWrapper>
          </ThemeContext.Provider>
        </RegionContext.Provider>
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
