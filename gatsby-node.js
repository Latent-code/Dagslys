const path = require(`path`)
const axios = require("axios")
const { createRemoteFileNode } = require("gatsby-source-filesystem")
const { restructureFoldersAndItems } = require("./nodeUtils/restructureFoldersAndItems");



// REMOVE BUILD ERRROR, FOR SOME REASON???????
const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ actions, plugins, ...args }) => {
  const buildWebpackConfig =
    args.stage === 'build-html'
      ? {
          resolve: {
            // Handle Uncaught TypeError: util.inherits is not a function - https://github.com/webpack/webpack/issues/1019
            mainFields: ['browser', 'module', 'main'],
            // Handle unsupported node scheme - https://github.com/webpack/webpack/issues/13290#issuecomment-987880453
            fallback: {
              util: require.resolve('util'),
              stream: require.resolve('stream-browserify'),
            },
          },
        }
      : {};
  actions.setWebpackConfig({
    plugins: [
      // Handle unsupported node scheme - https://github.com/webpack/webpack/issues/13290#issuecomment-987880453
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      }),
    ],
    ...buildWebpackConfig,
  });
};
// END : REMOVE BUILD ERRROR, FOR SOME REASON???????


// This is a simple debugging tool
// dd() will prettily dump to the terminal and kill the process
// const { dd } = require(`dumper.js`)

