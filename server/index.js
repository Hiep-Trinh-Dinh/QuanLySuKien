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

// thêm cloudinary config
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
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
        role : user.role,
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar_url
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

app.get('/events/:id', async (req, res) => {
  try {
    const [events] = await pool.query(
      `SELECT e.*, c.name as category_name, v.name as venue_name, v.address as venue_address,
        IFNULL(u.full_name, u.username) as event_creator_name
       FROM events e
       LEFT JOIN categories c ON e.category_id = c.id
       LEFT JOIN venues v ON e.venue_id = v.id
       LEFT JOIN users u ON e.created_by = u.id
       WHERE e.id = ?`, [req.params.id]);
    if (events.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(events[0]);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server. Vui lòng thử lại.' });
  }
});


app.post('/event-review', async (req, res) => {
  try {
    console.log('=== EVENT REVIEW REQUEST ===');
    console.log('Request body:', req.body);
    
    const { event_id, user_id, rating, name, email, phone, content } = req.body;
    
    // Validation
    if (!event_id || !rating || !name || !email) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
    }
    
    if (rating < 1 || rating > 5) {
      console.log('Validation failed - invalid rating:', rating);
      return res.status(400).json({ message: 'Rating phải từ 1-5!' });
    }
    
    // Xử lý content nếu null/undefined
    const finalContent = content || '';
    
    console.log('Review data validated:', { event_id, user_id, rating, name, email, phone, content: finalContent });
    
    // Test database connection
    console.log('Testing database connection...');
    const [testResult] = await pool.query('SELECT 1 as test');
    console.log('Database connection OK:', testResult);
    
    // Insert review
    console.log('Inserting review...');
    const result = await pool.query(
      'INSERT INTO reviews (event_id, user_id, rating, name, email, phone, content) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [event_id, user_id, rating, name, email, phone, finalContent]
    );
    
    console.log('Insert result:', result);
    console.log('=== REVIEW SUCCESS ===');
    
    res.json({ message: 'Đánh giá thành công!' });
  } catch (err) {
    console.error('=== ERROR IN /event-review ===');
    console.error('Error details:', err);
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    console.error('Error sqlState:', err.sqlState);
    console.error('========================');
    res.status(500).json({ message: 'Lỗi server. Vui lòng thử lại.' });
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const event_id = req.query.event_id;
    if (!event_id) return res.status(400).json({ message: 'Thiếu event_id!' });
    const [reviews] = await pool.query(
      'SELECT * FROM reviews WHERE event_id = ? ORDER BY created_at DESC',
      [event_id]
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy reviews.' });
  }
});

app.get('/event-lineup', async (req, res) => {
  try {
    const event_id = req.query.event_id;
    if (!event_id) return res.status(400).json({ message: 'Thiếu event_id!' });
    const [lineup] = await pool.query(`
      SELECT l.*, a.name as artist_name, a.avatar_url, a.bio
      FROM event_lineup l
      LEFT JOIN artists a ON l.artist_id = a.id
      WHERE l.event_id = ?
      ORDER BY l.performance_time ASC
    `, [event_id]);
    res.json(lineup);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy lineup.' });
  }
});

app.get('/tickets', async (req, res) => {
  try {
    const event_id = req.query.event_id;
    if (!event_id) return res.status(400).json({ message: 'Thiếu event_id!' });
    const [tickets] = await pool.query(
      'SELECT id, event_id, seat_number, Type, price, status, qr_code FROM tickets WHERE event_id = ?',
      [event_id]
    );
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy tickets.' });
  }
});

// =========================
// API CHO TICKET PURCHASE & PAYMENT
// =========================

// GET /user-tickets - Lấy vé của user
app.get('/user-tickets', async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) return res.status(400).json({ message: 'Thiếu user_id!' });
    
    const [tickets] = await pool.query(`
      SELECT t.*, e.title, e.start_time, e.end_time, e.image_url, v.name as venue_name, v.address as venue_address
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.id
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE t.user_id = ? AND t.status = 'sold'
      ORDER BY e.start_time DESC
    `, [user_id]);
    
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy vé của user.' });
  }
});

