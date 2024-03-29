import React, { useState, useContext, useEffect } from "react"
import { graphql } from "gatsby"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import { Typography } from "@mui/material"
import SEO from "../components/seo"

import Line from "../components/line/line"
import ImageContainer from "../components/imageContainer/imageContainer"
import "./rental-item.css"
import Breadcrumb from "../components/breadcrumb/breadcrumb"

import { CartContext } from "../context/cartContext"
import { AppContext } from "../context/appContext"
import ItemCounter from "../components/itemCounter/itemCounter"



const imageStyle = {
  width: "100vw",
  maxWidth: "20vw"
}

const articleStyle = {
  // borderRadius: "1rem 1rem 1rem 1rem",
  padding: "1rem 1rem 1rem 1rem",
  // border: "1px solid #EB5931",
  backgroundColor: "white"
}


const secondFlex = {
  margin: ".5em 0 .5em 0",
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "row",
}
const inlineFlex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}


const EquipmentItem = ({ data, location, pageContext: { post } }) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext)
  const { user } = useContext(AppContext)
  const [quantity, setQuantity] = useState()

  const pageItem = data

  useEffect(() => {
    const isItemInCart = cart.find(
      cartItem => cartItem.rentmanId === pageItem.brentRentalItem.rentmanId,
    ) // check if the item is already in the cart
    if (isItemInCart) {
      cart.map(cartItem => {
        if (cartItem.rentmanId == pageItem.brentRentalItem.rentmanId) {
          setQuantity(cartItem.quantity)
        }
      })
    } else {
      setQuantity(0)
    }
  }, [cart])
  const addItem = (setQuantity) => {
    addToCart(pageItem.brentRentalItem, setQuantity)
  }
  const removeItem = () => {
    removeFromCart(pageItem.brentRentalItem)
  }
  
  // console.log(pageItem.brentRentalItem.urlPath)
  // console.log(pageItem.brentRentalItem?.childFile?.childImageSharp?.gatsbyImageData?.images?.fallback?.src)

  return (
    <div>
      <SEO 
        title={pageItem.brentRentalItem?.displayname}
        description={pageItem.brentRentalItem?.shop_description_long || pageItem.brentRentalItem?.displayname}
        image={pageItem.brentRentalItem?.childFile?.childImageSharp?.gatsbyImageData?.images?.fallback?.src || ""}
        slug={pageItem.brentRentalItem.urlPath}
        ></SEO>
      <Breadcrumb url={location.pathname} name={pageItem.brentRentalItem?.displayname}></Breadcrumb>
      <Typography variant="h2">{pageItem.brentRentalItem?.displayname}</Typography>
      <div style={inlineFlex}>
        {pageItem.brentRentalItem?.childFile?.childImageSharp.gatsbyImageData != null ? (
          <ImageContainer>
            <GatsbyImage
              image={
                pageItem.brentRentalItem.childFile.childImageSharp.gatsbyImageData
              }
              alt={pageItem.brentRentalItem.displayname}
              style={imageStyle}
              imgStyle={{ objectFit: "contain" }}
            />
          </ImageContainer>
        ) : (
          <StaticImage
            src="../images/no-image.png"
            alt="no image present"
            style={imageStyle}
            imgStyle={{ objectFit: "contain" }}
          ></StaticImage>
        )}
      </div>
      <Line width={"100vw"} />
      <div style={{ width: "20%" }}>{user ?
        <ItemCounter
          price={pageItem.brentRentalItem.price}
          addItem={addItem}
          removeFromCart={removeItem}
          quantity={quantity}
          full
          quiet={false}
        /> : <></>}</div>


      {/* <h5>{pageItem.brentRentalItem.shop_description_short}</h5> */}
      <div style={{ marginTop: "2rem" }}>
        <p dangerouslySetInnerHTML={{ __html: pageItem.brentRentalItem?.shop_description_long }} />
      </div>
      {/* <p>{}</p> */}
    </div>
  )
}

export default EquipmentItem

export const pageQuery = graphql`
query BrentItemQuery ($id: Int) {
  brentRentalItem(rentmanId: {eq: $id}) {
      displayname
      id
      urlPath
      image
      name
      rentmanId
      shop_description_long
      shop_description_short
      title
      in_shop
      folder
      price
      pageLinkBrent
      urlPath
      childFile {
        childImageSharp {
          gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: FULL_WIDTH)
        }
      }
    }
  }
`
