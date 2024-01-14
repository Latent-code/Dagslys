import { createTheme } from "@mui/material";
const theme = createTheme({
  palette: {
    type: "light",
    // palette values for dark mode
    primary: { main: "#FFD115", contrastText: "#fff" },
    // divider: deepOrange[700],
    background: {
      default: { main: "#171E22", contrastText: "#fff" },
      paper: { main: "#504f4f", contrastText: "#fff" },
    },
    text: {
      primary: "#fff",
      secondary: { main: "#fff", contrastText: "#fff" },
    },
    primary: {
      main: "#171E22",
    },
    secondary: {
      main: "#FFD115",
    },
  },
  typography: {
    fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
    allVariants: {
      color: "white",
    },
    h1: {
      margin: ".5em 0",
      fontWeight: "100",
      fontSize: "3em",
    },
    h2: {
      margin: ".5em 0",
      fontWeight: "200",
      fontSize: "2.5em",
    },
    h3: {
      margin: ".5em 0",
      fontSize: "2em",
    },
  },
});

export default theme;