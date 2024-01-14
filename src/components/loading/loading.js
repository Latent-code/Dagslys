import React from "react"

import { useTheme } from "@mui/material"
import loading from "./Ellipsis.svg"


const Loading = ({text, size, inline}) => {
  const theme = useTheme()
  const parent = {
    position: "absolute",
    zIndex: "9999999999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.background.default.main,
    height: "100vh",
    width: "100vw",
    left: "0"
  }

  const inlineStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  }
  
  const img = {
    height: size ? size : "",
  }

  return (
    <div style={inline ? inlineStyle : parent}>
      <img style={img} src={loading}></img>
    </div>
  )
}

export default Loading