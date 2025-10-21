import { SpotifyAlbum } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface AlbumCardProps {
  album: SpotifyAlbum;
  onClick?: (album: SpotifyAlbum) => void;
}

export function AlbumCard({ album, onClick }: AlbumCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick?.(album)}
    >
      <CardHeader>
        <div className="relative aspect-square w-full mb-4">
          <Image
            src={album.images[0]?.url || "/placeholder.png"}
            alt={album.name}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardTitle className="line-clamp-2">{album.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {album.artists.map((artist) => artist.name).join(", ")}
          </p>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{album.album_type}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(album.release_date)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {album.total_tracks} track{album.total_tracks !== 1 ? "s" : ""}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
