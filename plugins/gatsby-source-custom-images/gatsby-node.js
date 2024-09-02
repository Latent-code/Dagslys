const axios = require('axios');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.processImageUrls = async ({ imageUrls, actions, store, cache, createNodeId, reporter }) => {
  const { createNode, createParentChildLink } = actions;

  for (const url of imageUrls) {
    try {
      // Sanitize the URL
      const sanitizedUrl = decodeURIComponent(url);

      // Create a File node using createRemoteFileNode
      const fileNode = await createRemoteFileNode({
        url: sanitizedUrl,
        parentNodeId: null, // You might want to link this to a parent node if applicable
        store,
        cache,
        createNode,
        createNodeId,
      });

      if (fileNode) {
        // Create a node for the image
        createNode({
          ...fileNode,
          id: createNodeId(`image-${fileNode.id}`),
          internal: {
            type: 'CustomImageNode',
            contentDigest: fileNode.internal.contentDigest,
          },
        });

        // Link the file node to its parent node
        createParentChildLink({
          parent: fileNode,
          child: fileNode,
        });
      }
    } catch (error) {
      reporter.panicOnBuild(`Error creating file node for image ${url}:`, error);
    }
  }
};