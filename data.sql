-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vue_todo
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `artists`
--

DROP TABLE IF EXISTS `artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `bio` text,
  `avatar_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` VALUES (1,'Taylor Swift','Pop singer',NULL),(2,'Ed Sheeran','Acoustic artist',NULL);
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Music','Các sự kiện âm nhạc, concert, festival'),(2,'Technology','Hội nghị công nghệ, workshop, seminar'),(3,'Sports','Các sự kiện thể thao, giải đấu');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_lineup`
--

DROP TABLE IF EXISTS `event_lineup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_lineup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `artist_id` int NOT NULL,
  `performance_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `artist_id` (`artist_id`),
  CONSTRAINT `event_lineup_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `event_lineup_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_lineup`
--

LOCK TABLES `event_lineup` WRITE;
/*!40000 ALTER TABLE `event_lineup` DISABLE KEYS */;
INSERT INTO `event_lineup` VALUES (1,1,1,'2024-07-15 20:00:00'),(2,1,2,'2024-07-15 21:00:00');
/*!40000 ALTER TABLE `event_lineup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`),
  CONSTRAINT `events_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Summer Music Festival 2024','Lễ hội âm nhạc mùa hè với nghệ sĩ quốc tế.',1,1,'2025-12-15 19:00:00','2026-07-15 23:00:00',1,NULL,'upcoming'),(2,'Tech Conference 2024','Hội nghị công nghệ lớn nhất năm.',2,2,'2024-08-20 09:00:00','2024-08-20 17:00:00',1,NULL,'active'),(3,'Football Final','Chung kết giải bóng đá.',3,1,'2024-06-30 19:30:00','2024-06-30 21:30:00',2,NULL,'ended'),(4,'Acoustic Night Live','Đêm nhạc acoustic ấm cúng với các nghệ sĩ trẻ.',1,1,'2024-10-10 19:00:00','2024-10-10 21:30:00',1,NULL,'upcoming'),(5,'AI & Data Summit','Hội nghị về Trí tuệ nhân tạo và Dữ liệu lớn.',2,2,'2024-11-05 08:30:00','2024-11-05 17:30:00',1,NULL,'upcoming'),(6,'City Marathon','Giải chạy Marathon thường niên của thành phố.',3,2,'2024-12-01 06:00:00','2024-12-01 12:00:00',1,NULL,'upcoming'),(7,'Tech Startup Demo Day','Ngày demo sản phẩm cho các startup công nghệ.',2,1,'2024-12-15 13:00:00','2024-12-15 18:00:00',1,NULL,'upcoming'),(8,'New Year Concert 2025','Đêm nhạc chào năm mới với nhiều nghệ sĩ nổi tiếng.',1,1,'2025-12-31 20:00:00','2026-01-01 00:30:00',1,NULL,'upcoming');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (3,13,4,1200000.00,'credit','paid','2025-10-29 20:33:10'),(4,14,4,1200000.00,'credit','paid','2025-10-29 20:36:41'),(5,15,4,1200000.00,'credit','paid','2025-10-29 21:09:15'),(6,16,4,1200000.00,'bank','paid','2025-10-29 21:15:09'),(7,17,4,300000.00,'credit','paid','2025-10-29 22:06:52');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `content` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,2,'john@email.com','0987654321','John Doe',5,'Sự kiện âm nhạc tuyệt vời!','2025-10-29 20:24:28'),(2,2,3,'jane@email.com','0912345678','Jane Smith',4,'Hội nghị công nghệ rất bổ ích.','2025-10-29 20:24:28');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_tickets`
--

DROP TABLE IF EXISTS `support_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int DEFAULT NULL,
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
  CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_tickets`
--

LOCK TABLES `support_tickets` WRITE;
/*!40000 ALTER TABLE `support_tickets` DISABLE KEYS */;
INSERT INTO `support_tickets` VALUES (1,4,1,'qr_invalid','QR','a@gmail.com','2','á','Screenshot 2025-10-24 105012.png','open','2025-11-02 00:51:19',NULL);
/*!40000 ALTER TABLE `support_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `seat_number` int DEFAULT NULL,
  `Type` enum('student','standard','vip') DEFAULT 'standard',
  `price` decimal(10,2) NOT NULL,
  `status` enum('available','reserved','sold') DEFAULT 'available',
  `qr_code` varchar(255) DEFAULT NULL,
  `purchased_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (10,1,2,1,'A',1200000.00,'sold','QRAAA001','2024-06-01 10:00:00'),(11,1,3,2,'B',500000.00,'reserved','QRAAA002','2024-06-02 14:30:00'),(12,2,NULL,1,'A',300000.00,'available',NULL,NULL),(13,1,4,2,'A',1200000.00,'sold','QR17617447897690','2025-10-29 20:33:10'),(14,1,4,3,'A',1200000.00,'sold','QR17617450012520','2025-10-29 20:36:41'),(15,1,4,4,'A',1200000.00,'sold','QR17617469549640','2025-10-29 21:09:15'),(16,1,4,5,'A',1200000.00,'sold','QR17617473087700','2025-10-29 21:15:09'),(17,2,4,1,'A',300000.00,'sold','QR17617504120730','2025-10-29 22:06:52');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@event.com','$2b$10$DUMMYHASH','Admin System','0123456789',NULL,'admin','2025-10-29 20:24:28'),(2,'john_doe','john@email.com','$2b$10$DUMMYHASH','John Doe','0987654321',NULL,'user','2025-10-29 20:24:28'),(3,'jane_smith','jane@email.com','$2b$10$DUMMYHASH','Jane Smith','0912345678',NULL,'user','2025-10-29 20:24:28'),(4,'A','voanhtuan0504@gmail.com','$2b$10$aYSnWn7vf.5ImK99ofbnHeAvNTqGmdKn6Psq5ijdxQCpA4lH54Bz.',NULL,NULL,NULL,'user','2025-10-29 20:32:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `description` text,
  `capacity` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (1,'Nhà hát Lớn Hà Nội','1 Tràng Tiền, Hoàn Kiếm, Hà Nội','Nhà hát lớn nhất Hà Nội',1000,NULL),(2,'Trung tâm Hội nghị Quốc gia','1 Đại lộ Thăng Long, Hà Nội','Hội nghị quốc gia',2000,NULL);
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-02 21:18:14
