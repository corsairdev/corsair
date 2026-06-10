ALTER TABLE "user" ADD COLUMN "github_username" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_github_username_unique" UNIQUE("github_username");