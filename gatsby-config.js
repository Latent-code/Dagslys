/**
 * @type {import('gatsby').GatsbyConfig}
 */

require("dotenv").config({
  // path: `.env.${process.env.NODE_ENV}`
})
const queries = require('./src/utils/algolia-queries')

module.exports = {
  siteMetadata: {
    title: `Dagslys rental portal`,
    description: `A web portal for light rental in Norway`,
    twitterUsername: `@gatsbyjs`,
    image: `/gatsby-icon.png`,
    siteUrl: process.env.GATSBY_SITE_URL,
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/content/assets`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      // See https://www.gatsbyjs.com/plugins/gatsby-plugin-manifest/?=gatsby-plugin-manifest
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Dagslys AS`,
        short_name: `Dagslys`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/favicon.png` ,
      },
    },
    {
      resolve: `gatsby-omni-font-loader`,
      options: {
        mode: "async",
        enableListener: true,
        preconnect: [
          `https://fonts.googleapis.com`,
          `https://fonts.gstatic.com`,
        ],
        web: [
          {
            name: `Poppins`,
            file: `https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap`,
            
          },
        ],
      },
    },
     
    {
      // This plugin must be placed last in your list of plugins to ensure that it can query all the GraphQL data
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        // Use Admin API key without GATSBY_ prefix, so that the key isn't exposed in the application
        // Tip: use Search API key with GATSBY_ prefix to access the service from within components
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries,
        chunkSize: 10000, // default: 1000
        settings: {

          // optional, any index settings
          // Note: by supplying settings, you will overwrite all existing settings on the index
        },
        mergeSettings: false, // optional, defaults to false. See notes on mergeSettings below
        concurrentQueries: false, // default: true
        dryRun: false, // default: false, only calculate which objects would be indexed, but do not push to Algolia
        continueOnFailure: false, // default: false, don't fail the build if Algolia indexing fails
        algoliasearchOptions: undefined, // default: { timeouts: { connect: 1, read: 30, write: 30 } }, pass any different options to the algoliasearch constructor
      },
    },
    {
      resolve: "gatsby-plugin-firebase-v9.0",
      options: {
        credentials: {
          apiKey: process.env.GATSBY_FIREBASE_API_KEY,
          authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
          storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGE_ID,
          appId: process.env.GATSBY_FIREBASE_APP_ID,
          measurementId: process.env.GATSBY_FIREBASE_MEASURE
        }
      }
    },
    

    // See https://www.gatsbyjs.com/plugins/gatsby-plugin-react-helmet/?=gatsby-plugin-react-helmet
    `gatsby-plugin-react-helmet`,
  ],
};
