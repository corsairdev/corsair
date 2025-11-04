import {
  createCorsairQueryClient,
  createCorsairMutationClient,
  InferQueriesOutputs,
  InferQueriesInputs,
  InferMutationsOutputs,
  InferMutationsInputs,
} from 'corsair/core'
import { mutations } from './operations'
import { queries } from './operations'

const queryClient = createCorsairQueryClient(queries)
const mutationClient = createCorsairMutationClient(mutations)

type UseCorsairQueryType = typeof queryClient.useQuery
type UseCorsairMutationType = typeof mutationClient.useMutation

export function useCorsairQuery<P extends keyof typeof queries>(
  prompt: P,
  input: Parameters<typeof queryClient.useQuery>[1],
  options?: Parameters<typeof queryClient.useQuery>[2]
): ReturnType<typeof queryClient.useQuery> {
  return queryClient.useQuery(prompt, input, options)
}

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
export function useCorsairMutation(
  prompt: 'link album to artists',
  input: { albumId: string; artistIds: string[] },
  options?: any
): any

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
export function useCorsairMutation(
  prompt: 'toggle track explicit',
  input: { trackId: string },
  options?: any
): any

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
export function useCorsairMutation(
  prompt: 'update artist popularity',
  input: { artistId: string; popularity: number },
  options?: any
): any

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
export function useCorsairMutation(
  prompt: 'create artist',
  input: {
    id: string
    name: string
    popularity?: number
    followers?: number
    genres?: string[]
  },
  options?: any
): any

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
export function useCorsairMutation(
  prompt: 'create album',
  input: any,
  options?: any
): any

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
export function useCorsairMutation(
  prompt: 'create track',
  input: any,
  options?: any
): any

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
export function useCorsairMutation(
  prompt: 'update album type',
  input: { albumId: string; albumType: string },
  options?: any
): any

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
export function useCorsairMutation(
  prompt: 'link album to artist',
  input: { albumId: string; artistId: string },
  options?: any
): any

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
export function useCorsairMutation(
  prompt: 'link track to artist',
  input: { trackId: string; artistId: string },
  options?: any
): any

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
export function useCorsairMutation(
  prompt: 'create albums',
  input: any,
  options?: any
): any

// Fallback overload so new mutations don't error before docs are added
export function useCorsairMutation<P extends string>(
  prompt: P,
  input: any,
  options?: any
): any

export function useCorsairMutation(
  prompt: any,
  input: any,
  options?: any
): any {
  return mutationClient.useMutation(prompt, input, options)
}

export type QueryOutputs = InferQueriesOutputs<typeof queries>
export type QueryInputs = InferQueriesInputs<typeof queries>
export type MutationOutputs = InferMutationsOutputs<typeof mutations>
export type MutationInputs = InferMutationsInputs<typeof mutations>

export type Mutations = typeof mutations
export type Queries = typeof queries
