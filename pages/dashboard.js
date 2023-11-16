import { useRouter } from 'next/router'
import '../src/app/globals.css'
import Link from "next/link"
import {useEffect, useState} from "react"
import {child, get, ref} from "firebase/database"
import {db} from "@/components/db/firebase"

const Dashboard = () => {
  const tasksRef = ref(db)
  const router = useRouter()
  const [dataRegion, setDataRegion] = useState([])
  const [loading, setLoadingDb] = useState(false)
  console.log(dataRegion, 'dataRegion')
  console.log(loading)

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
      getFormApp(router.query.data).catch((error) => {
        console.log(error)
      })
    }
  }, [router.isReady, router.query.form])

  return (
    <>
      <Link href={`/builder?data=${encodeURIComponent(router.query.data)}`}>+ Створити свій квест</Link>
      <h2>
        list quests {router.query.data}
      </h2>
      <div>
        {dataRegion.map((item, index) => {
          return (
            <Link key={index} href={`/quest/${item.id}?data=${router.query.data}`}>
              <h2>
                {item.titleQuestions}
                {item.id}
              </h2>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Dashboard
