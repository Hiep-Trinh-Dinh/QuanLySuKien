-- =========================
-- BẢNG NGHỆ SĨ (artists)
-- =========================
CREATE TABLE `artists` (
  `id` int NOT NULL AUTO_INCREMENT,             -- Mã nghệ sĩ (PK)
  `name` varchar(100) NOT NULL,                 -- Tên nghệ sĩ
  `bio` text,                                   -- Tiểu sử
  `avatar_url` varchar(255) DEFAULT NULL,       -- Ảnh đại diện
  PRIMARY KEY (`id`)
);

INSERT INTO `artists` VALUES (1,'Taylor Swift','Pop singer',NULL),(2,'Ed Sheeran','Acoustic artist',NULL);

-- =========================
-- BẢNG DANH MỤC SỰ KIỆN (categories)
-- =========================
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,              -- Mã danh mục (PK)
  `name` varchar(100) NOT NULL UNIQUE,           -- Tên danh mục
  `description` text,                            -- Mô tả
  PRIMARY KEY (`id`)
);

INSERT INTO `categories` VALUES (1,'Music','Các sự kiện âm nhạc, concert, festival'),(2,'Technology','Hội nghị công nghệ, workshop, seminar'),(3,'Sports','Các sự kiện thể thao, giải đấu');

-- =========================
-- BẢNG ĐỊA ĐIỂM (venues)
-- =========================
CREATE TABLE `venues` (
  `id` int NOT NULL AUTO_INCREMENT,               -- Mã địa điểm (PK)
  `name` varchar(100) NOT NULL,                   -- Tên địa điểm
  `address` varchar(255) NOT NULL,                -- Địa chỉ
  `description` text,                             -- Mô tả
  `capacity` int DEFAULT NULL,                    -- Sức chứa
  `image_url` varchar(255) DEFAULT NULL,          -- Ảnh địa điểm
  PRIMARY KEY (`id`)
);

INSERT INTO `venues` VALUES (1,'Nhà hát Lớn Hà Nội','1 Tràng Tiền, Hoàn Kiếm, Hà Nội','Nhà hát lớn nhất Hà Nội',1000,NULL),(2,'Trung tâm Hội nghị Quốc gia','1 Đại lộ Thăng Long, Hà Nội','Hội nghị quốc gia',2000,NULL);

-- =========================
-- BẢNG NGƯỜI DÙNG (users)
-- =========================
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

INSERT INTO `users` VALUES 
(1,'admin','admin@event.com','$2b$10$DUMMYHASH','Admin System','0123456789',NULL,'admin','2025-10-29 20:24:28'),
(2,'john_doe','john@email.com','$2b$10$DUMMYHASH','John Doe','0987654321',NULL,'user','2025-10-29 20:24:28'),
(3,'jane_smith','jane@email.com','$2b$10$DUMMYHASH','Jane Smith','0912345678',NULL,'user','2025-10-29 20:24:28'),
(4,'A','voanhtuan0504@gmail.com','$2b$10$aYSnWn7vf.5ImK99ofbnHeAvNTqGmdKn6Psq5ijdxQCpA4lH54Bz.',NULL,NULL,NULL,'user','2025-10-29 20:32:04');

-- =========================
-- BẢNG SỰ KIỆN (events)
-- =========================
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text,
  `category_id` int DEFAULT NULL,
  `venue_id` int DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `created_by` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('upcoming','active','ended','cancelled') DEFAULT 'upcoming',
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `venue_id` (`venue_id`),
  KEY `created_by` (`created_by`),
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
);

INSERT INTO `events` VALUES
(1,'Summer Music Festival 2024','Lễ hội âm nhạc mùa hè với nghệ sĩ quốc tế.',1,1,'2025-12-15 19:00:00','2026-07-15 23:00:00',1,NULL,'upcoming'),
(2,'Tech Conference 2024','Hội nghị công nghệ lớn nhất năm.',2,2,'2024-08-20 09:00:00','2024-08-20 17:00:00',1,NULL,'active'),
(3,'Football Final','Chung kết giải bóng đá.',3,1,'2024-06-30 19:30:00','2024-06-30 21:30:00',2,NULL,'ended'),
(4,'Acoustic Night Live','Đêm nhạc acoustic ấm cúng với các nghệ sĩ trẻ.',1,1,'2024-10-10 19:00:00','2024-10-10 21:30:00',1,NULL,'upcoming'),
(5,'AI & Data Summit','Hội nghị về Trí tuệ nhân tạo và Dữ liệu lớn.',2,2,'2024-11-05 08:30:00','2024-11-05 17:30:00',1,NULL,'upcoming'),
(6,'City Marathon','Giải chạy Marathon thường niên của thành phố.',3,2,'2024-12-01 06:00:00','2024-12-01 12:00:00',1,NULL,'upcoming'),
(7,'Tech Startup Demo Day','Ngày demo sản phẩm cho các startup công nghệ.',2,1,'2024-12-15 13:00:00','2024-12-15 18:00:00',1,NULL,'upcoming'),
(8,'New Year Concert 2025','Đêm nhạc chào năm mới với nhiều nghệ sĩ nổi tiếng.',1,1,'2025-12-31 20:00:00','2026-01-01 00:30:00',1,NULL,'upcoming');

