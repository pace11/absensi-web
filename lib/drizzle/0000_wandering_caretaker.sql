CREATE TABLE `attendances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`check_in` time,
	`check_out` time,
	`coordinates` text,
	`status` enum('checked_in','present','absent','leave') DEFAULT 'checked_in',
	`description` text,
	`accepted` enum('in_progress','accepted','declined') DEFAULT 'in_progress',
	`file` text,
	`created_at_local` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `attendances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `setting` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text,
	`address` text,
	`clock_in` time NOT NULL,
	`clock_out` time NOT NULL,
	`coordinates` text,
	`radius` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `setting_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`role` enum('admin','employee') DEFAULT 'employee',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;