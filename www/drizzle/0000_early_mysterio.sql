CREATE TYPE "public"."auth_mode" AS ENUM('API_KEY', 'OAUTH2', 'OAUTH1', 'BASIC', 'BASIC_WITH_JWT', 'BEARER_TOKEN', 'DCR_OAUTH', 'GOOGLE_SERVICE_ACCOUNT', 'NO_AUTH', 'S2S_OAUTH2', 'SAML');--> statement-breakpoint
CREATE TYPE "public"."trigger_type" AS ENUM('poll', 'webhook');--> statement-breakpoint
CREATE TABLE "auth_schemes" (
	"id" text PRIMARY KEY NOT NULL,
	"integration_id" text NOT NULL,
	"mode" "auth_mode" NOT NULL,
	"name" text NOT NULL,
	"required_fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"optional_fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operations" (
	"id" text PRIMARY KEY NOT NULL,
	"integration_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"is_deprecated" boolean DEFAULT false NOT NULL,
	"input_parameters" jsonb,
	"output_parameters" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "triggers" (
	"id" text PRIMARY KEY NOT NULL,
	"integration_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" "trigger_type" NOT NULL,
	"configuration" jsonb,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_schemes" ADD CONSTRAINT "auth_schemes_integration_id_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."integrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operations" ADD CONSTRAINT "operations_integration_id_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."integrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_integration_id_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."integrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_schemes_integration_id_idx" ON "auth_schemes" USING btree ("integration_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_schemes_integration_name_idx" ON "auth_schemes" USING btree ("integration_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "integrations_slug_idx" ON "integrations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "operations_integration_id_idx" ON "operations" USING btree ("integration_id");--> statement-breakpoint
CREATE UNIQUE INDEX "operations_integration_slug_idx" ON "operations" USING btree ("integration_id","slug");--> statement-breakpoint
CREATE INDEX "triggers_integration_id_idx" ON "triggers" USING btree ("integration_id");--> statement-breakpoint
CREATE UNIQUE INDEX "triggers_integration_slug_idx" ON "triggers" USING btree ("integration_id","slug");