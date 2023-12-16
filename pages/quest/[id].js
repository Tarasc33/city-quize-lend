import {useRouter} from 'next/router'
import {useEffect, useState} from "react"
import {child, get, ref, update} from "firebase/database"
import {db} from "../../src/components/db/firebase"
import '../../src/app/globals.css'
import Quiz from 'react-quiz-component'
import bg from '../../public/ua.jpg'
import Image from "next/image"
import {FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon} from 'next-share'


const Id = () => {
  const router = useRouter()
  const id = router.query.id
  const tasksRef = ref(db)
  const [itemQuest, setItemQuest] = useState([])
  const [loading, setLoadingDb] = useState(false)
  const [result, setResult] = useState(null)
  console.log(result, 'result')

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
        setResult(obj)
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  // const renderCustomResultPage = (obj) => {
  //   console.log(obj)
  //   debugger
  //   return (
  //     <div>
  //       <h1>11111</h1>
  //       <FacebookShareButton
  //         url={'https://github.com/next-share'}
  //         quote={'next-share is a social share buttons for your next React apps.'}
  //         hashtag={'#nextshare'}
  //       >
  //         <FacebookIcon size={32} round />
  //       </FacebookShareButton>
  //     </div>
  //   )
  // }
  const titleResult = `Пройдено квест ${itemQuest.quizTitle}. Результат: ${result?.correctPoints}/${result?.totalPoints} Вірно: ${result?.numberOfCorrectAnswers} з ${result?.numberOfQuestions} запитань`

  return (
    // <div style={{
    //   backgroundImage: `url(${bg.src})`,
    //   backgroundRepeat: 'no-repeat',
    //   backgroundSize: 'contain'
    // }}>
    <div>
    {/*{loading ? <p className='loader'>Завантаження...</p> : <Image className="quiz-img" src="/ua.jpg" fill alt=""/>}*/}
    {itemQuest && itemQuest.questions ?
      <Quiz
        quiz={itemQuest}
        shuffle={true}
        shuffleAnswer={true}
        showDefaultResult={false}
        showInstantFeedback={true}
        onComplete={setQuizResult}
        //renderCustomResultPage={renderCustomResultPage}
      />
      : null}
      {result ? (
        <div>
          <div>
            <h2>Ви пройшли тест!</h2>
            <h3></h3>
            <div>
              <h3>Бали:<span>{result.correctPoints}/{result.totalPoints}</span></h3>
              <span>Вірно: {result.numberOfCorrectAnswers} з {result.numberOfQuestions}</span>
            </div>
            <h3>Поділися з друзями!</h3>
            <div>
              <FacebookShareButton
                url={'https://uaquiz.vercel.app'}
                children={titleResult}
                hashtag={`#${itemQuest.regionName}`}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={'https://uaquiz.vercel.app'}
                children={titleResult}
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </div>
          </div>
        </div>)
        : null}
    </div>
  )
}

export default Id
