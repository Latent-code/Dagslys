import React, { useState, useEffect } from "react"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"

const ImageContainer = ({ children }) => {
  const [isShown, setIsShown] = useState(false)
  const [isHover, setIsHover] = useState(false)

  const main = {
    display: "flex",
    width: "auto",
    position: "relative",
  }
  const icon = {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: "1",
  }

  const fullScreenContainer = {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#ffffff00",
    top: "0",
    left: "0",
    zIndex: "9999999",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backdropFilter: "blur(8px)",
  }
  const imageContainer = {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "auto",
    height: "auto",
    padding: "5rem",
    backgroundColor: "white",
    top: "0",
    left: "0",
    zIndex: "9999999",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backdropFilter: "blur(8px)",
    border: "1px solid",
  }

  const imageStyle = {
    height: "70vh",
    width: "70vw"
  }

  const handleMouseEnter = () => {
    setIsHover(true)
  }
  const handleMouseLeave = () => {
    setIsHover(false)
  }

  const handleClick = () => {
    setIsShown(!isShown)
    setIsHover(false)
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsShown(false)
        setIsHover(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const FullScreenImage = () => {
    return (
      <div style={fullScreenContainer}>
        <div style={imageContainer}>
        <FullscreenExitIcon />
          {React.cloneElement(children, {style: imageStyle})}
          </div>
      </div>
    )
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={main}
    >
      <div style={icon}>{isHover ? <FullscreenIcon /> : <></>}</div>
      {isShown ? <FullScreenImage /> : children}
    </div>
  )
}

export default ImageContainer
