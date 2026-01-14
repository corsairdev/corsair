ALTER TABLE "corsair_connections" ADD COLUMN "connection_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "corsair_connections" DROP COLUMN "resource";--> statement-breakpoint
ALTER TABLE "corsair_connections" DROP COLUMN "permissions";--> statement-breakpoint
ALTER TABLE "corsair_connections" DROP COLUMN "webhook_secret";--> statement-breakpoint
ALTER TABLE "corsair_connections" DROP COLUMN "webhook_subscriptions";--> statement-breakpoint
ALTER TABLE "corsair_connections" DROP COLUMN "rate_limit_state";--> statement-breakpoint
ALTER TABLE "corsair_events" DROP COLUMN "retry_count";--> statement-breakpoint
ALTER TABLE "corsair_providers" DROP COLUMN "platform_credentials";