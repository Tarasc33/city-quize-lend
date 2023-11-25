import {useRouter} from 'next/router'
import '../src/app/globals.css'
import Link from "next/link"
import {useEffect, useState} from "react"
import {child, get, ref, update} from "firebase/database"
import {db} from "../src/components/db/firebase"
import {useContext} from "react"
import {RegionContext} from "./_app"
import Image from "next/image"

const Dashboard = () => {
  const tasksRef = ref(db)
  const router = useRouter()
  const [dataRegion, setDataRegion] = useState([])
  const [loading, setLoadingDb] = useState(false)

  const contextRegion = useContext(RegionContext)

  const getFormApp = async (regionNameId) => {
    try {
      get(child(tasksRef, `regions/${regionNameId}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const dataArray = Object.keys(snapshot.val() || {}).length > 0 ? Object.values(snapshot.val()) : []
          setDataRegion(dataArray)
          setLoadingDb(false)
        } else {
          console.log("No data available")
          setLoadingDb(false)
        }
      }).catch((err) => {
        console.error(err)
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoadingDb(true)
    if (router.isReady) {
      contextRegion.setRegion(router.query.data)
      getFormApp(router.query.data).catch((error) => {
        console.log(error)
      })
    }
  }, [router.isReady, router.query.form])

  return (
    <>
      <nav>
        <ul>
          <li><Link href="/">Головна</Link></li>
          <li><Link href={`/auth/login`}>+ Створити новий квест</Link></li>
        </ul>
      </nav>
      <h2>
        Квести для <span>{router.query.data} region</span>
      </h2>
      {dataRegion.length === 0 && !loading ? <p>Квестів немає</p> : loading ? <p>Завантаження...</p> : (
        <div>
          {dataRegion.map((item, index) => {
            const time = new Date(item.time).toLocaleDateString("en-US")
            return (
              <Link
                key={index}
                href={`/quest/${item.id}?data=${router.query.data}`}
                target="_blank"
                passHref
              >
                <h2>
                  {item.quizTitle}
                </h2>
                <p>{item.quizSynopsis}</p>
                <p>{time}</p>
                <p>{item.userName}</p>
                <button>Пройти тест+</button>
                <a>
                  <span>{item.like}</span>
                  <Image
                    src='/love.svg'
                    width='20'
                    height='20'
                    alt='like'
                    onClick={(e) => {
                      e.preventDefault()
                      const dbRef = ref(db, `regions/${item.regionName}/${item.id}`)
                      update(dbRef, {like: item.like + 1}).then(() => {
                        getFormApp(item.regionName)
                      }).catch((err) => {
                        console.log(err)
                      })
                    }}
                  />
                </a>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

export default Dashboard
