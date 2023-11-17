// import AuthButton from "@/src/components/Auth/AuthButton/AuthButton"
// import { signInWithGoogle } from "@/src/store/auth/auth"
// import Link from "next/link"
// import { PROJECTS, LOGIN } from "@/src/static/routes"
// import { useRouter } from "next/router"
// import { useDispatch, useSelector } from "react-redux"
// import { authSelector } from "@/src/store/auth/selectors"
// import { AppDispatch } from "@/src/store/store"
// import styles from "../Auth.module.sass"
// import { Typography } from "@mui/material"
//
// const SignUp = () => {
//   const route = useRouter()
//   const dispatch = useDispatch<AppDispatch>()
//   const { isFetching, errorMessage, isError } = useSelector(authSelector)
//
//   const onSuccess = () => route.push(PROJECTS)
//
//   return (
//     <div className={styles.container}>
//       <div className={`${styles.box} ${styles.form}`}>
//         <Typography variant="h2">Register</Typography>
//         <form>
//           <AuthButton
//             title={isFetching ? "Loading..." : "Sign up with Google"}
//             onClick={() => dispatch(signInWithGoogle({ callback: onSuccess }))}
//             loading={isFetching}
//           />
//           {isError ? (
//             <Typography
//               variant="body2"
//               color="error"
//               className={styles.errorMessage}
//             >
//               {errorMessage}
//             </Typography>
//           ) : null}
//         </form>
//       </div>
//       <div className={`${styles.box} ${styles.subForm}`}>
//         <Typography variant="body2">
//           I already have an account, <Link href={LOGIN}>Log In</Link>
//         </Typography>
//       </div>
//     </div>
//   )
// }
//
// export default SignUp
