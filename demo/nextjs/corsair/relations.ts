import { drizzle } from "corsair/db/types";
import * as schema from "./schema";

export const artistsRelations = drizzle.relations(
  schema.artists,
  ({ many }) => ({
    albumArtists: many(schema.album_artists),
    trackArtists: many(schema.track_artists),
  })
);

export const albumsRelations = drizzle.relations(schema.albums, ({ many }) => ({
  albumArtists: many(schema.album_artists),
}));

export const tracksRelations = drizzle.relations(schema.tracks, ({ many }) => ({
  trackArtists: many(schema.track_artists),
}));

export const albumArtistsRelations = drizzle.relations(
  schema.album_artists,
  ({ one }) => ({
    album: one(schema.albums, {
      fields: [schema.album_artists.album_id],
      references: [schema.albums.id],
    }),
    artist: one(schema.artists, {
      fields: [schema.album_artists.artist_id],
      references: [schema.artists.id],
    }),
  })
);

export const trackArtistsRelations = drizzle.relations(
  schema.track_artists,
  ({ one }) => ({
    track: one(schema.tracks, {
      fields: [schema.track_artists.track_id],
      references: [schema.tracks.id],
    }),
    artist: one(schema.artists, {
      fields: [schema.track_artists.artist_id],
      references: [schema.artists.id],
    }),
  })
);
