-- Schema for EST Connect minimal demo
-- Run this in your MySQL server (e.g., via phpMyAdmin or mysql CLI)

CREATE DATABASE IF NOT EXISTS `est_connect` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `est_connect`;

-- Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(32) NOT NULL DEFAULT 'student',
  `avatar` VARCHAR(512) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `followers` INT DEFAULT 0,
  `following` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Posts
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `content` TEXT NOT NULL,
  `image` VARCHAR(512) DEFAULT NULL,
  `likes` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Follows mapping (who follows whom)
CREATE TABLE IF NOT EXISTS `follows` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `follower_id` INT UNSIGNED NOT NULL,
  `following_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`follower_id`, `following_id`),
  FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Post likes mapping
CREATE TABLE IF NOT EXISTS `likes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`post_id`, `user_id`),
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
