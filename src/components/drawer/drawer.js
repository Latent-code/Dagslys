import * as React from "react"
import { useEffect, useContext, createRef } from "react"
import { styled } from "@mui/material/styles"
import { useTheme } from "@mui/material";

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
import RentalHeader from "../rentalHeader/rentalHeader"
import Loading from "../loading/loading"
import { AppContext } from "../../context/appContext"


import dagslys from "../../images/dagslys-logo.png"
import DrawerItem from "./DrawerItem"
import Menu from "../menu/menu"
import { navigate, useStaticQuery, graphql } from "gatsby"

import "./drawer.css"
import CartMenu from "../cart/cartMenu"

const CustomizedListItemText = styled(ListItemText)`
  & .MuiTypography-root {
    font-size: 0.9rem;
  }
  :hover {
    color: #FFD115;
  }
`
const CustomizedListItemButton = styled(ListItemButton)`
  :hover {
    color: #FFD115;
  }
`

const drawerWidth = 300


function ResponsiveDrawer(props, cameraQuery) {


const graphiqlData = useStaticQuery(graphql`
query TEST {
  allBrentRentalItem {
    nodes {
      displayname
      id
      image
      name
      rentmanId
      shop_description_long
      shop_description_short
      title
      in_shop
      folder
      urlPath
      pageLinkBrent
      childFile {
        childImageSharp {
          gatsbyImageData(
            quality: 100
            placeholder: DOMINANT_COLOR
            layout: FULL_WIDTH
          )
        }
      }
    }
  }
  allBrentRentalFolder {
    nodes {
      displayname
      id
      urlPath
      name
      rentmanId
      title
      path
      itemtype
      order
      pageLinkBrent
      menuParentBrent
    }
  }
}
`)


let FolderData = graphiqlData.allBrentRentalFolder.nodes
let RentalData = graphiqlData.allBrentRentalItem.nodes


const theme = useTheme()
const {setSelectedIndex, selectedIndex} = useContext(AppContext)
const { window, data, menuData, children, menuOpen, location } = props
const [isLoading, setIsLoading] = React.useState(true)

const [mobileOpen, setMobileOpen] = React.useState(false)
const [menu, setMenu] = React.useState(false)
const [rentalItems, setRentalItems] = React.useState(false)

const [searchOpen, setIsSearchOpen] = React.useState(false)

useEffect(() => {
  console.log(RentalData)
  if (RentalData && FolderData) {
    setIsLoading(false)
  } else {
    setIsLoading(true)

  }
  
},[FolderData, RentalData])

  // useEffect(() => {
  //   setIsLoading(false)
  // }, [])

  const searchClickListener = () => {
    setIsSearchOpen(prevValue => !prevValue)
  }


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }


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
           selected={selectedIndex === "root"}
           sx={{
             alignItems: "flex-end",
             borderBottom: "1px solid #dbdbdb",
             "&.Mui-selected": {
               backgroundColor: theme.palette.background.default.selected,
             },
             ":hover": {
              backgroundColor: theme.palette.background.default.selected,
            }
             // "&.Mui-focusVisible": {
             //   backgroundColor: "#2e8b57"
             // },
             // "&.MuiListItemButton-root": {
             //   backgroundColor: "#2e8b57"
             // },
             // ":hover": {
             //   backgroundColor: "#2e8b57"
             // }
           }}
           color="secondary"
          onClick={e => {
            setSelectedIndex("root")
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
        <Menu FolderData={FolderData} RentalData={RentalData} menu={menu} setMenu={setMenu}></Menu>

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
        <Menu FolderData={FolderData} RentalData={RentalData} menu={menu} setMenu={setMenu}></Menu>
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
              PaperProps={{ style: { maxWidth: "70%", backgroundColor: "#171E22" } }}
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
              {/* Adding dagslys logo to top mobile bar */}
              <div className="flex-menu">
                <img
                  className="rental-logo"
                  onClick={() => navigate("/")}
                  src={dagslys}
                  alt="dagslys logo"
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
