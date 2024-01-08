import '../../src/app/globals.css'
import {useEffect, useState} from "react"
import {child, get, ref, remove} from "firebase/database"
import {db} from "../../src/components/db/firebase"
import {useContext} from "react"
import {ThemeContext, QuizObjectContext} from "../_app"
import {useRouter} from "next/router"
import Link from "next/link";

const Settings = () => {
  const tasksRef = ref(db)
  const router = useRouter()
  const [loading, setLoadingDb] = useState(false)
  const [userQuize, setUserQuiz] = useState([])

  const contextValue = useContext(ThemeContext)
  const contextQuizObject = useContext(QuizObjectContext)

  const dataUserQuiz = () => {
    setLoadingDb(true)
    try {
      get(child(tasksRef, `users/${contextValue.authObj.userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const dataArray = Object.keys(snapshot.val() || {}).length > 0 ? Object.values(snapshot.val()) : []
          setUserQuiz(dataArray)
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


  const fetchDataById = (regionId, id) => {
    get(child(tasksRef, `regions/${regionId}/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        contextQuizObject.setQuizObject(snapshot.val())
      } else {
        console.log("No data available")
      }
    }).then(() => {
      router.push(`/builder?data=edit`)
    }).catch((err) => {
      console.error(err)
    })
  }

  useEffect(() => {
    dataUserQuiz()
  }, [])

  return (
    <>
      {loading ? <p className='loader'>Завантаження...</p> : (
        <>
          <div>
            <h2 style={{margin: '30px 20px'}}>Мої квести</h2>
            <div className='my-quest-container'>
              {userQuize.map((item, index) => {
                const time = new Date(item.time).toLocaleDateString("en-US")
                return (
                  <div className='my-quest'>
                    <div key={index}>
                      <div style={{display: "flex"}}>
                        Назва: <h3>{item.quizTitle}</h3>
                      </div>
                      <p>Опис: {item.quizSynopsis}</p>
                      <p>Дата: {time}</p>
                      <p>Регіон: {item.regionName}</p>
                    </div>
                    <div className="buttons-container">
                      <Link target="_blank" href={`/quest/${item.id}?data=${item.regionName}`}>Перегянути</Link>
                      <button  onClick={() => {
                        fetchDataById(item.regionName, item.id)
                      }}>
                        Редагувати
                      </button>
                      <button className="delate" onClick={() => {
                        const regiondbRef = ref(db, `regions/${item.regionName}/${item.id}`)
                        const dbRef = ref(db, `users/${contextValue.authObj.userId}/${item.id}`)
                        remove(dbRef).then(() => dataUserQuiz())
                        remove(regiondbRef).then(() => console.log("Deleted"))
                      }}>x
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Settings
