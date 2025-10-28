import express from "express";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================== CONFIG ==========================
app.use(express.json());
app.use(express.static("./"));

const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "mocktest_db",
};

let pool;

async function initDatabase() {
  try {
    pool = await mysql.createPool(dbConfig);
    console.log("✅ Kết nối MySQL thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
    process.exit(1);
  }
}

// ========================== ROUTES ==========================

// Health check
app.get("/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");
    if (rows[0].result === 1) {
      res.status(200).json({ status: "ok", db_status: "connected" });
    } else {
      res.status(503).json({ status: "error", db_status: "query_failed" });
    }
  } catch (err) {
    res.status(503).json({ status: "error", db_status: "disconnected", error: err.message });
  }
});

// GET / (Root) - Phục vụ file tu.html
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "tu.html"));
});

// GET all users
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email FROM users");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

// GET user by ID
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

// POST create new user
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    res.status(500).json({ error: "Database insert failed", details: err.message });
  }
});

// PUT update user
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email)
    return res.status(400).json({ error: "Name and email are required" });

  try {
    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.status(200).json({ id, name, email });
  } catch (err) {
    console.error("❌ Database update failed:", err.message);
    res.status(500).json({
      error: "Database update failed",
      details: err.message,
    });
  }
});

// DELETE user by ID
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("❌ Database delete failed:", err.message);
    res.status(500).json({
      error: "Database delete failed",
      details: err.message,
    });
  }
});

// ========================== 404 HANDLER (BƯỚC 8) ==========================
// Middleware này phải đặt ở CUỐI CÙNG, sau tất cả các route
// Nó sẽ bắt tất cả các request không khớp với bất kỳ route nào ở trên
app.use((req, res) => {
  // Trả về status 404 và gửi một trang HTML đơn giản
  // Express sẽ tự động đặt Content-Type là text/html
  res.status(404).send("<h1>404 - Page Not Found</h1>");
});
// =========================================================================

// ========================== SERVER START ==========================
initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server chạy tại: http://localhost:${port}`);
  });
});