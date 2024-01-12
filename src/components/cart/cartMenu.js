import React, { useContext, useEffect, useRef, useState } from "react"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import autoAnimate from "@formkit/auto-animate"

import { Badge } from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  Text,
  ListView,
  ActionButton,
  Item,
  Flex,
  Link,
} from "@adobe/react-spectrum"

import { CartContext } from "../../context/cartContext"
import { navigate } from "gatsby"
import {useTheme} from "@mui/material/styles"

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper.main}`,
    padding: "0 4px",
  },
}))

const menu = {
  position: "relative",
  marginRight: "2rem",
  // width: "200px",
  height: "auto",

}

const CartMenu = ({ exceptionRef }) => {
  const theme = useTheme()

  const [open, setOpen] = useState(false)
  const { cart, clearCart, getCartTotal } = useContext(CartContext)
  const anchorRef = useRef(null)
  let [isOpen, setIsOpen] = useState(false)

  const modal = {
    right: open ? "calc(0px - 2rem)" : "-550px",
    transition: "right 0.5s",
    position: "absolute",
    top: "65px",
    width: "400px",
    height: "500px",
    overflow: "auto",
    maxWidth: "100vw",

  }

  const handleClear = () => {
    setOpen(false)
    clearCart()
  }
  const handleCheckout = () => {
    setOpen(false)
    navigate("/user/checkout")
  }
  const modalContent = (
    <ListView >
      {Object.keys(cart).length !== 0 ? cart.map(item => {
        return (
          <Item textValue={item.name} key={item.id}>
            <Flex direction="row" gap=".5rem">
              <div>{item.quantity} </div>
              <div>{"x"} </div>
              <Text><Link variant="secondary" onClick={e => navigate(item.urlPath)}>{item.name}</Link></Text>
            </Flex>
          </Item>
        )
      }) : <Item>Your cart is empty...</Item>}
      {Object.keys(cart).length !== 0 && <Item>Total price: {getCartTotal().toFixed(2)}</Item>}
      <Item textValue="checkout or clear cart">
        <Flex wrap gap="size-250">
          <ActionButton onPress={handleCheckout}>
            Checkout
          </ActionButton>
          <ActionButton onPress={handleClear} >
            Clear cart
          </ActionButton>
        </Flex>
      </Item>
    </ListView>
  )
  const handleOpen = () => {
    setOpen(!open)
  }

  useEffect(() => {
    if (anchorRef.current) {
      autoAnimate(anchorRef.current)
    }
  }, [anchorRef])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickListener)

    return () => {
      document.removeEventListener("mousedown", handleClickListener)
    }
  }, [])

  const handleClickListener = event => {
    setOpen(false)

    let clickedOutside
    if (exceptionRef) {
      clickedOutside =
        (anchorRef && anchorRef.current.contains(event.target)) ||
        exceptionRef.current === event.target ||
        exceptionRef.current.contains(event.target)
    } else {
      clickedOutside = anchorRef && anchorRef.current.contains(event.target)
    }

    if (!clickedOutside) return
    else handleOpen()
  }

  return (
    <div ref={anchorRef} className="shoppong-icon-user" style={menu}>
      <div>
        <StyledBadge
          badgeContent={Object.values(cart || {}).reduce(
            (t, { quantity }) => t + quantity,
            0,
          )}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          overlap="circular"
          color="primary"
          max={99}
        >
          <ActionButton >
            <ShoppingCartIcon
              onClick={handleOpen}
              // style={{ color: "black" }}
            ></ShoppingCartIcon>{" "}
          </ActionButton>
        </StyledBadge>
      </div>
      <div className="cart-drawer" style={modal}>{modalContent}</div>
    </div>
  )
}

export default CartMenu
