CREATE TABLE `corsair_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`tenant_id` text NOT NULL,
	`integration_id` text NOT NULL,
	`config` text,
	`dek` text,
	FOREIGN KEY (`integration_id`) REFERENCES `corsair_integrations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `corsair_entities` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`account_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`version` text NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `corsair_events` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`account_id` text NOT NULL,
	`event_type` text NOT NULL,
	`payload` text NOT NULL,
	`status` text
);
--> statement-breakpoint
CREATE TABLE `corsair_integrations` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`name` text NOT NULL,
	`config` text,
	`dek` text
);
--> statement-breakpoint
CREATE TABLE `corsair_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`token` text NOT NULL,
	`plugin` text NOT NULL,
	`endpoint` text NOT NULL,
	`args` text NOT NULL,
	`session_id` text,
	`callback_url` text,
	`review_url` text,
	`status` text,
	`expires_at` integer,
	`tenant_id` text
);
