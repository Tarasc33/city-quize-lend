"use client"
import {useEffect, useState, useRef} from 'react'
import {v4 as uuid} from 'uuid'
import {ref, set, get, onValue, child, update, serverTimestamp} from "firebase/database"
import {db} from "@/components/db/firebase"
import {ToastContainer} from 'react-toastify'
import {showNotification} from "@/helpers/showNotification"
import VideoContainer from "@/components/VideoContainer/VideoContainer"
import ImageContainerMobile from "@/components/ImageContainerMobile/ImageContainerMobile"
import MapUk from "@/components/MapUk/MapUk"

const Home = () => {

  const targetRef = useRef()
  const tasksRef = ref(db)
  // const [dimensions, setDimensions] = useState({width: 0, height: 0})

  // const [formData, setFormData] = useState(initialFormData)
  // const [loading, setLoading] = useState(false)
  // const [loadingDb, setLoadingDb] = useState(false)
  // const [dataCloud, setDataCloud] = useState([])
  // const [modal, setModal] = useState(false)
  // const [titleModal, setTitleModal] = useState(false)
  // const [itemData, setItemData] = useState(null)
  // const [isOpen, setIsOpen] = useState(false)
  //
  // const [disableReportBtn, setDisableReportBtn] = useState(false)

  // const [error, setError] = useState('')
  // const [submitting, setSubmitting] = useState(false)
  // const [reCaptcha, setRecaptcha] = useState(false)

  // const [countryItemId, setCountryItemId] = useState(false)

  // const updateDimensions = () => {
  //   if (targetRef.current) {
  //     setDimensions({
  //       width: targetRef.current.offsetWidth,
  //       height: targetRef.current.offsetHeight,
  //     })
  //   }
  // }
  //
  // useEffect(() => {
  //   updateDimensions()
  //   window.addEventListener('resize', updateDimensions)
  //   return () => {
  //     window.removeEventListener('resize', updateDimensions)
  //   };
  // }, [])
  //
  // useEffect(() => {
  //   setLoadingDb(true)
  //   onValue(tasksRef, (snapshot) => {
  //     const data = snapshot.val()
  //     if (data !== undefined) {
  //       const dataArray = Object.keys(data?.cloud || {}).length > 0 ? Object.values(data.cloud) : []
  //       setDataCloud(dataArray)
  //     }
  //   })
  //   fetchAllCloudData()
  // }, [])
  //
  // const fetchAllCloudData = () => {
  //   get(tasksRef).then((snapshot) => {
  //     const data = snapshot.val()
  //     if (data !== undefined) {
  //       const dataArray = Object.keys(data?.cloud || {}).length > 0 ? Object.values(data.cloud) : []
  //       setDataCloud(dataArray)
  //       setLoadingDb(false)
  //     }
  //   }).catch((err) => {
  //     console.error(err)
  //   })
  // }
  //
  // const fetchDataById = (id) => {
  //   get(child(tasksRef, `cloud/${id}`)).then((snapshot) => {
  //     if (snapshot.exists()) {
  //       setTitleModal(true)
  //       setItemData(snapshot.val())
  //     } else {
  //       console.log("No data available")
  //     }
  //   }).catch((err) => {
  //     console.error(err)
  //   })
  // }
  //
  // useEffect(() => {
  //   const handleClick = (event) => {
  //     const clickedElement = event.target
  //     if (clickedElement.tagName === 'SPAN') {
  //       setIsOpen(true)
  //       const id = clickedElement.getAttribute('data-id')
  //       if (id) {
  //         fetchDataById(id)
  //       }
  //     }
  //   }
  //   document.body.addEventListener('click', handleClick)
  //   return () => {
  //     document.body.removeEventListener('click', handleClick)
  //   }
  // }, [])
  //
  // useEffect(() => {
  //   document.body.classList.toggle('modal-open', isOpen)
  // }, [isOpen])
  //
  //
  //
  // useEffect(() => {
  //   if (submitting) setError(validation(formData.title))
  // }, [formData.title])

  return (
    <>
      <VideoContainer/>
      <ImageContainerMobile/>
      {/*<PrimaryHeader*/}
      {/*  setModal={setModal}*/}
      {/*  setIsOpen={setIsOpen}*/}
      {/*  setDisableReportBtn={setDisableReportBtn}*/}
      {/*  setRecaptcha={setRecaptcha}*/}
      {/*/>*/}
      <main ref={targetRef} className="main flex min-h-screen flex-col pt-5 bg-[#32d56933] w-[100%] h-[100%]">
        <section className="w-[100%] h-[100%] m-auto">
          {/*{!loadingDb ?*/}
          {/*  <CloudWish*/}
          {/*    dimensions={dimensions}*/}
          {/*    dataCloud={dataCloud}/>*/}
          {/*  : <p*/}
          {/*    className="h-[100%] flex items-center justify-center text-2xl font-bold dark:text-white">Завантаження...</p>*/}
          {/*}*/}
          <MapUk
            // setIsOpen={setIsOpen}
            // setLoading={setLoading}
            // submit={submit}
            // setSubmitting={setSubmitting}
            // setFormData={setFormData}
            // formData={formData}
            // error={error}
            // loading={loading}
            // setError={setError}
            // reCaptcha={reCaptcha}
            // setRecaptcha={setRecaptcha}
            // setCountryItemId={setCountryItemId}
          />
        </section>
      </main>
      {/*{titleModal ?*/}
      {/*  <Modal>*/}
      {/*    <div className="flex">*/}
      {/*      <h1 className="text-2xl font-bold dark:text-white mb-3 mr-3">Бажання: {itemData.title}</h1>*/}
      {/*    </div>*/}
      {/*    <div className="flex">*/}
      {/*      <h2 className="text-2xl font-bold dark:text-white mb-3">{itemData.like}</h2>*/}
      {/*      <img className="w-4 h-4" src="/love.svg" alt='like'/>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <button type="button"*/}
      {/*              onClick={() => {*/}
      {/*                setTitleModal(false)*/}
      {/*                setIsOpen(false)*/}
      {/*                setDisableReportBtn(false)*/}
      {/*                setRecaptcha(false)*/}
      {/*              }}*/}
      {/*              className="text-white mr-3 bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:hover:bg-gray-700 dark:focus:ring-gray-900">*/}
      {/*        Закрити*/}
      {/*      </button>*/}
      {/*      <button*/}
      {/*        className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:hover:bg-purple-700 dark:focus:ring-purple-900"*/}
      {/*        onClick={() => {*/}
      {/*          const dbRef = ref(db, 'cloud/' + itemData.id)*/}
      {/*          update(dbRef, {like: itemData.like + 1}).then(() => {*/}
      {/*            fetchDataById(itemData.id)*/}
      {/*          }).catch((err) => {*/}
      {/*            console.log(err)*/}
      {/*          })*/}
      {/*        }}>Підтримай бажання*/}
      {/*      </button>*/}
      {/*    </div>*/}
      {/*    <div className="flex flex-col items-start">*/}
      {/*      <button*/}
      {/*        type="button"*/}
      {/*        onClick={() => {*/}
      {/*          setTitleModal(false)*/}
      {/*          setModal(true)*/}
      {/*          setIsOpen(true)*/}
      {/*          setDisableReportBtn(false)*/}
      {/*          setRecaptcha(false)*/}
      {/*        }}*/}
      {/*        className="w-[200px] h-10 text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:hover:bg-purple-700 dark:focus:ring-purple-900">*/}
      {/*        + Додай бажання!*/}
      {/*      </button>*/}
      {/*      <button*/}
      {/*        disabled={disableReportBtn}*/}
      {/*        className="text-[#333] background-transparent font-normal text-white px-3 py-1 text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"*/}
      {/*        type="button"*/}
      {/*        onClick={() => {*/}
      {/*          const dbRef = ref(db, 'cloud/' + itemData.id)*/}
      {/*          update(dbRef, {reports: itemData.reports + 1}).then(() => {*/}
      {/*            fetchDataById(itemData.id)*/}
      {/*            showNotification('Ваша скарга буде розглянута командою.', 'success')*/}
      {/*          }).then(() => {*/}
      {/*            setDisableReportBtn(true)*/}
      {/*          }).catch((err) => {*/}
      {/*            console.log(err)*/}
      {/*          })*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        Надіслати скаргу на контент*/}
      {/*      </button>*/}
      {/*    </div>*/}
      {/*  </Modal>*/}
      {/*  : null}*/}

    </>
  )
}

export default Home
