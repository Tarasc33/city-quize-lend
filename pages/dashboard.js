import { useRouter } from 'next/router'
import '../src/app/globals.css'
import Link from "next/link"
import {useEffect, useState} from "react"
import {child, get, ref} from "firebase/database"
import {db} from "../src/components/db/firebase"
import {useContext} from "react"
import {RegionContext} from "./_app"

const Dashboard = () => {
  const tasksRef = ref(db)
  const router = useRouter()
  const [dataRegion, setDataRegion] = useState([])
  const [loading, setLoadingDb] = useState(false)

  const contextRegion = useContext(RegionContext)
  console.log(contextRegion.setRegion, 'dashboard')
  console.log(contextRegion.region, 'region')

  useEffect(() => {
    const getFormApp = async (regionNameId) => {
      setLoadingDb(true)
      try {
        get(child(tasksRef, `regions/${regionNameId}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const dataArray = Object.keys(snapshot.val() || {}).length > 0 ? Object.values(snapshot.val()) : []
            setDataRegion(dataArray)
            setLoadingDb(false)
          } else {
            console.log("No data available")
          }
        }).catch((err) => {
          console.error(err)
        })
      } catch (error) {
        console.log(error)
      }
    }

    if (router.isReady) {
      contextRegion.setRegion(router.query.data)
      getFormApp(router.query.data).catch((error) => {
        console.log(error)
      })
    }
  }, [router.isReady, router.query.form])

  return (
    <>
      <Link href={`/auth/login`}>+ Створити свій квест</Link>
      <h2>
        list quests {router.query.data}
      </h2>
      <div>
        {dataRegion.map((item, index) => {
          return (
            <Link key={index} href={`/quest/${item.id}?data=${router.query.data}`}>
              <h2>
                {item.quizTitle}
              </h2>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Dashboard
