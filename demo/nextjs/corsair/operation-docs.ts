/**
 * Operation documentation for Corsair queries and mutations.
 * Hover over operation strings to see input/output types and pseudocode.
 */

/**
 * **get all artists**
 *
 * @description Retrieves all artists from the database
 * @input `{}`
 * @output `Array<Artist>`
 * @pseudocode `SELECT * FROM artists`
 */
export const GET_ALL_ARTISTS = 'get all artists' as const

/**
 * **get artist by id**
 *
 * @description Retrieves a single artist by ID
 * @input `{ id: string }`
 * @output `Artist | null`
 * @pseudocode `SELECT * FROM artists WHERE id = $id LIMIT 1`
 */
export const GET_ARTIST_BY_ID = 'get artist by id' as const

/**
 * **get all albums**
 *
 * @description Retrieves all albums from the database
 * @input `{}`
 * @output `Array<Album>`
 * @pseudocode `SELECT * FROM albums`
 */
export const GET_ALL_ALBUMS = 'get all albums' as const

/**
 * **get album by id**
 *
 * @description Retrieves a single album by ID
 * @input `{ id: string }`
 * @output `Album | null`
 * @pseudocode `SELECT * FROM albums WHERE id = $id LIMIT 1`
 */
export const GET_ALBUM_BY_ID = 'get album by id' as const

/**
 * **get album by id with artists**
 *
 * @description Retrieves an album by ID with all associated artists
 * @input `{ id: string }`
 * @output `Album & { artists: Artist[] } | null`
 * @pseudocode
 * ```
 * SELECT albums.*, artists.*
 * FROM albums
 * INNER JOIN album_artists ON albums.id = album_artists.album_id
 * INNER JOIN artists ON album_artists.artist_id = artists.id
 * WHERE albums.id = $id
 * ```
 */
export const GET_ALBUM_BY_ID_WITH_ARTISTS =
  'get album by id with artists' as const

/**
 * **get albums by artist id**
 *
 * @description Retrieves all albums by a specific artist
 * @input `{ artistId: string }`
 * @output `Array<Album>`
 * @pseudocode
 * ```
 * SELECT albums.*
 * FROM albums
 * INNER JOIN album_artists ON albums.id = album_artists.album_id
 * WHERE album_artists.artist_id = $artistId
 * ```
 */
export const GET_ALBUMS_BY_ARTIST_ID = 'get albums by artist id' as const

/**
 * **get all tracks**
 *
 * @description Retrieves all tracks from the database
 * @input `{}`
 * @output `Array<Track>`
 * @pseudocode `SELECT * FROM tracks`
 */
export const GET_ALL_TRACKS = 'get all tracks' as const

/**
 * **get tracks by artist id**
 *
 * @description Retrieves all tracks by a specific artist
 * @input `{ artistId: string }`
 * @output `Array<Track>`
 * @pseudocode
 * ```
 * SELECT tracks.*
 * FROM tracks
 * INNER JOIN track_artists ON tracks.id = track_artists.track_id
 * WHERE track_artists.artist_id = $artistId
 * ```
 */
export const GET_TRACKS_BY_ARTIST_ID = 'get tracks by artist id' as const

/**
 * **get tracks by album id**
 *
 * @description Retrieves all tracks for a specific album
 * @input `{ albumId: string }`
 * @output `Array<Track>`
 * @pseudocode `SELECT * FROM tracks WHERE album_id = $albumId`
 */
export const GET_TRACKS_BY_ALBUM_ID = 'get tracks by album id' as const

/**
 * **search artists**
 *
 * @description Searches for artists by name (case-insensitive)
 * @input `{ query: string }`
 * @output `Array<Artist>`
 * @pseudocode `SELECT * FROM artists WHERE name ILIKE '%' || $query || '%'`
 */
export const SEARCH_ARTISTS = 'search artists' as const

/**
 * **search albums**
 *
 * @description Searches for albums by name (case-insensitive)
 * @input `{ query: string }`
 * @output `Array<Album>`
 * @pseudocode `SELECT * FROM albums WHERE name ILIKE '%' || $query || '%'`
 */
export const SEARCH_ALBUMS = 'search albums' as const

/**
 * **get all albums by artist id**
 *
 * @description Retrieves all albums by artist ID with join data
 * @input `{ artistId: string }`
 * @output `Array<{ albums: Album, album_artists: AlbumArtist }>`
 * @pseudocode
 * ```
 * SELECT albums.*, album_artists.*
 * FROM albums
 * INNER JOIN album_artists ON albums.id = album_artists.album_id
 * WHERE album_artists.artist_id = $artistId
 * ```
 */
export const GET_ALL_ALBUMS_BY_ARTIST_ID =
  'get all albums by artist id' as const

/**
 * **update artist popularity**
 *
 * @description Updates the popularity score of an artist (0-100)
 * @input `{ artistId: string, popularity: number }`
 * @output `Artist | null`
 * @pseudocode
 * ```
 * UPDATE artists
 * SET popularity = CLAMP($popularity, 0, 100)
 * WHERE id = $artistId
 * RETURNING *
 * ```
 */
export const UPDATE_ARTIST_POPULARITY = 'update artist popularity' as const

/**
 * **update album type**
 *
 * @description Updates the album type (e.g., album, single, compilation)
 * @input `{ albumId: string, albumType: string }`
 * @output `Album | null`
 * @pseudocode
 * ```
 * UPDATE albums
 * SET album_type = $albumType
 * WHERE id = $albumId
 * RETURNING *
 * ```
 */
