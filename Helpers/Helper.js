const { createCanvas, loadImage } = require('canvas');

/**
 * Generate an image using Canvas API
 * @param {string} htmlBoilerPlate An HTML code in a string type to be rendered
 * @returns an image buffer
 */
const genImage = async (htmlBoilerPlate) => {
  try {
    // Extract text from HTML (simple approach for now)
    const textMatch = htmlBoilerPlate.match(/<h2[^>]*>([^<]+)<\/h2>/);
    const text = textMatch ? textMatch[1] : 'Bitcoin Fees';
    
    // Create canvas
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    
    // Load background image
    const bg = await loadImage('https://images.unsplash.com/photo-1674421268449-d68facc81eca');
    ctx.drawImage(bg, 0, 0, 800, 600);
    
    // Add dark overlay for better text readability
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, 800, 600);
    
    // Add semi-transparent card background
    ctx.fillStyle = 'rgba(30, 30, 30, 0.9)';
    ctx.fillRect(100, 150, 600, 300);
    
    // Add border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 150, 600, 300);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split text into lines and draw
    const lines = text.split('\n');
    const lineHeight = 60;
    const startY = 300 - (lines.length * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), 400, startY + index * lineHeight);
    });
    
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Canvas generation error:', error);
    return null;
  }
};

/**
 * Get main app url
 * @returns The main app URL in which the app is running
 */
const getMainURL = () => {
  if (process.env.NODE_ENV === "production")
    return `${process.env.PROTOCOL}://${process.env.DOMAIN}`;
  return "http://localhost:30032";
};

module.exports = { getMainURL, genImage };
