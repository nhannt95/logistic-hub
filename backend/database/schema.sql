-- ============================================================================
-- Logistics-Hub — MySQL schema
-- Target: MySQL 8.0+  ·  Engine: InnoDB  ·  Charset: utf8mb4
-- ============================================================================

-- Optional: create database
-- CREATE DATABASE IF NOT EXISTS logistics_hub
--   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE logistics_hub;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop in reverse dependency order (idempotent)
DROP TABLE IF EXISTS `plan_evaluations`;
DROP TABLE IF EXISTS `plan_containers`;
DROP TABLE IF EXISTS `plans`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `drivers`;
DROP TABLE IF EXISTS `vehicles`;
DROP TABLE IF EXISTS `routes`;
DROP TABLE IF EXISTS `vendors`;
DROP TABLE IF EXISTS `shipping_lines`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. USERS  (đăng nhập + phân quyền)
-- ============================================================================
CREATE TABLE `users` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`       VARCHAR(64)     NOT NULL,
  `name`           VARCHAR(128)    NOT NULL,
  `email`          VARCHAR(128)    NULL,
  `phone`          VARCHAR(32)     NULL,
  `password_hash`  VARCHAR(255)    NOT NULL,
  `role`           ENUM('Điều Độ','Tài Xế','Kế Toán','Giám Đốc') NOT NULL,
  `status`         ENUM('active','locked') NOT NULL DEFAULT 'active',
  `last_login_at`  DATETIME        NULL,
  `created_at`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tài khoản đăng nhập hệ thống';

-- ============================================================================
-- 2. CUSTOMERS  (khách hàng, mã 0001-9999)
-- ============================================================================
CREATE TABLE `customers` (
  `code`            VARCHAR(8)   NOT NULL  COMMENT 'Mã KH 4 chữ số: 0001..9999',
  `name`            VARCHAR(255) NOT NULL  COMMENT 'Tên đầy đủ pháp nhân',
  `short_name`      VARCHAR(64)  NOT NULL  COMMENT 'Tên gọi tắt (vd: ACOM LB)',
  `address`         VARCHAR(255) NULL,
  `tax_code`        VARCHAR(32)  NULL,
  `contact_person`  VARCHAR(128) NULL,
  `phone`           VARCHAR(32)  NULL,
  `email`           VARCHAR(128) NULL,
  `status`          ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`),
  KEY `idx_customers_status` (`status`),
  KEY `idx_customers_short_name` (`short_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data khách hàng';

-- ============================================================================
-- 3. SHIPPING LINES  (hãng tàu)
-- ============================================================================
CREATE TABLE `shipping_lines` (
  `code`        VARCHAR(16)  NOT NULL  COMMENT 'Mã hãng tàu: ANL, MSC...',
  `name`        VARCHAR(128) NOT NULL,
  `status`      ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Hãng tàu (HANG_TAU_LIST)';

-- ============================================================================
-- 4. VENDORS  (cảng, depot, xăng dầu, sửa chữa, đối tác…)
-- ============================================================================
CREATE TABLE `vendors` (
  `code`            VARCHAR(16)  NOT NULL  COMMENT 'VD001..',
  `name`            VARCHAR(255) NOT NULL,
  `type`            ENUM('port','depot','shipping','fuel','maintenance','partner') NOT NULL,
  `contact_person`  VARCHAR(128) NULL,
  `phone`           VARCHAR(32)  NULL,
  `email`           VARCHAR(128) NULL,
  `address`         VARCHAR(255) NULL,
  `tax_code`        VARCHAR(32)  NULL,
  `status`          ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`),
  KEY `idx_vendors_type` (`type`),
  KEY `idx_vendors_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data vendor / đối tác';

-- ============================================================================
-- 5. ROUTES  (tuyến vận chuyển)
-- ============================================================================
CREATE TABLE `routes` (
  `code`             VARCHAR(16)  NOT NULL  COMMENT 'RT001..',
  `from_location`    VARCHAR(128) NOT NULL,
  `to_location`      VARCHAR(128) NOT NULL,
  `distance`         DECIMAL(8,2) NOT NULL DEFAULT 0  COMMENT 'km',
  `estimated_hours`  DECIMAL(5,2) NOT NULL DEFAULT 0  COMMENT 'giờ',
  `standard_price`   DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'VND',
  `note`             TEXT         NULL,
  `status`           ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`),
  KEY `idx_routes_from_to` (`from_location`, `to_location`),
  KEY `idx_routes_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data tuyến vận chuyển';

-- ============================================================================
-- 6. VEHICLES  (đầu kéo / đầu xe)
-- 7. DRIVERS   (tài xế)
-- Vehicles & drivers reference each other → soft refs (VARCHAR, no FK).
-- ============================================================================
CREATE TABLE `vehicles` (
  `code`                  VARCHAR(16)  NOT NULL  COMMENT 'XE001..',
  `plate_number`          VARCHAR(32)  NOT NULL  COMMENT 'Biển số 51C-12345',
  `manufacturer`          VARCHAR(64)  NULL,
  `model`                 VARCHAR(64)  NULL,
  `year`                  SMALLINT     NULL,
  `capacity`              ENUM('20','40','mixed') NOT NULL DEFAULT 'mixed',
  `mooc`                  VARCHAR(32)  NULL  COMMENT 'Mooc gắn cố định',
  `assigned_driver_code`  VARCHAR(16)  NULL  COMMENT 'Soft ref → drivers.code',
  `insurance_expiry`      DATE         NULL,
  `registration_expiry`   DATE         NULL,
  `status`                ENUM('active','inactive','maintenance') NOT NULL DEFAULT 'active',
  `registered_at`         DATE         NULL,
  `created_at`            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`),
  UNIQUE KEY `uq_vehicles_plate` (`plate_number`),
  KEY `idx_vehicles_status` (`status`),
  KEY `idx_vehicles_driver` (`assigned_driver_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data đầu xe';

CREATE TABLE `drivers` (
  `code`                  VARCHAR(16)  NOT NULL  COMMENT 'DR001..',
  `user_id`               BIGINT UNSIGNED NULL  COMMENT 'Nếu tài xế có login → users.id',
  `name`                  VARCHAR(128) NOT NULL,
  `phone`                 VARCHAR(32)  NULL,
  `cccd`                  VARCHAR(20)  NULL,
  `license`               VARCHAR(32)  NULL  COMMENT 'Số bằng lái',
  `license_class`         ENUM('B2','C','D','E','FC') NOT NULL DEFAULT 'FC',
  `license_expiry`        DATE         NULL,
  `address`               VARCHAR(255) NULL,
  `assigned_vehicle_code` VARCHAR(16)  NULL  COMMENT 'Soft ref → vehicles.code',
  `status`                ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `hired_at`              DATE         NULL,
  `created_at`            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`),
  KEY `idx_drivers_status` (`status`),
  KEY `idx_drivers_vehicle` (`assigned_vehicle_code`),
  CONSTRAINT `fk_drivers_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data tài xế';

-- ============================================================================
-- 8. PERMISSIONS  (master quyền)
-- 9. ROLE_PERMISSIONS  (ma trận role × permission)
-- ============================================================================
CREATE TABLE `permissions` (
  `key`          VARCHAR(64)  NOT NULL  COMMENT 'plan.view, fin.edit...',
  `group_name`   VARCHAR(64)  NOT NULL  COMMENT 'Kế hoạch / Container / Tài xế...',
  `label`        VARCHAR(128) NOT NULL,
  `description`  VARCHAR(255) NULL,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`),
  KEY `idx_permissions_group` (`group_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh mục quyền hệ thống';

CREATE TABLE `role_permissions` (
  `role`            ENUM('Điều Độ','Tài Xế','Kế Toán','Giám Đốc') NOT NULL,
  `permission_key`  VARCHAR(64) NOT NULL,
  `granted`         TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`role`, `permission_key`),
  KEY `idx_rp_permission` (`permission_key`),
  CONSTRAINT `fk_rp_permission`
    FOREIGN KEY (`permission_key`) REFERENCES `permissions` (`key`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Ma trận phân quyền theo role';

-- ============================================================================
-- 10. PLANS  (kế hoạch điều độ — entity chính)
-- ============================================================================
CREATE TABLE `plans` (
  `id`                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

  -- Thông tin lệnh
  `ngay_dong_hang`          DATE         NOT NULL,
  `customer_code`           VARCHAR(8)   NULL   COMMENT 'FK customers.code',
  `tuyen_van_chuyen`        VARCHAR(255) NULL   COMMENT 'Free text, hoặc dùng route_code',
  `route_code`              VARCHAR(16)  NULL   COMMENT 'FK routes.code (tùy chọn)',
  `hop_dong`                VARCHAR(64)  NULL,
  `shipping_line_code`      VARCHAR(16)  NULL   COMMENT 'FK shipping_lines.code',
  `booking_bl`              VARCHAR(64)  NULL,
  `tinh_trang`              ENUM('XUẤT','NHẬP','Chuyển tải') NOT NULL,
  `cont_20`                 INT          NOT NULL DEFAULT 0,
  `cont_40`                 INT          NOT NULL DEFAULT 0,
  `tan`                     DECIMAL(10,2) NULL,
  `packing`                 VARCHAR(64)  NULL,
  `etd_eta`                 DATE         NULL,
  `cut_off`                 DATETIME     NULL,

  -- Vận hành cont
  `lay_cont_rong`           VARCHAR(255) NULL,
  `ha_full`                 VARCHAR(255) NULL,
  `cuoc`                    VARCHAR(255) NULL,
  `doi_lenh`                VARCHAR(255) NULL,
  `lay_ha_cont`             VARCHAR(255) NULL,
  `ghi_chu`                 TEXT         NULL,
  `neo`                     VARCHAR(64)  NULL,

  -- Phân công tài xế / phương tiện
  `driver_code`             VARCHAR(16)  NULL  COMMENT 'FK drivers.code',
  `vehicle_code`            VARCHAR(16)  NULL  COMMENT 'FK vehicles.code',
  `dau_keo`                 VARCHAR(32)  NULL  COMMENT 'BKS đầu kéo (cache from vehicle)',
  `mooc`                    VARCHAR(32)  NULL,
  `estimate_completion`     DATETIME     NULL  COMMENT 'Dự kiến hoàn thành',
  `chi_phi_tai_xe`          DECIMAL(15,2) NULL DEFAULT 0,
  `remark`                  TEXT         NULL  COMMENT 'Remark cho điều độ',

  -- Trạng thái tài xế
  `driver_status` ENUM('new','confirmed','picking','picked','delivering','delivered','done')
                            NULL DEFAULT 'new',

  -- Cược cont hàng nhập (7 cols)
  `cuoc_so_tien`            DECIMAL(15,2) NULL,
  `cuoc_ngay_cuoc`          DATE         NULL,
  `cuoc_ngay_thu`           DATE         NULL,
  `cuoc_so_dinh_danh`       VARCHAR(64)  NULL,
  `cuoc_ma`                 VARCHAR(64)  NULL,
  `cuoc_nguoi_tao`          VARCHAR(128) NULL,
  `cuoc_ngay_in_hd`         DATE         NULL,

  -- Khai Eport
  `eport_so_tien`           DECIMAL(15,2) NULL,
  `eport_ngay_in_hd`        DATE         NULL,
  `eport_so_hd`             VARCHAR(64)  NULL,
  `eport_ngay_dong`         DATE         NULL,

  -- Công nợ & thanh toán
  `cong_no_vc`              DECIMAL(15,2) NULL,
  `cong_no_tt_vc`           VARCHAR(64)  NULL,
  `cong_no_chi_ho`          DECIMAL(15,2) NULL,
  `cong_no_tt_chi_ho`       VARCHAR(64)  NULL,

  -- Trọng lượng
  `trong_luong_nw`          DECIMAL(10,2) NULL,
  `trong_luong_gw`          DECIMAL(10,2) NULL,
  `trong_luong_nw2`         DECIMAL(10,2) NULL,
  `trong_luong_gw2`         DECIMAL(10,2) NULL,

  -- Tài chính
  `doanh_thu`               DECIMAL(15,2) NULL DEFAULT 0,
  `chi_phi_khac`            DECIMAL(15,2) NULL DEFAULT 0,
  `thanh_toan`              ENUM('unpaid','partial','paid') NULL DEFAULT 'unpaid',

  -- Audit
  `created_by`              BIGINT UNSIGNED NULL,
  `created_at`              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_plans_ngay` (`ngay_dong_hang`),
  KEY `idx_plans_customer` (`customer_code`),
  KEY `idx_plans_shipping_line` (`shipping_line_code`),
  KEY `idx_plans_route` (`route_code`),
  KEY `idx_plans_driver` (`driver_code`),
  KEY `idx_plans_vehicle` (`vehicle_code`),
  KEY `idx_plans_tinh_trang` (`tinh_trang`),
  KEY `idx_plans_driver_status` (`driver_status`),
  KEY `idx_plans_thanh_toan` (`thanh_toan`),
  KEY `idx_plans_booking_bl` (`booking_bl`),

  CONSTRAINT `fk_plans_customer`
    FOREIGN KEY (`customer_code`) REFERENCES `customers` (`code`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_plans_shipping_line`
    FOREIGN KEY (`shipping_line_code`) REFERENCES `shipping_lines` (`code`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_plans_route`
    FOREIGN KEY (`route_code`) REFERENCES `routes` (`code`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_plans_driver`
    FOREIGN KEY (`driver_code`) REFERENCES `drivers` (`code`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_plans_vehicle`
    FOREIGN KEY (`vehicle_code`) REFERENCES `vehicles` (`code`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_plans_created_by`
    FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Kế hoạch điều độ (entity chính)';

-- ============================================================================
-- 11. PLAN_CONTAINERS  (chi tiết từng cont cho 1 plan)
-- ============================================================================
CREATE TABLE `plan_containers` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `plan_id`    BIGINT UNSIGNED NOT NULL,
  `so_cont`    VARCHAR(32)  NOT NULL  COMMENT 'Số container CSNU1234567',
  `seal`       VARCHAR(32)  NULL,
  `type`       ENUM('20','40') NOT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pc_plan` (`plan_id`),
  KEY `idx_pc_so_cont` (`so_cont`),
  CONSTRAINT `fk_pc_plan`
    FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Chi tiết container của mỗi kế hoạch';

-- ============================================================================
-- 12. PLAN_EVALUATIONS  (ảnh + hóa đơn tài xế upload)
-- ============================================================================
CREATE TABLE `plan_evaluations` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `plan_id`     BIGINT UNSIGNED NOT NULL,
  `kind`        ENUM('photo','invoice') NOT NULL,
  `caption`     VARCHAR(255) NULL,
  `url`         VARCHAR(500) NOT NULL  COMMENT 'URL ảnh (cloud storage / static)',
  `uploaded_by` VARCHAR(128) NULL      COMMENT 'Tên tài xế hoặc user',
  `uploaded_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pe_plan` (`plan_id`),
  KEY `idx_pe_kind` (`kind`),
  CONSTRAINT `fk_pe_plan`
    FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Ảnh + hóa đơn driver upload cho từng plan';
