import React, { Component } from 'react';



const Line = ({color, position, width}) => {


  const lineStyle = {
    width: width ? width : "70%",
    color: "red",
    height: "1px",
    backgroundColor: color ? color : "#FFD115",
  }
  const flex = {
    display: "flex",
    marginTop: position ? "" : "5vw",
    marginBottom: "3vw",
    justifyContent: position ? position : "center",
  }

    return (
      <div style={flex}>
        <div style={lineStyle}></div>
      </div>
    )
}

export default Line;