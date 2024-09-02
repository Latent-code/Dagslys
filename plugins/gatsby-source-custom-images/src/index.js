const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.sourceNodes = async ({ actions, createNodeId, createNode, createContentDigest, store, cache }) => {
  const { createNodeField } = actions;

  const imageUrl = 'https://s3-eu-west-1.amazonaws.com/rentman-production/64881%2Frm4_brent_1580_google_image_f175ccbb00feff3a0f893627b1300873.jpeg%2Fjpg%2Fjpe%2Fjfif';

  // Download the image
  try {
    const response = await axios({ url: imageUrl, responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Process the image with Sharp
    const outputPath = path.join(process.cwd(), 'public', 'images', 'processed-image.jpg');
    await sharp(imageBuffer)
      .resize(800) // Resize as needed
      .toFile(outputPath);

    // Create a file node
    const fileNode = await createRemoteFileNode({
      url: `file://${outputPath}`,
      store,
      cache,
      createNode,
      createNodeId,
      createContentDigest,
    });

    // Add the file node to the image node
    const imageNode = {
      id: createNodeId('custom-image-1'),
      parent: null,
      children: [],
      internal: {
        type: 'CustomImage',
        contentDigest: createContentDigest('custom-image-data'),
      },
      localFile___NODE: fileNode.id,
    };

    createNode(imageNode);

  } catch (error) {
    console.error('Error fetching or processing image:', error);
  }
};