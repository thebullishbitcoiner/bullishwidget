const express = require("express");
const path = require("path");
const app = express();
const MainRouter = require("../Routers/Main");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, "..")));

// Handle API routes
app.use("/", MainRouter);

// For GET requests to root, serve the static HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Catch-all handler for any unmatched routes
app.use("*", (req, res) => {
  console.log(`404 - File not found: ${req.originalUrl}`);
  res.status(404).send("File not found");
});

// Export the Express app for Vercel
module.exports = app;
