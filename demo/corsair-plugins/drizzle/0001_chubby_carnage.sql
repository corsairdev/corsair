CREATE TABLE "corsair_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"tenant_id" text NOT NULL,
	"resource" text NOT NULL,
	"permissions" text[] NOT NULL,
	"credentials" jsonb NOT NULL,
	"webhook_secret" text,
	"webhook_subscriptions" text[],
	"rate_limit_state" jsonb
);
--> statement-breakpoint
CREATE TABLE "corsair_events" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"tenant_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" text,
	"retry_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "corsair_providers" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"platform_credentials" jsonb,
	"config" jsonb NOT NULL
);
--> statement-breakpoint
DROP TABLE "corsair_credentials" CASCADE;--> statement-breakpoint
ALTER TABLE "corsair_resources" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "corsair_resources" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;