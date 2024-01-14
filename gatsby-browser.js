// normalize CSS across browsers
import "./src/css/normalize.css";

// custom CSS styles
import "./src/css/style.css";
import { Provider, darkTheme } from "@adobe/react-spectrum";
import { ThemeProvider } from "@mui/material/styles";

// import "firebase/auth"
import React from "react";
import Layout from "./src/components/layout";
import AppProvider from "./src/context/appContext";
import CartProvider from "./src/context/cartContext";
import theme from "./src/utils/theme";

export function wrapPageElement({ element, props }) {
  return (
    <ThemeProvider theme={theme}>
      <Provider theme={darkTheme}>
        <AppProvider>
          <CartProvider>
            <Layout {...props}>{element}</Layout>
          </CartProvider>
        </AppProvider>
      </Provider>
    </ThemeProvider>
  );
}
