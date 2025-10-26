import { createQuery, z } from "corsair/core";
import { type DatabaseContext, schema } from "./types";
import { drizzle, drizzleZod } from "corsair/db/types";

const query = createQuery<DatabaseContext>();

export const queries = {
  "get all artists": query({
    prompt: "get all artists",
    input_type: z.object({}),
    response_type: z.array(drizzleZod.createSelectSchema(schema.artists)),
    dependencies: {
      tables: ["artists"],
      columns: [
        "artists.id",
        "artists.name",
        "artists.popularity",
        "artists.followers",
        "artists.genres",
        "artists.images",
      ],
    },
    handler: async (input, ctx) => {
      const artists = await ctx.db.select().from(ctx.schema.artists);
      return artists;
    },
  }),

  "get artist by id": query({
    prompt: "get artist by id",
    input_type: z.object({
      id: z.string(),
    }),
    // response_type: drizzleZod.createSelectSchema(schema.artists).nullable(),
    dependencies: {
      tables: ["artists"],
      columns: [
        "artists.id",
        "artists.name",
        "artists.popularity",
        "artists.followers",
        "artists.genres",
        "artists.images",
      ],
    },
    handler: async (input, ctx) => {
      let [artist] = await ctx.db
        .select()
        .from(ctx.schema.artists)
        .where(drizzle.eq(ctx.schema.artists.id, input.id))
        .limit(1);

      return artist || null;
    },
  }),

  "get all albums": query({
    prompt: "get all albums",
    input_type: z.object({}),
    response_type: z.array(drizzleZod.createSelectSchema(schema.albums)),
    dependencies: {
      tables: ["albums"],
      columns: [
        "albums.id",
        "albums.name",
        "albums.album_type",
        "albums.release_date",
        "albums.total_tracks",
        "albums.images",
      ],
    },
    handler: async (input, ctx) => {
      const albums = await ctx.db.select().from(ctx.schema.albums);
      return albums;
    },
  }),

  "get album by id": query({
    prompt: "get album by id",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: drizzleZod.createSelectSchema(schema.albums).nullable(),
    dependencies: {
      tables: ["albums"],
      columns: [
        "albums.id",
        "albums.name",
        "albums.album_type",
        "albums.release_date",
        "albums.total_tracks",
        "albums.images",
      ],
    },
    handler: async (input, ctx) => {
      const [album] = await ctx.db
        .select()
        .from(ctx.schema.albums)
        .where(drizzle.eq(ctx.schema.albums.id, input.id))
        .limit(1);

      return album || null;
    },
  }),

  "get album by id with artists": query({
    prompt: "get album by id with artists",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: drizzleZod
      .createSelectSchema(schema.albums)
      .extend({
        artists: z.array(drizzleZod.createSelectSchema(schema.artists)),
      })
      .nullable(),
    dependencies: {
      tables: ["albums", "album_artists", "artists"],
      columns: [
        "albums.id",
        "albums.name",
        "albums.album_type",
        "albums.release_date",
        "albums.total_tracks",
        "albums.images",
        "album_artists.artist_id",
        "album_artists.album_id",
        "artists.id",
        "artists.name",
        "artists.popularity",
        "artists.followers",
        "artists.genres",
        "artists.images",
      ],
    },
    handler: async (input, ctx) => {
      const albumWithArtists = await ctx.db
        .select({
          albumId: ctx.schema.albums.id,
          albumName: ctx.schema.albums.name,
          album_type: ctx.schema.albums.album_type,
          release_date: ctx.schema.albums.release_date,
          release_date_precision: ctx.schema.albums.release_date_precision,
          total_tracks: ctx.schema.albums.total_tracks,
          albumImages: ctx.schema.albums.images,
          external_urls: ctx.schema.albums.external_urls,
          uri: ctx.schema.albums.uri,
          href: ctx.schema.albums.href,
          artist: {
            id: ctx.schema.artists.id,
            name: ctx.schema.artists.name,
            popularity: ctx.schema.artists.popularity,
            followers: ctx.schema.artists.followers,
            genres: ctx.schema.artists.genres,
            images: ctx.schema.artists.images,
            external_urls: ctx.schema.artists.external_urls,
            uri: ctx.schema.artists.uri,
            href: ctx.schema.artists.href,
          },
        })
        .from(ctx.schema.albums)
        .innerJoin(
          ctx.schema.album_artists,
          drizzle.eq(ctx.schema.albums.id, ctx.schema.album_artists.album_id)
        )
        .innerJoin(
          ctx.schema.artists,
          drizzle.eq(ctx.schema.album_artists.artist_id, ctx.schema.artists.id)
        )
        .where(drizzle.eq(ctx.schema.albums.id, input.id));

      if (albumWithArtists.length === 0) {
        return null;
      }

      // Group artists for the album
      const firstRow = albumWithArtists[0];
      const album = {
        id: firstRow.albumId,
        name: firstRow.albumName,
        album_type: firstRow.album_type,
        release_date: firstRow.release_date,
        release_date_precision: firstRow.release_date_precision,
        total_tracks: firstRow.total_tracks,
        images: firstRow.albumImages,
        external_urls: firstRow.external_urls,
        uri: firstRow.uri,
        href: firstRow.href,
        artists: albumWithArtists.map((row) => row.artist),
      };

      return album;
    },
  }),

  "get albums by artist id": query({
    prompt: "get albums by artist id",
    input_type: z.object({
      artistId: z.string(),
    }),
    response_type: z.array(drizzleZod.createSelectSchema(schema.albums)),
    dependencies: {
      tables: ["albums", "album_artists"],
      columns: [
        "albums.id",
        "albums.name",
        "albums.album_type",
        "albums.release_date",
        "albums.total_tracks",
        "albums.images",
        "album_artists.artist_id",
        "album_artists.album_id",
      ],
    },
    handler: async (input, ctx) => {
      const albums = await ctx.db
        .select({
          id: ctx.schema.albums.id,
          name: ctx.schema.albums.name,
          album_type: ctx.schema.albums.album_type,
          release_date: ctx.schema.albums.release_date,
          release_date_precision: ctx.schema.albums.release_date_precision,
          total_tracks: ctx.schema.albums.total_tracks,
          images: ctx.schema.albums.images,
          external_urls: ctx.schema.albums.external_urls,
          uri: ctx.schema.albums.uri,
          href: ctx.schema.albums.href,
        })
        .from(ctx.schema.albums)
        .innerJoin(
          ctx.schema.album_artists,
          drizzle.eq(ctx.schema.albums.id, ctx.schema.album_artists.album_id)
        )
        .where(drizzle.eq(ctx.schema.album_artists.artist_id, input.artistId));

      return albums;
    },
  }),

  "get all tracks": query({
    prompt: "get all tracks",
    input_type: z.object({}),
    response_type: z.array(drizzleZod.createSelectSchema(schema.tracks)),
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
      const tracks = await ctx.db.select().from(ctx.schema.tracks);
      return tracks;
    },
  }),

  "get tracks by artist id": query({
    prompt: "get tracks by artist id",
    input_type: z.object({
      artistId: z.string(),
    }),
    response_type: z.array(drizzleZod.createSelectSchema(schema.tracks)),
    dependencies: {
      tables: ["tracks", "track_artists"],
      columns: [
        "tracks.id",
        "tracks.name",
        "tracks.duration_ms",
        "tracks.explicit",
        "tracks.track_number",
        "track_artists.artist_id",
        "track_artists.track_id",
      ],
    },
    handler: async (input, ctx) => {
      const tracks = await ctx.db
        .select({
          id: ctx.schema.tracks.id,
          name: ctx.schema.tracks.name,
          disc_number: ctx.schema.tracks.disc_number,
          duration_ms: ctx.schema.tracks.duration_ms,
          explicit: ctx.schema.tracks.explicit,
          track_number: ctx.schema.tracks.track_number,
          preview_url: ctx.schema.tracks.preview_url,
          is_local: ctx.schema.tracks.is_local,
          external_urls: ctx.schema.tracks.external_urls,
          uri: ctx.schema.tracks.uri,
          href: ctx.schema.tracks.href,
        })
        .from(ctx.schema.tracks)
        .innerJoin(
          ctx.schema.track_artists,
          drizzle.eq(ctx.schema.tracks.id, ctx.schema.track_artists.track_id)
        )
        .where(drizzle.eq(ctx.schema.track_artists.artist_id, input.artistId));

      return tracks;
    },
  }),

  "get tracks by album id": query({
    prompt: "get tracks by album id",
    input_type: z.object({
      albumId: z.string(),
    }),
    response_type: z.array(drizzleZod.createSelectSchema(schema.tracks)),
    dependencies: {
      tables: ["tracks"],
      columns: [
        "tracks.id",
        "tracks.name",
        "tracks.album_id",
        "tracks.duration_ms",
        "tracks.explicit",
        "tracks.track_number",
      ],
    },
    handler: async (input, ctx) => {
      const tracks = await ctx.db.select().from(ctx.schema.tracks);
      // .where(drizzle.eq(ctx.schema.tracks.album_id, input.albumId));

      return tracks;
    },
  }),

  "search artists": query({
    prompt: "search artists",
    input_type: z.object({
      query: z.string(),
    }),
    response_type: z.array(drizzleZod.createSelectSchema(schema.artists)),
    dependencies: {
      tables: ["artists"],
      columns: [
        "artists.id",
        "artists.name",
        "artists.popularity",
        "artists.followers",
        "artists.genres",
        "artists.images",
      ],
    },
    handler: async (input, ctx) => {
      const artists = await ctx.db
        .select()
        .from(ctx.schema.artists)
        .where(drizzle.ilike(ctx.schema.artists.name, `%${input.query}%`));

      return artists;
    },
  }),

  "search albums": query({
    prompt: "search albums",
    input_type: z.object({
      query: z.string(),
    }),
    response_type: z.array(drizzleZod.createSelectSchema(schema.albums)),
    dependencies: {
      tables: ["albums"],
      columns: [
        "albums.id",
        "albums.name",
        "albums.album_type",
        "albums.release_date",
        "albums.total_tracks",
        "albums.images",
      ],
    },
    handler: async (input, ctx) => {
      const albums = await ctx.db
        .select()
        .from(ctx.schema.albums)
        .where(drizzle.ilike(ctx.schema.albums.name, `%${input.query}%`));

      return albums;
    },
  }),

  "get all albums by artist id": query({
    prompt: "get all albums by artist id",
    input_type: z.object({
      artistId: z.string(),
    }),
    response_type: z.array(
      drizzleZod.createSelectSchema(schema.albums).extend({
        artists: z.array(drizzleZod.createSelectSchema(schema.artists)),
      })
    ),
    dependencies: {
      tables: ["albums", "album_artists", "artists"],
      columns: [
        "albums.id",
        "albums.name",
        "albums.album_type",
        "albums.release_date",
        "albums.total_tracks",
        "albums.images",
        "album_artists.artist_id",
        "album_artists.album_id",
        "artists.id",
        "artists.name",
        "artists.popularity",
        "artists.followers",
        "artists.genres",
        "artists.images",
      ],
    },
    handler: async (input, ctx) => {
      const albumsWithArtists = await ctx.db
        .select({
          albumId: ctx.schema.albums.id,
          albumName: ctx.schema.albums.name,
          album_type: ctx.schema.albums.album_type,
          release_date: ctx.schema.albums.release_date,
          release_date_precision: ctx.schema.albums.release_date_precision,
          total_tracks: ctx.schema.albums.total_tracks,
          albumImages: ctx.schema.albums.images,
          external_urls: ctx.schema.albums.external_urls,
          uri: ctx.schema.albums.uri,
          href: ctx.schema.albums.href,
          artist: {
            id: ctx.schema.artists.id,
            name: ctx.schema.artists.name,
            popularity: ctx.schema.artists.popularity,
            followers: ctx.schema.artists.followers,
            genres: ctx.schema.artists.genres,
            images: ctx.schema.artists.images,
            external_urls: ctx.schema.artists.external_urls,
            uri: ctx.schema.artists.uri,
            href: ctx.schema.artists.href,
          },
        })
        .from(ctx.schema.albums)
        .innerJoin(
          ctx.schema.album_artists,
          drizzle.eq(ctx.schema.albums.id, ctx.schema.album_artists.album_id)
        )
        .innerJoin(
          ctx.schema.artists,
          drizzle.eq(ctx.schema.album_artists.artist_id, ctx.schema.artists.id)
        )
        .where(drizzle.eq(ctx.schema.album_artists.artist_id, input.artistId));

      // Group artists by album
      const albumsMap = new Map();

      for (const row of albumsWithArtists) {
        if (!albumsMap.has(row.albumId)) {
          albumsMap.set(row.albumId, {
            id: row.albumId,
            name: row.albumName,
            album_type: row.album_type,
            release_date: row.release_date,
            release_date_precision: row.release_date_precision,
            total_tracks: row.total_tracks,
            images: row.albumImages,
            external_urls: row.external_urls,
            uri: row.uri,
            href: row.href,
            artists: [],
          });
        }

        albumsMap.get(row.albumId).artists.push(row.artist);
      }

      return Array.from(albumsMap.values());
    },
  }),
};
