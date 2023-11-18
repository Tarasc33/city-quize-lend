import {useRouter} from 'next/router'
import {ToastContainer} from "react-toastify"
import {useEffect, useState, React} from "react"
import {child, get, ref} from "firebase/database"
import {db} from "../../src/components/db/firebase"
import '../../src/app/globals.css'
import Quiz from 'react-quiz-component'

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


  const setQuizResult = (obj) => {
    console.log(obj);
    // YOUR LOGIC GOES HERE
  }

  return (
    <>
      {itemQuest && itemQuest.questions ?
      <Quiz
        quiz={itemQuest}
        //shuffle={true}
        //shuffleAnswer={true}
        //disableSynopsis={true}
        showDefaultResult={true}
        //renderCustomResultPage={renderCustomResultPage}
        onComplete={setQuizResult}
      />
      : null}
      {/*{*/}
      {/*  itemQuest && itemQuest.questions ? (*/}
      {/*    <>*/}
      {/*      <h1>quest</h1>*/}
      {/*      <p>{itemQuest.quizTitle}</p>*/}
      {/*      <p>{itemQuest.time}</p>*/}
      {/*      <div> {itemQuest?.questions?.map((item, index) => {*/}
      {/*          return (*/}
      {/*            <>*/}
      {/*              <h3 key={index}>{item.question}</h3>*/}
      {/*              {item?.answers.map((answer, index) => {*/}
      {/*                return (*/}
      {/*                  <p key={index}>{answer}</p>*/}
      {/*                )*/}
      {/*              })}*/}
      {/*            </>*/}
      {/*          )*/}
      {/*        })*/}
      {/*      }*/}
      {/*      </div>*/}
      {/*      <Quiz*/}
      {/*        quiz={itemQuest}*/}
      {/*        shuffleAnswer={true}*/}
      {/*        disableSynopsis={true}*/}
      {/*      />*/}
      {/*    ) : (*/}
      {/*      <p>Loading...</p>*/}
      {/*      )}*/}
      {/*      <ToastContainer/>*/}
      {/*    </>*/}
      {/*  )}*/}
    </>
  )
}

export default Id
