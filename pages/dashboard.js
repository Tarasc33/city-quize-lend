import {useRouter} from 'next/router'
import '../src/app/globals.css'
import Link from "next/link"
import {useEffect, useState} from "react"
import {child, get, ref, update} from "firebase/database"
import {db} from "../src/components/db/firebase"
import {useContext} from "react"
import {RegionContext} from "./_app"
import Image from "next/image"
import {regions} from '../src/helpers/regionType'

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
    <div className='dashboard'>
      <nav className='dashboard-nav'>
        <ul className='dashboard-ul'>
          <li className='dashboard-li-main'><Link href="/">Головна</Link></li>
          <li className='dashboard-li-quest'><Link href={`/auth/login`}>+Створити квест</Link></li>
        </ul>
      </nav>
      <div className="dashboard-content">
      <div className='region'>
       <h2>{router.query.data} region</h2>
      </div>
      <div className="dashboard-map">
        {regions.map((item, index) => {
          switch (router.query.data) {
            case item:
              return (
                <div key={index} style={{ width: '500px', height: '700px', position: 'relative' }}>
                  <Image
                    src={`/region-map/${router.query.data}.jpeg`}
                    layout="fill"
                    objectFit="contain"
                    alt=""
                  />
                </div>
              )
            default:
              break
          }
          })}
      </div>
      {dataRegion.length === 0 && !loading ? <p>Квестів немає</p> : loading ? <p className='loader'>Завантаження...</p> : (
        <div className='quests-dashboard'>
          {dataRegion.map((item, index) => {
            const time = new Date(item.time).toLocaleDateString("en-US")
            return (
              <Link className='dashboard-card'
                key={index}
                href={`/quest/${item.id}?data=${router.query.data}`}
                target="_blank"
                passHref
              >
                <h3>
                  {item.quizTitle}
                </h3>
                <p>{item.quizSynopsis}</p>
                <p>{time}</p>
                <p>{item.userName}</p>
                <p>Пройдено: {item.completeQuizCount}</p>
                <button>Пройти тест</button>
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
      </div>
    </div>
  )
}

export default Dashboard
