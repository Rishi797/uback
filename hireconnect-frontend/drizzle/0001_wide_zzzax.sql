CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicantId` int NOT NULL,
	`jobId` int NOT NULL,
	`resumeUrl` text,
	`resumeKey` varchar(255),
	`skills` text,
	`experience` int DEFAULT 0,
	`lastCompany` varchar(100),
	`linkedin` varchar(255),
	`relocation` varchar(10),
	`city` varchar(100),
	`branch` varchar(50),
	`visionName` varchar(255),
	`visionSkills` text,
	`visionDescription` text,
	`status` enum('pending','reviewed','selected','rejected') NOT NULL DEFAULT 'pending',
	`appliedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`position` varchar(100) NOT NULL,
	`branch` varchar(50),
	`isInternship` boolean NOT NULL DEFAULT false,
	`minExperience` int DEFAULT 0,
	`maxExperience` int,
	`salaryMin` decimal(10,2),
	`salaryMax` decimal(10,2),
	`location` varchar(100),
	`status` enum('active','closed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`content` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`type` enum('application_submitted','application_reviewed','application_accepted','application_rejected','new_message') NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('applicant','admin') NOT NULL DEFAULT 'applicant';--> statement-breakpoint
ALTER TABLE `users` ADD `mobile` varchar(15);--> statement-breakpoint
ALTER TABLE `users` ADD `dob` date;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);