CREATE TABLE "corsair_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"token" text NOT NULL,
	"plugin" text NOT NULL,
	"endpoint" text NOT NULL,
	"args" jsonb NOT NULL,
	"session_id" text,
	"callback_url" text,
	"review_url" text,
	"status" text
);
