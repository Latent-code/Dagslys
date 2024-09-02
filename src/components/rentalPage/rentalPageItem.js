import { navigate } from "gatsby"
import React, { useContext, useState, useEffect } from "react"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import { CartContext } from "../../context/cartContext"
import { AppContext } from "../../context/appContext"
import ItemCounter from "../itemCounter/itemCounter"
import { useTheme } from "@mui/material"


const RentalPageItem = ({ menuChildren }) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext)
  const { user, setSelectedIndex } = useContext(AppContext)
  const [quantity, setQuantity] = useState()
  const theme = useTheme();

  const menuPostContainer = {
    backgroundColor: `${theme.palette.background.default.main}`,
    border: "1px solid rgb(116 116 116 / 38%)",
    padding: "5px 0",
  }
  const imageStyle = {
    margin: "1rem 1rem 1rem 1rem",
    display: "flex",
    height: "120px",
    width: "auto",
  }
  const textStyle = {
    margin: "1rem 1rem 1rem 1rem",
    fontWeight: 300,
    fontSize: "0.8em",
    display: "flex",
    width: "auto",
    height: "50px",
    textOverflow: "ellipsis",
    overflow: "hidden",
  }

  const headerButtonStyle = {
    marginTop: "1rem",
  }

  const cssGridChild = {
    backgroundColor: `${theme.palette.background.main}`,
    border: "1px solid rgb(116 116 116 / 38%)",
    width: "200px",
    height: "auto",
    cursor: "pointer",
  }

  //Check if cart changes, update number for itemCounter
  useEffect(() => {
    if (cart) {
      const isItemInCart = (cart || []).find(
        cartItem => cartItem.rentmanId === menuChildren.rentmanId,
      ) // check if the item is already in the cart
      if (isItemInCart) {
        cart.map(cartItem => {
          if (cartItem.rentmanId == menuChildren.rentmanId) {
            setQuantity(cartItem.quantity)
          }
        })
      } else {
        setQuantity(0)
      }
    }
  }, [cart])

  const addItem = (setQuantity) => {
    addToCart(menuChildren, setQuantity)
  }
  const removeItem = () => {
    removeFromCart(menuChildren)
  }
  const handleNavigate = (item) => {
    setSelectedIndex(item.id)
    navigate(item.urlPath)
  }

  return (
    <div>
      <div>
        <div
          key={menuChildren.id}
          className="page-flex-child hover-orange"
          style={cssGridChild}
        >
          <div onClick={e => handleNavigate(menuChildren)}>
            {menuChildren.childFile?.childImageSharp?.gatsbyImageData != null ? (
              <GatsbyImage
                image={menuChildren.childFile.childImageSharp.gatsbyImageData}
                alt={menuChildren.displayname}
                style={imageStyle}
                imgStyle={{ objectFit: "contain" }}
              />
            ) : (
              <StaticImage
                src="../../images/no-image.png"
                alt="no image"
                style={imageStyle}
                imgStyle={{ objectFit: "contain" }}
              ></StaticImage>
            )}
            <div className="page-item-text" style={textStyle}>
              {menuChildren.displayname}
            </div>
          </div>
        </div>
        {user ? (
          <div style={menuPostContainer}>
            <ItemCounter
              price={menuChildren.price}
              addItem={addItem}
              removeFromCart={removeItem}
              quantity={quantity}
              full
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default RentalPageItem
