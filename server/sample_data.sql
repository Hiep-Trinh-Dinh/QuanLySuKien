-- =========================
-- DỮ LIỆU MẪU CHO HỆ THỐNG EVENT MANAGEMENT
-- =========================

-- Xóa dữ liệu cũ (nếu có)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE support_tickets;
TRUNCATE TABLE reviews;
TRUNCATE TABLE tickets;
TRUNCATE TABLE event_lineup;
TRUNCATE TABLE events;
TRUNCATE TABLE venues;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- 1. USERS (Người dùng)
-- =========================
INSERT INTO users (id, username, email, password, full_name, phone, role, status, created_at) VALUES
(1, 'admin', 'admin@event.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin System', '0123456789', 'admin', 'active', NOW()),
(2, 'john_doe', 'john@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', '0987654321', 'user', 'active', NOW()),
(3, 'jane_smith', 'jane@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', '0912345678', 'user', 'active', NOW()),
(4, 'dinhhiep', 'dinhhiep@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trịnh Đình Hiệp', '0977309945', 'user', 'active', NOW()),
(5, 'event_manager', 'manager@event.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Event Manager', '0901234567', 'manager', 'active', NOW());

-- =========================
-- 2. CATEGORIES (Danh mục sự kiện)
-- =========================
INSERT INTO categories (id, name, description, created_at) VALUES
(1, 'Music', 'Các sự kiện âm nhạc, concert, festival', NOW()),
(2, 'Technology', 'Hội nghị công nghệ, workshop, seminar', NOW()),
(3, 'Sports', 'Các sự kiện thể thao, giải đấu', NOW()),
(4, 'Art & Culture', 'Triển lãm nghệ thuật, văn hóa', NOW()),
(5, 'Business', 'Hội nghị kinh doanh, networking', NOW()),
(6, 'Education', 'Khóa học, workshop giáo dục', NOW());

