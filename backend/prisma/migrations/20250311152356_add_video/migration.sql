-- CreateTable
CREATE TABLE `videos` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `drive_id` VARCHAR(100) NOT NULL,
    `folder` VARCHAR(100) NULL,
    `mime_type` VARCHAR(50) NOT NULL,
    `thumbnail_link` VARCHAR(191) NULL,
    `web_view_link` VARCHAR(191) NULL,
    `web_content_link` VARCHAR(191) NULL,
    `size` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `videos_user_id_idx`(`user_id`),
    INDEX `videos_folder_idx`(`folder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `videos` ADD CONSTRAINT `videos_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
