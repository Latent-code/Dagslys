import React, { useContext, useEffect, useState } from "react"

import { AppContext } from "../../context/appContext"
import { addSavedOrders} from "../../utils/firestoreCRUD"

import {
  View,
  Text,
  ActionButton,
  useDragAndDrop,
  TableView,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  useListData,
  Flex,
  DialogTrigger,
  Dialog,
  Heading,
  Content,
} from "@adobe/react-spectrum"

import { Typography } from "@mui/material"
import { CartContext } from "../../context/cartContext"

const databaseLocation = process.env.GATSBY_BRENT_FIREBASE_DATABASE

function Orders(props) {
  let { list, columns } = props
  let { dragAndDropHooks } = useDragAndDrop({
    getItems: keys =>
      [...keys].map(key => {
        let item = list.getItem(key)
        // Setup the drag types and associated info for each dragged item.
        return {
          "custom-app-type-copy-default": JSON.stringify(item),
          "text/plain": item.name,
        }
      }),
    onDragEnd: e => {
      let { dropOperation, keys } = e

      if (dropOperation === "move") {
        list.remove(...keys)
      }
    },
    renderPreview: (keys, draggedKey) => {
      const currenDraggItem = list.items.filter(i => i.id === draggedKey)[0]
      return (
        <View
          backgroundColor="gray-50"
          padding="size-100"
          borderRadius="medium"
          borderWidth="thin"
          borderColor="blue-500"
          width="size-5000"
        >
          <Flex gap="size-500" direction="row">
            <Flex>
              <strong>Order:</strong>
              <div>{currenDraggItem.name}</div>
            </Flex>
            <Flex>
              <strong>Remark:</strong>
              <div>{currenDraggItem.remark}</div>
            </Flex>
          </Flex>
        </View>
      )
    },
  })

  return (
    <TableView
      flex
      aria-label="Draggable TableView in default copy operation example"
      selectionMode="single"
      selectionStyle="highlight"
      width="100%"
      // height="size-3500"
      maxHeight="size-4600"
      dragAndDropHooks={dragAndDropHooks}
    >
      <TableHeader columns={columns}>
        {column => (
          <Column
            key={column.id}
            align={column.id === "date" ? "end" : "start"}
          >
            {column.name}
          </Column>
        )}
      </TableHeader>
      <TableBody items={list.items}>
        {item => <Row>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>}
      </TableBody>
    </TableView>
  )
}

function SavedOrders(props) {
  let { list, columns, setSelectedKeys } = props
  let { dragAndDropHooks } = useDragAndDrop({
    acceptedDragTypes: ["custom-app-type-copy-default"],
    getDropOperation: () => "copy",

    onInsert: async e => {
      let { items, target } = e

      // Create random id to allow for multiple copies of the same item
      let processedItems = await Promise.all(
        items.map(async item => ({
          ...JSON.parse(await item.getText("custom-app-type-copy-default")),
          id: Math.random().toString(36).slice(2),
        })),
      )
      if (target.dropPosition === "before") {
        list.insertBefore(target.key, ...processedItems)
      } else if (target.dropPosition === "after") {
        list.insertAfter(target.key, ...processedItems)
      }
    },
    onRootDrop: async e => {
      let { items } = e

      // Create random id to allow for multiple copies of the same item
      let processedItems = await Promise.all(
        items.map(async item => ({
          ...JSON.parse(await item.getText("custom-app-type-copy-default")),
          id: Math.random().toString(36).slice(2),
        })),
      )
      list.append(...processedItems)
    },
  })

  return (
    <TableView
      flex
      aria-label="Droppable table"
      width="100%"
      maxHeight="size-6000"
      selectionMode="single"
      selectionStyle="highlight"
      onSelectionChange={setSelectedKeys}
      dragAndDropHooks={dragAndDropHooks}
    >
      <TableHeader columns={columns}>
        {column => (
          <Column
            key={column.id}
            align={column.id === "date" ? "end" : "start"}
          >
            {column.name}
          </Column>
        )}
      </TableHeader>
      <TableBody items={list.items}>
        {item => <Row>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>}
      </TableBody>
    </TableView>
  )
}

