import { useRouter } from 'next/router'
import '../../src/app/globals.css'
import {useEffect, useState} from "react"
import {child, get, ref, remove} from "firebase/database"
import {db} from "../../src/components/db/firebase"
import {useContext} from "react"
import {RegionContext, ThemeContext} from "../_app"
import React from "react"

const Settings = () => {
  const tasksRef = ref(db)
  const router = useRouter()
  const [loading, setLoadingDb] = useState(false)
  const [userQuize, setUserQuiz] = useState([])
  console.log(userQuize, 'userQuize')

  const contextValue = useContext(ThemeContext)

  const dataUserQuiz = () => {
    try {
      get(child(tasksRef, `users/${contextValue.authObj.userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const dataArray = Object.keys(snapshot.val() || {}).length > 0 ? Object.values(snapshot.val()) : []
          setUserQuiz(dataArray)
          //setLoadingDb(false)
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

  useEffect(() => {dataUserQuiz()}, [])

  return (
    <>
      <h2>
        Settings
      </h2>
      <div>
        {userQuize.map((item, index) => {
          return (
            <>
              <div>
                <h3>{item.quizTitle}</h3>
              </div>
              <button onClick={() => {
                const regiondbRef = ref(db, `regions/${item.regionName}/${item.id}`)
                const dbRef = ref(db, `users/${contextValue.authObj.userId}/${item.id}`)
                remove(dbRef).then(() => {
                  dataUserQuiz()
                  //setUserQuiz([])
                })
                remove(regiondbRef).then(() => console.log("Deleted"))
              }}>x</button>
            </>
          )
        })}
      </div>
    </>
  )
}

export default Settings
