import React, { Component, useEffect, useState, createRef } from "react"
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  useInstantSearch,
} from "react-instantsearch-hooks-web"
import SearchHitPreview from "./search/searchHitPreview"
import algoliasearch from "algoliasearch/lite"
import NoResultsBoundary from "./search/noResultBoundary"
import { GatsbyImage } from "gatsby-plugin-image"
import Button from "@mui/material/Button"
import CloseIcon from "@mui/icons-material/Close"
import "./search/search.css"

const searchContainer = {
  boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  backgroundColor: "white",
  borderRadius: "15px",
  zIndex: "99999",
  width: "800px",
  maxHeight: "300px",
  left: "0",
  right: "0",
  marginLeft: "auto",
  marginRight: "auto",
}
const imageStyle = {
  flexGrow: "1",
  display: "inline-flex",
  justifyContent: "flex-start",
  width: "50%",
  padding: "1rem 1rem 1rem 1rem",
}

const hitImage = {
  position: "relative",
  height: "auto",
  maxHeight: "200px",
  width: "50%",
  zIndex: "9999",
  padding: "1rem",
  display: "flex",
  borderLeft: "1px solid lightgrey",
}
const searchHits = {
  width: "50%",
}
const searchHitContainer = {
  flexDirection: "row",
  justifyContent: "center",
  maxHeight: "calc(300px - 88px)",
  width: "inherit",
  zIndex: "9999",
  padding: "0rem 1rem 1rem 1rem",
  display: "flex",
}

const searchBox = {
  paddingTop: "1rem",
  paddingBottom: "1rem",
  position: "relative",
  zIndex: "99999",
  width: "100%",
  borderRadius: "15px 15px 0px 0px",
}
const closeButton = {
  alignSelf: "start",
  position: "absolute",
  zIndex: "999999",
  top: "33px",
}
const background = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "1000vw",
  height: "1000vw",
  backdropFilter: "blur(3px)",
  zIndex: "9990",
  background: "#0000004f",
}

const MobileSearchBar = ({ ref, isOpen, setOpen }) => {
  const [hoverImage, setHoverImage] = useState("")
  const [isSearchdEmpty, setIsSearchdEmpty] = useState(false)
  const [isOopen, setIsOopen] = useState(false)

  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_API_KEY
  )

  useState(() => {}, [])

  const test = () => {
    console.log("ALSKJD ALKSJD LASKJ DLASKJ LKAJS DLKJA SDLKJA SLDKJ ASLKDJ LAKSJDLKASJD")
    setIsOopen(!isOpen)
  }

  const searchClient = {
    ...algoliaClient,
    search(requests) {
      if (requests.every(({ params }) => params?.query?.length < 1) || !requests[0].params.query) {
        console.log("No search fired...")
        setHoverImage(null)
        setIsSearchdEmpty(false)
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
            hitsPerPage: 0,
            exhaustiveNbHits: false,
            query: "",
            params: "",
          })),
        })
      }
      setIsSearchdEmpty(true)
      return algoliaClient.search(requests)
    },
  }

  
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const mouseEnter = hover => {
    if (hover.featuredImage != null) {
      console.log(hover)
      setHoverImage(hover.featuredImage)
    }
  }

  return (
    <div>
      {isOpen ? (
        <>
          <div onClick={() => setOpen(!isOpen)} style={background}></div>
          <div className="searchContainer" style={searchContainer}>
            <InstantSearch
              searchClient={searchClient}
              indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME}
              insights={true}
            >
              {/* <div class="modalParent" style={modalParentStyle}> */}
              <Button onClick={() => setOpen(!isOpen)} style={closeButton}>
                <CloseIcon></CloseIcon>
              </Button>
              <div className="SearchBox" style={searchBox}>
                <SearchBox autoFocus />
              </div>
              <div className="searchHitContainer" style={searchHitContainer}>
                {isSearchdEmpty ? (
                  <>
                    <NoResultsBoundary >
                      <Hits
                        style={searchHits}
                        hitComponent={e =>
                          SearchHitPreview(e, mouseEnter, isOpen, setOpen)
                        }
                      />
                      <div className="search-result-image" style={hitImage}>
                        <GatsbyImage
                          image={
                            hoverImage?.node?.localFile?.childImageSharp
                              ?.gatsbyImageData
                          }
                          alt={hoverImage?.node?.altText}
                          style={imageStyle}
                          imgStyle={{ objectFit: "contain" }}
                        />
                      </div>
                    </NoResultsBoundary>
                  </>
                ) : (
                  <></>
                )}
              </div>
              {/* </div> */}
            </InstantSearch>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default MobileSearchBar
