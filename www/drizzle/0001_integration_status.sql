CREATE TYPE "public"."integration_phase" AS ENUM('awaiting_issue', 'awaiting_pr', 'building', 'ready_to_review', 'finished', 'released');--> statement-breakpoint
CREATE TYPE "public"."integration_release_reason" AS ENUM('issue_timeout', 'pr_timeout', 'manual', 'abuse');--> statement-breakpoint
CREATE TABLE "integration_status" (
	"id" text PRIMARY KEY NOT NULL,
	"integration_id" text NOT NULL,
	"user_id" text NOT NULL,
	"phase" "integration_phase" NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"issue_deadline_at" timestamp with time zone,
	"pr_deadline_at" timestamp with time zone,
	"greptile_score" integer,
	"release_reason" "integration_release_reason",
	"metadata" jsonb
);--> statement-breakpoint
ALTER TABLE "integration_status" ADD CONSTRAINT "integration_status_integration_id_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."integrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_status" ADD CONSTRAINT "integration_status_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "integration_status_integration_id_idx" ON "integration_status" USING btree ("integration_id");--> statement-breakpoint
CREATE INDEX "integration_status_user_id_idx" ON "integration_status" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "integration_status_occurred_at_idx" ON "integration_status" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "integration_status_integration_occurred_idx" ON "integration_status" USING btree ("integration_id","occurred_at");--> statement-breakpoint
INSERT INTO "integration_status" ("id", "integration_id", "user_id", "phase", "occurred_at")
SELECT
	gen_random_uuid()::text,
	"integration_id",
	"user_id",
	CASE
		WHEN "status" = 'finished' THEN 'finished'::"integration_phase"
		ELSE 'building'::"integration_phase"
	END,
	"created_at"
FROM "user_integrations";--> statement-breakpoint
DROP TABLE "user_integration_events";--> statement-breakpoint
DROP TABLE "user_integrations";--> statement-breakpoint
DROP TYPE "public"."user_integration_event_type";--> statement-breakpoint
DROP TYPE "public"."user_integration_status";
