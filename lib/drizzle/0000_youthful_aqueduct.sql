CREATE TABLE `attendances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`check_in` time,
	`check_out` time,
	`coordinates` text,
	`status` enum('checked_in','present','absent','leave') DEFAULT 'checked_in',
	`description` text,
	`is_accepted` boolean NOT NULL,
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

-- INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`, `deleted_at`) VALUES (NULL, 'admin', 'admin_db@mail.com', '$2a$12$T4ldlUEycm8gDWOZNUk.0es1Y7y8IkYM1T7Wni4imril8fMtvhcES', 'admin', '2025-04-03 22:52:41', '2025-04-03 22:52:41', NULL);