// POST /purchase-ticket - Mua vé
app.post('/purchase-ticket', async (req, res) => {
  try {
    const { event_id, user_id, ticket_type, quantity, total_amount } = req.body;
    
    if (!event_id || !user_id || !ticket_type || !quantity || !total_amount) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
    }
    
    // Tạo vé mới với QR code
    const ticketData = [];
    for (let i = 0; i < quantity; i++) {
      const qrCode = `QR${Date.now()}${i}`;
      ticketData.push([event_id, user_id, i + 1, ticket_type, total_amount / quantity, 'sold', qrCode, new Date()]);
    }
    
    const placeholders = ticketData.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
    const values = ticketData.flat();
    
    await pool.query(
      `INSERT INTO tickets (event_id, user_id, seat_number, Type, price, status, qr_code, purchased_at) VALUES ${placeholders}`,
      values
    );
    
    res.json({ message: 'Mua vé thành công!' });
  } catch (err) {
    console.error('Error in /purchase-ticket:', err);
    res.status(500).json({ message: 'Lỗi server khi mua vé.' });
  }
});

// POST /payment - Thanh toán
app.post('/payment', async (req, res) => {
  try {
    const { ticket_id, user_id, amount, payment_method } = req.body;
    
    if (!ticket_id || !user_id || !amount || !payment_method) {
      return res.status(400).json({ message: 'Thiếu thông tin thanh toán!' });
    }
    
    // Tạo payment record
    await pool.query(
      'INSERT INTO payments (ticket_id, user_id, amount, payment_method, status, paid_at) VALUES (?, ?, ?, ?, ?, ?)',
      [ticket_id, user_id, amount, payment_method, 'paid', new Date()]
    );
    
    res.json({ message: 'Thanh toán thành công!' });
  } catch (err) {
    console.error('Error in /payment:', err);
    res.status(500).json({ message: 'Lỗi server khi thanh toán.' });
  }
});

// =========================
// API CHO CUSTOMER SUPPORT
// =========================

// POST /support-ticket - Tạo ticket hỗ trợ
app.post('/support-ticket', async (req, res) => {
  try {
    const { user_id, subject, message } = req.body;
    
    if (!user_id || !subject || !message) {
      return res.status(400).json({ message: 'Thiếu thông tin hỗ trợ!' });
    }
    
    await pool.query(
      'INSERT INTO support_tickets (user_id, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?)',
      [user_id, subject, message, 'open', new Date()]
    );
    
    res.json({ message: 'Đã gửi yêu cầu hỗ trợ thành công!' });
  } catch (err) {
    console.error('Error in /support-ticket:', err);
    res.status(500).json({ message: 'Lỗi server khi gửi hỗ trợ.' });
  }
});

// GET /support-tickets - Lấy danh sách ticket hỗ trợ của user
app.get('/support-tickets', async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) return res.status(400).json({ message: 'Thiếu user_id!' });
    
    const [tickets] = await pool.query(
      'SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy ticket hỗ trợ.' });
  }
});

// =========================
// API CHO ADMIN - CREATE EVENT
// =========================

// POST /create-event - Tạo sự kiện mới (admin only)
app.post('/create-event', async (req, res) => {
  try {
    const { title, description, category_id, venue_id, start_time, end_time, created_by, image_url } = req.body;
    
    if (!title || !start_time || !end_time || !created_by) {
      return res.status(400).json({ message: 'Thiếu thông tin sự kiện!' });
    }
    
    await pool.query(
      'INSERT INTO events (title, description, category_id, venue_id, start_time, end_time, created_by, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, category_id, venue_id, start_time, end_time, created_by, image_url, 'upcoming']
    );
    
    res.json({ message: 'Tạo sự kiện thành công!' });
  } catch (err) {
    console.error('Error in /create-event:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo sự kiện.' });
  }
});

// GET /categories - Lấy danh sách categories
app.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy categories.' });
  }
});

// GET /venues - Lấy danh sách venues
app.get('/venues', async (req, res) => {
  try {
    const [venues] = await pool.query('SELECT * FROM venues ORDER BY name');
    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy venues.' });
  }
});

