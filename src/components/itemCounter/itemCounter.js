import React, { useEffect, useState } from "react"
import { NumberField, Flex, Text } from "@adobe/react-spectrum"

const ItemCounter = ({
  quantity,
  addItem,
  removeFromCart,
  price,
  full,
  style,
  optionalItem,
}) => {
  const [inputValue, setInputValue] = useState(quantity)

  useEffect(() => {
    if (inputValue < quantity) {
      removeFromCart()
    } else if (inputValue > quantity) {
      // This solves the option to pass an item into the itemCounter so that the correct item is edited. e.g if the itemCounter is inside a map function.
      if (optionalItem) {
        addItem(inputValue, optionalItem)
      } else {
        addItem(inputValue)
      }
    }
  }, [inputValue])

  useEffect(() => {
    setInputValue(quantity)
  }, [quantity])

  const handleInput = e => {
    const newValue = parseInt(e)
    setInputValue(newValue)
  }
  const handleKeyDown = e => {
    if (e.key === "Enter") {
      if (inputValue < quantity) {
        removeFromCart()
      } else if (inputValue > quantity) {
        // This solves the option to pass an item into the itemCounter so that the correct item is edited. e.g if the itemCounter is inside a map function.
        if (optionalItem) {
          addItem(inputValue, optionalItem)
        } else {
          addItem(inputValue)
        }
      }
    }
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="space-around"
      marginTop="size-200w"
    >
      {full && <Text>{price},-</Text>}

      <NumberField
        isQuiet={true}
        aria-label="add item to cart, amount"
        value={quantity}
        // value={inputValue >= 1 || inputValue !== undefined ? inputValue : 0}
        // value={inputValue >= 1 || inputValue !== undefined ? inputValue : 0}
        onChange={setInputValue}
        onKeyDown={handleKeyDown}
        minValue={0}
        UNSAFE_style={style}
      />
    </Flex>
  )
}

export default ItemCounter