export const UPDATE_ALBUM_TYPE = 'update album type' as const

/**
 * **toggle track explicit**
 *
 * @description Toggles the explicit flag on a track
 * @input `{ trackId: string }`
 * @output `Track | null`
 * @pseudocode
 * ```
 * SELECT explicit FROM tracks WHERE id = $trackId
 * UPDATE tracks SET explicit = NOT explicit WHERE id = $trackId
 * RETURNING *
 * ```
 */
export const TOGGLE_TRACK_EXPLICIT = 'toggle track explicit' as const

/**
 * **create artist**
 *
 * @description Creates a new artist in the database
 * @input `{ id: string, name: string, popularity?: number, followers?: number, genres?: string[] }`
 * @output `Artist`
 * @pseudocode
 * ```
 * INSERT INTO artists (id, name, popularity, followers, genres, images)
 * VALUES ($id, $name, $popularity, $followers, $genres, $images)
 * RETURNING *
 * ```
 */
export const CREATE_ARTIST = 'create artist' as const

/**
 * **create album**
 *
 * @description Creates a new album in the database
 * @input `{ id: string, name: string, album_type: string, release_date: string, total_tracks: number }`
 * @output `Album`
 * @pseudocode
 * ```
 * INSERT INTO albums (id, name, album_type, release_date, total_tracks)
 * VALUES ($id, $name, $albumType, $releaseDate, $totalTracks)
 * RETURNING *
 * ```
 */
export const CREATE_ALBUM = 'create album' as const

/**
 * **create track**
 *
 * @description Creates a new track in the database
 * @input `{ id: string, name: string, duration_ms: number, explicit: boolean, album_id: string }`
 * @output `Track`
 * @pseudocode
 * ```
 * INSERT INTO tracks (id, name, duration_ms, explicit, album_id, track_number)
 * VALUES ($id, $name, $duration, $explicit, $albumId, $trackNumber)
 * RETURNING *
 * ```
 */
export const CREATE_TRACK = 'create track' as const

/**
 * **link album to artist**
 *
 * @description Links an album to a single artist
 * @input `{ albumId: string, artistId: string }`
 * @output `{ album_id: string, artist_id: string }`
 * @pseudocode
 * ```
 * INSERT INTO album_artists (album_id, artist_id)
 * VALUES ($albumId, $artistId)
 * RETURNING *
 * ```
 */
export const LINK_ALBUM_TO_ARTIST = 'link album to artist' as const

/**
 * **link album to artists**
 *
 * @description Links an album to multiple artists
 * @input `{ albumId: string, artistIds: string[] }`
 * @output `Array<{ album_id: string, artist_id: string }>`
 * @pseudocode
 * ```
 * 1. Validate album exists: SELECT id FROM albums WHERE id = $albumId
 * 2. Validate all artists exist: SELECT id FROM artists WHERE id IN ($artistIds)
 * 3. Get existing links to avoid duplicates
 * 4. INSERT INTO album_artists (album_id, artist_id)
 *    VALUES ($albumId, $artistId) for each new artist
 * 5. Return all links for the album
 * ```
 */
export const LINK_ALBUM_TO_ARTISTS = 'link album to artists' as const

/**
 * **link track to artist**
 *
 * @description Links a track to an artist
 * @input `{ trackId: string, artistId: string }`
 * @output `{ track_id: string, artist_id: string }`
 * @pseudocode
 * ```
 * INSERT INTO track_artists (track_id, artist_id)
 * VALUES ($trackId, $artistId)
 * RETURNING *
 * ```
 */
export const LINK_TRACK_TO_ARTIST = 'link track to artist' as const

/**
 * **create albums**
 *
 * @description Creates multiple albums and links them to artists
 * @input `{ albums: Array<{ id: string, name: string, album_type: string, artist_ids: string[] }> }`
 * @output `Array<Album>`
 * @pseudocode
 * ```
 * 1. Validate all artist_ids exist
 * 2. For each album:
 *    a. INSERT INTO albums (...) VALUES (...)
 *    b. For each artist_id:
 *       INSERT INTO album_artists (album_id, artist_id) VALUES (...)
 * 3. Return created albums
 * ```
 */
export const CREATE_ALBUMS = 'create albums' as const

export type QueryKeys =
  | typeof GET_ALL_ARTISTS
  | typeof GET_ARTIST_BY_ID
  | typeof GET_ALL_ALBUMS
  | typeof GET_ALBUM_BY_ID
  | typeof GET_ALBUM_BY_ID_WITH_ARTISTS
  | typeof GET_ALBUMS_BY_ARTIST_ID
  | typeof GET_ALL_TRACKS
  | typeof GET_TRACKS_BY_ARTIST_ID
  | typeof GET_TRACKS_BY_ALBUM_ID
  | typeof SEARCH_ARTISTS
  | typeof SEARCH_ALBUMS
  | typeof GET_ALL_ALBUMS_BY_ARTIST_ID

export type MutationKeys =
  | typeof UPDATE_ARTIST_POPULARITY
  | typeof UPDATE_ALBUM_TYPE
  | typeof TOGGLE_TRACK_EXPLICIT
  | typeof CREATE_ARTIST
  | typeof CREATE_ALBUM
  | typeof CREATE_TRACK
  | typeof LINK_ALBUM_TO_ARTIST
  | typeof LINK_ALBUM_TO_ARTISTS
  | typeof LINK_TRACK_TO_ARTIST
  | typeof CREATE_ALBUMS
