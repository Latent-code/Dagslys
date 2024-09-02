const path = require(`path`);
const axios = require("axios");
const {
  createRemoteFileNode,
  createFilePath,
} = require("gatsby-source-filesystem");
const {
  restructureFoldersAndItems,
} = require("./nodeUtils/restructureFoldersAndItems");
const { createFileNodeFromBuffer } = require("gatsby-source-filesystem");
const fs = require("fs");
const sharp = require("sharp"); // Ensure sharp is imported

// REMOVE BUILD ERRROR, FOR SOME REASON???????
const webpack = require("webpack");

exports.onCreateWebpackConfig = ({ actions, plugins, ...args }) => {
  const buildWebpackConfig =
    args.stage === "build-html"
      ? {
          resolve: {
            // Handle Uncaught TypeError: util.inherits is not a function - https://github.com/webpack/webpack/issues/1019
            mainFields: ["browser", "module", "main"],
            // Handle unsupported node scheme - https://github.com/webpack/webpack/issues/13290#issuecomment-987880453
            fallback: {
              util: require.resolve("util"),
              stream: require.resolve("stream-browserify"),
            },
          },
        }
      : {};
  actions.setWebpackConfig({
    plugins: [
      // Handle unsupported node scheme - https://github.com/webpack/webpack/issues/13290#issuecomment-987880453
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
    ],
    ...buildWebpackConfig,
  });
};
// END : REMOVE BUILD ERRROR, FOR SOME REASON???????

/**
 * This is a tool to process image
 *
 *
 *
 *
 *
 */

