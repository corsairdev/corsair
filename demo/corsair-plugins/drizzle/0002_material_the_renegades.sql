ALTER TABLE "corsair_permissions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "corsair_permissions" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "corsair_permissions" ADD COLUMN "expires_at" timestamp;