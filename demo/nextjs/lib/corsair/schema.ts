import CorsairDB from "corsair/db/schema-builder";

export const artists = CorsairDB.table(
  "artists",
  {
    id: CorsairDB.text("id").primaryKey(),
    name: CorsairDB.text("name"),
    popularity: CorsairDB.integer("popularity"),
    followers: CorsairDB.integer("followers"),
    genres: CorsairDB.jsonb("genres")(),
    images: CorsairDB.jsonb("images")(),
    external_urls: CorsairDB.jsonb("external_urls")(),
    uri: CorsairDB.text("uri"),
    href: CorsairDB.text("href"),
  },
  {
    access: {
      create: "public",
      update: "public",
      delete: "public",
    },
  }
);

export const albums = CorsairDB.table(
  "albums",
  {
    id: CorsairDB.text("id").primaryKey(),
    name: CorsairDB.text("name"),
    album_type: CorsairDB.text("album_type"),
    release_date: CorsairDB.text("release_date"),
    release_date_precision: CorsairDB.text("release_date_precision"),
    total_tracks: CorsairDB.integer("total_tracks"),
    images: CorsairDB.jsonb("images")(),
    external_urls: CorsairDB.jsonb("external_urls")(),
    uri: CorsairDB.text("uri"),
    href: CorsairDB.text("href"),
  },
  {
    access: {
      create: "public",
      update: "public",
      delete: "public",
    },
  }
);

export const tracks = CorsairDB.table(
  "tracks",
  {
    id: CorsairDB.text("id").primaryKey(),
    name: CorsairDB.text("name"),
    disc_number: CorsairDB.integer("disc_number"),
    duration_ms: CorsairDB.integer("duration_ms"),
    explicit: CorsairDB.boolean("explicit"),
    track_number: CorsairDB.integer("track_number"),
    preview_url: CorsairDB.text("preview_url"),
    is_local: CorsairDB.boolean("is_local"),
    external_urls: CorsairDB.jsonb("external_urls")(),
    uri: CorsairDB.text("uri"),
    href: CorsairDB.text("href"),
  },
  {
    access: {
      create: "public",
      update: "public",
      delete: "public",
    },
  }
);

export const album_artists = CorsairDB.table(
  "album_artists",
  {
    id: CorsairDB.uuid("id")
      .primaryKey()
      .default(CorsairDB.sql`uuid_generate_v4()`),
    album_id: CorsairDB.text("album_id").references(() => albums.id),
    artist_id: CorsairDB.text("artist_id").references(() => artists.id),
  },
  {
    access: {
      create: "public",
      update: "public",
      delete: "public",
    },
  }
);

export const track_artists = CorsairDB.table(
  "track_artists",
  {
    id: CorsairDB.uuid("id")
      .primaryKey()
      .default(CorsairDB.sql`uuid_generate_v4()`),
    track_id: CorsairDB.text("track_id").references(() => tracks.id),
    artist_id: CorsairDB.text("artist_id").references(() => artists.id),
  },
  {
    access: {
      create: "public",
      update: "public",
      delete: "public",
    },
  }
);
