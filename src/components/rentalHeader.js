import React, { useContext } from "react"
import { AppContext } from "../context/appContext"

import { navigate } from "gatsby"
import {
  ActionButton,
  Flex,
  View,
} from "@adobe/react-spectrum"


import CustomizedSnackbars from "./alert/alert"
import CartMenu from "./cart/cartMenu"

import CustomizedModal from "./modal/modal"
import SearchBar from "./search/searchBar"
import dagslysLogo from "../images/dagslys-logo.png"
import SignInPopup from "./signInPopup/SignInPopup"
import "./rentalHeader.css"

const RentalHeader = ({ location, setMenuOpen }) => {
 
  const { user, userData, handleSignOut, handleSignIn, setIsPopupOpen } =
    useContext(AppContext)

  const handleClosePopup = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setIsPopupOpen({ open: false, message: "", severity: "" })
  }

  const mainFlex = {
    margin: ".5em 0 .5em 0",
    display: "flex",
    alignItems: "center",
    gap: "5vw",
  }

  return (
    <div className="rental-header-main" style={mainFlex}>
      <CustomizedSnackbars handleClosePopup={handleClosePopup} />
      <CustomizedModal handleClosePopup={handleClosePopup}></CustomizedModal>

      <a href=".">
        {" "}
        <img
          className="header-image"
          style={{ marginLeft: "5vw", width: "200px" }}
          // className="rental-logo"
          onClick={() => navigate("/")}
          src={dagslysLogo}
          alt="brent logo"
        ></img>
      </a>
      {/* <div style={secondFlex}> */}
      <SearchBar setMenuOpen={setMenuOpen}> </SearchBar>

      {user && userData? (
        <View marginStart="auto"  UNSAFE_className="login-menu-bar">
          <Flex alignItems="center" direction="row" gap="size-200">
              <ActionButton onPress={() => navigate("/user/home")}>
                {userData.firstName + " " + userData.lastName}
              </ActionButton>
            <ActionButton
              variant="primary"
              minWidth={100}
              // style="outline"
              onPress={e => handleSignOut()}
            >
              Sign Out
            </ActionButton>
            <CartMenu mobile={false}></CartMenu>
          </Flex>
        </View>
      ) : (
        <SignInPopup handleSignIn={handleSignIn}></SignInPopup>
      )}
    </div>
  )
}

export default RentalHeader