// =========================
// API CHO USER PROFILE
// =========================

// GET /user-profile - Lấy thông tin user
app.get('/user-profile', async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) return res.status(400).json({ message: 'Thiếu user_id!' });
    
    const [users] = await pool.query(
      'SELECT id, username, email, full_name, phone, avatar_url, role, created_at FROM users WHERE id = ?',
      [user_id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy user!' });
    }
    
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin user.' });
  }
});

// PUT /update-profile - Cập nhật thông tin user
app.put('/update-profile', async (req, res) => {
  try {
    const { user_id, username, full_name, phone, avatar_data } = req.body;
    if (!user_id) return res.status(400).json({ message: 'Thiếu user_id!' });

    const [users] = await pool.query('SELECT avatar_url FROM users WHERE id = ?', [user_id]);
    const currentAvatar = users?.[0]?.avatar_url || null;

    let newAvatarUrl = null;

    if (avatar_data) {
      // Xóa avatar cũ nếu là Cloudinary
      try {
        if (currentAvatar && currentAvatar.includes('res.cloudinary.com')) {
          // Lấy public_id (bao gồm folder) từ URL, loại bỏ extension và version nếu có
          const match = currentAvatar.match(/\/upload\/(?:v\d+\/)?(.+)\.(?:jpg|jpeg|png|gif|webp|svg|bmp)/i);
          const publicIdRaw = match ? match[1] : null;
          const publicId = publicIdRaw ? decodeURIComponent(publicIdRaw) : null;
          if (publicId) {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
          }
        }
      } catch (err) {
        console.warn('Không thể xóa avatar cũ trên Cloudinary (tiếp tục):', err.message || err);
      }

      // Upload avatar mới vào folder đúng như bạn đặt (ví dụ "Media Library/Assets")
      const uploadResult = await cloudinary.uploader.upload(avatar_data, {
        folder: 'Media Library/Assets',
        overwrite: true,
        resource_type: 'image'
      });
      console.log('Upload avatar mới thành công:', uploadResult.secure_url);
      newAvatarUrl = uploadResult.secure_url;

    }

    let query = 'UPDATE users SET username = ?, full_name = ?, phone = ?';
    const params = [username, full_name, phone];

    if (newAvatarUrl) {
      query += ', avatar_url = ?';
      params.push(newAvatarUrl);
    }

    query += ' WHERE id = ?';
    params.push(user_id);

    await pool.query(query, params);

    const responsePayload = { message: 'Cập nhật thông tin thành công!' };
    if (newAvatarUrl) responsePayload.avatar_url = newAvatarUrl;

    res.json(responsePayload);
  } catch (err) {
    console.error('Error in /update-profile:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin.' });
  }
});

// =========================
// API CHO ADMIN MANAGEMENT
// =========================

// GET /admin/dashboard - Thống kê tổng quan
app.get('/admin/dashboard', async (req, res) => {
  try {
    // Thống kê tổng quan
    const [totalEvents] = await pool.query('SELECT COUNT(*) as count FROM events');
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [totalTickets] = await pool.query('SELECT COUNT(*) as count FROM tickets WHERE status = "sold"');
    const [totalRevenue] = await pool.query('SELECT SUM(amount) as total FROM payments WHERE status = "paid"');
    
    // Sự kiện sắp diễn ra
    const [upcomingEvents] = await pool.query(`
      SELECT e.*, c.name as category_name, v.name as venue_name
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE e.start_time > NOW()
      ORDER BY e.start_time ASC
      LIMIT 5
    `);
    
    // Doanh thu theo tháng
    const [monthlyRevenue] = await pool.query(`
      SELECT 
        DATE_FORMAT(paid_at, '%Y-%m') as month,
        SUM(amount) as revenue
      FROM payments 
      WHERE status = 'paid' AND paid_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(paid_at, '%Y-%m')
      ORDER BY month ASC
    `);
    
    res.json({
      stats: {
        totalEvents: totalEvents[0].count,
        totalUsers: totalUsers[0].count,
        totalTickets: totalTickets[0].count,
        totalRevenue: totalRevenue[0].total || 0
      },
      upcomingEvents,
      monthlyRevenue
    });
  } catch (err) {
    console.error('Error in /admin/dashboard:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy thống kê.' });
  }
});

