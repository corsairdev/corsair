'use client';

import { useState } from 'react';
import { AlbumCard } from '@/components/album-card';
import { AlbumDetailsSheet } from '@/components/album-details-sheet';
import { ArtistCard } from '@/components/artist-card';
import { ArtistDetailsSheet } from '@/components/artist-details-sheet';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useCorsairMutation, type QueryOutputs } from '@/corsair/client';

interface ArtistsAlbumsViewProps {
	initialArtists: QueryOutputs['get all artists'];
	initialAlbums: QueryOutputs['get all albums'];
}

export function ArtistsAlbumsView({
	initialArtists,
	initialAlbums,
}: ArtistsAlbumsViewProps) {
	const [view, setView] = useState<'all' | 'artists' | 'albums'>('all');
	const [selectedArtist, setSelectedArtist] =
		useState<QueryOutputs['get artist by id']>();
	const [selectedAlbum] = useState<
		QueryOutputs['get album by id with artists'] | null
	>(null);
	const [artistSheetOpen, setArtistSheetOpen] = useState(false);
	const [albumSheetOpen, setAlbumSheetOpen] = useState(false);

	const handleArtistClick = (
		artist: QueryOutputs['get all artists'][number],
	) => {
		setSelectedArtist(artist as QueryOutputs['get all artists'][number]);
		setArtistSheetOpen(true);
	};

	const handleAlbumClick = () => {
		setAlbumSheetOpen(true);
	};
	const sendSlackMessage = useCorsairMutation('send slack message');

	return (
		<>
			<button onClick={() => {
				sendSlackMessage.mutate({
					channel: 'general',
					message: 'Hello, world!',
				});
			}}>
				Send Slack Message
			</button>
			<div className="max-w-7xl mx-auto space-y-8">
				<header className="space-y-4">
					<h1 className="text-4xl font-bold">Spotify Music Database</h1>
					<p className="text-muted-foreground">
						Explore artists, albums, and tracks with sorting and filtering
					</p>

					<Select value={view} onValueChange={(v) => setView(v as typeof view)}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Select view" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="artists">Artists Only</SelectItem>
							<SelectItem value="albums">Albums Only</SelectItem>
						</SelectContent>
					</Select>
				</header>

				{(view === 'all' || view === 'artists') && (
					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Artists</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{initialArtists.map((artist) => (
								<ArtistCard
									key={artist.id}
									artist={artist}
									onClick={handleArtistClick}
								/>
							))}
						</div>
					</section>
				)}

				{(view === 'all' || view === 'albums') && (
					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Albums</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{initialAlbums.map((album) => (
								<AlbumCard
									key={album.id}
									album={album}
									onClick={handleAlbumClick}
								/>
							))}
						</div>
					</section>
				)}
			</div>

			<ArtistDetailsSheet
				artist={selectedArtist}
				open={artistSheetOpen}
				onOpenChange={setArtistSheetOpen}
			/>

			<AlbumDetailsSheet
				album={selectedAlbum}
				open={albumSheetOpen}
				onOpenChange={setAlbumSheetOpen}
			/>
		</>
	);
}
