import React, { useEffect, useState, useContext } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import { navigate } from "gatsby"
import Breadcrumb from "../components/breadcrumb/breadcrumb"
import Loading from "../components/loading/loading"
import { Typography, Button } from "@mui/material"
import { ActionButton } from "@adobe/react-spectrum"
import ItemCounter from "../components/itemCounter/itemCounter"
import RentalPageItem from "../components/rentalPage/rentalPageItem"
import { AppContext } from "../context/appContext"

import SEO from "../components/seo"

import "./page.css"
import Line from "../components/line/line"


const Page = ({ pageContext, location }) => {

  const rentalItemFlex = {
    display: "flex",
    columnGap: "10px",
    rowGap: "15px",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
  }

  const headerButtonStyle = {
    color: "#FFD115",
    // fontSize: "2em",
    marginTop: "3em",
    marginBottom: "1em",
  }

  const data = useStaticQuery(graphql`
  query rentmanData {
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
        price
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
        pageLinkBrent
        menuParentBrent
      }
    }
  }
  `)

  const { setSelectedIndex } = useContext(AppContext)

  const [isLoading, setIsLoading] = useState(true)
  const [menu, setMenu] = useState()
  const [pageItems, setPageItems] = useState()
  const [pageCategories, setPageCategories] = useState()

  const brentRentalItems = data.allBrentRentalItem.nodes

  const hiddenItems = [251, 45, 46, 47]
  let completeMenuArr = []

  let FolderData = data.allBrentRentalFolder.nodes
  let RentalData = data.allBrentRentalItem.nodes

  const fixMenu = () => {
    // Change folder and parent to a number, not string
    RentalData.map((item, index) => {
      if (!item.in_shop) {
        RentalData.splice(index, 1)
      }


      item.parentFolderId = parseInt(item.folder.split("/").slice(-1))
      completeMenuArr.push(item)
    })

    FolderData.map((item, index) => {
      if (
        item.itemtype === "contact" ||
        item.itemtype === "vehicle" ||
        item.itemtype === "user"
      ) {
        FolderData.splice(index, 1)
      } else if (
        item.displayname.startsWith("import-") ||
        item.displayname.startsWith("Import-")
      ) {
      } else if (hiddenItems.includes(item.rentmanId)) {
        FolderData.splice(index, 1)
      } else {
        if (item.menuParentBrent != null) {
          item.parentFolderId = parseInt(
            item.menuParentBrent?.split("/").slice(-1),
          )
          completeMenuArr.push(item)
        } else {
          item.parentFolderId = null
          completeMenuArr.push(item)
        }
      }
    })

    const menuSort = (function (data, root) {
      var t = {}
      data.forEach(o => {
        Object.assign((t[o.rentmanId] = t[o.rentmanId] || {}), o)
          ; ((t[o.parentFolderId] ??= {}).children ??= []).push(t[o.rentmanId])
      })
      return t[root].children
    })(completeMenuArr, null),
      shop = (r, { children = [], ...o }) => {
        children = children.reduce(shop, [])
        const sub = children.length ? { children } : {}
        if (o.in_shop || sub.children) r.push({ ...o, ...sub })
        return r
      }
    let finalMenu = menuSort.reduce(shop, [])

    setMenu(finalMenu) // Layout menu setter
    setIsLoading(false)
  }



  const currentPageId = pageContext.page.id
  useEffect(() => {
    fixMenu()
    let rentalItems = []
    let rentalFolders = []
    RentalData.forEach((item) => {
      if (item.parentFolderId === currentPageId) {
        rentalItems.push(item)
      }
    })
    FolderData.forEach((item) => {
      if (item.parentFolderId === currentPageId) {
        rentalFolders.push(item)
      }
    })

    setPageItems(rentalItems.sort((a, b) => a.displayname.localeCompare(b.displayname)))
    setPageCategories(rentalFolders.sort((a, b) => a.displayname.localeCompare(b.displayname)))
  }, [])


  const handleClick = item => {
    setSelectedIndex(item.id)
    navigate(item.urlPath)
  }
  console.log(pageContext.pageLinkBrent)
  return (
    <div>
      {
        <div>
          <Breadcrumb url={location.pathname} name={pageContext.page.name}></Breadcrumb>
          <Typography variant="h2">{pageContext.page.name}</Typography>
          <SEO
            title={pageContext.page.name}
            description={pageContext.page.name}
            slug={pageContext.pageLinkBrent}
            />
          <div>
            {pageCategories ? pageCategories.map((item, index) => {
              if (item.parentFolderId === currentPageId) {

                return (
                  <ActionButton
                    marginEnd="size-150"
                    marginBottom="size-150"
                    key={item.id}
                    onClick={e => handleClick(item)}
                    style={headerButtonStyle}
                    variant="outlined"
                  >
                    {item.displayname}
                  </ActionButton>
                )
              }
            })
              : <></>
            }

          </div>
          <Line position={"flex-start"}></Line>
          <div >
            {pageCategories ? pageCategories.map((item, index) => {
              return (
                <div key={item.rentmanId}>
                  {console.log(item)}
                  <Button
                    onClick={e => handleClick(item)}
                    sx={headerButtonStyle}
                    variant="outlined"
                    color="secondary"
                  >
                    {item.displayname}
                  </Button>
                  <div style={rentalItemFlex}>
                    {RentalData ? RentalData.map(i => {
                      if (item.rentmanId === i.parentFolderId) {
                        {console.log(i)}
                        return (
                          <div className="page-flex" key={i.id}
                          >
                            <RentalPageItem
                              menuChildren={i}
                            />
                            {/* <ItemCounter /> */}
                          </div>
                        )
                      }
                    })
                      : <></>
                    }
                  </div>
                </div>
              )
            })
              : <></>
            }
          </div>
          <div className="page-flex-header main-menu">
            {pageItems ? pageItems.map(item => {
              if (item.parentFolderId === currentPageId) {
                return (
                  <div key={item.id}
                  >
                    <RentalPageItem
                      menuChildren={item}
                    />
                    {/* <ItemCounter /> */}
                  </div>
                )
              }
            })
              : <></>
            }


          </div>
        </div>

      }
    </div>
  )
}

export default Page