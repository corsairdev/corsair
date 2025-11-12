CREATE TABLE IF NOT EXISTS "album_artists" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"album_id" text,
	"artist_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "albums" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"album_type" text,
	"release_date" text,
	"release_date_precision" text,
	"total_tracks" integer,
	"images" jsonb,
	"external_urls" jsonb,
	"uri" text,
	"href" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"popularity" integer,
	"followers" integer,
	"genres" jsonb,
	"images" jsonb,
	"external_urls" jsonb,
	"uri" text,
	"href" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "track_artists" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"track_id" text,
	"artist_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"disc_number" integer,
	"duration_ms" integer,
	"explicit" boolean,
	"track_number" integer,
	"preview_url" text,
	"is_local" boolean,
	"external_urls" jsonb,
	"uri" text,
	"href" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "album_artists" ADD CONSTRAINT "album_artists_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "album_artists" ADD CONSTRAINT "album_artists_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
