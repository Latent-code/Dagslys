import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { navigate } from "gatsby"

import "./equipmentMenu.css"

const imageStyle = {
  width: "40%",
}

const articleStyle = {
  borderRadius: "1rem 1rem 1rem 1rem",
  padding: "1rem 1rem 1rem 1rem",
  border: "1px solid #FFD115",
  backgroundColor: "white"
}


const EquipmentMenu = ({ data }) => {

  const [allMenuItems, setAllMenuItems] = useState([{}])

  // const featuredImage = {
  //   data: post.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData,
  //   alt: post.featuredImage?.node?.alt || `image`,
  // }

  // console.log(menuItemArr)

  var menuArr = []
  console.log(data)
  data.map((menuItem, index) => {
    if (menuArr.some(item => item.name === menuItem.node.menuCategory.customMenuCategory)) {
      return
    } else {
      let item = {
        "name": menuItem.node.menuCategory.customMenuCategory,
        "slug": menuItem.node.menuCategory.customMenuCategory,
        "children": {}
      }
      menuArr.push(item)
    }
  })
  console.log(menuArr)

  menuArr.map((menuItem, index) => {
    var menuItemArr = []
    data.forEach((item) => {
      if (menuItem.name === item.node.menuCategory.customMenuCategory) {
        let obj = {
          name: item.node.title,
          slug: item.node.slug
        }
        menuItemArr.push(obj)
      }
    })
    menuItem.children = { ...menuItemArr }
  })

  const clickOnMenuItem = (e) => {
    console.log(e.slug)
    navigate(`/${e.slug}`)
  }

  return (
    <div className="equipment-menu">
      <div className="menu-inner">
        {menuArr.map((menuItem, index) => {
          let items = []
          Object.keys(menuItem.children).forEach(function (key, index) {
            items.push(menuItem.children[key])
          })
          return (
            <ul>
              <lh onClick={e => clickOnMenuItem(menuItem)}>{menuItem.name}</lh>
              {items.map((item) => {
                return (<li onClick={e => clickOnMenuItem(item)}>{item.name}</li>)
              })}
            </ul>
          )
        })}
      </div>
    </div>
  )
}

export default EquipmentMenu

// export const pageQuery = graphql`
//   query BlogPostById(
//     $id: String!
//     $previousPostId: String
//     $nextPostId: String
//   ) {
//     post: wpPost(id: { eq: $id }) {
//       id
//       excerpt
//       content
//       title
//       date(formatString: "MMMM DD, YYYY")
//       featuredImage {
//         node {
//           altText
//           localFile {
//             childImageSharp {
//               gatsbyImageData(
//                 quality: 100
//                 placeholder: TRACED_SVG
//                 layout: FULL_WIDTH
//               )
//             }
//           }
//         }
//       }
//     }
//     previous: wpPost(id: { eq: $previousPostId }) {
//       uri
//       title
//     }
//     next: wpPost(id: { eq: $nextPostId }) {
//       uri
//       title
//     }
//   }
// `