// GET /admin/events - Quản lý sự kiện
app.get('/admin/events', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    let params = [];
    
    if (status) {
      whereClause += ' AND e.status = ?';
      params.push(status);
    }
    
    if (search) {
      whereClause += ' AND (e.title LIKE ? OR e.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    const [events] = await pool.query(`
      SELECT 
        e.*, 
        c.name as category_name, 
        v.name as venue_name,
        u.username as creator_name,
        COUNT(t.id) as ticket_count,
        SUM(CASE WHEN t.status = 'sold' THEN 1 ELSE 0 END) as sold_tickets
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN tickets t ON e.id = t.event_id
      WHERE ${whereClause}
      GROUP BY e.id
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);
    
    const [totalCount] = await pool.query(`
      SELECT COUNT(*) as count FROM events e WHERE ${whereClause}
    `, params);
    
    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount[0].count,
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });
  } catch (err) {
    console.error('Error in /admin/events:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sự kiện.' });
  }
});

// PUT /admin/events/:id - Cập nhật sự kiện
app.put('/admin/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, category_id, venue_id, start_time, end_time, status, image_url } = req.body;
    
    await pool.query(
      'UPDATE events SET title = ?, description = ?, category_id = ?, venue_id = ?, start_time = ?, end_time = ?, status = ?, image_url = ? WHERE id = ?',
      [title, description, category_id, venue_id, start_time, end_time, status, image_url, eventId]
    );
    
    res.json({ message: 'Cập nhật sự kiện thành công!' });
  } catch (err) {
    console.error('Error in /admin/events/:id:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật sự kiện.' });
  }
});

// DELETE /admin/events/:id - Xóa sự kiện
app.delete('/admin/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Kiểm tra xem có vé nào đã bán chưa
    const [tickets] = await pool.query('SELECT COUNT(*) as count FROM tickets WHERE event_id = ? AND status = "sold"', [eventId]);
    
    if (tickets[0].count > 0) {
      return res.status(400).json({ message: 'Không thể xóa sự kiện đã có vé được bán!' });
    }
    
    // Xóa các bản ghi liên quan
    await pool.query('DELETE FROM reviews WHERE event_id = ?', [eventId]);
    await pool.query('DELETE FROM event_lineup WHERE event_id = ?', [eventId]);
    await pool.query('DELETE FROM tickets WHERE event_id = ?', [eventId]);
    await pool.query('DELETE FROM events WHERE id = ?', [eventId]);
    
    res.json({ message: 'Xóa sự kiện thành công!' });
  } catch (err) {
    console.error('Error in /admin/events/:id:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa sự kiện.' });
  }
});

// GET /admin/users - Quản lý người dùng
app.get('/admin/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    let params = [];
    
    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }
    
    if (search) {
      whereClause += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    const [users] = await pool.query(`
      SELECT 
        u.*,
        COUNT(t.id) as ticket_count,
        COUNT(r.id) as review_count
      FROM users u
      LEFT JOIN tickets t ON u.id = t.user_id AND t.status = 'sold'
      LEFT JOIN reviews r ON u.id = r.user_id
      WHERE ${whereClause}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);
    
    const [totalCount] = await pool.query(`
      SELECT COUNT(*) as count FROM users WHERE ${whereClause}
    `, params);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount[0].count,
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });
  } catch (err) {
    console.error('Error in /admin/users:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng.' });
  }
});

// PUT /admin/users/:id - Cập nhật quyền người dùng
app.put('/admin/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    await pool.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, userId]
    );
    
    res.json({ message: 'Cập nhật quyền người dùng thành công!' });
  } catch (err) {
    console.error('Error in /admin/users/:id:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật quyền người dùng.' });
  }
});

// GET /admin/tickets - Quản lý vé
app.get('/admin/tickets', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, event_id } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    let params = [];
    
    if (status) {
      whereClause += ' AND t.status = ?';
      params.push(status);
    }
    
    if (event_id) {
      whereClause += ' AND t.event_id = ?';
      params.push(event_id);
    }
    
    const [tickets] = await pool.query(`
      SELECT 
        t.*,
        e.title as event_title,
        e.start_time,
        u.username as buyer_name,
        u.email as buyer_email
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE ${whereClause}
      ORDER BY t.purchased_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);
    
    const [totalCount] = await pool.query(`
      SELECT COUNT(*) as count FROM tickets t WHERE ${whereClause}
    `, params);
    
    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount[0].count,
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });
  } catch (err) {
    console.error('Error in /admin/tickets:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách vé.' });
  }
});

