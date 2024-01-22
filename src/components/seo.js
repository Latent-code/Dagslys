/**
 * Seo component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const SEO = ({ title, description, image, slug, children }) => {
  const { site, favicon, logo } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            description
            siteUrl
            title
          }
        }
        favicon: file(name: { eq: "favicon" }) {
          publicURL
        }
        logo: file(name: { eq: "dagslys-og-imge" }) {
          publicURL
        }
      }
    `
  );

  // const metaDescription = description || wp.generalSettings?.description
  // const defaultTitle = wp.generalSettings?.title
  const { siteMetadata } = site;
  const imageConst = image ? siteMetadata.siteUrl + image : siteMetadata.siteUrl + logo.publicURL

  console.log(imageConst)

  console.log(
    `${siteMetadata.siteUrl}${image}`,
    `and: ${siteMetadata.siteUrl}/`
  );

  return (
    <Helmet htmlAttributes={{ lang: `en` }} titleTemplate={`%s | ${title}`}>
      <title>{siteMetadata.title}</title>
      <link rel="shortcut icon" href={favicon.publicURL} />

      {/* FACEBOOK */}
      <meta name="og:title" content={title ? title :siteMetadata.title} />
      <meta
        name="og:description"
        content={description || siteMetadata.description}
      />
      <meta
        name="og:image"
        content={imageConst}
      />
      <meta name="og:type" content="website" />
      <meta
        name="og:url"
        content={
          slug ? `${siteMetadata.siteUrl}${slug}` : `${siteMetadata.siteUrl}/`
        }
      />
      <meta name="og:site_name" content={siteMetadata.title} />

      {/* TWITTER */}
      <meta name="twitter:card" content="summary" />
      <meta property="twitter:domain" content={siteMetadata.siteUrl} />
      <meta
        property="twitter:url"
        content={slug ? `${siteMetadata.siteUrl}${slug}` : `${siteMetadata.siteUrl}/`}
      />
      <meta name="twitter:title" content={title ? title :siteMetadata.title} />
      <meta name="twitter:description" content={description || siteMetadata.description} />
      <meta
        name="twitter:image"
        content={imageConst}
      />

      {children}
    </Helmet>
  );
};

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  slug: PropTypes.string,
  children: PropTypes.node,
};

export default SEO;
