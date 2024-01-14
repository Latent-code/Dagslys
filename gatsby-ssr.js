// normalize CSS across browsers
import "./src/css/normalize.css"

// custom CSS styles
import "./src/css/style.css"

import React from "react"
import Layout from "./src/components/layout"

import { Provider, darkTheme } from "@adobe/react-spectrum"
import { ThemeProvider } from "@mui/material/styles";

import AppProvider from "./src/context/appContext"
import CartProvider from "./src/context/cartContext"
import theme from "./src/utils/theme";

export function wrapPageElement({ element, props }) {
  return (
    <Provider theme={darkTheme}>
      <ThemeProvider theme={theme}>
        <AppProvider>
          <CartProvider>
            <Layout {...props}>{element}</Layout>
          </CartProvider>
        </AppProvider>
      </ThemeProvider>
    </Provider>
  );
}
