DROP TABLE `corsair_permissions`;--> statement-breakpoint

CREATE TABLE `corsair_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`token` text NOT NULL,
	`plugin` text NOT NULL,
	`endpoint` text NOT NULL,
	`args` text NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`expires_at` text NOT NULL,
	`error` text
);
--> statement-breakpoint
CREATE INDEX `corsair_events_account_type_created_idx` ON `corsair_events` (`account_id`,`event_type`,`created_at`);