-- =========================
-- BẢNG VÉ (tickets)
-- =========================
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `seat_number` int DEFAULT NULL,
  `Type` varchar(20) DEFAULT 'standard',              -- loại vé mềm dẻo, có thể là A/B/C/VIP/v.v
  `price` decimal(10,2) NOT NULL,
  `status` enum('available','reserved','sold') DEFAULT 'available',
  `qr_code` text DEFAULT NULL,
  `purchased_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

INSERT INTO `tickets` VALUES 
(10,1,2,1,'A',1200000.00,'sold','QRAAA001','2024-06-01 10:00:00'),(11,1,3,2,'B',500000.00,'reserved','QRAAA002','2024-06-02 14:30:00'),
(12,2,NULL,1,'A',300000.00,'available',NULL,NULL),
(13,1,4,2,'A',1200000.00,'sold','QR17617447897690','2025-10-29 20:33:10'),
(14,1,4,3,'A',1200000.00,'sold','QR17617450012520','2025-10-29 20:36:41'),
(15,1,4,4,'A',1200000.00,'sold','QR17617469549640','2025-10-29 21:09:15'),
(16,1,4,5,'A',1200000.00,'sold','QR17617473087700','2025-10-29 21:15:09'),
(17,2,4,1,'A',300000.00,'sold','QR17617504120730','2025-10-29 22:06:52');

-- =========================
-- BẢNG LINEUP (event_lineup)
-- =========================
CREATE TABLE `event_lineup` (
  `id` int NOT NULL AUTO_INCREMENT,         -- Mã dòng lineup (PK)
  `event_id` int NOT NULL,                  -- Mã sự kiện (FK)
  `artist_id` int NOT NULL,                 -- Mã nghệ sĩ (FK)
  `performance_time` datetime DEFAULT NULL, -- Thời gian biểu diễn
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `artist_id` (`artist_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`)
);

INSERT INTO `event_lineup` VALUES (1,1,1,'2024-07-15 20:00:00'),(2,1,2,'2024-07-15 21:00:00');

-- =========================
-- BẢNG REVIEW (reviews)
-- =========================
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,              -- Mã review (PK)
  `event_id` int NOT NULL,                       -- Sự kiện đánh giá (FK)
  `user_id` int DEFAULT NULL,                    -- (nullable) Người đánh giá (FK)
  `email` varchar(100) NOT NULL,                 -- Email người đánh giá (unique)
  `phone` varchar(20) DEFAULT NULL,              -- SĐT người đánh giá
  `name` varchar(100) DEFAULT NULL,              -- Tên người đánh giá
  `rating` int NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Số sao
  `content` text,                                -- Nội dung nhận xét
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP, -- Ngày giờ tạo
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

INSERT INTO `reviews` VALUES 
(1,1,2,'john@email.com','0987654321','John Doe',5,'Sự kiện âm nhạc tuyệt vời!','2025-10-29 20:24:28'),
(2,2,3,'jane@email.com','0912345678','Jane Smith',4,'Hội nghị công nghệ rất bổ ích.','2025-10-29 20:24:28');

-- =========================
-- BẢNG THANH TOÁN (payments)
-- =========================
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NOT NULL,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

INSERT INTO `payments` VALUES 
(3,13,4,1200000.00,'credit','paid','2025-10-29 20:33:10'),
(4,14,4,1200000.00,'credit','paid','2025-10-29 20:36:41'),
(5,15,4,1200000.00,'credit','paid','2025-10-29 21:09:15'),
(6,16,4,1200000.00,'bank','paid','2025-10-29 21:15:09'),
(7,17,4,300000.00,'credit','paid','2025-10-29 22:06:52');

-- =========================
-- BẢNG HỖ TRỢ KHÁCH HÀNG (support_tickets)
-- =========================
CREATE TABLE `support_tickets` (
  `id` int NOT NULL AUTO_INCREMENT,                -- Mã ticket hỗ trợ (PK)
  `user_id` int NOT NULL,                          -- User gửi ticket (FK)
  `event_id` int DEFAULT NULL,                     -- Sự kiện liên quan
  `issue_type` enum('qr_invalid','payment','bug_report','feature_request','other') NOT NULL,
  `subject` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `attachment` varchar(500) DEFAULT NULL,
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

INSERT INTO `support_tickets` VALUES (1,4,1,'qr_invalid','QR','a@gmail.com','2','á','Screenshot 2025-10-24 105012.png','open','2025-11-02 00:51:19',NULL);