// GET /admin/reviews - Quản lý đánh giá
app.get('/admin/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, event_id } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    let params = [];
    
    if (rating) {
      whereClause += ' AND r.rating = ?';
      params.push(rating);
    }
    
    if (event_id) {
      whereClause += ' AND r.event_id = ?';
      params.push(event_id);
    }
    
    const [reviews] = await pool.query(`
      SELECT 
        r.*,
        e.title as event_title,
        u.username as reviewer_name
      FROM reviews r
      LEFT JOIN events e ON r.event_id = e.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);
    
    const [totalCount] = await pool.query(`
      SELECT COUNT(*) as count FROM reviews r WHERE ${whereClause}
    `, params);
    
    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount[0].count,
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });
  } catch (err) {
    console.error('Error in /admin/reviews:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách đánh giá.' });
  }
});

// DELETE /admin/reviews/:id - Xóa đánh giá
app.delete('/admin/reviews/:id', async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    await pool.query('DELETE FROM reviews WHERE id = ?', [reviewId]);
    
    res.json({ message: 'Xóa đánh giá thành công!' });
  } catch (err) {
    console.error('Error in /admin/reviews/:id:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa đánh giá.' });
  }
});

// GET /admin/support-tickets - Quản lý ticket hỗ trợ
app.get('/admin/support-tickets', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    let params = [];
    
    if (status) {
      whereClause += ' AND st.status = ?';
      params.push(status);
    }
    
    const [tickets] = await pool.query(`
      SELECT 
        st.*,
        u.username,
        u.email
      FROM support_tickets st
      LEFT JOIN users u ON st.user_id = u.id
      WHERE ${whereClause}
      ORDER BY st.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);
    
    const [totalCount] = await pool.query(`
      SELECT COUNT(*) as count FROM support_tickets WHERE ${whereClause}
    `, params);
    
    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount[0].count,
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });
  } catch (err) {
    console.error('Error in /admin/support-tickets:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách ticket hỗ trợ.' });
  }
});

// PUT /admin/support-tickets/:id - Cập nhật trạng thái ticket hỗ trợ
app.put('/admin/support-tickets/:id', async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;
    
    await pool.query(
      'UPDATE support_tickets SET status = ? WHERE id = ?',
      [status, ticketId]
    );
    
    res.json({ message: 'Cập nhật ticket hỗ trợ thành công!' });
  } catch (err) {
    console.error('Error in /admin/support-tickets/:id:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật ticket hỗ trợ.' });
  }
});

// POST /admin/categories - Tạo category mới
app.post('/admin/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Thiếu tên category!' });
    }
    
    await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    
    res.json({ message: 'Tạo category thành công!' });
  } catch (err) {
    console.error('Error in /admin/categories:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo category.' });
  }
});

// POST /admin/venues - Tạo venue mới
app.post('/admin/venues', async (req, res) => {
  try {
    const { name, address, capacity, description } = req.body;
    
    if (!name || !address) {
      return res.status(400).json({ message: 'Thiếu thông tin venue!' });
    }
    
    await pool.query(
      'INSERT INTO venues (name, address, capacity, description) VALUES (?, ?, ?, ?)',
      [name, address, capacity, description]
    );
    
    res.json({ message: 'Tạo venue thành công!' });
  } catch (err) {
    console.error('Error in /admin/venues:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo venue.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
