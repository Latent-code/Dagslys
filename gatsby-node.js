const path = require(`path`)
const axios = require("axios")
const { createRemoteFileNode } = require("gatsby-source-filesystem")



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
  // Query our posts from the GraphQL server
  // const posts = await getPosts(gatsbyUtilities)
  // const pages = await getPages(gatsbyUtilities)


  // OLD FUNCTIONS:
  // getRentalItems(100, 0).then(result =>
  //   createIndividualBlogPostPages(result, gatsbyUtilities),
  // )
  // getRentalItems(100, 100).then(result =>
  //   createIndividualBlogPostPages(result, gatsbyUtilities),
  // )
  // getRentalItems(100, 200).then(result =>
  //   createIndividualBlogPostPages(result, gatsbyUtilities),
  // )

  const folders = await getRentmanFolders(200, 0)
  const items1 = await getRentalItems(100, 0)
  const items2 = await getRentalItems(100, 100)
  const items3 = await getRentalItems(100, 200)
  const items4 = await getRentalItems(100, 300)
  const items5 = await getRentalItems(100, 400)
  const items6 = await getRentalItems(100, 500)
  const items7 = await getRentalItems(100, 600)
  const items8 = await getRentalItems(100, 700)
  const items9 = await getRentalItems(100, 800)
  const items10 = await getRentalItems(100, 900)
  const items = [
    ...items1.test.data.data,
    ...items2.test.data.data,
    ...items3.test.data.data,
    ...items4.test.data.data,
    ...items5.test.data.data,
    ...items6.test.data.data,
    ...items7.test.data.data,
    ...items8.test.data.data,
    ...items9.test.data.data,
    ...items10.test.data.data,
  ]

  let completeMenuArr = []
  const hiddenItems = [251, 45, 46, 47]

  items.map((item, index) => {
    if (!item.in_shop) {
      items.splice(index, 1)
    }

      item.parentFolderId = parseInt(item.folder.split("/").slice(-1))
      completeMenuArr.push(item)
  })

  folders.test.data.data.map((item, index) => {
    if (
      item.itemtype === "contact" ||
      item.itemtype === "vehicle" ||
      item.itemtype === "user"
    ) {
      folders.test.data.data.splice(index, 1)
    } else if (
      item.displayname.startsWith("import-") ||
      item.displayname.startsWith("Import-")
    ) {
    } else if (hiddenItems.includes(item.id)) {
      folders.test.data.data.splice(index, 1)
    } else {
      if (item.parent != null) {
        item.parentFolderId = parseInt(item.parent?.split("/").slice(-1))
        completeMenuArr.push(item)
      } else {
        item.parentFolderId = null
        completeMenuArr.push(item)
      }
    }
  })

  const menuSort = (function (data, root) {
      var t = {}
      data.forEach(o => {
        // console.log(o)
        Object.assign((t[o.id] = t[o.id] || {}), o)
        ;((t[o.parentFolderId] ??= {}).children ??= []).push(t[o.id])
      })
      return t[root].children
    })(completeMenuArr, null),
    shop = (r, { children = [], ...o }) => {
      children = children.reduce(shop, [])
      const sub = children.length ? { children } : {}
      if (o.in_shop || sub.children) r.push({ ...o, ...sub })
      return r
    }
  let finalMenu = menuSort.reduce(shop, [])

  function setPath(o) {
    o.urlPath = this.concat("/", o.name.replaceAll(" ", "-").replaceAll("|", "").replaceAll("/", "-").toLowerCase().toLowerCase())
    Array.isArray(o.children) && o.children.forEach(setPath, o.urlPath)
  }

  finalMenu.map(i => setPath.bind("")(i))

  // console.log("FINAL : ",finalMenu)
  const flatten = members => {
    let children = []
    const flattenMembers = members.map(m => {
      if (m.children && m.children.length) {
        children = [...children, ...m.children]
      }
      // console.log(m.urlPath)
      return m
    })

    return flattenMembers.concat(children.length ? flatten(children) : children)
  }
  const editFolders = []
  const editItems = []
  // const tempFolders = flatten(finalMenu)
  const tempData = flatten(finalMenu)
  tempData.forEach((item, index) => {
    if (item.path) {
      editFolders.push(item)
    } else {
      editItems.push(item)
    }
  })


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

