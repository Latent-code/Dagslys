import React, { useContext, useEffect } from "react"
import { graphql, useStaticQuery, navigate } from "gatsby"
// import { Button, IconButton } from "@mui/material"
import SearchBar from "./search/searchBar"
import brent from "../images/dagslys-logo.png"
import SignInPopup from "./signInPopup/SignInPopup"
import "./rentalHeader.css"
import PrivateRoute from "./privateRoute/privateRoute"
import Home from "../pages/user/home"
import Badge from "@mui/material/Badge"
import { styled } from "@mui/material/styles"

import { CartContext } from "../context/cartContext"

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import CustomizedSnackbars from "./alert/alert"
import { AppContext } from "../context/appContext"
import CartMenu from "./cart/cartMenu"

import CustomizedModal from "./modal/modal"

import {
  TextField,
  Text,
  Content,
  ActionButton,
  Divider,
  Menu,
  Item,
  Button,
  Flex,
  Row,
  Header,
  View,
  Column,
} from "@adobe/react-spectrum"
const RentalHeader = ({ location, setMenuOpen }) => {
  // const data = useStaticQuery(graphql`
  //   query {
  //     allWpMenuItem(filter: { parentDatabaseId: { eq: 0 } }) {
  //       nodes {
  //         title
  //         label
  //         parentDatabaseId
  //         id
  //         databaseId
  //         uri
  //         connectedNode {
  //           node {
  //             id
  //           }
  //         }
  //         childItems {
  //           nodes {
  //             label
  //             title
  //             parentDatabaseId
  //             databaseId
  //             parentId
  //             id
  //             uri
  //             childItems {
  //               nodes {
  //                 uri
  //                 title
  //                 parentDatabaseId
  //                 label
  //                 id
  //                 databaseId
  //                 childItems {
  //                   nodes {
  //                     uri
  //                     title
  //                     label
  //                     parentDatabaseId
  //                     databaseId
  //                     childItems {
  //                       nodes {
  //                         uri
  //                         title
  //                         label
  //                         parentDatabaseId
  //                         databaseId
  //                         connectedNode {
  //                           node {
  //                             id
  //                           }
  //                         }
  //                         order
  //                       }
  //                     }
  //                     connectedNode {
  //                       node {
  //                         id
  //                       }
  //                     }
  //                     order
  //                   }
  //                 }
  //                 connectedNode {
  //                   node {
  //                     id
  //                   }
  //                 }
  //                 order
  //               }
  //             }
  //             connectedNode {
  //               node {
  //                 id
  //               }
  //             }
  //             order
  //           }
  //         }
  //         order
  //       }
  //     }
  //   }
  // `)
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
  const secondFlex = {
    margin: ".5em 0 .5em 0",
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
  }
  const thirdFlex = {
    margin: ".5em 0 .5em 0",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginLeft: "auto",
  }

  // const pageData = data.allWpMenuItem

  const flatten = array => {
    const final = []
    const flat = arr => {
      arr.childItems.nodes.map(item => {
        // const menuItemExist = final.some(el => el.id === item.id)
        // if (!menuItemExist) {
        if (item.childItems.nodes.length > 0) {
          final.push(item)
          flat(item)
        } else {
          final.push(item)
        }
        // }
      })
    }
    array.nodes.map(item => {
      final.push(item)
      flat(item)
    })
    return final
  }

  let currentPage = []
  const makeBreadcrumb = data => {
    data.map(item => {
      // console.log(location.pathname)
      const recursive = i => {
        data.map(item => {
          if (i.parentDatabaseId === item.databaseId) {
            currentPage.push(item)
            recursive(item)
          }
        })
      }
      if (location.pathname === item.uri) {
        recursive(item)
        currentPage.push(item)
        if (item.parentDatabase != 0) {
        }
      }
    })
    // SORT THE breadcrumb based on order from wp menu
    currentPage.sort((a, b) => a.order - b.order)
  }

  // let flatMenu = flatten(pageData)
  // makeBreadcrumb(flatMenu)

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }))

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
          src={brent}
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
