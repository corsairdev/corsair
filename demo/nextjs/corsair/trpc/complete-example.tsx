// Complete example and test file for Corsair tRPC integration
import React from 'react'
import { useCorsairQuery, useCorsairMutation } from './working-client'

type Optional<T> = T | null | undefined

// Example 1: Basic Artist Search
export function ArtistSearchExample() {
  // ✅ Natural language query with full type safety
  const {
    data: artists,
    isLoading,
    error,
  } = useCorsairQuery('search artists', { query: 'Beatles' }, {
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // ✅ Natural language mutation with full type safety
  const updatePopularityMutation = useCorsairMutation('update artist popularity', {
    onSuccess: updatedArtist => {
      console.log('Updated artist:', updatedArtist?.name)
      // ↑ updatedArtist is fully typed based on the mutation's return type
    },
  })

  const handleUpdatePopularity = (artistId: string, newPopularity: number) => {
    updatePopularityMutation.mutate({
      artistId,
      popularity: newPopularity, // ← TypeScript ensures this is 0-100
    })
  }

  if (isLoading) return <div>Loading artists...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Artist Search Results</h2>
      {artists?.map(artist => (
        <div key={artist.id} className="artist-card">
          <h3>{artist.name}</h3>
          <p>Popularity: {artist.popularity}/100</p>
          <p>Followers: {artist.followers?.toLocaleString()}</p>

          <button
            onClick={() =>
              handleUpdatePopularity(artist.id, (artist.popularity || 0) + 1)
            }
            disabled={updatePopularityMutation.isPending}
          >
            Increase Popularity
          </button>

          {/* ✅ All properties are fully typed from your database schema */}
          {artist.genres && (
            <div>
              <strong>Genres:</strong> {(artist.genres as string[]).join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Example 2: Album Detail with Complex Query
export function AlbumDetailExample({ albumId }: { albumId: string }) {
  // ✅ Complex query with joins - fully typed return with nested data
  const { data: albumWithArtists, isLoading } = useCorsairQuery(
    'get album by id with artists',
    { id: albumId }
  )

  // ✅ Create new album mutation - now automatically detected!
  const createAlbumMutation = useCorsairMutation('create album')

  const handleCreateAlbum = () => {
    createAlbumMutation.mutateAsync({
      id: `album-${Date.now()}`,
      name: 'New Album',
      album_type: 'album',
      release_date: '2024',
      release_date_precision: 'year',
      total_tracks: 10,
      images: [],
      // ↑ TypeScript ensures all required fields are provided
    })
  }

  if (isLoading) return <div>Loading album...</div>
  if (!albumWithArtists) return <div>Album not found</div>

  return (
    <div>
      <h2>{albumWithArtists.name}</h2>
      <p>Type: {albumWithArtists.album_type}</p>
      <p>Release Date: {albumWithArtists.release_date}</p>
      <p>Total Tracks: {albumWithArtists.total_tracks}</p>

      <h3>Artists</h3>
      {albumWithArtists.artists.map(artist => (
        <div key={artist.id}>
          {/* ✅ Nested artist data is fully typed */}
          <strong>{artist.name}</strong> - {artist.popularity}/100
        </div>
      ))}

      <button onClick={handleCreateAlbum} disabled={createAlbumMutation.isPending}>
        Create Similar Album
      </button>
    </div>
  )
}

// Example 3: Simple Artist Detail
export function SimpleArtistExample() {
  // ✅ Query with full type safety
  const { data: artist, isLoading, error } = useCorsairQuery(
    'get artist by id',
    { id: '123' }
  )

  // ✅ Mutation with full type safety
  const updatePopularity = useCorsairMutation('update artist popularity')

  const handleUpdate = () => {
    updatePopularity.mutate(
      { artistId: '123', popularity: 90 },
      {
        onSuccess: (updatedArtist) => {
          if (updatedArtist) {
            console.log(`Updated ${updatedArtist.name} to ${updatedArtist.popularity}`)
          }
        }
      }
    )
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!artist) return <div>Artist not found</div>

  return (
    <div>
      <h2>{artist.name}</h2>
      <p>Popularity: {artist.popularity}/100</p>
      <p>Followers: {artist.followers?.toLocaleString()}</p>

      <button onClick={handleUpdate} disabled={updatePopularity.isPending}>
        {updatePopularity.isPending ? 'Updating...' : 'Boost Popularity'}
      </button>
    </div>
  )
}

// Example 4: All Queries and Mutations Demo
export function AllOperationsExample() {
  // Test all available queries
  const allArtists = useCorsairQuery('get all artists', {})
  const allAlbums = useCorsairQuery('get all albums', {})
  const albumsByArtist = useCorsairQuery('get albums by artist id', { artistId: 'artist-123' })
  const searchResults = useCorsairQuery('search artists', { query: 'rock' })

  // Test all available mutations
  const updateArtist = useCorsairMutation('update artist popularity')
  const createAlbum = useCorsairMutation('create album')

  return (
    <div>
      <h2>All Operations Demo</h2>

      <section>
        <h3>Queries</h3>
        <p>All Artists: {allArtists.data?.length || 0} artists</p>
        <p>All Albums: {allAlbums.data?.length || 0} albums</p>
        <p>Albums by Artist: {albumsByArtist.data?.length || 0} albums</p>
        <p>Search Results: {searchResults.data?.length || 0} results</p>
      </section>

      <section>
        <h3>Mutations</h3>
        <button
          onClick={() => updateArtist.mutate({ artistId: '123', popularity: 95 })}
          disabled={updateArtist.isPending}
        >
          Update Artist Popularity
        </button>

        <button
          onClick={() => createAlbum.mutate({
            id: 'new-album',
            name: 'Test Album',
            album_type: 'album',
            release_date: '2024',
            release_date_precision: 'year',
            total_tracks: 12,
            images: []
          })}
          disabled={createAlbum.isPending}
        >
          Create Album
        </button>
      </section>
    </div>
  )
}

// Example 5: Type Testing Component
export function TypeTestingExample() {
  // Test query with proper typing
  const artistQuery = useCorsairQuery('get artist by id', { id: '123' })

  // Test mutation with proper typing
  const updateMutation = useCorsairMutation('update artist popularity')

  // Test that the types are properly inferred
  if (artistQuery.data) {
    // This should work - accessing properties that exist on the artist
    const name: Optional<string> = artistQuery.data.name // Should be string
    const id: Optional<string> = artistQuery.data.id // Should be string
    const popularity: Optional<number> = artistQuery.data.popularity // Should be number

    console.log(`Artist: ${name} (${id}) - Popularity: ${popularity}`)
  }

  const handleUpdatePopularity = () => {
    updateMutation.mutate(
      {
        artistId: '123',
        popularity: 85,
      },
      {
        onSuccess: updatedArtist => {
          if (updatedArtist) {
            // This should work - accessing properties on the updated artist
            const name: Optional<string> = updatedArtist.name
            const newPopularity: Optional<number> = updatedArtist.popularity

            console.log(`Updated ${name} to popularity ${newPopularity}`)
          }
        },
      }
    )
  }

  return (
    <div>
      <h2>Type Testing Example</h2>

      {artistQuery.isLoading && <p>Loading artist...</p>}
      {artistQuery.error && <p>Error: {artistQuery.error.message}</p>}

      {artistQuery.data && (
        <div>
          <h3>{artistQuery.data.name}</h3>
          <p>Popularity: {artistQuery.data.popularity}/100</p>
          <p>Followers: {artistQuery.data.followers?.toLocaleString()}</p>

          <button
            onClick={handleUpdatePopularity}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Updating...' : 'Increase Popularity'}
          </button>
        </div>
      )}
    </div>
  )
}

// Example 6: Natural Language Interface Demo
export function NaturalLanguageExample() {
  // Instead of remembering specific function names, developers can use natural language:

  const albums = useCorsairQuery('get all albums', {}) // ← Natural language
  const searchResults = useCorsairQuery('search artists', { query: 'rock' }) // ← Natural language
  const albumsByArtist = useCorsairQuery('get albums by artist id', { artistId: 'some-artist-id' }) // ← Natural language

  // The beauty is that developers can write operations in natural language
  // and get full type safety without having to remember exact API names!

  return (
    <div>
      <h2>Natural Language Interface</h2>
      <p>This component demonstrates how you can use natural language to describe your operations</p>
      <ul>
        <li>"get all albums" → {albums.data?.length || 0} albums</li>
        <li>"search artists" → {searchResults.data?.length || 0} results</li>
        <li>"get albums by artist id" → {albumsByArtist.data?.length || 0} albums</li>
      </ul>
    </div>
  )
}

// Server-side usage example
export async function getStaticProps() {
  const { corsairQuery } = await import('./working-client')

  // ✅ Server-side queries with the same type safety
  const artists = await corsairQuery('get all artists', {})
  const featuredArtist = await corsairQuery('get artist by id', {
    id: 'featured-artist-id',
  })

  return {
    props: {
      artists, // ✅ Fully typed
      featuredArtist, // ✅ Fully typed
    },
    revalidate: 3600, // 1 hour
  }
}

// Type tests (these would be caught by TypeScript if they were uncommented)
function typeValidationTests() {
  // ✅ These should all compile without errors:

  // Query with correct input
  const query1 = useCorsairQuery('get artist by id', { id: '123' })
  const query2 = useCorsairQuery('search artists', { query: 'Beatles' })
  const query3 = useCorsairQuery('get all artists', {})
  const query4 = useCorsairQuery('get all albums', {})
  const query5 = useCorsairQuery('get albums by artist id', { artistId: 'artist-123' })

  // Mutation with correct setup
  const mutation1 = useCorsairMutation('update artist popularity')
  const mutation2 = useCorsairMutation('create album')

  // Check return types
  if (query1.data) {
    const artistName: Optional<string> = query1.data.name // Should work
    const artistId: Optional<string> = query1.data.id // Should work
  }

  // ❌ These should cause TypeScript errors if uncommented:
  // const badQuery = useCorsairQuery("get artist by id", {}); // Missing id
  // const badQuery2 = useCorsairQuery("get artist by id", { id: 123 }); // Wrong type
  // const badMutation = useCorsairQuery("update artist popularity", { artistId: "123" }); // Wrong function
  // const badRoute = useCorsairQuery("non-existent route", {}); // Invalid route
}

// Main component that shows all examples
export default function CompleteExample() {
  const [activeExample, setActiveExample] = React.useState('artist-search')

  const examples = [
    { id: 'artist-search', name: 'Artist Search', component: <ArtistSearchExample /> },
    { id: 'album-detail', name: 'Album Detail', component: <AlbumDetailExample albumId="album-123" /> },
    { id: 'simple-artist', name: 'Simple Artist', component: <SimpleArtistExample /> },
    { id: 'all-operations', name: 'All Operations', component: <AllOperationsExample /> },
    { id: 'type-testing', name: 'Type Testing', component: <TypeTestingExample /> },
    { id: 'natural-language', name: 'Natural Language', component: <NaturalLanguageExample /> },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h1>Complete Corsair tRPC Example</h1>

      <nav style={{ marginBottom: '20px' }}>
        {examples.map(example => (
          <button
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            style={{
              margin: '5px',
              padding: '10px',
              backgroundColor: activeExample === example.id ? '#007acc' : '#f0f0f0',
              color: activeExample === example.id ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {example.name}
          </button>
        ))}
      </nav>

      <main>
        {examples.find(ex => ex.id === activeExample)?.component}
      </main>

      <footer style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9f9f9' }}>
        <h3>✅ Key Features Demonstrated:</h3>
        <ul>
          <li><strong>Natural Language Interface:</strong> Write queries like "get artist by id"</li>
          <li><strong>Full Type Safety:</strong> TypeScript knows exact input/output types</li>
          <li><strong>Automatic Detection:</strong> Mutations vs queries detected automatically</li>
          <li><strong>TanStack Query Integration:</strong> Caching, background updates, etc.</li>
          <li><strong>tRPC Performance:</strong> Request batching, optimistic updates</li>
          <li><strong>Framework Agnostic:</strong> Works with Next.js, Svelte, etc.</li>
        </ul>
      </footer>
    </div>
  )
}