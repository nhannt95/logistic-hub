-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `email` VARCHAR(128) NULL,
    `phone` VARCHAR(32) NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('Điều Độ', 'Tài Xế', 'Kế Toán', 'Giám Đốc') NOT NULL,
    `status` ENUM('active', 'locked') NOT NULL DEFAULT 'active',
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    INDEX `users_role_idx`(`role`),
    INDEX `users_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `code` VARCHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `short_name` VARCHAR(64) NOT NULL,
    `address` VARCHAR(255) NULL,
    `tax_code` VARCHAR(32) NULL,
    `contact_person` VARCHAR(128) NULL,
    `phone` VARCHAR(32) NULL,
    `email` VARCHAR(128) NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `customers_status_idx`(`status`),
    INDEX `customers_short_name_idx`(`short_name`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipping_lines` (
    `code` VARCHAR(16) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendors` (
    `code` VARCHAR(16) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM('port', 'depot', 'shipping', 'fuel', 'maintenance', 'partner') NOT NULL,
    `contact_person` VARCHAR(128) NULL,
    `phone` VARCHAR(32) NULL,
    `email` VARCHAR(128) NULL,
    `address` VARCHAR(255) NULL,
    `tax_code` VARCHAR(32) NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `vendors_type_idx`(`type`),
    INDEX `vendors_status_idx`(`status`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `routes` (
    `code` VARCHAR(16) NOT NULL,
    `from_location` VARCHAR(128) NOT NULL,
    `to_location` VARCHAR(128) NOT NULL,
    `distance` DECIMAL(8, 2) NOT NULL DEFAULT 0,
    `estimated_hours` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `standard_price` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `note` TEXT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `routes_from_location_to_location_idx`(`from_location`, `to_location`),
    INDEX `routes_status_idx`(`status`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicles` (
    `code` VARCHAR(16) NOT NULL,
    `plate_number` VARCHAR(32) NOT NULL,
    `manufacturer` VARCHAR(64) NULL,
    `model` VARCHAR(64) NULL,
    `year` SMALLINT NULL,
    `capacity` ENUM('20', '40', 'mixed') NOT NULL DEFAULT 'mixed',
    `mooc` VARCHAR(32) NULL,
    `assigned_driver_code` VARCHAR(16) NULL,
    `insurance_expiry` DATE NULL,
    `registration_expiry` DATE NULL,
    `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
    `registered_at` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vehicles_plate_number_key`(`plate_number`),
    INDEX `vehicles_status_idx`(`status`),
    INDEX `vehicles_assigned_driver_code_idx`(`assigned_driver_code`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drivers` (
    `code` VARCHAR(16) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(128) NOT NULL,
    `phone` VARCHAR(32) NULL,
    `cccd` VARCHAR(20) NULL,
    `license` VARCHAR(32) NULL,
    `license_class` ENUM('B2', 'C', 'D', 'E', 'FC') NOT NULL DEFAULT 'FC',
    `license_expiry` DATE NULL,
    `address` VARCHAR(255) NULL,
    `assigned_vehicle_code` VARCHAR(16) NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `hired_at` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `drivers_status_idx`(`status`),
    INDEX `drivers_assigned_vehicle_code_idx`(`assigned_vehicle_code`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `key` VARCHAR(64) NOT NULL,
    `group_name` VARCHAR(64) NOT NULL,
    `label` VARCHAR(128) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `permissions_group_name_idx`(`group_name`),
    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `role` ENUM('Điều Độ', 'Tài Xế', 'Kế Toán', 'Giám Đốc') NOT NULL,
    `permission_key` VARCHAR(64) NOT NULL,
    `granted` BOOLEAN NOT NULL DEFAULT true,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `role_permissions_permission_key_idx`(`permission_key`),
    PRIMARY KEY (`role`, `permission_key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plans` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ngay_dong_hang` DATE NOT NULL,
    `customer_code` VARCHAR(8) NULL,
    `tuyen_van_chuyen` VARCHAR(255) NULL,
    `route_code` VARCHAR(16) NULL,
    `hop_dong` VARCHAR(64) NULL,
    `shipping_line_code` VARCHAR(16) NULL,
    `booking_bl` VARCHAR(64) NULL,
    `tinh_trang` ENUM('XUẤT', 'NHẬP', 'Chuyển tải') NOT NULL,
    `cont_20` INTEGER NOT NULL DEFAULT 0,
    `cont_40` INTEGER NOT NULL DEFAULT 0,
    `tan` DECIMAL(10, 2) NULL,
    `packing` VARCHAR(64) NULL,
    `etd_eta` DATE NULL,
    `cut_off` DATETIME(3) NULL,
    `lay_cont_rong` VARCHAR(255) NULL,
    `ha_full` VARCHAR(255) NULL,
    `cuoc` VARCHAR(255) NULL,
    `doi_lenh` VARCHAR(255) NULL,
    `lay_ha_cont` VARCHAR(255) NULL,
    `ghi_chu` TEXT NULL,
    `neo` VARCHAR(64) NULL,
    `driver_code` VARCHAR(16) NULL,
    `vehicle_code` VARCHAR(16) NULL,
    `dau_keo` VARCHAR(32) NULL,
    `mooc` VARCHAR(32) NULL,
    `estimate_completion` DATETIME(3) NULL,
    `chi_phi_tai_xe` DECIMAL(15, 2) NULL DEFAULT 0,
    `remark` TEXT NULL,
    `driver_status` ENUM('new', 'confirmed', 'picking', 'picked', 'delivering', 'delivered', 'done') NULL DEFAULT 'new',
    `cuoc_so_tien` DECIMAL(15, 2) NULL,
    `cuoc_ngay_cuoc` DATE NULL,
    `cuoc_ngay_thu` DATE NULL,
    `cuoc_so_dinh_danh` VARCHAR(64) NULL,
    `cuoc_ma` VARCHAR(64) NULL,
    `cuoc_nguoi_tao` VARCHAR(128) NULL,
    `cuoc_ngay_in_hd` DATE NULL,
    `eport_so_tien` DECIMAL(15, 2) NULL,
    `eport_ngay_in_hd` DATE NULL,
    `eport_so_hd` VARCHAR(64) NULL,
    `eport_ngay_dong` DATE NULL,
    `cong_no_vc` DECIMAL(15, 2) NULL,
    `cong_no_tt_vc` VARCHAR(64) NULL,
    `cong_no_chi_ho` DECIMAL(15, 2) NULL,
    `cong_no_tt_chi_ho` VARCHAR(64) NULL,
    `trong_luong_nw` DECIMAL(10, 2) NULL,
    `trong_luong_gw` DECIMAL(10, 2) NULL,
    `trong_luong_nw2` DECIMAL(10, 2) NULL,
    `trong_luong_gw2` DECIMAL(10, 2) NULL,
    `doanh_thu` DECIMAL(15, 2) NULL DEFAULT 0,
    `chi_phi_khac` DECIMAL(15, 2) NULL DEFAULT 0,
    `thanh_toan` ENUM('unpaid', 'partial', 'paid') NULL DEFAULT 'unpaid',
    `created_by` BIGINT UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `plans_ngay_dong_hang_idx`(`ngay_dong_hang`),
    INDEX `plans_customer_code_idx`(`customer_code`),
    INDEX `plans_shipping_line_code_idx`(`shipping_line_code`),
    INDEX `plans_route_code_idx`(`route_code`),
    INDEX `plans_driver_code_idx`(`driver_code`),
    INDEX `plans_vehicle_code_idx`(`vehicle_code`),
    INDEX `plans_tinh_trang_idx`(`tinh_trang`),
    INDEX `plans_driver_status_idx`(`driver_status`),
    INDEX `plans_thanh_toan_idx`(`thanh_toan`),
    INDEX `plans_booking_bl_idx`(`booking_bl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan_containers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plan_id` BIGINT UNSIGNED NOT NULL,
    `so_cont` VARCHAR(32) NOT NULL,
    `seal` VARCHAR(32) NULL,
    `type` ENUM('20', '40') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `plan_containers_plan_id_idx`(`plan_id`),
    INDEX `plan_containers_so_cont_idx`(`so_cont`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan_evaluations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plan_id` BIGINT UNSIGNED NOT NULL,
    `kind` ENUM('photo', 'invoice') NOT NULL,
    `caption` VARCHAR(255) NULL,
    `url` VARCHAR(500) NOT NULL,
    `uploaded_by` VARCHAR(128) NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `plan_evaluations_plan_id_idx`(`plan_id`),
    INDEX `plan_evaluations_kind_idx`(`kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `drivers` ADD CONSTRAINT `drivers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_key_fkey` FOREIGN KEY (`permission_key`) REFERENCES `permissions`(`key`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans` ADD CONSTRAINT `plans_customer_code_fkey` FOREIGN KEY (`customer_code`) REFERENCES `customers`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans` ADD CONSTRAINT `plans_shipping_line_code_fkey` FOREIGN KEY (`shipping_line_code`) REFERENCES `shipping_lines`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans` ADD CONSTRAINT `plans_route_code_fkey` FOREIGN KEY (`route_code`) REFERENCES `routes`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans` ADD CONSTRAINT `plans_driver_code_fkey` FOREIGN KEY (`driver_code`) REFERENCES `drivers`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans` ADD CONSTRAINT `plans_vehicle_code_fkey` FOREIGN KEY (`vehicle_code`) REFERENCES `vehicles`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans` ADD CONSTRAINT `plans_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_containers` ADD CONSTRAINT `plan_containers_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_evaluations` ADD CONSTRAINT `plan_evaluations_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
