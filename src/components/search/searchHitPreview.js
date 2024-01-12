import React, { Component } from "react"
import { Highlight } from "react-instantsearch-hooks-web"
import { Button } from "@mui/material"
import { navigate } from "gatsby"


const mainStyle = {
  display: "flex",
}
const contentStyle = {
  justifyContent: "flex-start",
  width: "100%",
}

const SearchHitPreview = (hits, mouseEnter, setOpen, setIsSearchdEmpty) => {
  const hit = hits.hit

  const hoverHit = () => {
    mouseEnter(hit)
  }
  return (
    <div key={hit} style={mainStyle}>
      <Button
        onMouseEnter={hoverHit}
        style={contentStyle}
        onClick={() => {
          console.log(hit)
          setIsSearchdEmpty(true)
          setOpen(false)
          navigate(`${hit.urlPath}`)
        }}
      >
        <Highlight
          classNames={{
            root: "searchHighlight",
            highlighted:
              "searchHighlightHighlighted",
          }}
          attribute="title"
          hit={hit}
        ></Highlight>
      </Button>
    </div>
  )
}

export default SearchHitPreview
