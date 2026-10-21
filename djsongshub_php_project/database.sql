-- STM Music Portal Database Schema (PHP 8.3 / 8.4 / 8.5)
-- Compatible with MySQL 8.0+, MariaDB 10.5+

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS downloads_log;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS admin_users;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NULL,
    badge VARCHAR(30) DEFAULT NULL,
    is_new TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cat_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    artist VARCHAR(150) NOT NULL DEFAULT 'DJ Surendra',
    release_year VARCHAR(10) DEFAULT '2026',
    cover_art VARCHAR(255) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_album_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    role ENUM('singer', 'dj', 'both') DEFAULT 'dj',
    bio TEXT NULL,
    image VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_artist_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tag_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    album_id INT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    remixer VARCHAR(150) NOT NULL DEFAULT 'DJ Surendra',
    singer VARCHAR(255) NOT NULL DEFAULT 'Various Artists',
    bitrate VARCHAR(30) DEFAULT '320 Kbps',
    file_size VARCHAR(30) DEFAULT '8.1 MB',
    duration VARCHAR(30) DEFAULT '4:05',
    duration_sec INT DEFAULT 245,
    hits INT UNSIGNED DEFAULT 0,
    release_year VARCHAR(10) DEFAULT '2026',
    release_date DATE NULL,
    tempo VARCHAR(100) DEFAULT '138 BPM (Heavy Dance Drop)',
    file_path VARCHAR(255) NOT NULL,
    ringtone_path VARCHAR(255) NULL,
    artwork_path VARCHAR(255) NULL,
    tags TEXT NULL,
    keywords TEXT NULL,
    description TEXT NULL,
    lyrics LONGTEXT NULL,
    is_hot TINYINT(1) DEFAULT 0,
    is_trending TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_hits (hits),
    INDEX idx_created (created_at),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE downloads_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    song_id INT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255) NULL,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_song (song_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_settings (
    setting_key VARCHAR(64) PRIMARY KEY,
    setting_value TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_panels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NULL,
    panel_type ENUM('songs', 'categories', 'notice', 'artists', 'banner', 'quick_links') DEFAULT 'songs',
    placement ENUM('home_top', 'home_middle', 'home_bottom', 'all') DEFAULT 'home_middle',
    sort_order INT DEFAULT 1,
    is_active TINYINT(1) DEFAULT 1,
    theme VARCHAR(30) DEFAULT 'emerald',
    badge VARCHAR(50) DEFAULT 'HOT',
    icon VARCHAR(50) DEFAULT 'flame',
    item_limit INT DEFAULT 4,
    filter_category VARCHAR(150) NULL,
    custom_html TEXT NULL,
    action_url VARCHAR(255) NULL,
    action_text VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2y$12$e0MYzX1HqQxI5V3VfO1/0OGsV2n8iXJ7/3uY1hU6a3l8R4A5w9GqS', 'admin@djsongshub.in'); -- Password: admin123 (change upon deploy)

INSERT INTO categories (id, name, slug, description, badge, is_new) VALUES
(1, 'Navratri & Bhakti Special Dj Songs', 'navratri-bhakti-special-dj-songs', 'Pachra DJ remix, Devi Geet bass vibration', 'NEW', 1),
(2, 'Electro House & EDM Festival Edits', 'electro-house-edm-festival-edits', 'Psytrance drops, festival horn mixers', 'HOT', 0),
(3, 'Trending Ringtones & 30s Audio Cuts', 'trending-ringtones-30s-audio-cuts', 'High-volume loud ringtones, dialogue cuts', 'VIRAL', 0),
(4, 'Latest Roadshow 2026', 'latest-roadshow-2026', 'Competition Roadshow DJ Tracks with high bass', '2026', 1),
(5, 'Bhojpuri Club & Hard Bass Remixes', 'bhojpuri-club-hard-bass-remixes', 'Trending Bhojpuri dance tracks & dholki drops', NULL, 0),
(6, 'Haryanvi Bass Boosted Dance Mix', 'haryanvi-bass-boosted-dance-mix', 'Heavy car subwoofer mix & Desi roadshow anthems', NULL, 0);

INSERT INTO songs (id, category_id, title, slug, remixer, singer, bitrate, file_size, duration, duration_sec, hits, release_year, release_date, tempo, file_path, tags, keywords, description, is_hot, is_trending) VALUES
(1, 5, 'Bhojpuri DJ Remix (Hard Bass Kick 2026)', 'bhojpuri-dj-remix-hard-bass-kick-2026', 'DJ Tezz 2', 'Various Artists', '320 Kbps', '8.1 MB', '4:05', 245, 89450, '2026', '2026-10-12', '140 BPM (Heavy Dance Drop)', 'bhojpuri_hard_kick.mp3', 'Bhojpuri,DJTezz,HardBass,Dholki', 'bhojpuri dj remix 2026, dj tezz download', 'Master audio 320kbps mix.', 1, 1),
(2, 6, 'Teri Aakhya Ka Yo Kajal (Heavy Car Subwoofer Mix)', 'teri-aakhya-ka-yo-kajal-heavy-car-subwoofer-mix', 'DJ Surendra x DJ Akhil', 'Sapna Choudhary & DC Madana', '320 Kbps', '7.6 MB', '3:15', 195, 41200, '2026', '2026-10-02', '138 BPM (Heavy Dance Drop)', 'teri_aakhya_car_subwoofer.mp3', 'Haryanvi,SapnaChoudhary,CarSubwoofer,DJSurendra', 'teri aakhya ka yo kajal dj mix, car bass', 'Tuned for subwoofers between 32Hz-55Hz.', 1, 1);

INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'DjSongsHub.In All In One'),
('site_subtitle', 'All In One DJ Remix & High Speed MP3 Portal'),
('admin_email', 'admin@djsongshub.in'),
('adsense_enabled', '1'),
('adsense_pub_id', 'pub-9482710398402819'),
('notice_ticker', 'UPDATES: DjSongsHub.In All In One Official 320Kbps HQ MP3 Portal - All DJ Remixes, Dholki Mix & Hard Bass Available - Fast Cloud CDN Active');
