import React, { useEffect, useState } from "react"
import { graphql, navigate, useStaticQuery } from "gatsby"
import Loading from "../loading/loading"

import MenuItem from "./menuItem"

const Menu = ({ setMenu, menu, graphiqlData, FolderData, RentalData }) => {
  // const graphiqlData = useStaticQuery(graphql`
  //   query TEST {
  //     allBrentRentalItem {
  //       nodes {
  //         displayname
  //         id
  //         image
  //         name
  //         rentmanId
  //         shop_description_long
  //         shop_description_short
  //         title
  //         in_shop
  //         folder
  //         urlPath
  //         pageLinkBrent
  //         childFile {
  //           childImageSharp {
  //             gatsbyImageData(
  //               quality: 100
  //               placeholder: DOMINANT_COLOR
  //               layout: FULL_WIDTH
  //             )
  //           }
  //         }
  //       }
  //     }
  //     allBrentRentalFolder {
  //       nodes {
  //         displayname
  //         id
  //         urlPath
  //         name
  //         rentmanId
  //         title
  //         path
  //         itemtype
  //         order
  //         pageLinkBrent
  //         menuParentBrent
  //       }
  //     }
  //   }
  // `)

  const [isLoading, setIsLoading] = React.useState(true)
  const hiddenItems = [251, 45, 46, 47]
  const [selectedIndex, setSelectedIndex] = useState(null);

  let completeMenuArr = []
  useEffect(() => {
    
    console.log("rerendered!!! !!! !  ! ! ! ! ! ! ! ! ! ! !")
  },[])
  // let FolderData = graphiqlData.allBrentRentalFolder.nodes
  // let RentalData = graphiqlData.allBrentRentalItem.nodes

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

    const sort = arr => {
      // SORT THE MENU BASED ON ORDER IN RENTMAN
      return arr.sort((a, b) => a.order - b.order)
    }

    const menuSort = (function (data, root) {
        var t = {}
        data.forEach(o => {
          Object.assign((t[o.rentmanId] = t[o.rentmanId] || {}), o)
          ;((t[o.parentFolderId] ??= {}).children ??= []).push(t[o.rentmanId])
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

    setMenu(sort(finalMenu)) // Layout menu setter
    setIsLoading(false)
  }

  const handleClick = (e, item) => {
    navigate(item.urlPath)
  }

  useEffect(() => {
    fixMenu()
    if (menu) {
      setIsLoading(false)
    }
  }, [])

  return (
    <div>
      {!isLoading ? (
        <>
          <div>
            {menu ? (
              menu.map(item => {
                
                // REMOVE KITS FROM MENU
                if (item.rentmanId === 320) {
                } else {
                  return (
                    <div key={item.id}>
                      <MenuItem
                        onClick={e => handleClick(e, item)}
                        menuData={FolderData}
                        item={item}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                      ></MenuItem>
                    </div>
                  )
                }
              })
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <Loading></Loading>
      )}
    </div>
  )
}

export default Menu