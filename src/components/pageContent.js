import React, { useEffect, useState, useMemo, useCallback } from "react"
import { navigate, useStaticQuery, graphql } from "gatsby"

import { GatsbyImage, StaticImage } from "gatsby-plugin-image"

import { useLocation } from "@reach/router"

import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"

import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import Collapse from "@mui/material/Collapse"
import FlattenMenu from "./flattenMenu"

import { styled } from "@mui/material/styles"

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

export default function PageContent({ element }) {
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

  const secondFlex = {
    display: "flex",
    gridTemplateRows: "auto auto auto",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    columnGap: "10px",
    rowGap: "15px",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "3rem",
  }
  const inlineFlex = {
    display: "inline-flex",
    alignItems: "baseline",
    flexWrap: "nowrap",
  }

  const imageStyle = {
    margin: "1rem 1rem 1rem 1rem",
    display: "flex",
    height: "150px",
    width: "auto",
    maxWidh: "30%",
  }
  const textStyle = {
    margin: "1rem 1rem 1rem 1rem",

    display: "flex",
    width: "auto",
  }


  return (
    <>
      <div key={element[0].id} style={secondFlex}>
        {element.map(item => {
          if (item.childItems.nodes.length >= 1) {
            return (
              <div key={item.id + "length>1"} style={{ dispplay: "flex" }}>
                <h5
                  onClick={e => navigate(item.uri)}
                  className="hover-orange main-menu-child"
                >
                  {item.label}
                </h5>
              </div>
            )
          } else {
            // return <PageContent element={item.childItems.nodes}></PageContent>
          }
        })}
      </div>
      <div style={secondFlex}>
        {element.map(item => {
          // console.log(item.childItems.nodes.length)
          if (item.childItems.nodes.length == 0) {
            // console.log(item)
            return (
              <div key={item.id + "length0"} >
                <div
                  key={item.databaseId}
                  onClick={e => navigate(item.uri)}
                  className="page-flex-child hover-orange"
                >
                  {item.connectedNode.node.featuredImage != null ? (
                    <GatsbyImage
                      image={
                        item.connectedNode.node.featuredImage?.node?.localFile
                          ?.childImageSharp?.gatsbyImageData
                      }
                      alt={
                        item.label
                      }
                      style={imageStyle}
                      imgStyle={{ objectFit: "contain" }}
                    />
                  ) : (
                    <StaticImage
                      src="../images/no-image.png"
                      style={imageStyle}
                      imgStyle={{ objectFit: "contain" }}
                    ></StaticImage>
                  )}
                  <div style={textStyle}>{item.label}</div>
                </div>
                {/* <div>NOTHEADER: {item.label}</div> */}
              </div>
            )
          } else {
            // return <PageContent element={item.childItems.nodes}></PageContent>
          }
        })}
      </div>
    </>
  )
}
