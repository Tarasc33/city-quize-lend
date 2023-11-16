import PrimaryLayout from "../src/layout/PrimaryLayout/PrimaryLayout"
import QuestLayout from "@/layout/QuestLayout/QuestLayout"
import BuilderLayout from "@/layout/BuilderLayout/BuilderLayout"
import { useRouter } from "next/router"

export default function MyApp({Component, pageProps}) {
  const router = useRouter()
  return (
    <>
      {router.pathname.includes('dashboard') ? (
        <PrimaryLayout>
          <Component {...pageProps} />
        </PrimaryLayout>
      ) : router.pathname.includes('builder') ? (
        <BuilderLayout>
          <Component {...pageProps} />
        </BuilderLayout>
      ) : router.pathname.includes('quest') ? (
        <QuestLayout>
          <Component {...pageProps} />
        </QuestLayout>
      ) : (
        <PrimaryLayout>
          <Component {...pageProps} />
        </PrimaryLayout>
      )}
    </>
  )
}
