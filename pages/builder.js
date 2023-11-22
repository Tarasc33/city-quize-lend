import {useContext, useEffect} from "react"
import {ToastContainer} from "react-toastify"
import '../src/app/globals.css'
import {RegionContext} from "./_app"
import Board from "../src/components/Builder/Dashboard"
import {useRouter} from "next/router"

const BuilderPage = () => {
  const router = useRouter()
  const contextRegion = useContext(RegionContext)

  useEffect(() => {
     if (contextRegion.region === 'default' || contextRegion.region === undefined) {
       router.push('/')
     }
   }, [])

  return (
    <>
      <Board/>
      <ToastContainer/>
    </>
  )
}

export default BuilderPage
