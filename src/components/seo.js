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
  const { site, favicon } = useStaticQuery(
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
      }
    `
  );

  // const metaDescription = description || wp.generalSettings?.description
  // const defaultTitle = wp.generalSettings?.title
  const { siteMetadata } = site;

  console.log(
    `${siteMetadata.siteUrl}${image}`,
    `and: ${siteMetadata.siteUrl}/`
  );

  return (
    <Helmet htmlAttributes={{ lang: `en` }} titleTemplate={`%s | ${title}`}>
      <title>{siteMetadata.title}</title>
      <link rel="shortcut icon" href={favicon.publicURL} />

      {/* FACEBOOK */}
      <meta name="og:title" content={siteMetadata.title} />
      <meta
        name="og:description"
        content={description || siteMetadata.description}
      />
      <meta
        name="og:image"
        content={`${siteMetadata.siteUrl}${image} ||${favicon.publicURL}`}
      />
      <meta name="og:type" content="website" />
      <meta
        name="og:url"
        content={
          slug ? `${siteMetadata.siteUrl}/${slug}` : `${siteMetadata.siteUrl}/`
        }
      />
      <meta name="og:site_name" content={siteMetadata.title} />

      {/* TWITTER */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={siteMetadata.siteUrl} />
      <meta
        property="twitter:url"
        content="https://rental.dagslys.no/control/dmx-cable/lumisplitt-2.10-dmx-rdm-5p/"
      />
      <meta name="twitter:title" content={siteMetadata.title} />
      <meta name="twitter:description" content={description || siteMetadata.description} />
      <meta
        name="twitter:image"
        content={`${siteMetadata.siteUrl}${image}`}
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
