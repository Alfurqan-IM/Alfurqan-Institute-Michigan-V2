-- CreateTable
CREATE TABLE `banner` (
    `banner_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `image` VARCHAR(255) NULL DEFAULT '/uploads/example.jpeg',
    `image_public_id` VARCHAR(255) NULL,
    `time` VARCHAR(100) NULL,
    `year` INTEGER NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`banner_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaigns_aim` (
    `campaign_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `image_url` VARCHAR(500) NOT NULL DEFAULT '/uploads/example.jpeg',
    `image_public_id` VARCHAR(255) NULL,
    `description` TEXT NOT NULL,
    `donation_url` VARCHAR(500) NOT NULL DEFAULT 'https://donorbox.org/embed',
    `start_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `end_date` DATETIME(0) NULL,
    `status` ENUM('active', 'completed', 'pending') NULL DEFAULT 'active',
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`campaign_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enquiries` (
    `enq_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('pending', 'resolved') NULL DEFAULT 'pending',
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`enq_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `event_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `image_url` VARCHAR(500) NOT NULL DEFAULT '/uploads/example.jpeg',
    `image_public_id` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `event_date` DATETIME(0) NULL,
    `location` VARCHAR(255) NULL,
    `organizer` VARCHAR(255) NULL,
    `contact_email` VARCHAR(255) NULL,
    `contact_phone` VARCHAR(20) NULL,
    `event_url` VARCHAR(500) NOT NULL DEFAULT 'https://donorbox.org/events',
    `status` ENUM('upcoming', 'ongoing', 'completed') NULL DEFAULT 'upcoming',
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedbackcomplaints` (
    `feedback_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `subject` VARCHAR(255) NOT NULL,
    `notes` TEXT NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`feedback_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programme_reg` (
    `reg_id` INTEGER NOT NULL AUTO_INCREMENT,
    `programme_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `programme` VARCHAR(255) NULL,
    `category` ENUM('Youth', 'Adult') NOT NULL,
    `discovery_method` ENUM('Masjid', 'Social Media', 'Email Campaign', 'Referral', 'Website', 'Event/Workshop', 'Advertisement', 'Friends', 'Other') NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `programme_id`(`programme_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`reg_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programmeoutcomes` (
    `outcome_id` INTEGER NOT NULL AUTO_INCREMENT,
    `programme_id` INTEGER NULL,
    `outcome1` VARCHAR(255) NULL DEFAULT '/uploads/example.jpeg',
    `outcome2` VARCHAR(255) NULL DEFAULT '/uploads/example.jpeg',
    `outcome3` VARCHAR(255) NULL DEFAULT '/uploads/example.jpeg',
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `programme_id`(`programme_id`),
    PRIMARY KEY (`outcome_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programmes` (
    `programme_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `heading` VARCHAR(100) NULL,
    `about` TEXT NOT NULL,
    `time` VARCHAR(100) NOT NULL,
    `year` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`programme_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programmesimages` (
    `img_id` INTEGER NOT NULL AUTO_INCREMENT,
    `programme_id` INTEGER NULL,
    `image0` VARCHAR(255) NULL,
    `image0_public_id` VARCHAR(255) NULL,
    `image1` VARCHAR(255) NULL,
    `image1_public_id` VARCHAR(255) NULL,
    `image2` VARCHAR(255) NULL,
    `image2_public_id` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `programme_id`(`programme_id`),
    PRIMARY KEY (`img_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quran_surahs` (
    `surah_id` INTEGER NOT NULL AUTO_INCREMENT,
    `surah` VARCHAR(255) NULL,
    `verse` INTEGER NULL,
    `text` TEXT NULL,
    `translation` TEXT NULL,
    `transliteration` TEXT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`surah_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token` (
    `token_id` INTEGER NOT NULL AUTO_INCREMENT,
    `refreshToken` VARCHAR(100) NOT NULL,
    `ip` VARCHAR(100) NOT NULL,
    `userAgent` VARCHAR(500) NULL,
    `isValid` BOOLEAN NOT NULL DEFAULT true,
    `user` INTEGER NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user`(`user`),
    PRIMARY KEY (`token_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `user_name` VARCHAR(50) NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'user') NULL DEFAULT 'user',
    `phone` VARCHAR(30) NOT NULL,
    `image` TEXT NULL,
    `img_public_id` VARCHAR(255) NULL,
    `gender` ENUM('male', 'female') NULL DEFAULT 'female',
    `address` VARCHAR(1000) NOT NULL DEFAULT 'please update your address',
    `city` VARCHAR(50) NOT NULL DEFAULT 'please update your city',
    `state` VARCHAR(50) NOT NULL DEFAULT 'please update your state',
    `country` VARCHAR(50) NOT NULL DEFAULT 'please update your country',
    `notification` BOOLEAN NOT NULL DEFAULT false,
    `blacklisted` BOOLEAN NOT NULL DEFAULT false,
    `verificationString` TEXT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `verified` DATETIME(0) NULL,
    `passwordToken` TEXT NULL,
    `passwordExpirationDate` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `user_name`(`user_name`),
    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `phone`(`phone`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `socialaccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` VARCHAR(255) NOT NULL,
    `providerId` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_user`(`userId`),
    UNIQUE INDEX `unique_provider_providerId`(`provider`, `providerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feedbackcomplaints` ADD CONSTRAINT `feedbackcomplaints_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `programme_reg` ADD CONSTRAINT `programme_reg_ibfk_1` FOREIGN KEY (`programme_id`) REFERENCES `programmes`(`programme_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `programme_reg` ADD CONSTRAINT `programme_reg_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `programmeoutcomes` ADD CONSTRAINT `programmeoutcomes_ibfk_1` FOREIGN KEY (`programme_id`) REFERENCES `programmes`(`programme_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `programmesimages` ADD CONSTRAINT `programmesimages_ibfk_1` FOREIGN KEY (`programme_id`) REFERENCES `programmes`(`programme_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `token` ADD CONSTRAINT `token_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `socialaccount` ADD CONSTRAINT `fk_user` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
