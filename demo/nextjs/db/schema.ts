import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  uuid,
} from 'drizzle-orm/pg-core'

import { sql, relations } from 'drizzle-orm'

export const artists = pgTable('artists', {
  id: text('id').primaryKey(),
  name: text('name'),
  popularity: integer('popularity'),
  followers: integer('followers'),
  genres: jsonb('genres'),
  images: jsonb('images'),
  external_urls: jsonb('external_urls'),
  uri: text('uri'),
  href: text('href'),
})

export const albums = pgTable('albums', {
  id: text('id').primaryKey(),
  name: text('name'),
  album_type: text('album_type'),
  release_date: text('release_date'),
  release_date_precision: text('release_date_precision'),
  total_tracks: integer('total_tracks'),
  images: jsonb('images'),
  external_urls: jsonb('external_urls'),
  uri: text('uri'),
  href: text('href'),
})

export const tracks = pgTable('tracks', {
  id: text('id').primaryKey(),
  name: text('name'),
  disc_number: integer('disc_number'),
  duration_ms: integer('duration_ms'),
  explicit: boolean('explicit'),
  track_number: integer('track_number'),
  preview_url: text('preview_url'),
  is_local: boolean('is_local'),
  external_urls: jsonb('external_urls'),
  uri: text('uri'),
  href: text('href'),
})

export const album_artists = pgTable('album_artists', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  album_id: text('album_id').references(() => albums.id),
  artist_id: text('artist_id').references(() => artists.id),
})

export const track_artists = pgTable('track_artists', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  track_id: text('track_id').references(() => tracks.id),
  artist_id: text('artist_id').references(() => artists.id),
})

// Relations
export const artistsRelations = relations(artists, ({ many }) => ({
  albumArtists: many(album_artists),
  trackArtists: many(track_artists),
}))

export const albumsRelations = relations(albums, ({ many }) => ({
  albumArtists: many(album_artists),
}))

export const tracksRelations = relations(tracks, ({ many }) => ({
  trackArtists: many(track_artists),
}))

export const albumArtistsRelations = relations(album_artists, ({ one }) => ({
  album: one(albums, {
    fields: [album_artists.album_id],
    references: [albums.id],
  }),
  artist: one(artists, {
    fields: [album_artists.artist_id],
    references: [artists.id],
  }),
}))

export const trackArtistsRelations = relations(track_artists, ({ one }) => ({
  track: one(tracks, {
    fields: [track_artists.track_id],
    references: [tracks.id],
  }),
  artist: one(artists, {
    fields: [track_artists.artist_id],
    references: [artists.id],
  }),
}))
