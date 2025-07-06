const { genImage } = require("../Helpers/Helper");

/**
 * Generate an image using Canvas API
 * @param {*} metadata data to be used in an HTML code to render dynamic images
 * @returns an image buffer
 */
module.exports = async (metadata) => {
  try {
    // Create a simple HTML template for text extraction
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>Bitcoin Fees</title>
</head>
<body>
    <h2>${metadata}</h2>
</body>
</html>
    `;
    
    let buffer = await genImage(htmlTemplate);
    return buffer;
  } catch (error) {
    console.error('ImagePainter error:', error);
    return null;
  }
};
