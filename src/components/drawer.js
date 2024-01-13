import * as React from "react"
import { useEffect, useCallback, createRef } from "react"
import { useContext } from "react"
import { styled } from "@mui/material/styles"

import PropTypes from "prop-types"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MailIcon from "@mui/icons-material/Mail"
import MenuIcon from "@mui/icons-material/Menu"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import Collapse from "@mui/material/Collapse"
import StarBorder from "@mui/icons-material/StarBorder"
import CameraIcon from "@mui/icons-material/Camera"
import MonitorIcon from "@mui/icons-material/Monitor"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SearchIcon from "@mui/icons-material/Search"
import RentalHeader from "./rentalHeader"
import Loading from "./loading/loading"


import brent from "../images/brent_welcome.png"
import DrawerItem from "./DrawerItem"
import Menu from "./menu/menu"
import { navigate, useStaticQuery, graphql } from "gatsby"

import "./drawer.css"
import CartMenu from "./cart/cartMenu"

const CustomizedListItemText = styled(ListItemText)`
  & .MuiTypography-root {
    font-size: 0.9rem;
  }
`
const CustomizedListItemButton = styled(ListItemButton)`
  :hover {
    color: #FFD115;
  }
`

const drawerWidth = 300

function ResponsiveDrawer(props, cameraQuery) {
  const { window, data, menuData, children, menuOpen, location } = props
  const [isLoading, setIsLoading] = React.useState(true)

  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [menu, setMenu] = React.useState(false)
  const [rentalItems, setRentalItems] = React.useState(false)

  const [searchOpen, setIsSearchOpen] = React.useState(false)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const searchClickListener = () => {
    setIsSearchOpen(prevValue => !prevValue)
  }


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }


  // Same as below, not needed
  // const handleExpandClick = (menuItem, e) => {
  //   setMenuOpen(prevState => ({
  //     ...prevState,
  //     [menuItem.databaseId]: !prevState[menuItem.databaseId],
  //   }))
  // }

  // const handleParentClick = (menuItem, e, children) => {
  //   if (children) {
  //     children.map(child => {
  //       if (menuOpen[menuItem.databaseId]) {
  //         setMenuOpen(prevState => ({
  //           ...prevState,
  //           [child]: !prevState[menuItem.databaseId],
  //         }))
  //       }
  //     })
  //   }
  //   setMenuOpen(prevState => ({
  //     ...prevState,
  //     [menuItem.databaseId]: !prevState[menuItem.databaseId],
  //   }))
  //   navigate(menuItem.uri)
  // }

  // NOT NEEDED I THINK. DrawerItem compoinent fixes the recursive issues
  // const secondSubMenu = (element, menuItem) => {
  //   return element.map(item => {
  //     return (
  //       <Collapse
  //         in={menuOpen[`${menuItem.databaseId}`]}
  //         timeout="auto"
  //         unmountOnExit
  //       >
  //         <List component="div" disablePadding>
  //           <ListItemButton
  //             onClick={e => handleChildClick(item)}
  //             sx={{ pl: 4 }}
  //           >
  //             <ListItemText
  //               sx={{ paddingLeft: "1.5rem" }}
  //               primary={item.label}
  //             />
  //           </ListItemButton>
  //         </List>
  //       </Collapse>
  //     )
  //   })
  // }
  // const subMenu = (element, menuItem) => {
  //   return element.map(item => {
  //     const childIds = []
  //     // console.log(item)
  //     item.childItems.nodes.map(childId => {
  //       childIds.push(childId.databaseId)
  //     })

  //     if (item.childItems.nodes.length > 0) {
  //       return (
  //         <React.Fragment>
  //           <Collapse
  //             in={menuOpen[`${menuItem.databaseId}`]}
  //             timeout="auto"
  //             unmountOnExit
  //           >
  //             <ListItemButton
  //               onClick={e => handleParentClick(item, e, childIds)}
  //             >
  //               {/* <ListItemIcon>{menuIcon(item.label)}</ListItemIcon> */}

  //               <ListItemText
  //                 sx={{ paddingLeft: "2rem" }}
  //                 primary={item.label}
  //               />
  //               {menuOpen[`${item.databaseId}`] ? (
  //                 <ExpandLess className="expand-icon" />
  //               ) : (
  //                 <ExpandMore className="expand-icon" />
  //               )}
  //             </ListItemButton>
  //           </Collapse>
  //           {subMenu(item.childItems.nodes, item)}
  //         </React.Fragment>
  //       )
  //     }

  //     return (
  //       <Collapse
  //         in={menuOpen[`${menuItem.databaseId}`]}
  //         timeout="auto"
  //         unmountOnExit
  //       >
  //         <List sx={{ paddingLeft: "1rem" }} component="div" disablePadding>
  //           <ListItemButton
  //             onClick={e => handleChildClick(item)}
  //             sx={{ pl: 4 }}
  //           >
  //             <ListItemText primary={item.label} />
  //           </ListItemButton>
  //         </List>
  //       </Collapse>
  //     )
  //   })
  // }

  //console.log(menu)

  // const test = () => {
  //   var arr = []
  //   menuData.map(item => {
  //     arr.push(item.node)

  //     console.log(item)
  //   })

  //   return arr
  // }

  // const modifiedMenuData = test()

  // console.log(menuData)
  //   console.log(menuData.sort((a, b) => {
  //     let fa = a.label.toLowerCase(),
  //         fb = b.label.toLowerCase();

  //     if (fa < fb) {
  //         return -1;
  //     }
  //     if (fa > fb) {
  //         return 1;
  //     }
  //     return 0;
  // }))
  

  const drawer = (
    <div
      className="mainSidebar"
      style={{
        minWidth: "400px",
        height: "calc(100vh - 228px)",
        overflow: "scroll",
        position: "-webkit-sticky",
        position: "sticky",
        top: "114px",
      }}
    >
      <List>
        <CustomizedListItemButton
          sx={{
            alignItems: "flex-end",
            borderBottom: "1px solid #dbdbdb",
          }}
          onClick={e => {
            navigate("/")
          }}
        >
          <CustomizedListItemText
            sx={{ marginTop: "0px", marginBottom: "0px" }}
            primary={"All equipment"}
          /> 
          {/* 
          <IconButton
            className="searchButton"
            onClick={searchClickListener}
            variant="outlined"
            size="large"
          >
            <SearchIcon variant="outlined" />
          </IconButton> */}
        </CustomizedListItemButton>
        <Menu menu={menu} setMenu={setMenu}></Menu>

        {/* {menuData.map(item => {
          return (
            <div key={item.id}>
              <DrawerItem element={item} location={location} flatMenu={test} />
            </div>
          )
        })} */}
       </List>
    </div>
  )
  const mobileDrawer = (
    <div
      className="mobileSidebar"
      style={{
        minWidth: "70%",
        height: "calc(100vh - 197px)",
        overflow: "scroll",
        position: "-webkit-sticky",
        position: "sticky",
        top: "114px",
      }}
    >
      <List>
        <CustomizedListItemButton
          sx={{
            alignItems: "flex-end",
            borderBottom: "1px solid #dbdbdb",
          }}
          onClick={e => {
            navigate("/")
          }}
        >
          <CustomizedListItemText
            sx={{ marginTop: "0px", marginBottom: "0px" }}
            primary={"All equipment"}
          />
          {/* 
          <IconButton
            className="searchButton"
            onClick={searchClickListener}
            variant="outlined"
            size="large"
          >
            <SearchIcon variant="outlined" />
          </IconButton> */}
        </CustomizedListItemButton>
        <Menu menu={menu} setMenu={setMenu}></Menu>
        {/* <CartMenu mobile={true}></CartMenu> */}

      </List>
    </div>
  )

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <>
      {!isLoading ? (
        <>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
              position="fixed"
              sx={{
                // width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                paddingTop: "1rem",
                paddingBottom: "1rem",
                boxShadow: "none",
                backgroundColor: "#171E22",
                borderBottom: "1px solid #FFD115",
                color: "black !important"
              }}
            >
              <RentalHeader location={location}></RentalHeader>
            </AppBar>

            {/* <div style={{width: "60%"}} class="rental-wrapper">{children}</div> */}

            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
              PaperProps={{ style: { maxWidth: "70%" } }}
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: "flex",

                display: { sm: "block", md: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {/* Adding brent logo to top mobile bar */}
              <div className="flex-menu">
                <img
                  className="rental-logo"
                  onClick={() => navigate("/")}
                  src={brent}
                  alt="brent logo"
                ></img>
              </div>
              {drawer}
              {mobileDrawer}
            </Drawer>

            <Box
              component="main"
              sx={{
                display: "flex",
                height: " calc(100% - 65px)",
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                maxWidth: "100%",
                marginTop: "90px",
              }}
            >
              {/* <SearchBar isOpen={searchOpen} setOpen={setIsSearchOpen}></SearchBar> */}
              {/* <Toolbar className="mobile-toggle"> */}
              <IconButton
                className="mobile-toggle"
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              {/* </Toolbar> */}
              {drawer}
              <div className="seperator"
                style={{
                  width: "1px",
                  height: "100vh",
                  borderLeft: "1px solid #dbdbdb",
                }}
              ></div>
              <div
                style={{
                  width: "70%",
                  paddingLeft: "5rem",
                  borderLeft: "1px solid #dbdbdb",
                }}
                className="rental-wrapper"
              >
                    {children}

                {/* {children} */}
              </div>
            </Box>
          </Box>
          <div
            style={{
              position: "absolute",
              borderTop: "1px solid #FFD115",
              margin: "0 auto",
              padding: "2rem 0rem",
              marginLeft: "auto",
              width: "100%",
              backgroundColor: "#171E22",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className="contact-details "
          >
            <div>Dagslys AS</div>
            <div>Gjerdrums vei 6, 0484 Oslo, Norway</div>
            <div>booking @ dagslys.no</div>
            <div style={{position: "absolute", left: 10, bottom: 10, color: "#171E22"}}>Website: Latent</div>
          </div>
        </>
      ) : (
        <Loading></Loading>
      )}
    </>
  )
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
}

export default ResponsiveDrawer
