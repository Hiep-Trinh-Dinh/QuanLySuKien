-- =========================
-- CHỌN DATABASE VÀ TẠO BẢNG
-- =========================

-- =========================
-- BẢNG NGƯỜI DÙNG (User)
-- =========================
CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,    -- Mã tự tăng, khóa chính duy nhất
    username        VARCHAR(50) NOT NULL UNIQUE,       -- Tên đăng nhập, không trùng lặp
    email           VARCHAR(100) NOT NULL UNIQUE,      -- Email người dùng, không trùng lặp
    password   VARCHAR(255) NOT NULL,             -- Mật khẩu
    full_name       VARCHAR(100),                      -- Họ và tên đầy đủ người dùng
    phone           VARCHAR(20),                       -- Số điện thoại
    avatar_url      VARCHAR(255),                      -- Đường dẫn ảnh đại diện
    role            ENUM('user', 'admin') DEFAULT 'user', -- Vai trò: user hoặc admin
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP -- Thời điểm tạo tài khoản
);

-- =========================
-- BẢNG DANH MỤC SỰ KIỆN (Category)
-- =========================
CREATE TABLE categories (
    id          INT AUTO_INCREMENT PRIMARY KEY,    -- Mã danh mục (PK)
    name        VARCHAR(100) NOT NULL UNIQUE,      -- Tên danh mục (ví dụ: Music, Sport, ...)
    description TEXT                               -- Mô tả về danh mục
);

-- =========================
-- BẢNG ĐỊA ĐIỂM TỔ CHỨC (Venue)
-- =========================
CREATE TABLE venues (
    id              INT AUTO_INCREMENT PRIMARY KEY,    -- Mã địa điểm (PK)
    name            VARCHAR(100) NOT NULL,             -- Tên địa điểm tổ chức
    address         VARCHAR(255) NOT NULL,             -- Địa chỉ đầy đủ
    description     TEXT,                              -- Mô tả thêm về địa điểm
    capacity        INT,                               -- Sức chứa tối đa
    image_url       VARCHAR(255)                       -- Ảnh địa điểm (nếu có)
);

-- =========================
-- BẢNG SỰ KIỆN (Event)
-- =========================
CREATE TABLE events (
    id              INT AUTO_INCREMENT PRIMARY KEY,        -- Mã sự kiện (PK)
    title           VARCHAR(150) NOT NULL,                 -- Tiêu đề/tên sự kiện
    description     TEXT,                                  -- Mô tả chi tiết sự kiện
    category_id     INT,                                   -- Khóa ngoại tới danh mục sự kiện
    venue_id        INT,                                   -- Khóa ngoại địa điểm tổ chức
    start_time      DATETIME NOT NULL,                     -- Ngày giờ bắt đầu sự kiện
    end_time        DATETIME NOT NULL,                     -- Ngày giờ kết thúc sự kiện
    created_by      INT,                                   -- Tạo bởi admin (user_id)
    image_url       VARCHAR(255),                          -- Ảnh đại diện sự kiện
    status          ENUM('upcoming','active','ended','cancelled') DEFAULT 'upcoming', -- Trạng thái sự kiện
    FOREIGN KEY (category_id) REFERENCES categories(id),   -- Liên kết danh mục
    FOREIGN KEY (venue_id) REFERENCES venues(id),          -- Liên kết địa điểm
    FOREIGN KEY (created_by) REFERENCES users(id)          -- Liên kết người tạo (admin)
);

-- =========================
-- BẢNG VÉ (Ticket)
-- =========================
CREATE TABLE tickets (
    id              INT AUTO_INCREMENT PRIMARY KEY,    -- Mã vé (PK)
    event_id        INT NOT NULL,                      -- Mã sự kiện (FK)
    user_id         INT,                               -- Người sở hữu (nullable, nếu chưa bán)
    seat_number     INT,                               -- Số ghế (nếu quy định theo ghế)
    Type            VARCHAR(20) DEFAULT 'standard',    -- loai ve (student|standard|vip)
    price           DECIMAL(10,2) NOT NULL,            -- Giá vé
    status          ENUM('available','reserved','sold') DEFAULT 'available', -- Tình trạng vé: có sẵn, giữ chỗ, đã bán
    qr_code         VARCHAR(255),                      -- Mã QR cho vé điện tử
    purchased_at    DATETIME,                          -- Thời điểm mua (nếu đã mua)
    FOREIGN KEY (event_id) REFERENCES events(id),      -- Liên kết sự kiện
    FOREIGN KEY (user_id) REFERENCES users(id)         -- Liên kết người mua
);

