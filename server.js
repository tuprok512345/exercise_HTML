import express from "express";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt"; // <--- THÊM MỚI CHO ĐĂNG NHẬP

const app = express();
const port = 3001;
const saltRounds = 10; // <--- THÊM MỚI CHO ĐĂNG NHẬP

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

// ====================== CRUD CHO USERS =====================
// (Các route GET, POST, PUT, DELETE cho /api/users của bạn)

// GET all users
app.get("/api/users", async (req, res) => {
  try {
    // Chỉ lấy các cột an toàn, không lấy password_hash
    const [rows] = await pool.query("SELECT id, name, email, username FROM users");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

// GET user by ID
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT id, name, email, username FROM users WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

// POST create new user (Route này giờ là REGISTER)
// Bạn có thể giữ route POST /api/users cũ hoặc dùng /api/register mới bên dưới
// Tốt nhất nên dùng /api/register
// app.post("/api/users", ... ); 

// PUT update user
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  // Giả sử bạn chỉ cho cập nhật name và email, không cho đổi username/password ở đây
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

    res.status(200).json({ id: Number(id), name, email });
  } catch (err) {
    res.status(500).json({ error: "Database update failed", details: err.message });
  }
});

// DELETE user by ID
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database delete failed", details: err.message });
  }
});


// ====================== CRUD CHO QUESTIONS =====================
// (Các route GET, POST, PUT, DELETE cho /api/questions của bạn)

// [CREATE] POST /api/questions
app.post("/api/questions", async (req, res) => {
  const { question_text, answer_text } = req.body;
  if (!question_text || !answer_text) {
    return res.status(400).json({ error: "question_text and answer_text are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO questions (question_text, answer_text) VALUES (?, ?)",
      [question_text, answer_text]
    );
    res.status(201).json({ id: result.insertId, question_text, answer_text });
  } catch (err) {
    res.status(500).json({ error: "Database insert failed", details: err.message });
  }
});

// [READ ALL] GET /api/questions
app.get("/api/questions", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM questions");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

// [READ ONE] GET /api/questions/:id
app.get("/api/questions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM questions WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

// [UPDATE] PUT /api/questions/:id
app.put("/api/questions/:id", async (req, res) => {
  const { id } = req.params;
  const { question_text, answer_text } = req.body;
  if (!question_text || !answer_text) {
    return res.status(400).json({ error: "question_text and answer_text are required" });
  }
  try {
    const [result] = await pool.query(
      "UPDATE questions SET question_text = ?, answer_text = ? WHERE id = ?",
      [question_text, answer_text, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json({ id: Number(id), question_text, answer_text });
  } catch (err) {
    res.status(500).json({ error: "Database update failed", details: err.message });
  }
});

// [DELETE] DELETE /api/questions/:id
app.delete("/api/questions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM questions WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database delete failed", details: err.message });
  }
});

// =================================================================
// ==================== AUTHENTICATION (CODE MỚI) ==================
// =================================================================

// [REGISTER] POST /api/register - Đăng ký user mới
app.post("/api/register", async (req, res) => {
  // Form đăng ký của bạn cần gửi 4 trường này
  const { name, email, username, password } = req.body; 

  if (!username || !email || !password || !name) {
    return res.status(400).json({ error: "Vui lòng nhập đủ thông tin: name, username, email, password" });
  }

  try {
    // Mã hóa mật khẩu
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Lưu vào database
    const [result] = await pool.query(
      "INSERT INTO users (name, email, username, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, username, password_hash]
    );
    
    // Lấy lại user vừa tạo (không kèm hash)
    const [userRows] = await pool.query("SELECT id, name, email, username FROM users WHERE id = ?", [result.insertId]);
    
    res.status(201).json(userRows[0]);

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Username hoặc Email đã tồn tại" });
    }
    res.status(500).json({ error: "Lỗi khi đăng ký", details: err.message });
  }
});


// [LOGIN] POST /api/login - Đăng nhập
app.post("/api/login", async (req, res) => {
  // Form đăng nhập của bạn chỉ cần 2 trường này
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Vui lòng nhập username và password" });
  }

  try {
    // 1. Tìm user trong database
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, username] // Cho phép đăng nhập bằng username hoặc email
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Username không tồn tại" });
    }

    const user = rows[0];

    // 2. So sánh mật khẩu
    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      // Mật khẩu đúng!
      res.status(200).json({ 
        message: "Đăng nhập thành công",
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          username: user.username 
        }
      });
    } else {
      // Mật khẩu sai
      res.status(401).json({ error: "Mật khẩu không chính xác" });
    }

  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi đăng nhập", details: err.message });
  }
});


// ========================== 404 HANDLER ==========================
app.use((req, res) => {
  res.status(404).send("<h1>404 - Page Not Found</h1>");
});
// =================================================================

// ========================== SERVER START ==========================
initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server chạy tại: http://localhost:${port}`);
  });
});