/**
 * exports.createPages is a built-in Gatsby Node API.
 * It's purpose is to allow you to create pages for your site! 💡
 *
 * See https://www.gatsbyjs.com/docs/node-apis/#createPages for more info.
 *
 *
 */

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type BrentRentalItem implements Node {
      title: String!
      childFile: File
    }
  `;
  createTypes(typeDefs);
};

exports.createPages = async gatsbyUtilities => {
  
  const folders = await getRentmanFolders(200, 0)
  const items = await getRentalItems()

  const { editFolders, editItems } = restructureFoldersAndItems(
    folders,
    items,
  )

  createIndividualItemPages(editItems, gatsbyUtilities)

  createIndividualFolderPages(editFolders, gatsbyUtilities)
}
/**
 * This function creates all the individual blog pages in this site
 */
const createIndividualItemPages = async (test, gatsbyUtilities) => {
  Promise.all(
    test.map(post => {
      // createPage is an action passed to createPages
      // See https://www.gatsbyjs.com/docs/actions#createPage for more info
      gatsbyUtilities.actions.createPage({
        // Use the WordPress uri as the Gatsby page path
        // This is a good idea so that internal links and menus work 👍
        path: `${post.urlPath}`,

        // use the blog post template as the page component
        component: path.resolve(`./src/pages/rental-item.jsx`),

        // `context` is available in the template as a prop and
        // as a variable in GraphQL.
        context: {
          post: post,
          link: post.path,
          // we need to add the post id here
          // so our blog post template knows which blog post
          // the current page is (when you open it in a browser)
          id: post.id,

          // We also use the next and previous id's to query them and add links!
          // previousPostId: previous ? previous.id : null,
          // nextPostId: next ? next.id : null,
        },
      })
    }),
  )
}

const createIndividualFolderPages = async (result, gatsbyUtilities) =>
  Promise.all(
    // console.log("REIEL", result.test.data.data),
    result.map(folder => {
      // console.log("test",typeof folder.urlPath)
      // console.log("FOLDER", `/rental${folder.urlPath}`)
      // createPage is an action passed to createPages
      // See https://www.gatsbyjs.com/docs/actions#createPage for more info
      gatsbyUtilities.actions.createPage({
        // Use the WordPress uri as the Gatsby page path
        // This is a good idea so that internal links and menus work 👍
        path: `${folder.urlPath}`,

        // use the blog post template as the page component
        component: path.resolve(`./src/templates/page.jsx`),

        // `context` is available in the template as a prop and
        // as a variable in GraphQL.
        context: {
          page: folder,
          pageLinkBrent: folder.name
            .toString()
            .replaceAll(" ", "-")
            .toLowerCase(),
          menuParentBrent: folder.parent,
          // we need to add the post id here
          // so our blog post template knows which blog post
          // the current page is (when you open it in a browser)
          id: folder.id,

          // We also use the next and previous id's to query them and add links!
          // previousPostId: previous ? previous.id : null,
          // nextPostId: next ? next.id : null,
        },
      })
    }),
  )

/**
 * This function creates all the individual blog pages in this site
//  */

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  getCache,
  createNodeId,
}) => {
  if (node.internal.type === "BrentRentalItem" && node.imageContent) {
    const { createNode, createNodeField, createParentChildLink } = actions

    /* Download the image and create the File node. Using gatsby-plugin-sharp and gatsby-transformer-sharp the node will become an ImageSharp. */
    const fileNode = await createRemoteFileNode({
      url: node.imageContent.url, // string that points to the URL of the image
      parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
      store, // Gatsby's redux store
      getCache, // get Gatsby's cache
      createNode, // helper function in gatsby-node to generate the node
      createNodeId, // helper function in gatsby-node to generate the node id
    })
    if (fileNode) {
      createParentChildLink({ parent: node, child: fileNode })
      // node.imageContent.reiel___NODE = fileNode.id
    }
  } else if (node.internal.type === "BrentRentalFolder") {
  } else if (
    node.internal.type !== "BrentRentalFolder" ||
    node.internal.type !== "BrentRentalItem"
  ) {
    return
  }
}

exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
  createNodeId,
  store,
  getCache,
}) => {
  // Function to turn image object into gatsby node
  const turnImageObjectIntoGatsbyNode = (image, parent) => {
    // const content = {
    //   content: parent.displayname,
    //   ["reiel___NODE"]: createNodeId(`image-{${parent.id}}`),
    // }
    const nodeId = createNodeId(image.id)
    const nodeContent = JSON.stringify(image)

    const nodeData = {
      ...image,
      // ...content,
      title: image.displayname,
      parent: null,
      children: [],
      internal: {
        type: "Image",
        content: nodeContent,
        contentDigest: createContentDigest(nodeId),
      },
    }
    return nodeData
  }

  const createImageObjectFromURL = url => {
    const lastIndexOfSlash = url.lastIndexOf("/")
    const id = url.slice(lastIndexOfSlash + 1, url.lastIndexOf("."))
    return { id, image: id, url }
  }

  const folders = await getRentmanFolders(200, 0)
  const images = await fetchImageFromFile()
  const items = await getRentalItems()

  const { editFolders, editItems } = restructureFoldersAndItems(
    folders,
    items,
    )
    console.log("REIEL2 folders before",folders)
    
    
    // console.log("REIEL items function",editItems)
    console.log("REIEL2 folders function",editFolders)
   
  editFolders.forEach(item => {
    // console.log(item)
    createNode({
      ...item,
      rentmanId: item.id,
      children: [],
      childRentalItems: item.children,
      id: createNodeId(item.id),
      title: item.displayname,
      pageLinkBrent: item.name.toString().replaceAll(" ", "-").replaceAll("|", "").toLowerCase(),
      menuParentBrent: item.parent,
      internal: {
        type: "BrentRentalFolder",
        contentDigest: createContentDigest(item),
      },
    })
  })

  editItems.forEach((item, index) => {
    // console.log("test3",item.displayname)
    if(images) {

      images.map(img => {
        if (img.id === parseInt(item.image?.split("/").slice(-1))) {
          const imgObj = createImageObjectFromURL(img.url)
          const nodeData = turnImageObjectIntoGatsbyNode(imgObj, item)
          
          createNode({
            ...item,
            rentmanId: item.id,
            children: [],
            childRentalItems: item.children,
            id: createNodeId(item.id),
            title: item.displayname,
            pageLinkBrent: item.name
            .toString()
            .replaceAll(" ", "-")
            .toLowerCase(),
            menuParentBrent: item.parent,
            internal: {
              type: "BrentRentalItem",
              contentDigest: createContentDigest(item),
            },
            imageContent: nodeData,
          })
          images.slice(index, 1)
        }
      })
    }
      createNode({
      ...item,
      id: createNodeId(item.id),
      childRentalItems: item.children,
      rentmanId: item.id,
      title: item.displayname,
      pageLinkBrent: item.name.toString().replaceAll(" ", "-").toLowerCase(),
      menuParentBrent: item.parent,
      internal: {
        type: "BrentRentalItem",
        contentDigest: createContentDigest(item),
      },
      imageContent: null,
    })
  })
}

/**
 * This function queries Gatsby's GraphQL server and asks for
 * All WordPress blog posts. If there are any GraphQL error it throws an error
 * Otherwise it will return the posts 🙌
 *
 * We're passing in the utilities we got from createPages.
 * So see https://www.gatsbyjs.com/docs/node-apis/#createPages for more info!
 */

async function getRentalItems() {
  let limit = 100;
  let offset = 0;
  async function fetchAll(limit, offset) {
    const items = [];

    const token = process.env.GATSBY_RENTMAN_API;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.rentman.net/equipment?folder[isnull]=false&in_shop[isnull]=false&limit=${limit}&offset=${offset}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(config);

      // Check if the response has data property and data is an array
      if (response.data && Array.isArray(response.data.data)) {
        items.push(...response.data.data);
      }

      // Check if itemCount is less than limit
      if (response.data.itemCount < limit) {
        console.log("Stopping API calls. itemCount is less than the limit.");
        // console.log("response.data.data: ", response.data.data);
        // console.log("items: ", items);
      } else {
        // Make the next API call with an updated offset
        const newOffset = offset + limit;
        const nextItems = await fetchAll(limit, newOffset);
        items.push(...nextItems);
      }
    } catch (error) {
      console.error("Error fetching rental items data:", error.message);
    }

    return items;
  }

  let tempItemData =  await fetchAll(limit, offset)

  return tempItemData;
}


async function getRentmanFolders() {
  let limit = 100;
  let offset = 0;
  async function fetchAll(limit, offset) {
    const items = [];

    const token = process.env.GATSBY_RENTMAN_API;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.rentman.net/folders?limit=${limit}&offset=${offset}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(config);

      // Check if the response has data property and data is an array
      if (response.data && Array.isArray(response.data.data)) {
        items.push(...response.data.data);
      }

      // Check if itemCount is less than limit
      if (response.data.itemCount < limit) {
        console.log("Stopping API calls. itemCount is less than the limit.");
        // console.log("response.data.data: ", response.data.data);
        // console.log("items: ", items);
      } else {
        // Make the next API call with an updated offset
        const newOffset = offset + limit;
        const nextItems = await fetchAll(limit, newOffset);
        items.push(...nextItems);
      }
    } catch (error) {
      console.error("Error fetching folder data:", error.message);
    }

    return items;
  }

  let tempFolderData =  await fetchAll(limit, offset)

  return tempFolderData;
}

async function fetchImageFromFile() {
  let limit = 100;
  let offset = 0;
  async function fetchAll(limit, offset) {
    const items = [];

    const token = process.env.GATSBY_RENTMAN_API;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.rentman.net/files?type[neq]=application/pdf&limit=${limit}&offset=${offset}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(config);

      // Check if the response has data property and data is an array
      if (response.data && Array.isArray(response.data.data)) {
        items.push(...response.data.data);
      }

      // Check if itemCount is less than limit
      if (response.data.itemCount < limit) {
        console.log("Stopping API calls. itemCount is less than the limit.");
        // console.log("response.data.data: ", response.data.data);
        // console.log("items: ", items);
      } else {
        // Make the next API call with an updated offset
        const newOffset = offset + limit;
        const nextItems = await fetchAll(limit, newOffset);
        items.push(...nextItems);
      }
    } catch (error) {
      console.error("Error fetching image data:", error.message);
    }

    return items;
  }

  let tempImageData =  await fetchAll(limit, offset)

  return tempImageData;
}