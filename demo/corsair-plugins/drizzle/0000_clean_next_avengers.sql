CREATE TABLE "corsair_credentials" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"resource" text NOT NULL,
	"permissions" text[] NOT NULL,
	"credentials" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "corsair_resources" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"resource_id" text NOT NULL,
	"resource" text NOT NULL,
	"service" text NOT NULL,
	"version" text NOT NULL,
	"data" jsonb NOT NULL
);
