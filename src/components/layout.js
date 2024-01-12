import React, { createContext, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"
import Header from "../components/header"
import mobileHeader from "../components/mobileHeader"
import MobileHeader from "../components/mobileHeader"
import ResponsiveDrawer from "./drawer"
import HandleApi from "./handleApi/handleApi"
import { Router } from "@reach/router"
import PrivateRoute from "./privateRoute/privateRoute"

const Layout = ({ pageResources, children, mobile, location }) => {
  const data = useStaticQuery(graphql`
    query {
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
                placeholder: BLURRED
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
          pageLinkBrent
          menuParentBrent
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const [open, setOpen] = React.useState()
  const [isNonexistent, setIsNonexistent] = React.useState(true)

  const sort = arr => {
    // SORT THE MENU BASED ON ORDER IN WORDPRESS ADMIN
    return arr.sort((a, b) => a.order - b.order)
  }

  // const modifiedMenuData = sort(data.allWpMenuItem.nodes)

  useEffect(() => {
    if (pageResources?.page.path === "/404.html") {
      setIsNonexistent(true)
    } else {
      setIsNonexistent(false)
    }
  })

  // fetch( {
  //   method: "GET",
  //   body: {
  //     "my-url": "https://api.rentman.net/equipment?limit=$10&offset=10"
  //   }}).then(res => console.log("FETCH API CORS PROXY",res))

  return (
    <React.Fragment>
      {/* <Router>
        <PrivateRoute path="/user/checkout"></PrivateRoute>
        <PrivateRoute path="/user/home"></PrivateRoute> */}
        <Helmet
          title={"Brent rental"}
          meta={[
            { name: "description", content: "A rental house in Oslo" },
            { name: "keywords", content: "rental, camera, video, equipment" },
          ]}
        ></Helmet>
        { isNonexistent ? (
          <div>{children}</div>
        ) : (
          <div style={{backgroundColor: "#171E22"}}>
            <ResponsiveDrawer
              setMenuOpen={setOpen}
              menuOpen={open}
              // data={data.allWpPost.edges}
              // menuData={modifiedMenuData}
              content={children}
              location={location}
              is404={isNonexistent}
              test={data.allBrentRentalItem}
              test2={data.allBrentRentalFolder}
            >
              {children}
            </ResponsiveDrawer>
          </div>
        )}

        <div
          id="content2"
          style={{
            margin: "0 auto",
            maxWidth: 870,
            padding: "0px 1.0875rem 1.45rem",
            paddingTop: 0,
          }}
        ></div>
      {/* </Router> */}
    </React.Fragment>
  )
}

export default Layout
