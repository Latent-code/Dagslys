import React, { createContext, useState, useEffect, useContext } from "react"
import { AppContext } from "../context/appContext"

export const CartContext = createContext({
  cart: null,
  db: null,
  auth: null,
})

const CartProvider = ({ children }) => {
  const isBrowser = typeof window !== "undefined"
  // Get cart from local storage..
  const [cart, setCart] = useState(
    isBrowser ? JSON.parse(localStorage.getItem("Dagslys-cart")) || [] : [],
  )
  const { setIsPopupOpen, handleClosePopup, userData } = useContext(AppContext)
  const [processedItemIds, setProcessedItemIds] = useState(new Set())

  // Save cart to local storage to keep for refresh..
  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem("Dagslys-cart", JSON.stringify(cart))
    }
  }, [cart])

  const getData = async (id, limit, offset) => {
    try {
      const completeURL = `http://localhost:3000/api/fetch?endpoint=https://api.rentman.net/equipment/${id}&limit=${limit}&offset=${offset}`

      const response = await fetch(completeURL)

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error in getData:", error.message)
      console.error("Error:", error)
      throw error
    }
  }

  const updateCartItemAfterFetchingData = async item => {
    try {
      // Make the actual API call to fetch data
      const data = await getData(item.rentmanId, 1, 0)
      const currentQuantity = data.body.data.current_quantity

      // Update the cart with the new data using the functional form of setCart
      setCart(prevCart =>
        prevCart.map(cartItem =>
          cartItem.rentmanId === item.rentmanId
            ? {
                ...cartItem,
                currentQuantity: currentQuantity,
                // Add any other properties you want to update based on the fetched data
              }
            : cartItem,
        ),
      )
    } catch (error) {
      console.error("Error updating cart item:", error.message)
      // Handle the error (e.g., show an error message to the user)
    }
  }

  const addToCart = async (item, setQuantity = 1) => {
    const isItemInCart = cart.find(cartItem => cartItem.id === item.id) // check if the item is already in the cart
    console.log(setQuantity)
    if (isItemInCart) {
      setCart(
        cart.map(
          (
            cartItem, // if the item is already in the cart, increase the quantity of the item
          ) =>
            cartItem.id === item.id
              ? {
                  name: cartItem.name,
                  id: cartItem.id,
                  rentmanId: cartItem.rentmanId,
                  quantity: !setQuantity ? cartItem.quantity + 1 : setQuantity,
                  price: cartItem.price,
                  urlPath: cartItem.urlPath,
                  currentQuantity: cartItem.currentQuantity,
                }
              : cartItem, // otherwise, return the cart item
        ),
      )
    } else {
      // const data = await getData(item.rentmanId, 1, 0)
      // const currentQuantity = data.body.data.current_quantity
      // console.log(data.body.data.current_quantity)
      setCart([
        ...cart,
        {
          name: item.name,
          id: item.id,
          rentmanId: item.rentmanId,
          quantity: setQuantity,
          price: item.price,
          urlPath: item.urlPath,
          // currentQuantity: currentQuantity,
        },
      ]) // if the item is not in the cart, add the item to the cart
      updateCartItemAfterFetchingData(item)
    }
    // setIsPopupOpen({
    //   open: true,
    //   message: `${item.name} was added to cart`,
    //   severity: "success",
    //   closePopup: handleClosePopup,
    // })
  }

  const removeFromCart = (item) => {
    const isItemInCart = cart.find(cartItem => cartItem.id === item.id)
    if (isItemInCart) {
      if (isItemInCart.quantity === 1) {
        setCart(cart.filter(cartItem => cartItem.id !== item.id))
      } else {
        setCart(
          cart.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem,
          ),
        )
      }
    }
  }
  const removeItemFromCart = item => {
    const isItemInCart = cart.find(cartItem => cartItem.id === item.id)
    if (isItemInCart) {
      setCart(cart.filter(cartItem => cartItem.id !== item.id))
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    if (cart) {
      return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    } else return 0
  }

  const getUserDiscountedPrice = () => {
    if (cart) {
      let fullPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ) // calculate the total price of the items in the cart
      let discount = userData ? userData.discount : 0
      let savings = fullPrice * (discount / 100)
      return fullPrice - savings
    } else return 0
  }

  const output = {
    cart,
    addToCart,
    removeFromCart,
    removeItemFromCart,
    clearCart,
    getCartTotal,
    setCart,
    getUserDiscountedPrice,
  }

  return <CartContext.Provider value={output}>{children}</CartContext.Provider>
}

export default CartProvider

// import React, { createContext, useState, useEffect, useContext, useReducer } from "react";
// import { AppContext } from "../context/appContext";

// export const CartContext = createContext();

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TO_CART':
//       const { item, currentStock } = action.payload;
//       console.log('Reducer: Adding to Cart - Item:', item, 'Current Stock:', currentStock);

//       const isItemInCart = state.find((cartItem) => cartItem.id === item.id);