export const DraggableOrderTable = () => {
  const { user, userData } = useContext(AppContext)
  const { cart, setCart } = useContext(CartContext)
  const [test, setTest] = useState(null)

  let [selectedKeys, setSelectedKeys] = useState()

  const [orderArchive, setOrderArchive] = useState(
    userData.orders.map(item => {
      return {
        id: item.id,
        itemId: item.id,
        price: item.price,
        name: item.name,
        remark: item.remark,
      }
    }),
  )

  let columns = [
    { name: "Id", id: "itemId" },
    { name: "Price", id: "price" },
    { name: "Project Name", id: "name" },
    { name: "Project remark", id: "remark" },
  ]

  let sourceList = useListData({
    initialItems: [...orderArchive],
  })

  let targetList = useListData({
    initialItems: Object.keys(userData.savedOrders).map(
      keyName => userData.savedOrders[keyName],
    ),
  })

  useEffect(() => {
    addSavedOrders({
      brentCollection: databaseLocation,
      userEmail: userData.email,
      object: targetList.items,
    })
  }, [targetList])

  const handleRemove = () => {
    targetList.remove(selectedKeys.currentKey)
  }

  const handleView = () => {
    console.log(userData)
    setTest(
      userData.orders.find(
        i => i.id == targetList.getItem(selectedKeys.currentKey).itemId,
      ).cart,
    )
  }

  const handleOrderClick = () => {
    setCart(
      userData.orders.find(
        i => i.id == targetList.getItem(selectedKeys.currentKey).itemId,
      ).cart,
    )
  }

  

  return (
    <View>
      <Flex gap="size-500" direction="column">
        <Flex direction="column" wrap gap="size-300">
          {/* Orders from saved orders... */}
          <Orders list={sourceList} columns={columns} />
          <Text>You can drag orders to save them...</Text>
        </Flex>
        <Flex direction="column" wrap gap="size-300">
          {/* User-saved orders... */}
          <Typography variant="h2">Your saved orders</Typography>
          <SavedOrders
            setSelectedKeys={setSelectedKeys}
            list={targetList}
            columns={columns}
          />
          <Flex justifyContent="flex-end" gap="size-200">
            {/* <ActionButton>Edit</ActionButton> */}
            <ActionButton onPress={handleRemove}>Delete</ActionButton>

            {selectedKeys?.size >= 1 ? (
              <DialogTrigger isDismissable type="modal">
                <ActionButton onPress={handleView}>View order</ActionButton>

                <Dialog>
                  <Heading>Order content</Heading>
                  {/* <Divider /> */}
                  <Content>
                    <TableView>
                      <TableHeader>
                        <Column showDivider width={80} align="center"></Column>
                        <Column align="start"></Column>
                      </TableHeader>
                      <TableBody>
                      {test ? (
                        test.map(item => (
                          <Row key={item.id}>
                            {/* <Flex direction={"row"}> */}
                              <Cell>{item.quantity}</Cell>
                              <Cell>{item.name}</Cell>
                              {/* <Divider size="S" /> */}
                            {/* </Flex> */}
                          </Row>
                        ))
                      ) : (
                        <>
                          <Text>No content</Text>
                        </>
                      )}
                      </TableBody>
                    </TableView>
                  </Content>
                </Dialog>
              </DialogTrigger>
            ) : (
              <ActionButton isDisabled={true} onPress={handleView}>
                View order
              </ActionButton>
            )}
            <ActionButton onPress={handleOrderClick}>
              Add selected project to cart
            </ActionButton>
          </Flex>
        </Flex>
      </Flex>
    </View>
  )
}
