CREATE TABLE "corsair_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"tenant_id" text NOT NULL,
	"integration_id" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"dek" text
);
--> statement-breakpoint
CREATE TABLE "corsair_entities" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" text NOT NULL,
	"entity_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"version" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "corsair_events" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text
);
--> statement-breakpoint
CREATE TABLE "corsair_integrations" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"dek" text
);
--> statement-breakpoint
ALTER TABLE "corsair_accounts" ADD CONSTRAINT "corsair_accounts_integration_id_corsair_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."corsair_integrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corsair_entities" ADD CONSTRAINT "corsair_entities_account_id_corsair_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."corsair_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corsair_events" ADD CONSTRAINT "corsair_events_account_id_corsair_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."corsair_accounts"("id") ON DELETE no action ON UPDATE no action;