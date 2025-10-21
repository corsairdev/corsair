"use client";

import { SpotifyTrack } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

interface TracksTableProps {
  tracks: SpotifyTrack[];
}

type SortField = "track_number" | "name" | "duration_ms" | "artists";
type SortDirection = "asc" | "desc";

export function TracksTable({ tracks }: TracksTableProps) {
  const [sortField, setSortField] = useState<SortField>("track_number");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTracks = [...tracks].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "track_number":
        comparison = a.track_number - b.track_number;
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "duration_ms":
        comparison = a.duration_ms - b.duration_ms;
        break;
      case "artists":
        comparison = a.artists[0].name.localeCompare(b.artists[0].name);
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("track_number")}
            >
              <div className="flex items-center gap-1">
                # <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-1">
                Title <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("artists")}
            >
              <div className="flex items-center gap-1">
                Artist(s) <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 text-right"
              onClick={() => handleSort("duration_ms")}
            >
              <div className="flex items-center gap-1 justify-end">
                Duration <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTracks.map((track) => (
            <TableRow key={track.id}>
              <TableCell className="font-medium">
                {track.track_number}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{track.name}</span>
                  {track.explicit && (
                    <Badge variant="destructive" className="text-xs">
                      E
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {track.artists.map((artist) => artist.name).join(", ")}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDuration(track.duration_ms)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
