import React, { useContext, forwardRef } from "react"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"

import { AppContext } from "../../context/appContext"

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" severity="warning" {...props} />
})

// Alert popup. types available (severity): error, warning, info, success
export default function CustomizedSnackbars() {

  const { isPopupOpen } = useContext(AppContext)
  return (
    <>
      {isPopupOpen ? (
        <Snackbar
          open={isPopupOpen.open}
          autoHideDuration={5000}
          onClose={isPopupOpen.closePopup}
        >
          <Alert
            onClose={isPopupOpen.closePopup}
            severity={isPopupOpen.severity}
            sx={{ width: "100%" }}
          >
            {isPopupOpen.message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
    </>
  )
}