CREATE TYPE "public"."user_integration_status" AS ENUM('in_progress', 'finished');--> statement-breakpoint
ALTER TYPE "public"."user_integration_event_type" ADD VALUE 'finished';--> statement-breakpoint
ALTER TABLE "user_integrations" ADD COLUMN "status" "user_integration_status" DEFAULT 'in_progress' NOT NULL;