const createIndividualPages = async ({ pages, gatsbyUtilities }) =>
  Promise.all(
    pages.map(({ previous, page, next }) =>
      // createPage is an action passed to createPages
      // See https://www.gatsbyjs.com/docs/actions#createPage for more info
      gatsbyUtilities.actions.createPage({
        // Use the WordPress uri as the Gatsby page path
        // This is a good idea so that internal links and menus work 👍
        path: `${page.urlPath}`,

        // use the blog post template as the page component
        component: path.resolve(`./src/templates/page.jsx`),

        // `context` is available in the template as a prop and
        // as a variable in GraphQL.
        context: {
          page: page,
          // we need to add the post id here
          // so our blog post template knows which blog post
          // the current page is (when you open it in a browser)
          id: page.id,

          // We also use the next and previous id's to query them and add links!
          previousPostId: previous ? previous.id : null,
          nextPostId: next ? next.id : null,
        },
      }),
    ),
  )
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
  const images1 = await fetchImageFromFile(100, 0)
  const images2 = await fetchImageFromFile(100, 100)
  const images3 = await fetchImageFromFile(100, 200)
  const images4 = await fetchImageFromFile(100, 300)
  const images5 = await fetchImageFromFile(100, 400)
  const items1 = await getRentalItems(100, 0)
  const items2 = await getRentalItems(100, 100)
  const items3 = await getRentalItems(100, 200)
  const items4 = await getRentalItems(100, 300)
  const items5 = await getRentalItems(100, 400)
  const items6 = await getRentalItems(100, 500)
  const items7 = await getRentalItems(100, 600)
  const items8 = await getRentalItems(100, 700)
  const items9 = await getRentalItems(100, 800)
  const items10 = await getRentalItems(100, 900)
  const items = [
    ...items1.test.data.data,
    ...items2.test.data.data,
    ...items3.test.data.data,
    ...items4.test.data.data,
    ...items5.test.data.data,
    ...items6.test.data.data,
    ...items7.test.data.data,
    ...items8.test.data.data,
    ...items9.test.data.data,
    ...items10.test.data.data,
  ]
  const images = [
    ...images1,
    ...images2,
    ...images3,
    ...images4,
    ...images5,
  ]
 

  let completeMenuArr = []

  // ITEMS THAT ARE NOT SUPPOSED TO BE SHOWN FROM RENTMAN (e.g Cars and crew)
  const hiddenItems = [251, 45, 46, 47]

  items.map((item, index) => {
    if (!item.in_shop) {
      items.splice(index, 1)
    }


      item.parentFolderId = parseInt(item.folder.split("/").slice(-1))
      completeMenuArr.push(item)
  })

  folders.test.data.data.map((item, index) => {
    if (

      item.itemtype === "contact" ||
      item.itemtype === "vehicle" ||
      item.itemtype === "user"
    ) {
      folders.test.data.data.splice(index, 1)
    } else if (
      item.displayname.startsWith("import-") ||
      item.displayname.startsWith("Import-")
    ) {
    } else if (hiddenItems.includes(item.id)) {
      folders.test.data.data.splice(index, 1)
    } else {
      if (item.parent != null) {
        item.parentFolderId = parseInt(item.parent?.split("/").slice(-1))
        completeMenuArr.push(item)
      } else {
        item.parentFolderId = null
        completeMenuArr.push(item)
      }
    }
  })

  const menuSort = (function (data, root) {
      var t = {}
      data.forEach(o => {
        // console.log(o)
        Object.assign((t[o.id] = t[o.id] || {}), o)
        ;((t[o.parentFolderId] ??= {}).children ??= []).push(t[o.id])
      })
      return t[root].children
    })(completeMenuArr, null),
    shop = (r, { children = [], ...o }) => {
      children = children.reduce(shop, [])
      const sub = children.length ? { children } : {}
      if (o.in_shop || sub.children) r.push({ ...o, ...sub })
      return r
    }
  let finalMenu = menuSort.reduce(shop, [])

  function setPath(o) {
    o.urlPath = this.concat("/", o.name.replaceAll(" ", "-").replaceAll("|", "").replaceAll("/", "-").toLowerCase())
    Array.isArray(o.children) && o.children.forEach(setPath, o.urlPath)
  }

  finalMenu.map(i => setPath.bind("")(i))

  // console.log("FINAL : ",finalMenu)
  const flatten = members => {
    let children = []
    const flattenMembers = members.map(m => {
      if (m.children && m.children.length) {
        children = [...children, ...m.children]
      }
      return m
    })

    return flattenMembers.concat(children.length ? flatten(children) : children)
  }
  const editFolders = []
  const editItems = []
  // const tempFolders = flatten(finalMenu)
  const tempData = flatten(finalMenu)
  tempData.forEach((item, index) => {
    if (item.path) {
      editFolders.push(item)
    } else {
      editItems.push(item)
    }
  })
  // console.log("MENU",finalMenu)

  // finalMenu.flat().forEach(item => {
  //   console.log(item)
  //   createNode({
  //     ...item,
  //     rentmanId: item.id,
  //     children: [],
  //     id: createNodeId(item.id),
  //     title: item.displayname,
  //     pageLinkBrent: item.name.toString().replaceAll(" ", "-").toLowerCase(),
  //     menuParentBrent: item.parent,
  //     internal: {
  //       type: "BrentRentalFolder",
  //       contentDigest: createContentDigest(item),
  //     },
  //   })
  // })
  // folders.test.data.data.forEach(item => {
  //   createNode({
  //     ...item,
  //     rentmanId: item.id,
  //     children: [],
  //     id: createNodeId(item.id),
  //     title: item.displayname,
  //     pageLinkBrent: item.name.toString().replaceAll(" ", "-").toLowerCase(),
  //     menuParentBrent: item.parent,
  //     internal: {
  //       type: "BrentRentalFolder",
  //       contentDigest: createContentDigest(item),
  //     },
  //   })
  // })

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
async function getRentalItems(limit, offset) {
  let items = []
  const token = process.env.GATSBY_RENTMAN_API
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.rentman.net/equipment?folder[isnull]=false&in_shop[isnull]=false&limit=${limit}&offset=${offset}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios
    .request(config)
    .then(response => {
      return {
        test: response,
      }
    })
    .catch(error => {
      console.log(error)
    })
}

async function getRentmanFolders(limit, offset) {
  let items = []
  const token = process.env.GATSBY_RENTMAN_API
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.rentman.net/folders?limit=${limit}&offset=${offset}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios
    .request(config)
    .then(response => {
      return {
        test: response,
      }
    })
    .catch(error => {
      console.log(error)
    })
}

async function fetchImageFromFile(limit, offset) {
  const token = process.env.GATSBY_RENTMAN_API

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.rentman.net/files?type[neq]=application/pdf&limit=${limit}&offset=${offset}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios
    .request(config)
    .then(response => {
      return response.data.data
    })
    .catch(error => {
      console.log(error)
    })
}