import { createMutation } from "corsair/core";
import { z } from "corsair/core";
import type { DatabaseContext } from "./types";
import { schema } from "./types";
import { drizzle, drizzleZod } from "corsair/db/types";

const mutation = createMutation<DatabaseContext>();

export const mutations = {
  "update artist popularity": mutation({
    prompt: "update artist popularity",
    input_type: z.object({
      artistId: z.string(),
      popularity: z.number().min(0).max(100),
    }),
    // response_type: drizzleZod.createSelectSchema(schema.artists).nullable(),
    dependencies: {
      tables: ["artists"],
      columns: ["artists.id", "artists.popularity"],
    },
    handler: async (input, ctx) => {
      const [artist] = await ctx.db
        .update(ctx.schema.artists)
        .set({
          popularity: Math.max(0, Math.min(100, input.popularity)),
        })
        .where(drizzle.eq(ctx.schema.artists.id, input.artistId))
        .returning();

      return artist || null;
    },
  }),

  "update album type": mutation({
    prompt: "update album type",
    input_type: z.object({
      albumId: z.string(),
      albumType: z.string(),
    }),
    // response_type: drizzleZod.createSelectSchema(schema.albums).nullable(),
    dependencies: {
      tables: ["albums"],
      columns: ["albums.id", "albums.album_type"],
    },
    handler: async (input, ctx) => {
      const [album] = await ctx.db
        .update(ctx.schema.albums)
        .set({
          album_type: input.albumType,
        })
        .where(drizzle.eq(ctx.schema.albums.id, input.albumId))
        .returning();

      return album || null;
    },
  }),

  "toggle track explicit": mutation({
    prompt: "toggle track explicit",
    input_type: z.object({
      trackId: z.string(),
    }),
    // response_type: drizzleZod.createSelectSchema(schema.tracks).nullable(),
    dependencies: {
      tables: ["tracks"],
      columns: ["tracks.id", "tracks.explicit"],
    },
    handler: async (input, ctx) => {
      // First get the current track to toggle its explicit value
      const [currentTrack] = await ctx.db
        .select()
        .from(ctx.schema.tracks)
        .where(drizzle.eq(ctx.schema.tracks.id, input.trackId))
        .limit(1);

      if (!currentTrack) {
        return null;
      }

      const [track] = await ctx.db
        .update(ctx.schema.tracks)
        .set({
          explicit: !currentTrack.explicit,
        })
        .where(drizzle.eq(ctx.schema.tracks.id, input.trackId))
        .returning();

      return track || null;
    },
  }),

  "create artist": mutation({
    prompt: "create artist",
    input_type: z.object({
      id: z.string(),
      name: z.string(),
      popularity: z.number().min(0).max(100).optional(),
      followers: z.number().optional(),
      genres: z.array(z.string()).optional(),
      images: z.any().optional(),
      external_urls: z.any().optional(),
      uri: z.string().optional(),
      href: z.string().optional(),
    }),
    // response_type: drizzleZod.createSelectSchema(schema.artists),
    dependencies: {
      tables: ["artists"],
      columns: [
        "artists.id",
        "artists.name",
        "artists.popularity",
        "artists.followers",
        "artists.genres",
      ],
    },
    handler: async (input, ctx) => {
      const [artist] = await ctx.db
        .insert(ctx.schema.artists)
        .values({
          id: input.id,
          name: input.name,
          popularity: input.popularity || 0,
          followers: input.followers || 0,
          genres: input.genres,
          images: input.images,
          external_urls: input.external_urls,
          uri: input.uri || "",
          href: input.href || "",
        })
        .returning();

      return artist;
    },
  }),

  "create album": mutation({
    prompt: "create album",
    input_type: drizzleZod.createInsertSchema(schema.albums),
    // response_type: drizzleZod.createSelectSchema(schema.albums),
    dependencies: {
      tables: ["albums"],
      columns: [
        "albums.id",
        "albums.name",
        "albums.album_type",
        "albums.release_date",
        "albums.total_tracks",
      ],
    },
    handler: async (input, ctx) => {
      const [album] = await ctx.db
        .insert(ctx.schema.albums)
        .values({ ...input })
        .returning();

      return album;
    },
  }),

  "create track": mutation({
    prompt: "create track",
    input_type: drizzleZod.createInsertSchema(schema.tracks),
    // response_type: drizzleZod.createSelectSchema(schema.tracks),
    dependencies: {
      tables: ["tracks"],
      columns: [
        "tracks.id",
        "tracks.name",
        "tracks.duration_ms",
        "tracks.explicit",
        "tracks.track_number",
      ],
    },
    handler: async (input, ctx) => {
      const [track] = await ctx.db
        .insert(ctx.schema.tracks)
        .values({ ...input })
        .returning();

      return track;
    },
  }),

  "link album to artist": mutation({
    prompt: "link album to artist",
    input_type: z.object({
      albumId: z.string(),
      artistId: z.string(),
    }),
    // response_type: drizzleZod.createSelectSchema(schema.album_artists),
    dependencies: {
      tables: ["album_artists"],
      columns: ["album_artists.album_id", "album_artists.artist_id"],
    },
    handler: async (input, ctx) => {
      const [link] = await ctx.db
        .insert(ctx.schema.album_artists)
        .values({
          album_id: input.albumId,
          artist_id: input.artistId,
        })
        .returning();

      return link;
    },
  }),

  "link track to artist": mutation({
    prompt: "link track to artist",
    input_type: z.object({
      trackId: z.string(),
      artistId: z.string(),
    }),
    // response_type: drizzleZod.createSelectSchema(schema.track_artists),
    dependencies: {
      tables: ["track_artists"],
      columns: ["track_artists.track_id", "track_artists.artist_id"],
    },
    handler: async (input, ctx) => {
      const [link] = await ctx.db
        .insert(ctx.schema.track_artists)
        .values({
          track_id: input.trackId,
          artist_id: input.artistId,
        })
        .returning();

      return link;
    },
  }),
};

const test = drizzleZod.createInsertSchema(schema.albums).def.shape;
