import React, { Component } from "react"

import loading from "./Ellipsis.svg"


const Loading = ({text, size}) => {
  const parent = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  }
  const img = {
    height: size ? size : "",
  }


  return (
    <div style={parent}>
      <img style={img} src={loading}></img>
    </div>
  )
}

export default Loading
