import { navigate } from "gatsby"
import React, { useContext, useState, useEffect } from "react"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import { CartContext } from "../../context/cartContext"
import { AppContext } from "../../context/appContext"
import ItemCounter from "../itemCounter/itemCounter"
import { Flex } from "@adobe/react-spectrum"
import noImage from "../../images/no-image.png"
import { useTheme } from "@mui/material"


const RentalPageItem = ({ menuChildren }) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext)
  const { user } = useContext(AppContext)
  const [quantity, setQuantity] = useState()
  const theme = useTheme();

  const menuPostContainer = {
    // borderBottom: "1px solid grey",
    backgroundColor: `${theme.palette.primary.main}`,
    border: "1px solid rgb(116 116 116 / 38%)",
    // borderLeft: "1px solid grey",
    // borderRight: "1px solid grey",
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
    // boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    backgroundColor: `${theme.palette.primary.main}`,
    /* border-radius: 1rem 1rem 1rem 1rem; */
    border: "1px solid rgb(116 116 116 / 38%)",
    width: "200px",
    height: "auto",
    cursor: "pointer",

    // display: "flex",
    // flexDirection: "column",
    // height: "251px",
    // gridTemplateColumns: "repeat(8, minmax(10px, 1fr))",
    // boxDhadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    // backgroundColor: "white",
    // /* border-radius: 1rem 1rem 1rem 1rem; */
    // border: "1px solid rgba(0, 0, 0, 0.383)",
  }

  // console.log(menuChildren)

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

  return (
    <div>
      {/* {menuChildren.map(item => {
        // console.log(Object.hasOwn(item, "children"), item)
        // console.log(item)
        {
          return Object.hasOwn(item, "children") ? (
              <RentalPageItem menuChildren={item.children} />
          ) : ( */}
      
      <div>
        <div
          // onClick={e => navigate("/rental" + menuChildren.urlPath + "/")}
          // onClick={() => addToCart(menuChildren)}
          key={menuChildren.id}
          className="page-flex-child hover-orange"
          style={cssGridChild}
        >
          <div onClick={e => navigate(menuChildren.urlPath + "/")}>
            {menuChildren.childFile?.childImageSharp.gatsbyImageData != null ? (
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
      {/* )
        }
      })} */}
    </div>
  )
}

export default RentalPageItem
