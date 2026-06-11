CREATE TYPE "public"."integration_url_type" AS ENUM('issue', 'pr', 'docs');--> statement-breakpoint
CREATE TABLE "integration_urls" (
	"id" text PRIMARY KEY NOT NULL,
	"integration_id" text NOT NULL,
	"type" "integration_url_type" NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "integration_urls" ADD CONSTRAINT "integration_urls_integration_id_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."integrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "integration_urls_integration_id_idx" ON "integration_urls" USING btree ("integration_id");--> statement-breakpoint
CREATE UNIQUE INDEX "integration_urls_integration_type_idx" ON "integration_urls" USING btree ("integration_id","type");--> statement-breakpoint
INSERT INTO "integration_urls" ("id", "integration_id", "type", "url", "created_at", "updated_at")
SELECT gen_random_uuid()::text, "id", 'issue', "urls"->>'issueUrl', now(), now()
FROM "integrations"
WHERE nullif(trim("urls"->>'issueUrl'), '') IS NOT NULL;--> statement-breakpoint
INSERT INTO "integration_urls" ("id", "integration_id", "type", "url", "created_at", "updated_at")
SELECT gen_random_uuid()::text, "id", 'pr', "urls"->>'prUrl', now(), now()
FROM "integrations"
WHERE nullif(trim("urls"->>'prUrl'), '') IS NOT NULL;--> statement-breakpoint
INSERT INTO "integration_urls" ("id", "integration_id", "type", "url", "created_at", "updated_at")
SELECT gen_random_uuid()::text, "id", 'docs', "urls"->>'docsUrl', now(), now()
FROM "integrations"
WHERE nullif(trim("urls"->>'docsUrl'), '') IS NOT NULL;--> statement-breakpoint
ALTER TABLE "integrations" DROP COLUMN "urls";