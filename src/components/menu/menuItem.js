import React, { Component, useState, useEffect, useCallback } from "react"
import { navigate } from "gatsby"
import { useLocation } from "@reach/router"

import { styled } from "@mui/material/styles"

import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"

import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import Collapse from "@mui/material/Collapse"

const CustomizedListItemText = styled(ListItemText)`
  & .MuiTypography-root {
    font-size: 0.9rem;
  }
`
const CustomizedListItemButton = styled(ListItemButton)`
  :hover {
    color: #FFD115;
  }
`

const MenuItem = ({ item, key }) => {
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()

  const expand = () => {
    setIsVisible(!isVisible)
  }

  // console.log(isVisible)
  // console.log(item)

  const handleParentClick = (e, item) => {
    // console.log(item)
    // console.log(location.pathname)
    if (
      item.urlPath + "/" === location.pathname
    ) {
      expand()
    } else {
      navigate(item.urlPath)
    }
  }

  const checkItemForPageChild = useCallback(item => {
    if (item.urlPath + "/" === location.pathname) {
      setIsVisible(true)
    } else if (item.children?.length > 0) {
      item.children.map(i => {
        checkItemForPageChild(i)
      })
    }
  })

  useEffect(() => {
    checkItemForPageChild(item)
  }, [location])

  // GET ELEMENTS AND ADD A NEW PROPERTY WITH THE PATH OF THE ELEMENT CONSISTING OF THE RENTMAN ID AND PARENT ID
  // https://stackoverflow.com/questions/54338616/how-to-get-parent-path-all-the-way-to-the-last-child-in-javascript
  console.log(item.displayname)
  return (
    <>
      {Object.hasOwn(item, "children") ? (
        <>
        {/* {console.log(item)} */}
          <CustomizedListItemButton
            sx={{
              alignItems: "flex-end",
              borderBottom: "1px solid #dbdbdb",
            }}
            onClick={e => {
              handleParentClick(e, item)
            }}
            key={item.id}
          >
            <CustomizedListItemText
              sx={{ marginTop: "0px", marginBottom: "0px" }}
              primary={item.displayname}
            ></CustomizedListItemText>
            {isVisible ? (
              <ExpandLess
                sx={{ width: "0.9em !important", height: "0.9em" }}
                className="expand-icon"
                key={item.id}
              />
            ) : (
              <ExpandMore
                sx={{ width: "0.9em !important", height: "0.9em" }}
                className="expand-icon"
                key={item.id + "more"}
              />
            )}
          </CustomizedListItemButton>
          {item.children?.length > 0 ? (
            <Collapse
              sx={{ paddingLeft: "0.5rem" }}
              in={isVisible}
              timeout="auto"
              unmountOnExit
              key={item.displayname + "collapse"}
            >
              {isVisible ? (
                item.children.map(child => {
                  // console.log(child)
                  return (
                    <div
                      key={child.displayname + child.id + "next"}
                      style={{ paddingLeft: 10 }}
                    >
                      {console.log(child)}
                      <MenuItem item={child} />
                    </div>
                  )
                })
              ) : (
                <>REIEL</>
              )}
            </Collapse>
          ) : (
            <></>
          )}
        </>
      ) : (
        // <div>{item.displayname}</div>
        <CustomizedListItemButton
          sx={{
            alignItems: "flex-end",
            borderBottom: "1px solid #dbdbdb",
          }}
          onClick={e => {
            handleParentClick(e, item)
          }}
        >
          <CustomizedListItemText
            sx={{ marginTop: "0px", marginBottom: "0px" }}
            primary={item.displayname}
          ></CustomizedListItemText>
        </CustomizedListItemButton>
      )}
    </>
  )
}

export default MenuItem
