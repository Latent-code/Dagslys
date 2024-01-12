import React, { useEffect, useState } from "react"
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-hooks-web"
import SearchHitPreview from "./searchHitPreview"
import algoliasearch from "algoliasearch/lite"
import NoResultsBoundary from "./noResultBoundary"
import { GatsbyImage } from "gatsby-plugin-image"

import "./search.css"
import { object } from "prop-types"

const imageStyle = {
  flexGrow: "1",
  display: "inline-flex",
  justifyContent: "flex-start",
  width: "100%",
  padding: "1rem 1rem 1rem 1rem",
}

const hitImage = {
  position: "relative",
  height: "auto",
  maxHeight: "200px",
  width: "100%",
  zIndex: "9999",
  padding: "1rem",
  display: "flex",
}
const searchHits = {
  width: "100%",
  textAlign: "start",
}

const SearchBar = ({}) => {
  const [hoverImage, setHoverImage] = useState("")
  const [title, setTitle] = useState("")
  const [isSearchdEmpty, setIsSearchdEmpty] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [isEmpty, setIsEmpty] = useState()
  const isBrowser = typeof window !== "undefined"

  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_API_KEY,
  )

  const searchClient = {
    ...algoliaClient,
    search(requests) {
      // console.log(requests)
      if (
        requests.every(({ params }) => params?.query?.length < 1) ||
        !requests[0].params.query
      ) {
        console.log("No search fired...")
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
      return algoliaClient.search(requests)
    },
  }
  useEffect(() => {
    const searchInput = document.querySelector(".ais-SearchBox-input")
    if (!isOpen && searchInput) {
      searchInput.classList.remove("activeSearch")
      searchInput.innerHTML = ""
      setIsEmpty("")
      setOpen(false)
      setHoverImage(null)
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        const searchInput = document.querySelector(".ais-SearchBox-input")

        setOpen(false)
        setHoverImage(null)
        console.log(searchInput)
        // searchInput.value = ""
        searchInput.classList.remove("activeSearch")
      }
    }
    document.addEventListener("keydown", handleKeyDown)

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const mouseEnter = hover => {
    if (hover.featuredImage != null) {
      setHoverImage(hover.featuredImage)
      setTitle(hover.title)
    }
  }

  const handleChange = event => {
    if (
      typeof event.uiState[process.env.GATSBY_ALGOLIA_INDEX_NAME] !== undefined
    ) {
      // console.log("after ", event)
      const searchInput = document.querySelector(".ais-SearchBox-input")
      if (
        Object.keys(event.uiState[process.env.GATSBY_ALGOLIA_INDEX_NAME])
          .length !== 0
      ) {
        setOpen(true)
        searchInput.classList.add("activeSearch")
      } else if (
        Object.keys(event.uiState[process.env.GATSBY_ALGOLIA_INDEX_NAME])
          .length === 0
      ) {
        searchInput.classList.remove("activeSearch")
        setHoverImage(null)
        setOpen(false)
      }
      setIsEmpty(event.uiState[process.env.GATSBY_ALGOLIA_INDEX_NAME].query)
    }
  }

  // Close search preview if user clicks outside 
  if (isBrowser) {
    window.addEventListener("click", function (e) {
      const hitContainer = document.getElementById("searchHitContainer")
      const searchInputArr = document.getElementsByClassName(
        "ais-SearchBox-input",
      )
      const searchInput = searchInputArr[0]
      if (hitContainer !== null) {
        if (!hitContainer.contains(e.target) || !searchInput === e.target) {
          setOpen(false)
        }
      }
    })
  }

  return (
    <div id="search-box-id" className="searchContainer">
      <InstantSearch
        onStateChange={handleChange}
        searchClient={searchClient}
        indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME}
        insights={true}
      >
        <div className="SearchBox">
          <SearchBox
            onChange={handleChange}
            placeholder="Search for products..."
          />
        </div>
        {isOpen ? (
          <div id="searchHitContainer" className="searchHitContainer">
            <NoResultsBoundary>
              <Hits
                style={searchHits}
                hitComponent={e =>
                  SearchHitPreview(e, mouseEnter, setOpen, setIsSearchdEmpty)
                }
              />
              {/* <div className="serch-hit-hover-content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div className="search-result-image" style={hitImage}>
                  {hoverImage?.node?.localFile?.childImageSharp
                    ?.gatsbyImageData ? (
                    <GatsbyImage
                      image={
                        hoverImage.node.localFile.childImageSharp
                          .gatsbyImageData
                      }
                      alt={title || "alt"}
                      style={imageStyle}
                      imgStyle={{ objectFit: "contain" }}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <p style={{ color: "black", margin: "1rem 2rem 1rem 2rem" }}>
                  {title}
                </p>
              </div> */}
            </NoResultsBoundary>
          </div>
        ) : (
          <></>
        )}
      </InstantSearch>
    </div>
  )
}

export default SearchBar