-- =========================
-- BẢNG NGHỆ SĨ VÀ LINEUP
-- =========================
CREATE TABLE artists (
    id          INT AUTO_INCREMENT PRIMARY KEY,    -- Mã nghệ sĩ (PK)
    name        VARCHAR(100) NOT NULL,             -- Tên nghệ sĩ
    bio         TEXT,                              -- Tiểu sử nghệ sĩ
    avatar_url  VARCHAR(255)                       -- Ảnh đại diện nghệ sĩ
);

-- Sự kiện - nghệ sĩ (nhiều - nhiều, có field thời gian diễn)
CREATE TABLE event_lineup (
    id                  INT AUTO_INCREMENT PRIMARY KEY,    -- Mã dòng lineup (PK)
    event_id            INT NOT NULL,                      -- Sự kiện tham gia (FK)
    artist_id           INT NOT NULL,                      -- Nghệ sĩ biểu diễn (FK)
    performance_time    DATETIME,                          -- Thời gian biểu diễn
    FOREIGN KEY (event_id) REFERENCES events(id),          -- Liên kết sự kiện
    FOREIGN KEY (artist_id) REFERENCES artists(id)         -- Liên kết nghệ sĩ
);

-- =========================
-- BẢNG REVIEW ĐÁNH GIÁ
-- =========================
CREATE TABLE reviews (
    id              INT AUTO_INCREMENT PRIMARY KEY,    -- Mã review (PK)
    event_id        INT NOT NULL,                      -- Sự kiện đánh giá (FK)
    user_id         INT,                      -- Người đánh giá (FK)
    email           VARCHAR(100) NOT NULL UNIQUE,                     -- Email người đánh giá (nullable)
    phone           VARCHAR(20),                      -- Số điện thoại người đánh giá (nullable)
    name            VARCHAR(100),                      -- Tên người đánh giá (nullable)
    rating          INT CHECK (rating >= 1 AND rating <= 5), -- Số sao đánh giá (1-5)
    content         TEXT,                              -- Nội dung nhận xét
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,-- Ngày giờ tạo đánh giá
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- BẢNG THANH TOÁN (PAYMENT)
-- =========================
CREATE TABLE payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,    -- Mã giao dịch thanh toán (PK)
    ticket_id       INT NOT NULL,                      -- Vé đã thanh toán (FK)
    user_id         INT NOT NULL,                      -- Người thanh toán (FK)
    amount          DECIMAL(10,2) NOT NULL,            -- Số tiền thanh toán
    payment_method  VARCHAR(50),                       -- Phương thức: momo, banking, cash, ...
    status          ENUM('pending','paid','failed','refunded') DEFAULT 'pending', -- Trạng thái giao dịch
    paid_at         DATETIME,                          -- Ngày giờ thanh toán
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- BẢNG HỖ TRỢ KHÁCH HÀNG
-- =========================
CREATE TABLE support_tickets (
    id              INT AUTO_INCREMENT PRIMARY KEY,    -- Mã ticket hỗ trợ (PK)
    user_id         INT NOT NULL,                      -- Người gửi (FK)
    subject         VARCHAR(255) NOT NULL,             -- Chủ đề
    message         TEXT NOT NULL,                     -- Nội dung hỗ trợ
    status          ENUM('open','in_progress','resolved','closed') DEFAULT 'open', -- Trạng thái xử lý yêu cầu
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,-- Ngày gửi
    resolved_at     DATETIME,                          -- Ngày xử lý xong (nullable)
    FOREIGN KEY (user_id) REFERENCES users(id)
);