import React, { useEffect, useState, useMemo, useCallback } from "react"
import { navigate, useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@reach/router"

import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"

import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import Collapse from "@mui/material/Collapse"
import FlattenMenu from "./flattenMenu"

import { styled } from "@mui/material/styles"
import { ConnectingAirportsOutlined } from "@mui/icons-material"

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

export default function DrawerItem({ element }) {
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
  //                         childItems {
  //                           nodes {
  //                             uri
  //                             title
  //                             label
  //                             parentDatabaseId
  //                             databaseId
  //                             connectedNode {
  //                               node {
  //                                 id
  //                               }
  //                             }
  //                             order
  //                           }
  //                         }
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
  //     allWpPost {
  //       edges {
  //         node {
  //           slug
  //           title
  //           excerpt
  //           categories {
  //             nodes {
  //               name
  //             }
  //           }
  //           tags {
  //             nodes {
  //               name
  //             }
  //           }
  //           featuredImage {
  //             node {
  //               altText
  //               localFile {
  //                 childImageSharp {
  //                   gatsbyImageData(
  //                     quality: 100
  //                     placeholder: TRACED_SVG
  //                     layout: FULL_WIDTH
  //                   )
  //                 }
  //               }
  //             }
  //           }
  //           id
  //         }
  //       }
  //     }
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `)

  // const [isVisible, setIsVisible] = useState(false)
  // const location = useLocation()

  // const expand = () => {
  //   setIsVisible(!isVisible)
  // }

  // const menu = FlattenMenu(data.allWpMenuItem.nodes)

  // //TODO:  DET ER HER MAN FIKSER AT MENYEN ER ÅPEN!!
  // useEffect(() => {
  //   const array = []
  //   const findParent = (item, arr) => {
  //     arr.map(i => {
  //       if (i.databaseId === item.parentDatabaseId) {
  //         array.push(i)
  //         findParent(i, menu)
  //       }
  //     })
  //   }
  //   console.log(menu)
  //   menu.map(item => {
  //     if (item.uri === location.pathname) {
  //       array.push(item)
  //       findParent(item, menu)
  //     }
  //   })
  //   if (array.includes(element) && element.uri !== location.pathname) {
  //     setIsVisible(true)
  //   }
  // })

  // const handleParentClick = (e, element) => {
  //   if (element.uri === location.pathname) {
  //     expand()
  //   } else {
  //     navigate(element.uri)
  //     expand()
  //   }
  // }

  return (
    <>
      {/* <CustomizedListItemButton
        sx={{
          alignItems: "flex-end",
          borderBottom: "1px solid #dbdbdb",
        }}
        onClick={e => {
          handleParentClick(e, element)
        }}
      >
        <CustomizedListItemText
          sx={{ marginTop: "0px", marginBottom: "0px" }}
          primary={element.label}
        ></CustomizedListItemText>
        {element.childItems.nodes.length > 0 ? (
          isVisible ? (
            <ExpandLess
              key={element.id}
              sx={{ width: "0.9em !important", height: "0.9em" }}
              className="expand-icon"
            />
          ) : (
            <ExpandMore
              key={element.id + "more"}
              sx={{ width: "0.9em !important", height: "0.9em" }}
              className="expand-icon"
            />
          )
        ) : (
          <></>
        )}
      </CustomizedListItemButton>

      {element.childItems?.nodes?.length > 0 ? (
        <Collapse
          key={element.label + "collapse"}
          sx={{ paddingLeft: "0.5rem" }}
          in={isVisible}
          timeout="auto"
          unmountOnExit
        >
          {isVisible ? (
            element.childItems.nodes?.map(child => {
              return (
                <div key={child.label + "next"} style={{ paddingLeft: 10 }}>
                  <DrawerItem element={child} />
                </div>
              )
            })
          ) : (
            <></>
          )}
        </Collapse>
      ) : (
        <></>
      )} */}
    </>
  )
}
