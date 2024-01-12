import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import { GatsbyImage } from "gatsby-plugin-image"
import { navigate } from "gatsby"

import "./rentalItem.css"

const cardStyle = {
  display: "flex",
  width: "200px",
  margin: "100px",
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
}
const imageStyle = {
  margin: "1rem 1rem 1rem 1rem",
  display: "flex",
  height: "150px",
  width: "auto",
}
const textStyle = {
  margin: "1rem 1rem 1rem 1rem",

  display: "flex",
  width: "auto",
}

const clickOnRentalItem = (e) => {
  navigate(`/${e.node.slug}`)
}

const RentalItems = ({ data, variant, location }) => {

  console.log(data)
  return (
    <div className="css-grid">
      {/* <Breadcrumb
            location={location}
            menu={[...FolderData, ...RentalData]}
          ></Breadcrumb> */}
      {data.map((data, index) => {

        if (variant === "menu") {
          return <div onClick={() => navigate(`/${data.name}`)}>{data.name}</div>
        }
        else{
          console.log(data)
          return (
            <div onClick={e => clickOnRentalItem(data)} key={index} className="css-grid-child hover-orange">
              {data.node.featuredImage != null
                ? <GatsbyImage
                  image={data.node.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData}
                  alt={data.node.featuredImage?.node?.altText}
                  style={imageStyle}
                  imgStyle={{ objectFit: "contain" }}
                />
                : <></>}
              <div style={textStyle}>{data.node.title}</div>
            </div>
          )
        }
      })
      }
    </div>
  )
}

RentalItems.propTypes = {
  variant: PropTypes.string
}


export default RentalItems