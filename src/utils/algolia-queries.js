const myQuery = `
query {
  RentalItems: allBrentRentalItem(filter: {in_shop: {eq: true}}) {
    nodes {
      displayname
      id
      image
      name
      rentmanId
      shop_description_long
      shop_description_short
      title
      in_shop
      pageLinkBrent
      urlPath
      internal {
        contentDigest
      }
      childFile {
        childImageSharp {
          gatsbyImageData(quality: 100, placeholder: TRACED_SVG, layout: FULL_WIDTH)
        }
      }
    }
  }
}
`

const queries = [
  {
    query: myQuery,
    queryVariables: {}, // optional. Allows you to use graphql query variables in the query
    transformer: ({ data }) => data.RentalItems.nodes, // optional
    indexName: 'prod_brent', // overrides main index name, optional
    settings: {
      attributesToSnippet: ["content:30"],
      snippetEllipsisText: "...",
      // optional, any index settings
      // Note: by supplying settings, you will overwrite all existing settings on the index
    },
    mergeSettings: false, // optional, defaults to false. See notes on mergeSettings below
  },
]

module.exports = queries


