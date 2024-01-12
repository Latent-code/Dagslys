// custom typefaces
// import "typeface-montserrat"
// import "typeface-merriweather"

// normalize CSS across browsers
import "./src/css/normalize.css"

// custom CSS styles
import "./src/css/style.css"

import React from "react"
import Layout from "./src/components/layout"
import ResponsiveDrawer from "./src/components/drawer"

import { defaultTheme, Provider, lightTheme } from "@adobe/react-spectrum"
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AppProvider from "./src/context/appContext"
import CartProvider from "./src/context/cartContext"

const outerTheme = createTheme({
  palette: {
    type: 'light',
          // palette values for dark mode
          primary: {main: '#FFD115', contrastText: '#fff'},
          // divider: deepOrange[700],
          background: {
            default: {main: '#171E22', contrastText: '#fff'},
            paper: {main: '#504f4f', contrastText: '#fff'},
          },
          text: {
            primary: '#fff',
            secondary: {main: '#fff', contrastText: '#fff'},
          },
    primary: {
      main: "#171E22",
    },
    secondary: {
      main: "#FFD115",
    },
  },
  typography: {
    allVariants: {
      color: "white"
    },
    h2: {
      margin: ".5em 0",
      fontSize: "3em",
    },
    h3: {
      margin: ".5em 0",
      fontSize: "3em"
    },
  },
});

export function wrapPageElement({ element, props }) {
  return (
    <Provider theme={lightTheme}>
      <ThemeProvider theme={outerTheme}>
        <AppProvider>
          <CartProvider>
            <Layout {...props}>{element}</Layout>
          </CartProvider>
        </AppProvider>
      </ThemeProvider>
    </Provider>
  );
}
