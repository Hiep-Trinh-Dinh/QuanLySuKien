-- =========================
-- DỮ LIỆU MẪU CHO HỆ THỐNG EVENT MANAGEMENT
-- =========================
USE vue_todo;

-- =========================
-- 1. USERS (Người dùng)
-- =========================
INSERT INTO users (username, email, password, full_name, phone, avatar_url, role)
VALUES
('admin', 'admin@event.com', '$2b$10$DUMMYHASH', 'Admin System', '0123456789', null, 'admin'),
('john_doe', 'john@email.com', '$2b$10$DUMMYHASH', 'John Doe', '0987654321', null, 'user'),
('jane_smith', 'jane@email.com', '$2b$10$DUMMYHASH', 'Jane Smith', '0912345678', null, 'user');

-- =========================
-- 2. CATEGORIES (Danh mục sự kiện)
-- =========================
INSERT INTO categories (name, description)
VALUES
('Music', 'Các sự kiện âm nhạc, concert, festival'),
('Technology', 'Hội nghị công nghệ, workshop, seminar'),
('Sports', 'Các sự kiện thể thao, giải đấu');

-- =========================
-- 3. VENUES (Địa điểm)
-- =========================
INSERT INTO venues (name, address, description, capacity, image_url)
VALUES
('Nhà hát Lớn Hà Nội', '1 Tràng Tiền, Hoàn Kiếm, Hà Nội', 'Nhà hát lớn nhất Hà Nội', 1000, null),
('Trung tâm Hội nghị Quốc gia', '1 Đại lộ Thăng Long, Hà Nội', 'Hội nghị quốc gia', 2000, null);

-- =========================
-- 4. EVENTS (Sự kiện)
-- =========================
INSERT INTO events (title, description, category_id, venue_id, start_time, end_time, created_by, image_url, status)
VALUES
('Summer Music Festival 2024', 'Lễ hội âm nhạc mùa hè với nghệ sĩ quốc tế.', 1, 1, '2024-07-15 19:00:00', '2024-07-15 23:00:00', 1, null, 'upcoming'),
('Tech Conference 2024', 'Hội nghị công nghệ lớn nhất năm.', 2, 2, '2024-08-20 09:00:00', '2024-08-20 17:00:00', 1, null, 'active'),
('Football Final', 'Chung kết giải bóng đá.', 3, 1, '2024-06-30 19:30:00', '2024-06-30 21:30:00', 2, null, 'ended');

-- =========================
-- 5. ARTISTS
-- =========================
INSERT INTO artists (name, bio, avatar_url)
VALUES
('Taylor Swift', 'Pop singer', null),
('Ed Sheeran', 'Acoustic artist', null);

-- =========================
-- 6. EVENT LINEUP
-- =========================
INSERT INTO event_lineup (event_id, artist_id, performance_time)
VALUES
(1, 1, '2024-07-15 20:00:00'),
(1, 2, '2024-07-15 21:00:00');

-- =========================
-- 7. TICKETS
-- =========================
INSERT INTO tickets (event_id, user_id, seat_number, Type, price, status, qr_code, purchased_at)
VALUES
(1, 2, 1, 'A', 1200000, 'sold', 'QRAAA001', '2024-06-01 10:00:00'),
(1, 3, 2, 'B', 500000, 'reserved', 'QRAAA002', '2024-06-02 14:30:00'),
(2, null, 1, 'A', 300000, 'available', null, null);

-- =========================
-- 8. REVIEWS
-- =========================
INSERT INTO reviews (event_id, user_id, email, phone, name, rating, content)
VALUES
(1, 2, 'john@email.com', '0987654321', 'John Doe', 5, 'Sự kiện âm nhạc tuyệt vời!'),
(2, 3, 'jane@email.com', '0912345678', 'Jane Smith', 4, 'Hội nghị công nghệ rất bổ ích.');

-- =========================
-- 9. PAYMENTS
-- =========================
INSERT INTO payments (ticket_id, user_id, amount, payment_method, status, paid_at)
VALUES
(1, 2, 1200000, 'credit_card', 'paid', '2024-06-01 10:05:00'),
(2, 3, 500000, 'bank_transfer', 'pending', null);

-- =========================
-- 10. SUPPORT TICKETS
-- =========================
INSERT INTO support_tickets (user_id, subject, message, status)
VALUES
(2, 'Vấn đề về vé', 'Tôi đã mua vé nhưng chưa nhận được email xác nhận.', 'open'),
(3, 'Hoàn vé', 'Tôi muốn hoàn vé vì có việc đột xuất.', 'in_progress');
