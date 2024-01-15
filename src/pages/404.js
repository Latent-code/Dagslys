import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

// import "./404.css"

const NotFoundPage = props => {
  // const siteTitle = data.site.siteMetadata.title

  // setIsNonexistent(true)
  // console.log(props)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <SEO title="404: Not Found" />
      <h1>404: Not Found</h1>
      <p>You just hit a page that doesn&#39;t exist... thats horrible.</p>
      <Link className="back-button" to="/">
        Return home
        {/* <h1>
          RETURN HOME
          
          </h1> */}
      </Link>
    </div>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
// const NotFoundPage = ({ data, location, setIsNonexistent }) => {
//   const siteTitle = data.site.siteMetadata.title

//   // setIsNonexistent(true)

//   return (
//     <div >
//       <Seo title="404: Not Found" />
//       <h1>404: Not Found</h1>
//       <p>You just hit a page that doesn&#39;t exist... thats horrible.</p>
//       <Link
//       className="back-button"
//         to="/"
//       >
//         Return home
//         {/* <h1>
//           RETURN HOME

//           </h1> */}
//       </Link>
//     </div>
//   )
// }

// export default NotFoundPage

// export const pageQuery = graphql`
//   query {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//   }
// `
