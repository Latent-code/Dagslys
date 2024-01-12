import React, { useContext, useEffect } from "react"
import { navigate } from "gatsby"
// import { isLoggedIn } from "../services/auth"
import { AppContext } from "../../context/appContext"

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AppContext)

  useEffect(() => {
    // console.log(!user)
    if (!user) {
      navigate("/")
    }
  }, [user])

  return <>{children}</>
}

export default PrivateRoute
