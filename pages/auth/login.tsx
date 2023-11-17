import Head from "next/head"
import Login from "../../src/components/Auth/Login/Login"

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
