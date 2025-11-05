// server/index.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
// increase body size limit to allow base64 image uploads (data URLs)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
      `SELECT e.*, c.name as category_name, v.name as venue_name, v.address as venue_address, v.capacity as venue_capacity,
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

// ------------------------
// ADMIN: Artists (CRUD) & Event Lineup management
// ------------------------

// GET /admin/artists - list artists
app.get('/admin/artists', async (req, res) => {
  try {
    const [artists] = await pool.query('SELECT * FROM artists ORDER BY name');
    res.json(artists);
  } catch (err) {
    console.error('Error in GET /admin/artists', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách nghệ sĩ.' });
  }
});

// POST /admin/artists - create artist (accepts avatar as data URL or url)
app.post('/admin/artists', async (req, res) => {
  try {
    let { name, bio, avatar_url } = req.body;
    if (!name) return res.status(400).json({ message: 'Thiếu tên nghệ sĩ.' });

    if (avatar_url && typeof avatar_url === 'string' && avatar_url.startsWith('data:')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(avatar_url, {
          folder: 'Media Library/Artists',
          resource_type: 'image',
        });
        avatar_url = uploadResult.secure_url;
      } catch (err) {
        console.error('Failed to upload artist avatar to Cloudinary:', err);
        return res.status(500).json({ message: 'Lỗi khi upload ảnh nghệ sĩ.' });
      }
    }

    const [result] = await pool.query('INSERT INTO artists (name, bio, avatar_url) VALUES (?, ?, ?)', [name, bio || null, avatar_url || null]);
    res.json({ message: 'Tạo nghệ sĩ thành công', id: result.insertId });
  } catch (err) {
    console.error('Error in POST /admin/artists', err);
    res.status(500).json({ message: 'Lỗi server khi tạo nghệ sĩ.' });
  }
});

// PUT /admin/artists/:id - update artist
app.put('/admin/artists/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let { name, bio, avatar_url } = req.body;
    if (!name) return res.status(400).json({ message: 'Thiếu tên nghệ sĩ.' });

    if (avatar_url && typeof avatar_url === 'string' && avatar_url.startsWith('data:')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(avatar_url, {
          folder: 'Media Library/Artists',
          resource_type: 'image',
        });
        avatar_url = uploadResult.secure_url;
      } catch (err) {
        console.error('Failed to upload artist avatar to Cloudinary:', err);
        return res.status(500).json({ message: 'Lỗi khi upload ảnh nghệ sĩ.' });
      }
    }

    await pool.query('UPDATE artists SET name = ?, bio = ?, avatar_url = ? WHERE id = ?', [name, bio || null, avatar_url || null, id]);
    res.json({ message: 'Cập nhật nghệ sĩ thành công' });
  } catch (err) {
    console.error('Error in PUT /admin/artists/:id', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật nghệ sĩ.' });
  }
});

// DELETE /admin/artists/:id - delete artist
app.delete('/admin/artists/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // optional: check and remove references in event_lineup
    await pool.query('DELETE FROM event_lineup WHERE artist_id = ?', [id]);
    await pool.query('DELETE FROM artists WHERE id = ?', [id]);
    res.json({ message: 'Xóa nghệ sĩ thành công' });
  } catch (err) {
    console.error('Error in DELETE /admin/artists/:id', err);
    res.status(500).json({ message: 'Lỗi server khi xóa nghệ sĩ.' });
  }
});

// Event lineup CRUD for admin
// POST /admin/event-lineup - add artist to event
app.post('/admin/event-lineup', async (req, res) => {
  try {
    const { event_id, artist_id, performance_time } = req.body;
    if (!event_id || !artist_id) return res.status(400).json({ message: 'Thiếu event_id hoặc artist_id.' });
    const [result] = await pool.query('INSERT INTO event_lineup (event_id, artist_id, performance_time) VALUES (?, ?, ?)', [event_id, artist_id, performance_time || null]);
    res.json({ message: 'Thêm lineup thành công', id: result.insertId });
  } catch (err) {
    console.error('Error in POST /admin/event-lineup', err);
    res.status(500).json({ message: 'Lỗi server khi thêm lineup.' });
  }
});

// PUT /admin/event-lineup/:id - update lineup entry
app.put('/admin/event-lineup/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { artist_id, performance_time } = req.body;
    if (!artist_id) return res.status(400).json({ message: 'Thiếu artist_id.' });
    await pool.query('UPDATE event_lineup SET artist_id = ?, performance_time = ? WHERE id = ?', [artist_id, performance_time || null, id]);
    res.json({ message: 'Cập nhật lineup thành công' });
  } catch (err) {
    console.error('Error in PUT /admin/event-lineup/:id', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật lineup.' });
  }
});

// DELETE /admin/event-lineup/:id - remove lineup entry
app.delete('/admin/event-lineup/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM event_lineup WHERE id = ?', [id]);
    res.json({ message: 'Xóa lineup thành công' });
  } catch (err) {
    console.error('Error in DELETE /admin/event-lineup/:id', err);
    res.status(500).json({ message: 'Lỗi server khi xóa lineup.' });
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
app.get("/ticket-detail", async (req, res) => {
  try {
    const { ticket_id } = req.query;

    if (!ticket_id) return res.status(400).json({ error: "Missing ticket_id" });

    const [rows] = await pool.query(
      `
      SELECT 
        t.id AS ticket_id,
        t.seat_number,
        t.Type,
        t.price,
        t.status AS ticket_status,
        t.qr_code,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        v.name AS venue_name,
        v.address AS venue_address
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      JOIN venues v ON e.venue_id = v.id
      WHERE t.id = ?
      `,
      [ticket_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// POST /purchase-ticket - Mua vé
app.post('/purchase-ticket', async (req, res) => {
  try {
    const { event_id, user_id, ticket_type, quantity, total_amount, payment_method } = req.body;
    
    if (!event_id || !user_id || !ticket_type || !quantity || !total_amount) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
    }

    // Kiểm tra user tồn tại
    const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [user_id]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'User không tồn tại. Vui lòng đăng nhập lại.' });
    }

    // Lấy thông tin event và capacity của venue
    const [eventRows] = await pool.query(
      `SELECT e.id, v.capacity FROM events e LEFT JOIN venues v ON e.venue_id = v.id WHERE e.id = ?`,
      [event_id]
    );
    if (eventRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
    }
    const venueCapacity = Number(eventRows[0].capacity) || 0;

    // Đếm số vé đã bán của sự kiện (mọi loại)
    const [soldCountRows] = await pool.query(
      'SELECT COUNT(*) as sold FROM tickets WHERE event_id = ? AND status = "sold"',
      [event_id]
    );
    const soldCount = Number(soldCountRows[0].sold) || 0;

    // Kiểm tra còn đủ chỗ không
    const remaining = Math.max(venueCapacity - soldCount, 0);
    if (remaining <= 0 || remaining < quantity) {
      return res.status(400).json({ message: `Hết vé hoặc không đủ số lượng. Còn lại: ${remaining}` });
    }

    // Tạo các vé mới với seat_number theo thứ tự mua (soldCount + i + 1)
    const unitPrice = total_amount / quantity;
    const now = new Date();
    const qrBase = `QR${Date.now()}`;

    const ticketValues = [];
    for (let i = 0; i < quantity; i++) {
      const seatNumber = soldCount + i + 1; // thứ tự mua
      const qrCode = `${qrBase}${i}`;
      ticketValues.push([event_id, user_id, seatNumber, ticket_type, unitPrice, 'sold', qrCode, now]);
    }

    const placeholders = ticketValues.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
    const [insertTickets] = await pool.query(
      `INSERT INTO tickets (event_id, user_id, seat_number, Type, price, status, qr_code, purchased_at) VALUES ${placeholders}`,
      ticketValues.flat()
    );

    // Ghi nhận payments
    const firstTicketId = insertTickets.insertId;
    const insertedCount = insertTickets.affectedRows || quantity;
    const payMethod = payment_method || 'credit_card';
    const payments = [];
    for (let i = 0; i < insertedCount; i++) {
      const ticketId = firstTicketId + i;
      payments.push([ticketId, user_id, unitPrice, payMethod, 'paid', now]);
    }
    const payPlaceholders = payments.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
    await pool.query(
      `INSERT INTO payments (ticket_id, user_id, amount, payment_method, status, paid_at) VALUES ${payPlaceholders}`,
      payments.flat()
    );

    res.json({ message: 'Mua vé và ghi nhận thanh toán thành công!', tickets_created: insertedCount, remaining_after: remaining - insertedCount });
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
  let connection;
  try {
    const { title, description, category_id, venue_id, start_time, end_time, created_by } = req.body;
    let { image_url } = req.body;

    if (!title || !start_time || !end_time || !created_by) {
      return res.status(400).json({ message: 'Thiếu thông tin sự kiện!' });
    }

    // Start transaction: create event and optional tickets together
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // If client sent a data URL for image (base64), upload it to Cloudinary and replace image_url
    if (image_url && typeof image_url === 'string' && image_url.startsWith('data:')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(image_url, {
          folder: 'Media Library/Assets',
          resource_type: 'image',
        });
        image_url = uploadResult.secure_url;
        console.log('Uploaded event image to Cloudinary:', image_url);
      } catch (err) {
        console.error('Failed to upload event image to Cloudinary:', err);
        await connection.rollback();
        connection.release();
        return res.status(500).json({ message: 'Lỗi khi upload hình ảnh sự kiện.' });
      }
    }

    // Insert the event
    const [insertResult] = await connection.query(
      'INSERT INTO events (title, description, category_id, venue_id, start_time, end_time, created_by, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, category_id, venue_id, start_time, end_time, created_by, image_url, 'upcoming']
    );

    const eventId = insertResult.insertId;

    // If tickets array provided, create ticket rows for the new event
    const tickets = Array.isArray(req.body.tickets) ? req.body.tickets : null;
    console.log('Tickets to create:', tickets);
    let ticketsCreated = 0;
    if (tickets && tickets.length) {
      // Next seat number starts at 1 (new event has none)
      let nextSeat = 1;

      const values = [];
      const placeholders = [];
      for (const t of tickets) {
        const type = t.type || 'standard';
        const price = typeof t.price !== 'undefined' ? Number(t.price) : 0;
        const status = t.status || 'available';
        const seatNumber = nextSeat++;
        // event_id, user_id (null), seat_number, Type, price, status, qr_code, purchased_at
        values.push(eventId, null, seatNumber, type, price, status, null, null);
        placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?)');
      }

      const sql = `INSERT INTO tickets (event_id, user_id, seat_number, Type, price, status, qr_code, purchased_at) VALUES ${placeholders.join(', ')}`;
      const [ticketInsert] = await connection.query(sql, values);
      ticketsCreated = ticketInsert.affectedRows || tickets.length;
    }

    await connection.commit();
    if (connection) connection.release();

    res.json({ message: 'Tạo sự kiện thành công!', eventId, ticketsCreated });
  } catch (err) {
    console.error('Error in /create-event:', err);
    try { if (connection) { await connection.rollback(); connection.release(); } } catch (e) {}
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
    const { user_id, username, full_name, phone, avatar_data, password } = req.body;
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

    // If client requests a password change, validate & hash it then include in update
    if (password !== undefined && password !== null && password !== '') {
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
      }
      const hashed = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashed);
    }

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