-- =========================
-- 3. VENUES (Địa điểm)
-- =========================
INSERT INTO venues (id, name, address, capacity, description, created_at) VALUES
(1, 'Nhà hát Lớn Hà Nội', '1 Tràng Tiền, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 1000, 'Nhà hát lớn nhất Hà Nội với hệ thống âm thanh và ánh sáng hiện đại', NOW()),
(2, 'Trung tâm Hội nghị Quốc gia', '1 Đại lộ Thăng Long, Nam Từ Liêm, Hà Nội', 2000, 'Trung tâm hội nghị quốc tế với đầy đủ tiện nghi', NOW()),
(3, 'Sân vận động Mỹ Đình', 'Đường Lê Đức Thọ, Nam Từ Liêm, Hà Nội', 40000, 'Sân vận động lớn nhất Việt Nam', NOW()),
(4, 'Bảo tàng Mỹ thuật Việt Nam', '66 Nguyễn Thái Học, Đống Đa, Hà Nội', 500, 'Không gian triển lãm nghệ thuật truyền thống và hiện đại', NOW()),
(5, 'Khách sạn JW Marriott', '8 Đồng Khởi, Quận 1, TP.HCM', 800, 'Khách sạn 5 sao với phòng hội nghị cao cấp', NOW()),
(6, 'Trung tâm Triển lãm SECC', '799 Nguyễn Văn Linh, Quận 7, TP.HCM', 1500, 'Trung tâm triển lãm và hội nghị lớn nhất TP.HCM', NOW());

-- =========================
-- 4. EVENTS (Sự kiện)
-- =========================
INSERT INTO events (id, title, description, category_id, venue_id, start_time, end_time, created_by, image_url, status, price, created_at) VALUES
(1, 'Summer Music Festival 2024', 'Lễ hội âm nhạc mùa hè với các nghệ sĩ quốc tế và địa phương. Trải nghiệm một đêm khó quên với âm nhạc đa dạng từ pop, rock đến electronic.', 1, 1, '2024-07-15 19:00:00', '2024-07-15 23:00:00', 1, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80', 'upcoming', 500000, NOW()),
(2, 'Tech Conference 2024', 'Hội nghị công nghệ lớn nhất năm với các chuyên gia hàng đầu về AI, Blockchain và Cloud Computing. Cơ hội networking và học hỏi từ các chuyên gia.', 2, 2, '2024-08-20 09:00:00', '2024-08-20 17:00:00', 1, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80', 'upcoming', 300000, NOW()),
(3, 'Football Championship Final', 'Trận chung kết giải vô địch bóng đá quốc gia. Cuộc đối đầu giữa hai đội tuyển mạnh nhất mùa giải.', 3, 3, '2024-06-30 19:30:00', '2024-06-30 21:30:00', 5, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80', 'completed', 200000, NOW()),
(4, 'Contemporary Art Exhibition', 'Triển lãm nghệ thuật đương đại với các tác phẩm từ các nghệ sĩ trẻ tài năng. Khám phá những xu hướng nghệ thuật mới nhất.', 4, 4, '2024-09-10 10:00:00', '2024-09-15 18:00:00', 1, 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80', 'upcoming', 100000, NOW()),
(5, 'Startup Pitch Competition', 'Cuộc thi khởi nghiệp với các startup tiềm năng trình bày ý tưởng kinh doanh. Cơ hội gặp gỡ các nhà đầu tư và mentor.', 5, 5, '2024-10-05 14:00:00', '2024-10-05 18:00:00', 5, 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80', 'upcoming', 150000, NOW()),
(6, 'Digital Marketing Workshop', 'Workshop về Digital Marketing với các chuyên gia hàng đầu. Học cách xây dựng chiến lược marketing hiệu quả cho doanh nghiệp.', 6, 6, '2024-11-12 09:00:00', '2024-11-12 16:00:00', 1, 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80', 'upcoming', 250000, NOW());

-- =========================
-- 5. EVENT LINEUP (Nghệ sĩ biểu diễn)
-- =========================
INSERT INTO event_lineup (id, event_id, artist_id, artist_name, stage_name, performance_time, bio, avatar_url) VALUES
(1, 1, 1, 'Taylor Swift', 'Main Stage', '2024-07-15 20:00:00', 'Ca sĩ nhạc pop nổi tiếng thế giới', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80'),
(2, 1, 2, 'Ed Sheeran', 'Main Stage', '2024-07-15 21:30:00', 'Nghệ sĩ acoustic guitar tài năng', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80'),
(3, 1, 3, 'BTS', 'Main Stage', '2024-07-15 22:00:00', 'Nhóm nhạc K-pop hàng đầu thế giới', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80'),
(4, 2, 4, 'Elon Musk', 'Keynote Stage', '2024-08-20 10:00:00', 'CEO Tesla và SpaceX, nhà đổi mới công nghệ', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
(5, 2, 5, 'Sundar Pichai', 'Keynote Stage', '2024-08-20 14:00:00', 'CEO Google, chuyên gia về AI và Machine Learning', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
(6, 4, 6, 'Banksy', 'Gallery A', '2024-09-10 10:00:00', 'Nghệ sĩ street art nổi tiếng thế giới', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=200&q=80');

-- =========================
-- 6. TICKETS (Vé)
-- =========================
INSERT INTO tickets (id, event_id, user_id, seat_number, price, status, purchased_at) VALUES
-- Event 1 - Summer Music Festival
(1, 1, 2, 'VIP-001', 1200000, 'sold', '2024-06-01 10:00:00'),
(2, 1, 2, 'VIP-002', 1200000, 'sold', '2024-06-01 10:00:00'),
(3, 1, 3, 'STANDARD-001', 500000, 'sold', '2024-06-02 14:30:00'),
(4, 1, 4, 'STANDARD-002', 500000, 'sold', '2024-06-03 09:15:00'),
(5, 1, 4, 'STANDARD-003', 500000, 'sold', '2024-06-03 09:15:00'),
(6, 1, NULL, 'STANDARD-004', 500000, 'available', NULL),
(7, 1, NULL, 'STANDARD-005', 500000, 'available', NULL),
(8, 1, NULL, 'VIP-003', 1200000, 'available', NULL),

-- Event 2 - Tech Conference
(9, 2, 2, 'EARLY-001', 300000, 'sold', '2024-07-01 11:00:00'),
(10, 2, 3, 'EARLY-002', 300000, 'sold', '2024-07-02 16:45:00'),
(11, 2, 4, 'EARLY-003', 300000, 'sold', '2024-07-03 13:20:00'),
(12, 2, NULL, 'EARLY-004', 300000, 'available', NULL),
(13, 2, NULL, 'EARLY-005', 300000, 'available', NULL),

-- Event 3 - Football Championship
(14, 3, 2, 'NORTH-001', 200000, 'sold', '2024-05-15 12:00:00'),
(15, 3, 3, 'NORTH-002', 200000, 'sold', '2024-05-16 15:30:00'),
(16, 3, 4, 'SOUTH-001', 200000, 'sold', '2024-05-17 10:15:00'),

-- Event 4 - Art Exhibition
(17, 4, 2, 'GENERAL-001', 100000, 'sold', '2024-08-01 09:00:00'),
(18, 4, 3, 'GENERAL-002', 100000, 'sold', '2024-08-02 14:00:00'),
(19, 4, NULL, 'GENERAL-003', 100000, 'available', NULL),
(20, 4, NULL, 'GENERAL-004', 100000, 'available', NULL);

-- =========================
-- 7. PAYMENTS (Thanh toán)
-- =========================
INSERT INTO payments (id, ticket_id, user_id, amount, payment_method, status, paid_at) VALUES
(1, 1, 2, 1200000, 'credit_card', 'paid', '2024-06-01 10:05:00'),
(2, 2, 2, 1200000, 'credit_card', 'paid', '2024-06-01 10:05:00'),
(3, 3, 3, 500000, 'bank_transfer', 'paid', '2024-06-02 14:35:00'),
(4, 4, 4, 500000, 'momo', 'paid', '2024-06-03 09:20:00'),
(5, 5, 4, 500000, 'momo', 'paid', '2024-06-03 09:20:00'),
(6, 9, 2, 300000, 'credit_card', 'paid', '2024-07-01 11:05:00'),
(7, 10, 3, 300000, 'bank_transfer', 'paid', '2024-07-02 16:50:00'),
(8, 11, 4, 300000, 'momo', 'paid', '2024-07-03 13:25:00'),
(9, 14, 2, 200000, 'credit_card', 'paid', '2024-05-15 12:05:00'),
(10, 15, 3, 200000, 'bank_transfer', 'paid', '2024-05-16 15:35:00'),
(11, 16, 4, 200000, 'momo', 'paid', '2024-05-17 10:20:00'),
(12, 17, 2, 100000, 'credit_card', 'paid', '2024-08-01 09:05:00'),
(13, 18, 3, 100000, 'bank_transfer', 'paid', '2024-08-02 14:05:00');

-- =========================
-- 8. REVIEWS (Đánh giá)
-- =========================
INSERT INTO reviews (id, event_id, user_id, rating, name, email, phone, content, created_at) VALUES
(1, 1, 2, 5, 'John Doe', 'john@email.com', '0987654321', 'Sự kiện âm nhạc tuyệt vời! Các nghệ sĩ biểu diễn rất hay và không gian tổ chức chuyên nghiệp.', '2024-07-16 10:00:00'),
(2, 1, 3, 4, 'Jane Smith', 'jane@email.com', '0912345678', 'Rất thích sự kiện này. Chỉ có điều giá vé hơi cao một chút.', '2024-07-16 14:30:00'),
(3, 1, 4, 5, 'Trịnh Đình Hiệp', 'dinhhiep@gmail.com', '0977309945', 'hay', '2024-07-16 16:45:00'),
(4, 2, 2, 5, 'John Doe', 'john@email.com', '0987654321', 'Hội nghị công nghệ rất bổ ích. Học được nhiều kiến thức mới về AI và Blockchain.', '2024-08-21 09:00:00'),
(5, 2, 3, 4, 'Jane Smith', 'jane@email.com', '0912345678', 'Nội dung chất lượng cao, diễn giả chuyên nghiệp. Recommend!', '2024-08-21 11:30:00'),
(6, 3, 2, 3, 'John Doe', 'john@email.com', '0987654321', 'Trận đấu hay nhưng chất lượng âm thanh chưa tốt.', '2024-07-01 22:00:00'),
(7, 3, 3, 4, 'Jane Smith', 'jane@email.com', '0912345678', 'Không khí sôi động, trận đấu hấp dẫn.', '2024-07-01 22:15:00'),
(8, 4, 2, 5, 'John Doe', 'john@email.com', '0987654321', 'Triển lãm nghệ thuật đương đại rất ấn tượng. Các tác phẩm có ý nghĩa sâu sắc.', '2024-09-11 15:00:00'),
(9, 4, 3, 4, 'Jane Smith', 'jane@email.com', '0912345678', 'Không gian triển lãm đẹp, tác phẩm đa dạng.', '2024-09-12 10:30:00'),
(10, 5, 2, 5, 'John Doe', 'john@email.com', '0987654321', 'Cuộc thi startup rất thú vị. Có nhiều ý tưởng kinh doanh sáng tạo.', '2024-10-06 12:00:00');

-- =========================
-- 9. SUPPORT TICKETS (Ticket hỗ trợ)
-- =========================
INSERT INTO support_tickets (id, user_id, subject, message, status, admin_response, created_at, updated_at) VALUES
(1, 2, 'Vấn đề về vé', 'Tôi đã mua vé nhưng chưa nhận được email xác nhận. Vui lòng kiểm tra giúp tôi.', 'open', NULL, '2024-06-05 10:00:00', '2024-06-05 10:00:00'),
(2, 3, 'Hoàn vé', 'Tôi muốn hoàn vé cho sự kiện Tech Conference vì có việc đột xuất không thể tham dự.', 'in_progress', 'Chúng tôi đang xử lý yêu cầu hoàn vé của bạn. Sẽ liên hệ lại trong 24h.', '2024-07-15 14:30:00', '2024-07-15 16:00:00'),
(3, 4, 'Thay đổi thông tin', 'Tôi muốn thay đổi số điện thoại trong thông tin đăng ký.', 'resolved', 'Đã cập nhật số điện thoại mới cho bạn.', '2024-08-01 09:15:00', '2024-08-01 11:30:00'),
(4, 2, 'Kỹ thuật', 'Website không thể thanh toán bằng thẻ tín dụng. Lỗi 500 Internal Server Error.', 'open', NULL, '2024-08-10 16:45:00', '2024-08-10 16:45:00'),
(5, 3, 'Chuyển vé', 'Tôi muốn chuyển vé cho người khác tham dự sự kiện.', 'closed', 'Đã hướng dẫn cách chuyển vé qua email.', '2024-09-05 11:20:00', '2024-09-05 15:45:00');

-- =========================
-- THÔNG TIN ĐĂNG NHẬP TEST
-- =========================
/*
ADMIN ACCOUNT:
- Email: admin@event.com
- Password: password (đã hash)
- Role: admin

USER ACCOUNTS:
- Email: john@email.com / Password: password
- Email: jane@email.com / Password: password  
- Email: dinhhiep@gmail.com / Password: password
- Email: manager@event.com / Password: password (Role: manager)

TEST DATA SUMMARY:
- 5 users (1 admin, 1 manager, 3 users)
- 6 categories
- 6 venues
- 6 events (1 completed, 5 upcoming)
- 6 artists in lineup
- 20 tickets (13 sold, 7 available)
- 13 payments
- 10 reviews
- 5 support tickets

API ENDPOINTS TO TEST:
- GET /admin/dashboard - Thống kê tổng quan
- GET /admin/events - Quản lý sự kiện
- GET /admin/users - Quản lý người dùng
- GET /admin/tickets - Quản lý vé
- GET /admin/reviews - Quản lý đánh giá
- GET /admin/support-tickets - Quản lý hỗ trợ
- GET /events - Danh sách sự kiện
- GET /events/1 - Chi tiết sự kiện
- GET /reviews?event_id=1 - Đánh giá sự kiện
- GET /user-tickets?user_id=2 - Vé của user
*/
