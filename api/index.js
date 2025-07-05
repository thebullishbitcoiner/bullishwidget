const express = require("express");
const path = require("path");
const app = express();
const MainRouter = require("../Routers/Main");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Handle API routes first
app.use("/", MainRouter);

// For GET requests to root, serve the static HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Serve static files with proper MIME types
app.get("/static/*", (req, res) => {
  const filePath = path.join(__dirname, "..", req.path);
  const ext = path.extname(filePath);
  
  // Set proper MIME types
  const mimeTypes = {
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
  };
  
  if (mimeTypes[ext]) {
    res.setHeader('Content-Type', mimeTypes[ext]);
  }
  
  res.sendFile(filePath);
});

// Serve other static files
app.get("/*.(ico|png|jpg|jpeg|gif|svg|json|txt|woff|woff2|ttf|eot)", (req, res) => {
  const filePath = path.join(__dirname, "..", req.path);
  const ext = path.extname(filePath);
  
  // Set proper MIME types
  const mimeTypes = {
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
  };
  
  if (mimeTypes[ext]) {
    res.setHeader('Content-Type', mimeTypes[ext]);
  }
  
  res.sendFile(filePath);
});

// Export the Express app for Vercel
module.exports = app;
