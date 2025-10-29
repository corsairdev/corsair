import { createMutation, z } from "corsair/core";
import { schema, type DatabaseContext } from "./types";
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
    input_type: schema.albums._.inferInsert,
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
    input_type: schema.tracks._.inferInsert,
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
  "create albums": mutation({
    prompt: "create albums",
    input_type: schema.albums._.inferInsert,
    handler: async (input, ctx) => {
      // Validate that all referenced artist_ids exist
      const allArtistIds = [
        ...new Set(input.albums.flatMap((a) => a.artist_ids)),
      ];
      if (allArtistIds.length > 0) {
        const existingArtists = await ctx.db
          .select({ id: ctx.schema.artists.id })
          .from(ctx.schema.artists)
          .where(drizzle.inArray(ctx.schema.artists.id, allArtistIds));
        const foundArtistIds = new Set(existingArtists.map((a) => a.id));
        const missingIds = allArtistIds.filter((id) => !foundArtistIds.has(id));
        if (missingIds.length > 0) {
          throw new Error(
            `Some artist_ids do not exist: ${missingIds.join(", ")}`
          );
        }
      }

      // Insert albums and create album_artists relationships
      const createdAlbums = [];
      for (const album of input.albums) {
        // Insert album
        const [insertedAlbum] = await ctx.db
          .insert(ctx.schema.albums)
          .values({
            id: album.id,
            name: album.name,
            album_type: album.album_type,
            release_date: album.release_date,
            release_date_precision: album.release_date_precision,
            total_tracks: album.total_tracks,
            images: album.images,
            external_urls: album.external_urls,
            uri: album.uri,
            href: album.href,
          })
          .onConflictDoNothing()
          .returning();
        if (!insertedAlbum) {
          // Album with this id already exists: safe to continue or throw?
          throw new Error(`Album with id '${album.id}' already exists.`);
        }

        // Insert into album_artists
        for (const artist_id of album.artist_ids) {
          await ctx.db
            .insert(ctx.schema.album_artists)
            .values({
              album_id: album.id,
              artist_id: artist_id,
            })
            .onConflictDoNothing();
        }
        createdAlbums.push(insertedAlbum);
      }
      return createdAlbums;
    },
  }),
  "link album to artists": mutation({
    prompt: "link album to artists",
    input_type: z.object({
      albumId: z.string(),
      artistIds: z.array(z.string()),
    }),
    handler: async (input, ctx) => {
      const { albumId, artistIds } = input;

      // Validate that the album exists
      const [album] = await ctx.db
        .select({ id: ctx.schema.albums.id })
        .from(ctx.schema.albums)
        .where(drizzle.eq(ctx.schema.albums.id, albumId))
        .limit(1);
      if (!album) {
        throw new Error(`Album with id '${albumId}' does not exist.`);
      }

      // Validate that all artistIds exist and collect the missing ones
      const existingArtistRows = await ctx.db
        .select({ id: ctx.schema.artists.id })
        .from(ctx.schema.artists)
        .where(drizzle.inArray(ctx.schema.artists.id, artistIds));
      const foundArtistIds = new Set(existingArtistRows.map((a) => a.id));
      const missingArtistIds = artistIds.filter(
        (id) => !foundArtistIds.has(id)
      );
      if (missingArtistIds.length > 0) {
        throw new Error(
          `These artistIds do not exist: ${missingArtistIds.join(", ")}`
        );
      }

      // Prepare insert data for new pairs that don't already exist
      // First, select existing links to avoid duplicates
      const existingLinks = await ctx.db
        .select({ artist_id: ctx.schema.album_artists.artist_id })
        .from(ctx.schema.album_artists)
        .where(
          drizzle.and(
            drizzle.eq(ctx.schema.album_artists.album_id, albumId),
            drizzle.inArray(ctx.schema.album_artists.artist_id, artistIds)
          )
        );
      const alreadyLinkedSet = new Set(existingLinks.map((l) => l.artist_id));

      const newLinks = artistIds.filter((id) => !alreadyLinkedSet.has(id));
      if (newLinks.length === 0) {
        // All links already exist, return the existing links
        const allLinks = await ctx.db
          .select()
          .from(ctx.schema.album_artists)
          .where(drizzle.eq(ctx.schema.album_artists.album_id, albumId));
        return allLinks;
      }

      // Create new album_artist links
      const insertRows = newLinks.map((artist_id) => ({
        album_id: albumId,
        artist_id,
      }));

      const inserted = await ctx.db
        .insert(ctx.schema.album_artists)
        .values(insertRows)
        .returning();

      // Return all links for the album (including previous and new)
      const allLinks = await ctx.db
        .select()
        .from(ctx.schema.album_artists)
        .where(drizzle.eq(ctx.schema.album_artists.album_id, albumId));

      return allLinks;
    },
  }),
};

// const test = schema.albums._.inferInsert;
