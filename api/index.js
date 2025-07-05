const express = require("express");
const path = require("path");
const app = express();
const MainRouter = require("../Routers/Main");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Handle API routes
app.use("/", MainRouter);

// For GET requests to root, serve the static HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// For GET requests to static files, serve them
app.get("/static/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", req.path));
});

app.get("/*.(ico|png|json|txt)", (req, res) => {
  res.sendFile(path.join(__dirname, "..", req.path));
});

// Export the Express app for Vercel
module.exports = app;
