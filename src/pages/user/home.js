import React, {
  Component,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import { CartContext } from "../../context/cartContext"
import { AppContext } from "../../context/appContext"
import {
  Button,
  ActionButton,
  TextField,
  DatePicker,
  Flex,
  Text,
  Form,
  Dialog,
  Column,
  Link,
  Header,
  Divider,
  ButtonGroup,
  TableView,
  TableBody,
  TableHeader,
  Row,
  Cell,
  useCollator,
  useAsyncList,
  NumberField,
} from "@adobe/react-spectrum"

import { Typography } from "@mui/material"
import { DraggableOrderTable } from "../../components/draggableTable/draggableTable"
import { parseDate } from "@internationalized/date"
import { useDateFormatter } from "@adobe/react-spectrum"
import { navigate } from "gatsby"
import PrivateRoute from "../../components/privateRoute/privateRoute"

const Home = () => {
  const { userData, isLoggedIn } = useContext(AppContext)
  const { cart, setCart } = useContext(CartContext)

  const [selectedItem, setSelectedItem] = useState(null)
  const [days, setDays] = useState(1)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [projectId, setProjectId] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState()
  const [projectName, setProjectName] = useState()
  const [lastName, setLastName] = useState()
  const [firstName, setFirstName] = useState()
  const [start, setStart] = useState(parseDate("2021-01-01"))
  const [end, setEnd] = useState(parseDate("2021-01-01"))
  const [remark, setRemark] = useState()

  const handleOrderClick = item => {
    console.log(userData.orders)
    console.log(item.id)
    setCart(userData.orders.find(i => i.id == selectedItem.currentKey).cart)
  }
  console.log(userData)

  return (
    <PrivateRoute >
        <Typography variant="h1">{`Welcome back ${userData?.firstName} ${userData?.lastName}`}</Typography>
        <Typography variant="h2">Your past orders</Typography>
    {/* <div>
      <div>

        <Divider size="s"></Divider>
        {userData ? (
          <TableView
            selectionMode="single"
            selectedKeys={selectedItem}
            onSelectionChange={setSelectedItem}
            selectionStyle="highlight"
          >
            <TableHeader>
              <Column width="12%">id</Column>
              <Column width="12%">Price</Column>
              <Column width="28%">Project name</Column>
              <Column width="47%">Project remark</Column>
            </TableHeader>
            <TableBody>
              {userData.orders.map(item => {
                return (
                  <Row key={item.id}>
                    <Cell>{item.id}</Cell>
                    <Cell>{item.price}</Cell>
                    <Cell>{item.name}</Cell>
                    <Cell>{item.remark}</Cell>
                  </Row>
                )
              })}
            </TableBody>
          </TableView>
        ) : (
          <></>
        )}
      </div>

      <br></br>
      <br></br>
      <Button isPending={isLoading} type="submit" variant="primary">
        Confirm booking
      </Button>
      <Button
        isPending={isLoading}
        type="submit"
        variant="primary"
        onPress={handleOrderClick}
      >
        Add items from project to cart
      </Button>
    </div> */}
    {userData? <DraggableOrderTable></DraggableOrderTable> : <></>}
    </PrivateRoute>
  )
}

export default Home
