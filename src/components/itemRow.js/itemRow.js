import React, { useState, useContext } from "react"
import {
  Button,
  DateRangePicker,
  TextField,
  TableView,
  Flex,
  Text,
  Form,
  Dialog,
  Column,
  Link,
  MenuTrigger,
  Divider,
  ListView,
  Item,
  TableBody,
  TableHeader,
  Row,
  Cell,
  Menu,
  ActionButton,
  NumberField,
} from "@adobe/react-spectrum"
import { navigate } from "gatsby"
import ItemCounter from "../itemCounter/itemCounter"
import MoreSmallListVert from "@spectrum-icons/workflow/MoreSmallListVert"

import { CartContext } from "../../context/cartContext"

const ItemRow = ({ item }) => {
  const { addItem, removeItem, removeItemFromCart } = useContext(CartContext)
  const [isEdit, setIsEdit] = useState()

  const handleEditItemRemark = (e, item) => {
    if (e === "edit") {
      console.log(e, item)
      setIsEdit(true)
    } else if (e === "delete") {
      console.log(e, item)
      removeItemFromCart(item)
    }
    // removeFromCart(item)
    // setIsLoading(true, createProjectRequest())
  }

  return (
    <>
      <Cell>
        <ItemCounter
          price={item.price}
          addItem={() => addItem(item)}
          removeFromCart={() => removeItem(item)}
          quantity={item.quantity}
          full={false}
        ></ItemCounter>
      </Cell>
      <Cell>
        <Flex alignItems="center" justifyContent="space-between">
          <Link onClick={e => navigate(item.urlPath)}>
            {item.name}
          </Link>

          {/* <ActionButton
        price={item.price}
        addItem={addItem}
        removeFromCart={removeItem}
        quantity={item.quantity}
        variant="secondary"
        >
        Delete
      </ActionButton> */}
        </Flex>
      </Cell>
      {isEdit ? (
        <Cell>
          <TextField isDisabled={false}></TextField>
        </Cell>
      ) : (
        <Cell>
          <TextField isDisabled={true}></TextField>
        </Cell>
      )}
      <Cell>{(item.price * item.quantity).toFixed(2)}</Cell>
      <Cell>
        <MenuTrigger>
          <ActionButton isQuiet>
            <MoreSmallListVert />
          </ActionButton>
          <Menu onAction={e => handleEditItemRemark(e, item)}>
            <Item key="edit">Edit item remark</Item>
            <Item key="delete">Remove item</Item>
            {/* <Item>Paste</Item> */}
          </Menu>
        </MenuTrigger>
      </Cell>
    </>
  )
}

export default ItemRow
