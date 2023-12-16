import {useRouter} from 'next/router'
import {useEffect, useState} from "react"
import {child, get, ref, update} from "firebase/database"
import {db} from "../../src/components/db/firebase"
import '../../src/app/globals.css'
import Quiz from 'react-quiz-component'
import bg from '../../public/ua.jpg'
import Image from "next/image";

// const renderCustomResultPage = (obj) => {
//   console.log(obj);
//   return (
//     <div>
//       This is a custom result page. You can use obj to render your custom result page
//     </div>
//   )
// }


const Id = () => {
  const router = useRouter()
  const id = router.query.id
  const tasksRef = ref(db)
  const [itemQuest, setItemQuest] = useState([])
  const [loading, setLoadingDb] = useState(false)

  useEffect(() => {
    const getFormApp = async (regionItemId) => {
      setLoadingDb(true)
      try {
        get(child(tasksRef, `regions/${regionItemId}/${id}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setItemQuest(snapshot.val())
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

  console.log(itemQuest, 'itemQuest')

  const setQuizResult = (obj) => {
    if (obj) {
      const dbRef = ref(db, `regions/${itemQuest.regionName}/${itemQuest.id}`)
      update(dbRef, {completeQuizCount: itemQuest.completeQuizCount + 1}).then(() => {
        console.log('complete regions')
      }).then(() => {
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  return (
    // <div style={{
    //   backgroundImage: `url(${bg.src})`,
    //   backgroundRepeat: 'no-repeat',
    //   backgroundSize: 'contain'
    // }}>
    <div>
    {loading ? <p className='loader'>Завантаження...</p> : <Image className="quiz-img" src="/ua.jpg" fill alt=""/>}
    {itemQuest && itemQuest.questions ?
      <Quiz
        quiz={itemQuest}
        shuffle={true}
        shuffleAnswer={true}
        showDefaultResult={true}
        //renderCustomResultPage={renderCustomResultPage}
        onComplete={setQuizResult}
      />
      : null}
    </div>
  )
}

export default Id
