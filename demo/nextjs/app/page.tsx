// Server Component - fetches data on the server
import { serverQueries } from "@/lib/api/queries.server";
import { ArtistsAlbumsView } from "@/components/artists-albums-view";
import { UserProfile } from "@/components/user-profile";

export default async function Home() {
  // Server-side data fetching using our query layer
  // Initial data is fetched on the server for fast first paint
  // Detailed data (tracks, etc.) is fetched on the client when needed
  const artists = await serverQueries.getAllArtists();
  const albums = await serverQueries.getAllAlbums();

  return (
    <div className="min-h-screen p-8">
      <UserProfile userId="019a08a5-7029-7183-99c9-939647ca163b" />
      <ArtistsAlbumsView initialArtists={artists} initialAlbums={albums} />
    </div>
  );
}
