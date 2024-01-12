import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import brent from "../images/brent_welcome.png"
import { Button } from "@mui/material"
import { navigate } from "gatsby"

const Header = ({ siteTitle, menuLinks, mobile }) => {




  console.log(mobile, "test")
  return (
    <header
      className="header_container"
      style={{
        marginBottom: "1.45rem",
      }}
    >
      <div
        style={{
          marginBottom: "1.45rem",
        }}
      >
        {/* <div id="header_placeholder"></div> */}
        <div
          id="myHeader"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              maxWidth: "870px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <nav id="navbar">
              <ul style={{ display: "flex", flex: 1, alignItems: "center" }}>
                <Link
                  className="welcome-image-container"
                  to="/"
                  style={{
                    marginRight: "auto",
                    color: "#232323",
                    textDecoration: "none",
                    marginRight: "auto",
                    color: "rgb(35, 35, 35)",
                    textDecoration: "none",
                    height: "70px",
                    display: "flex",
                    position: "relative",
                  }}
                >
                  <img
                    key={mobile}
                    id="welcome-image"
                    className="welcome-image-static"
                    src={brent}
                    alt="brent logo"
                    style={{
                      height: "auto",
                      width: mobile ? "30%" : "20%",
                    }}
                  />
                </Link>
                {/* COMMENTED FOR LATER, THIS ENABLES THE REST OF THE WEBSITE */}
                {/* <a style={{wordBreak: "normal"}} href="javascript:location.href = /rental/"><Button>Rental</Button></a> */}


                {/* {menuLinks.map(link => (
                  <li
                    key={link.name}
                    style={{
                      listStyleType: `none`,
                      padding: `1rem`,
                      minWidth: "5.5rem",
                    }}
                  >
                    <Link style={{ color: `#232323` }} to={link.link}>
                      {link.name}
                    </Link>
                  </li>
                ))} */}

                {/* <Link
                  to="/rental"
                  style={{
                    color: "#232323",
                    textDecoration: "none",
                    marginRight: "auto",
                    color: "rgb(35, 35, 35)",
                    textDecoration: "none",
                    width: "100px",
                    display: "flex",
                  }}
                >
                
                <div onClick={e => navigate("/rental/")}>Rental</div>
                </Link> */}
              </ul>
            </nav>
          </div>
          <div id="line"></div>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
