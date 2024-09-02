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
  maxWidth: "20vw",
}

const articleStyle = {
  padding: "1rem",
  backgroundColor: "white",
}

const secondFlex = {
  margin: ".5em 0",
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "row",
}
const inlineFlex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const EquipmentItem = ({ data, location }) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext)
  const { user } = useContext(AppContext)
  const [quantity, setQuantity] = useState(0)

  const { brentRentalItem } = data

  useEffect(() => {
    if (brentRentalItem) {
      const cartItem = cart.find(item => item.rentmanId === brentRentalItem.rentmanId);
      setQuantity(cartItem ? cartItem.quantity : 0);
    }
  }, [cart, brentRentalItem?.rentmanId]);

  const addItem = () => {
    addToCart(brentRentalItem, setQuantity)
  }

  const removeItem = () => {
    removeFromCart(brentRentalItem)
  }

  console.log(data)
  const imageData =
    brentRentalItem?.childFile?.childImageSharp?.gatsbyImageData

  return (
    <div>
      <SEO
        title={brentRentalItem?.displayname}
        description={brentRentalItem?.shop_description_long || brentRentalItem?.displayname}
        image={imageData?.images?.fallback?.src || ""}
        slug={brentRentalItem.urlPath}
      />
      <Breadcrumb url={location.pathname} name={brentRentalItem?.displayname} />
      <Typography variant="h2">{brentRentalItem?.displayname}</Typography>
      <div style={inlineFlex}>
        {imageData ? (
          <ImageContainer>
            <GatsbyImage
              image={imageData}
              alt={brentRentalItem.displayname}
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
          />
        )}
      </div>
      <Line width={"100vw"} />
      <div style={{ width: "20%" }}>
        {user && (
          <ItemCounter
            price={brentRentalItem.price}
            addItem={addItem}
            removeFromCart={removeItem}
            quantity={quantity}
            full
            quiet={false}
          />
        )}
      </div>
      <div style={{ marginTop: "2rem" }}>
        <p
          dangerouslySetInnerHTML={{
            __html: brentRentalItem?.shop_description_long,
          }}
        />
      </div>
    </div>
  )
}

export default EquipmentItem

export const pageQuery = graphql`
  query BrentItemQuery($id: Int) {
    brentRentalItem(rentmanId: { eq: $id }) {
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
          gatsbyImageData(
            quality: 100
            placeholder: DOMINANT_COLOR
            layout: FULL_WIDTH
          )
        }
      }
    }
  }
`