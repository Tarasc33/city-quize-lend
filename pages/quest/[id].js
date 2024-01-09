import {useRouter} from 'next/router'
import {useEffect, useState} from "react"
import {child, get, ref, update} from "firebase/database"
import {db} from "../../src/components/db/firebase"
import '../../src/app/globals.css'
import Quiz from 'react-quiz-component'
import {FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon, TelegramShareButton,
  TelegramIcon, ViberShareButton, ViberIcon, WhatsappShareButton,
  WhatsappIcon, LinkedinShareButton, LinkedinIcon, EmailShareButton, EmailIcon} from 'next-share'

const Id = () => {
  const router = useRouter()
  const id = router.query.id
  const tasksRef = ref(db)
  const [itemQuest, setItemQuest] = useState([])
  const [loading, setLoadingDb] = useState(false)
  const [result, setResult] = useState(null)

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
        setResult(obj)
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const titleResult = `Пройдено квест ${itemQuest.quizTitle}. Результат: ${result?.correctPoints}/${result?.totalPoints} Вірно: ${result?.numberOfCorrectAnswers} з ${result?.numberOfQuestions} запитань`

  return (
    <div>
    {loading ? <p className='loader'>Завантаження...</p> : null}
    {itemQuest && itemQuest.questions ?
      <Quiz
        quiz={itemQuest}
        shuffle={true}
        shuffleAnswer={true}
        showDefaultResult={false}
        showInstantFeedback={true}
        onComplete={setQuizResult}
      />
      : null}
      {result ? (
        <div style={{
            backgroundColor: `rgba(230, 183, 64, 0.69)`,
            height: '100vh',
            width: '100%',
            margin: '0 auto'
          }}>
          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              zIndex: '100',
              backgroundColor: 'rgba(230, 183, 64, 0.69)',
              padding: '30px',
              borderRadius: '17px'
            }}
          >
            <h2 style={{margin: '30px 0 20px 0'}}>Ви пройшли тест!</h2>
            <h3 style={{marginBottom: '10px', fontWeight: "normal"}}>{itemQuest.quizTitle}</h3>
            <div style={{marginBottom: '20px'}}>
              <span style={{fontWeight: "bold", marginBottom: '10px'}}>{result.numberOfCorrectAnswers} з {result.numberOfQuestions} запитань</span>
              <h3 style={{color: 'green'}}><span>{result.correctPoints} / {result.totalPoints}</span></h3>
            </div>
            <div style={{marginBottom: '10px'}}>Поділися з друзями!</div>
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
              <TelegramShareButton
                url={'https://uaquiz.vercel.app'}
                children={titleResult}
              >
                <TelegramIcon size={32} round />
              </TelegramShareButton>
              <ViberShareButton
                url={'https://uaquiz.vercel.app'}
                children={titleResult}
              >
                <ViberIcon size={32} round />
              </ViberShareButton>
              <WhatsappShareButton
                url={'https://uaquiz.vercel.app'}
                children={titleResult}
                separator=":: "
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <LinkedinShareButton
                url={'https://uaquiz.vercel.app'}
              >
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <EmailShareButton
                url={'https://uaquiz.vercel.app'}
                subject={titleResult}
                body="body"
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
          </div>
        </div>)
        : null}
    </div>
  )
}

export default Id