//       if (isItemInCart) {
//         return state.map((cartItem) =>
//           cartItem.id === item.id
//             ? {
//                 ...cartItem,
//                 quantity: cartItem.quantity + 1,
//                 currentStock: currentStock,
//               }
//             : cartItem
//         );
//       } else {
//         return [
//           ...state,
//           {
//             ...item,
//             quantity: 1,
//             itemRemark: "",
//             currentStock: currentStock,
//           },
//         ];
//       }

//     case 'REMOVE_FROM_CART':
//       return state.filter((cartItem) => cartItem.id !== action.payload.id);

//       case 'DECREASE_QUANTITY':
//         return state.map((cartItem) =>
//           cartItem.id === action.payload.id
//             ? {
//                 ...cartItem,
//                 quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 1,
//               }
//             : cartItem
//         ).filter((cartItem) => cartItem.quantity > 0); // Filter out items with quantity less than 1

//     case 'CLEAR_CART':
//       return [];

//     default:
//       return state;
//   }
// };

// const CartProvider = ({ children }) => {
//   const isBrowser = typeof window !== 'undefined';
//   const [cart, dispatch] = useReducer(cartReducer, [], (initial) =>
//     isBrowser ? JSON.parse(localStorage.getItem('Brent-cart')) || initial : initial
//   );

//   const { setIsPopupOpen, handleClosePopup, userData } = useContext(AppContext);

//   // Use a set to keep track of processed item IDs
//   const [processedItemIds, setProcessedItemIds] = useState(new Set());

//   useEffect(() => {
//     if (isBrowser) {
//       localStorage.setItem('Brent-cart', JSON.stringify(cart));
//     }
//   }, [cart]);

//   const getData = async (id, limit, offset) => {
//     try {
//       const completeURL = `http://localhost:3000/api/fetch?endpoint=https://api.rentman.net/equipment/${id}&limit=${limit}&offset=${offset}`;

//       const response = await fetch(completeURL);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch data. Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log(data);
//       return data;
//     } catch (error) {
//       console.error('Error in getData:', error.message);
//       throw error;
//     }
//   };
//   useEffect(() => {
//     console.log('Cart State Updated:', cart);
//   }, [cart]);
//   const addToCart = async (item) => {
//     try {
//       let currentStock;

//       // Check if the item ID is in the set
//       console.log(item)
//       if (!processedItemIds.has(item.rentmanId)) {
//         // Fetch data if it hasn't been fetched before
//         const response = await getData(item.rentmanId, 10, 10);
//         currentStock = response.body.data.current_quantity;
//         console.log("ELSE: ",currentStock);

//         // Update the set
//         setProcessedItemIds(new Set([...processedItemIds, item.rentmanId]));

//         // Create a local itemData object with the currentStock value
//         const itemData = {
//           ...item,
//           currentStock: currentStock,
//         };
//         console.log('ItemData:', itemData);

//         // Dispatch the add to cart action with the local itemData
//         dispatch({
//           type: 'ADD_TO_CART',
//           payload: {
//             item: itemData,
//           },
//         });
//         console.log('Cart State After Dispatch:', cart);

//       } else {
//         // Use the existing item's currentStock value if it's already in the cart
//         const existingItem = cart.find((cartItem) => cartItem.id === item.id);
//         currentStock = existingItem ? existingItem.currentStock : 0;

//         // Create a local itemData object with the currentStock value
//         const itemData = {
//           ...item,
//           currentStock: currentStock,
//         };
//         console.log("ELSE: ",itemData);

//         // Dispatch the add to cart action with the local itemData
//         dispatch({
//           type: 'ADD_TO_CART',
//           payload: {
//             item: itemData,
//           },
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);

//       // If there's an error, update the set to avoid repeated fetch attempts
//       setProcessedItemIds(new Set([...processedItemIds, item.rentmanId]));

//       // Dispatch the add to cart action without fetching data
//       dispatch({
//         type: 'ADD_TO_CART',
//         payload: {
//           item: item,
//           currentStock: 0, // Set the default value for currentStock if needed
//         },
//       });
//     }
//   };

//   const removeItemFromCart = (item) => {
//     dispatch({
//       type: 'REMOVE_FROM_CART',
//       payload: { id: item.id },
//     });
//   };

//   const removeFromCart = (item) => {
//     dispatch({
//       type: 'DECREASE_QUANTITY',
//       payload: { id: item.id },
//     });
//   };

//   const clearCart = () => {
//     dispatch({
//       type: 'CLEAR_CART',
//     });
//   };

//   const getCartTotal = () => {
//     if (cart) {
//       return cart.reduce((total, item) => total + item.price * item.quantity, 0);
//     } else return 0;
//   };

//   const getUserDiscountedPrice = () => {
//     if (cart) {
//       let fullPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
//       let discount = userData ? userData.discount : 0;
//       let savings = fullPrice * (discount / 100);
//       return fullPrice - savings;
//     } else return 0;
//   };

//   console.log(cart)

//   const output = {
//     cart,
//     addToCart,
//     removeFromCart,
//     clearCart,
//     getCartTotal,
//     setCart: dispatch, // You can directly expose dispatch if needed
//     getUserDiscountedPrice,
//     removeItemFromCart,
//   };

//   return <CartContext.Provider value={output}>{children}</CartContext.Provider>;
// };

// export default CartProvider;
