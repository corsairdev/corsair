"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { TracksTable } from "@/components/tracks-table";
import Image from "next/image";
import { useTracksByAlbumId } from "@/lib/api/queries.client";
import { QueryOutputs } from "@/corsair/client";

interface AlbumDetailsSheetProps {
  album: QueryOutputs["get album by id with artists"] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlbumDetailsSheet({
  album,
  open,
  onOpenChange,
}: AlbumDetailsSheetProps) {
  // Client-side query hook to fetch tracks when album is selected
  const { data: tracks, isLoading } = useTracksByAlbumId(album?.id || null);

  if (!album) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const albumTracks = tracks || [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-6">
        <SheetHeader className="space-y-3">
          <div className="relative aspect-square w-48 mx-auto mb-4">
            <Image
              src={
                (album?.images as unknown as { url: string }[])?.[0]?.url ||
                "/placeholder.png"
              }
              alt={album.name || ""}
              fill
              className="object-cover rounded-md"
              sizes="192px"
            />
          </div>
          <SheetTitle className="text-2xl">{album.name}</SheetTitle>
          <SheetDescription>
            {album.artists.map((artist) => artist.name).join(", ")}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="secondary">{album.album_type}</Badge>
            <span className="text-sm text-muted-foreground">
              Released: {formatDate(album.release_date || "")}
            </span>
            <span className="text-sm text-muted-foreground">
              {album.total_tracks} track{album.total_tracks !== 1 ? "s" : ""}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Tracks</h3>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading tracks...</p>
            ) : albumTracks.length > 0 ? (
              <TracksTable tracks={albumTracks} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No track data available for this album
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
