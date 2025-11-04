// Queries
import { getAlbumByIdWithArtists } from './queries/get-album-by-id-with-artists'
import { getAlbumById } from './queries/get-album-by-id'
import { getAlbumsByArtistId } from './queries/get-albums-by-artist-id'
import { getAllAlbumsByArtistId } from './queries/get-all-albums-by-artist-id'
import { getAllAlbums } from './queries/get-all-albums'
import { getAllArtists } from './queries/get-all-artists'
import { getAllTracks } from './queries/get-all-tracks'
import { getArtistById } from './queries/get-artist-by-id'
import { getTracksByAlbumId } from './queries/get-tracks-by-album-id'
import { getTracksByArtistId } from './queries/get-tracks-by-artist-id'
import { searchAlbums } from './queries/search-albums'
import { searchArtists } from './queries/search-artists'

// Mutations
import { createAlbum } from './mutations/create-album'
import { createAlbums } from './mutations/create-albums'
import { createArtist } from './mutations/create-artist'
import { createTrack } from './mutations/create-track'
import { linkAlbumToArtist } from './mutations/link-album-to-artist'
import { linkAlbumToArtists } from './mutations/link-album-to-artists'
import { linkTrackToArtist } from './mutations/link-track-to-artist'
import { toggleTrackExplicit } from './mutations/toggle-track-explicit'
import { updateAlbumType } from './mutations/update-album-type'
import { updateArtistPopularity } from './mutations/update-artist-popularity'

export const queries = {
  'get all artists': getAllArtists,
  'get artist by id': getArtistById,
  'get all albums': getAllAlbums,
  'get album by id': getAlbumById,
  'get album by id with artists': getAlbumByIdWithArtists,
  'get albums by artist id': getAlbumsByArtistId,
  'get all tracks': getAllTracks,
  'get tracks by artist id': getTracksByArtistId,
  'get tracks by album id': getTracksByAlbumId,
  'search artists': searchArtists,
  'search albums': searchAlbums,
  'get all albums by artist id': getAllAlbumsByArtistId,
}

export const mutations = {
  'update artist popularity': updateArtistPopularity,
  'update album type': updateAlbumType,
  'toggle track explicit': toggleTrackExplicit,
  'create artist': createArtist,
  'create album': createAlbum,
  'create track': createTrack,
  'link album to artist': linkAlbumToArtist,
  'link track to artist': linkTrackToArtist,
  'create albums': createAlbums,
  'link album to artists': linkAlbumToArtists,
}
