import React, { Component } from "react"
import { Button } from "@mui/material"

const secondFlex = {
  margin: ".5em 0 .5em 0",
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "row",
  position: "relative",
  left: "-12px",
  flexWrap: "wrap"
}
const inlineFlex = {
  display: "inline-flex",
  alignItems: "baseline",
  flexWrap: "nowrap",
}

const Breadcrumb = ({ menu, location }) => {
  let breadcrumbArr = []

  console.log(breadcrumbArr)
  
  const makeBreadcrumb = data => {
    console.log(data)
    data.map(item => {
      const recursive = i => {
        data.map(item => {
          if (i.parentFolderId === item.rentmanId) {
            breadcrumbArr.push(item)
            recursive(item)
          }
        })
      }
      if (location.pathname === "/rental" + item.urlPath + "/") {
        console.log(item)

        recursive(item)
        breadcrumbArr.push(item)
        if (item.parentDatabase != 0) {
        }
      }
    })
    // SORT THE breadcrumb based on order from wp menu
    breadcrumbArr.sort((a, b) => a.order - b.order)
  }

  const fixedMenu = []
  const fix = mainArr => {
    // console.log(mainArr)
    mainArr.map(item => {
      if (item.childItems.nodes.length > 1) {
        // const menuItemExist = newArr.some(el => el.id === item.id);
        // if (!menuItemExist) {
        fixedMenu.push(item)
        fix(item.childItems.nodes)
        // }
      } else {
        // console.log("Before!: ", item)
        // const menuItemExist = newArr.some(el => el.id === item.id);
        // if (!menuItemExist) {
        fixedMenu.push(item)
        //   fix(item.childItems.nodes)
        // }
      }
    })
  }

  // fix(menu)
  makeBreadcrumb(menu)

  return (
    <div style={secondFlex}>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Button
          sx={{
            width: "auto",
            fontSize: ".7em",
            textWrap: "nowrap",
            color: "#FFD115",
            marginRight: "0"
          }}
          href={"/rental"}
        >
          Home
        </Button>
        <div> {">"}</div>
      </div>
      {breadcrumbArr.map(item => {
        return (
          <div key={item.id + "breadcrub"} style={inlineFlex}>

            <Button
              sx={{
                width: "auto",
                fontSize: ".7em",
                textWrap: "nowrap",
                color: "#FFD115",
              }}
              href={item.uri}
            >
              {item.displayname}
            </Button>
            <div> {">"}</div>
          </div>
        )
      })}
    </div>
  )
}

export default Breadcrumb
