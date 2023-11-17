import { useRouter } from 'next/router'
import {ToastContainer} from "react-toastify"
import {useEffect, useState} from "react"
import {child, get, ref} from "firebase/database"
import {db} from "../../src/components/db/firebase"
import '../../src/app/globals.css'

const Id = () => {
  const router = useRouter()
  const id = router.query.id
  const tasksRef = ref(db)
  const [itemQuest, setItemQuest] = useState([])

  useEffect(() => {
    const getFormApp = async (regionItemId) => {
      try {
        get(child(tasksRef, `regions/${regionItemId}/${id}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setItemQuest(snapshot.val())
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
      <h1>quest</h1>
      <p>{itemQuest.titleQuestions}</p>
      <p>{itemQuest.time}</p>
      <ToastContainer/>
    </>
  )
}

export default Id
