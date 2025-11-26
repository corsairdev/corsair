// Server-side queries (for Server Components)
// These can be called directly in Server Components

import {
  getAllArtists,
  getAllAlbums,
  getArtistById,
  getAlbumById,
  getAllAlbumsByArtistId,
  getTracksByAlbumId,
  getTracksByArtistId,
  searchArtists,
  searchAlbums,
} from "./data";

// Re-export with "server" naming convention to make it clear these are server queries
export const serverQueries = {
  getAllArtists,
  getAllAlbums,
  getArtistById,
  getAlbumById,
  getAllAlbumsByArtistId,
  getTracksByAlbumId,
  getTracksByArtistId,
  searchArtists,
  searchAlbums,
} as const;
