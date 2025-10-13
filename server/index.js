// server/index.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'vue_todo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// POST /register
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });

    // Kiểm tra email đã tồn tại chưa
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length > 0)
      return res.status(400).json({ message: 'Email đã được sử dụng.' });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Lưu user mới
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash]
    );

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server. Vui lòng thử lại.' });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });

    // Tìm user theo email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0)
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });

    const user = users[0];

    // Kiểm tra password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });

    // Tạo token đơn giản (trong thực tế nên dùng JWT)
    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');

    // Trả về thông tin user và token (không trả về password)
    res.json({
      message: 'Đăng nhập thành công!',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server. Vui lòng thử lại.' });
  }
});


app.get('/events', async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT
        e.*,
        c.name as category_name,
        v.name as venue_name,
        v.address as venue_address
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      ORDER BY e.start_time DESC
      `);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server. Vui lòng thử lại.' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
