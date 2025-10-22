// Server Component - fetches data on the server
import { ArtistsAlbumsView } from "@/components/artists-albums-view";
import { corsairQuery } from "@/lib/corsair/server";

export default async function Home() {
  // Server-side data fetching using our query layer
  // Initial data is fetched on the server for fast first paint
  // Detailed data (tracks, etc.) is fetched on the client when needed
  const artists = await corsairQuery("get all artists", {});
  const albums = await corsairQuery("get all albums", {});

  return (
    <div className="min-h-screen p-8">
      <ArtistsAlbumsView initialArtists={artists} initialAlbums={albums} />
    </div>
  );
}
