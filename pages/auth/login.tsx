import Head from "next/head"
import Login from "../../src/components/Auth/Login/Login"
import '../../src/app/globals.css'

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="" />
      </Head>
      <Login />
    </>
  )
}
export default LoginPage
