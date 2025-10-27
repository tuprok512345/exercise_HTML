// Dùng 'import' thay vì 'require'
import express from "express";
import mysql from "mysql2/promise"; // Dùng thư viện MySQL

const app = express();
const port = 3001; // <<< TÔI ĐÃ ĐỔI CỔNG SANG 3001

// Cấu hình kết nối thẳng tới database XAMPP của bạn
const dbConfig = {
  host: "127.0.0.1", // Giống 'localhost'
  user: "root",        // User mặc định của XAMPP
  password: "",       // Password rỗng mặc định của XAMPP
  database: "mocktest_db" // Database bạn đã tạo
};

let pool;

try {
  pool = mysql.createPool(dbConfig);
  console.log("Đã tạo kết nối tới MySQL pool.");
} catch (err) {
  console.error("Lỗi khi tạo pool kết nối:", err);
  process.exit(1); // Thoát nếu không tạo được pool
}

// Serve các file tĩnh (như tu.html, script.js) từ thư mục hiện tại
app.use(express.static("./"));

// Endpoint /health để kiểm tra kết nối database
app.get("/health", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  
  try {
    // Thử truy vấn database MySQL
    const [rows] = await pool.query('SELECT 1 AS result');
    
    if (rows && rows[0] && rows[0].result === 1) {
      res.status(200).json({ 
        status: "ok", 
        db_status: "connected" 
      });
    } else {
      res.status(503).json({ status: "error", db_status: "query_failed" });
    }

  } catch (e) {
    // Nếu ping DB lỗi, trả về 503
    console.error("Health check FAILED:", e.message);
    res.status(503).json({ 
      status: "error", 
      db_status: "disconnected",
      error: e.message 
    });
  }
});

// Endpoint gốc, chuyển hướng đến tu.html
app.get("/", (req, res) => {
  res.redirect("/tu.html");
});

app.listen(port, () => {
  // Cập nhật thông báo log để hiển thị đúng cổng 3001
  console.log(`✅ Server Node.js đang chạy tại http://localhost:${port}`);
  console.log(`Kết nối đến database MySQL: ${dbConfig.database}`);
});

