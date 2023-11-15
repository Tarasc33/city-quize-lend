import { useRouter } from 'next/router'
import {v4 as uuid} from "uuid"
import {ref, serverTimestamp, set} from "firebase/database"
import {db} from "@/components/db/firebase"
import {getRandomColor, randomIntFromInterval} from "@/helpers/functions"
import {showNotification} from "@/helpers/showNotification"
import {useRef, useState} from "react"
import {ToastContainer} from "react-toastify"

const Id = () => {
  const router = useRouter()
  const id = router.query.id
  console.log(id, 'id')

  return (
    <>
      <h1>quest</h1>

      <ToastContainer/>
    </>
  )
}

export default Id
