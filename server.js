import express from "express";
const app = express();
const port = 3000;

// Serve static files
app.use(express.static("./"));

// Health check endpoint (luôn trả về 200)
app.get("/health", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
