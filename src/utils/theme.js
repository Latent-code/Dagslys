import { createTheme } from "@mui/material";

const breakpoints = {
  values: {
    xs: 0,
    sm: 0, // Phone
    md: 768, // Tablet/Laptop
    lg: 1500, // Desktop
    xl: 2000
  }
};

let theme = createTheme()


theme = createTheme({
  palette: {
    type: "light",
    // palette values for dark mode
    primary: { 
      main: "#504f4f", 
      contrastText: "#fff" 
    },
    // divider: deepOrange[700],
    background: {
      default: { 
        main: "#171E22", 
        selected: "#ffd11554",
        contrastText: "#fff" 
      },
      paper: { main: "#504f4f", contrastText: "#fff" },
    },
    text: {
      primary: "#fff",
      secondary: { main: "#fff", contrastText: "#fff" },
    },
    // primary: {
    //   main: "#504f4f",
    // },
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
      // fontSize: "3em",
      [theme.breakpoints.down('md')]: {
        fontSize: '2em', //11px
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '2.5em', //11px
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: '3em', //11px
      },
    },
    h2: {
      margin: ".5em 0",
      fontWeight: "200",
      // fontSize: "2.5em",
      [theme.breakpoints.down('md')]: {
        fontSize: '1.5em', //11px
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '2em', //11px
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: '2.5em', //11px
      },
    },
    h3: {
      margin: ".5em 0",
      // fontSize: "2em",
      [theme.breakpoints.down('md')]: {
        fontSize: '1em', //11px
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '1.5em', //11px
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: '2em', //11px
      },
    },
  },
});

export default theme;