// Helper function to process images
// Helper function to determine if the image needs processing
const isProcessableImage = (url) => {
  const validImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  return !validImageExtensions.some((ext) => url.endsWith(ext));
};

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
      id: ID!
      name: String
      description: String
      price: Float
      code: String
      shopFeatured: Boolean
      shopDescriptionLong: String
      shopDescriptionShort: String
      inShop: Boolean
      folder: String
      urlPath: String
      pageLinkBrent: String
    }

    type BrentRentalFolder implements Node {
      id: ID!
      name: String
      children: [BrentRentalItem] @link
    }

    type Query {
      allBrentRentalItems: [BrentRentalItem]
      brentRentalItem(id: ID!): BrentRentalItem
      allBrentRentalFolders: [BrentRentalFolder]
      brentRentalFolder(id: ID!): BrentRentalFolder
    }
  `;
  createTypes(typeDefs);
};

exports.createPages = async (gatsbyUtilities) => {
  const folders = await getRentmanFolders();
  const items = await getRentalItems();

  const { editFolders, editItems } = restructureFoldersAndItems(folders, items);

  createIndividualItemPages(editItems, gatsbyUtilities);

  createIndividualFolderPages(editFolders, gatsbyUtilities);
};
/**
 * This function creates all the individual blog pages in this site
 */
const createIndividualItemPages = async (test, gatsbyUtilities) => {
  Promise.all(
    test.map((post) => {
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
      });
    })
  );
};

const createIndividualFolderPages = async (result, gatsbyUtilities) =>
  Promise.all(
    // console.log("REIEL", result.test.data.data),
    await result.map((folder) => {
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
      });
    })
  );

/**
 * This function creates all the individual blog pages in this site
//  */

function isURL(str) {
  try {
    new URL(str);
    return true; // It's a valid URL
  } catch (_) {
    return false; // It's not a valid URL
  }
}

function isRelativePath(str) {
  return !path.isAbsolute(str) && !isURL(str);
}

const createRemoteFileNodeFromRelativePath = async (
  relativePath,
  { cache, store, createNodeId }
) => {
  const baseUrl = "http://localhost:3001"; // Replace with your actual base URL
  const absoluteUrl = `${baseUrl}/${relativePath}`;

  return absoluteUrl;
  // ... rest of the code (see next step)
};

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  getCache,
  createNodeId,
  createContentDigest,
  createImageSharpNode,
}) => {
  const { createNode, createParentChildLink } = actions;

  // Check if the node is of type BrentRentalItem and has an imageJPG
  if (node.internal.type === "BrentRentalItem" && node.imageContent.imageJPG) {
    // console.log("onCreateNode: ", node);

    let fileNode;

    // Handle remote URL
    if (node.imageContent.imageJPG.url) {
      try {
        fileNode = await createRemoteFileNode({
          url: node.imageContent.imageJPG.url,
          parentNodeId: node.id,
          parent: node.id,
          store,
          cache,
          createNode,
          createNodeId,
          getCache,
          name: node.displayname,
        });

        if (fileNode) {
          createParentChildLink({ parent: node, child: fileNode });
        }
      } catch (error) {
        console.error(
          `Error creating remote file node from URL ${node.imageContent.imageJPG.url}:`,
          error
        );
      }
    }
    // Handle local file path
    else if (node.imageContent.imageJPG.relativePath) {
      const baseUrl = "http://localhost:3001  "; // Replace with your actual base URL
      const absoluteUrl = `${baseUrl}/${node.imageContent.imageJPG.relativePath}`;

      const absolutePath = isRelativePath(
        node.imageContent.imageJPG.relativePath
      )
        ? node.imageContent.imageJPG.relativePath
        : path.resolve(process.cwd(), node.imageContent.imageJPG.relativePath);

      // Check if the file exists
      if (fs.existsSync(absolutePath)) {
        try {
          const fileBuffer = fs.readFileSync(absolutePath);

          // Option 1: Using createFileNodeFromBuffer
          const fileNode = await createFileNodeFromBuffer({
            buffer: fileBuffer,
            name: node.displayname || path.basename(absolutePath),
            ext: path.extname(absolutePath),
            parentNodeId: node.id,
            createNode,
            createNodeId,
            cache,
            store,
          });

          if (fileNode) {
            createParentChildLink({ parent: node, child: fileNode });
          }
        } catch (error) {
          console.error(
            `Error creating file node from local path ${absolutePath}:`,
            error
          );
        }
      } else {
        console.error(`File does not exist at path: ${absolutePath}`);
      }
    }
  }
  // Return early if the node is of types BrentRentalFolder or anything else
  else if (node.internal.type === "BrentRentalFolder") {
    // Handle BrentRentalFolder specific logic here if needed
  } else if (
    node.internal.type !== "BrentRentalFolder" ||
    node.internal.type !== "BrentRentalItem"
  ) {
    return;
  }
};

exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
  createNodeId,
  store,
  cache,
  getCache,
}) => {
  const turnImageObjectIntoGatsbyNode = (
    image,
    parent,
    createNode,
    createNodeId,
    createContentDigest
  ) => {
    const nodeId = createNodeId(`image-${image.id}`);
    const nodeContent = JSON.stringify(image);
    // console.log("image", image);
    const nodeData = {
      ...image,
      id: createNodeId(`image-${image.id}`),
      title: image.displayname,
      parent: null,
      children: [],
      internal: {
        type: "Image",
        content: nodeContent,
        contentDigest: createContentDigest(nodeId),
      },
    };

    return nodeData;
  };

  // Function to ensure directory exists
  const ensureDirectoryExists = (filePath) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };

  const createImageObjectFromURL = async (
    url,
    createNode,
    createNodeId,
    createContentDigest,
    store,
    cache,
    getCache
  ) => {
    try {
      // console.log(`Processing URL: ${url}`); // Log URL being processed

      // Define file paths
      const imageId = path.basename(url, path.extname(url));
      const jpgFilePath = path.join(
        __dirname,
        `./public/images/${imageId}.jpg`
      );
      const webpFilePath = path.join(
        __dirname,
        `./public/images/${imageId}.webp`
      );

      // Ensure directories exist
      ensureDirectoryExists(jpgFilePath);
      ensureDirectoryExists(webpFilePath);

      // Check if the URL already has a valid image extension
      if (isProcessableImage(url)) {
        // Fetch the image
        const response = await axios({ url, responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data, "binary");

        // Process and save image
        await sharp(buffer).toFile(jpgFilePath); // Save as JPG
        await sharp(buffer).toFormat("webp").toFile(webpFilePath); // Save as WebP

        // Create file nodes
        const jpgFileNode = await createFileNodeFromBuffer({
          buffer: fs.readFileSync(jpgFilePath),
          createNode,
          createNodeId,
          createContentDigest,
          store,
          cache,
          getCache,
          ext: ".jpg",
        });

        const webpFileNode = await createFileNodeFromBuffer({
          buffer: fs.readFileSync(webpFilePath),
          createNode,
          createNodeId,
          createContentDigest,
          store,
          cache,
          getCache,
          ext: ".webp",
        });

        // console.log("JPG File Node ID:", jpgFileNode); // Log JPG file node ID
        // console.log("WEBP File Node ID:", webpFileNode); // Log WEBP file node ID
        return { jpg: jpgFileNode, webp: webpFileNode };
      } else {
        // Return the URL if no processing is needed
        const jpgFileNode = {
          createNode,
          id: createNodeId("LØASKD"),
          createContentDigest,
          store,
          cache,
          getCache,
          url: url,
          ext: ".jpg",
        };

        const webpFileNode = {
          createNode,
          id: createNodeId("ASDASD"),
          createContentDigest,
          store,
          cache,
          getCache,
          url: url,
          ext: ".webp",
        };
        // console.log("JPG File Node ID, no processing is needed:", jpgFileNode); // Log JPG file node ID
        // console.log(
        //   "WEBP File Node ID, no processing is needed:",
        //   webpFileNode
        // ); // Log WEBP file node ID
        return { jpg: jpgFileNode, webp: webpFileNode };
      }
    } catch (error) {
      console.error(`Error processing image ${url}:`, error);
      return { jpg: null, webp: null };
    }
  };

  const folders = await getRentmanFolders();
  const images = await fetchImageFromFile();
  const items = await getRentalItems();

  const { editFolders, editItems } = restructureFoldersAndItems(folders, items);
  // console.log("REIEL2 folders before",folders)

  // console.log("editItems", editItems);
  // console.log("editFolders", editFolders);

  editFolders.forEach((item) => {
    // console.log(item)
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
        .replaceAll("|", "")
        .toLowerCase(),
      menuParentBrent: item.parent,
      internal: {
        type: "BrentRentalFolder",
        contentDigest: createContentDigest(item),
      },
    });
  });

  const processImageNodes = async (item) => {
    // console.log("Processing item:", item); // Log item being processed

    if (images) {
      for (const img of images) {
        if (img.id === parseInt(item.image?.split("/").slice(-1))) {
          const { jpg, webp } = await createImageObjectFromURL(
            img.url,
            createNode,
            createNodeId,
            createContentDigest,
            store,
            cache,
            getCache
          );

          // console.log("JPG:", jpg);
          // console.log("WEBP:", webp);

          // Create image nodes
          if (jpg) {
            const imageJPGNode = turnImageObjectIntoGatsbyNode(
              { id: jpg.id, url: jpg.url },
              item,
              createNode,
              createNodeId,
              createContentDigest
            );
            createNode(imageJPGNode);
          }

          if (webp) {
            const imageWEBPNode = turnImageObjectIntoGatsbyNode(
              { id: webp.id, url: webp.url },
              item,
              createNode,
              createNodeId,
              createContentDigest
            );
            createNode(imageWEBPNode);
          }

          // Create the main item node
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
              .replaceAll("|", "")
              .toLowerCase(),
            menuParentBrent: item.parent,
            internal: {
              type: "BrentRentalItem",
              contentDigest: createContentDigest(item),
            },
            imageContent: {
              imageJPG: jpg,
              imageWEBP: webp,
            },
          });

          break; // Assuming each item has only one image
        }
      }
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
      imageContent: {
        imageJPG: null,
        imageWEBP: null,
      },
    });
  };
  editItems.forEach((item) => {
    // console.log("editItems :", item.name);
    processImageNodes(item);
  });
};

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

    const token = process.env.RENTMAN_API;
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

  let tempItemData = await fetchAll(limit, offset);

  return tempItemData;
}

async function getRentmanFolders() {
  let limit = 100;
  let offset = 0;
  async function fetchAll(limit, offset) {
    const items = [];

    const token = process.env.RENTMAN_API;
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

  let tempFolderData = await fetchAll(limit, offset);

  return tempFolderData;
}

async function fetchImageFromFile() {
  let limit = 100;
  let offset = 0;
  async function fetchAll(limit, offset) {
    const items = [];

    const token = process.env.RENTMAN_API;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.rentman.net/files?itemtype=Materiaal&limit=${limit}&offset=${offset}`,
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

  let tempImageData = await fetchAll(limit, offset);

  return tempImageData;
}