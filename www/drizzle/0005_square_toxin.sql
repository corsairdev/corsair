CREATE TYPE "public"."user_integration_event_type" AS ENUM('claimed', 'unclaimed');--> statement-breakpoint
CREATE TABLE "user_integration_events" (
	"id" text PRIMARY KEY NOT NULL,
	"integration_id" text NOT NULL,
	"user_id" text NOT NULL,
	"type" "user_integration_event_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_integration_events" ADD CONSTRAINT "user_integration_events_integration_id_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."integrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_integration_events" ADD CONSTRAINT "user_integration_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_integration_events_integration_id_idx" ON "user_integration_events" USING btree ("integration_id");--> statement-breakpoint
CREATE INDEX "user_integration_events_created_at_idx" ON "user_integration_events" USING btree ("created_at");