import React, { useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"
import ResponsiveDrawer from "./drawer"

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
  return (
    <React.Fragment>
        <Helmet
          title={"Dagslys rental portal"}
          meta={[
            { name: "description", content: "Norways biggest light rental" },
            { name: "keywords", content: "rental, lights, oslo, equipment" },
          ]}
        ></Helmet>
        { isNonexistent ? (
          <div>{children}</div>
        ) : (
          <div style={{backgroundColor: "#171E22"}}>
            <ResponsiveDrawer
              setMenuOpen={setOpen}
              menuOpen={open}
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
    </React.Fragment>
  )
}

export default Layout
