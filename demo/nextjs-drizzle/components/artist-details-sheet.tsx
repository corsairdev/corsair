'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TracksTable } from '@/components/tracks-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { QueryOutputs } from '@/corsair/client';
import { useCorsairMutation, useCorsairQuery } from '@/corsair/client';
import {
	useAlbumsByArtistId,
	useTracksByArtistId,
} from '@/lib/api/queries.client';

interface ArtistDetailsSheetProps {
	artist: QueryOutputs['get artist by id'] | undefined;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ArtistDetailsSheet({
	artist,
	open,
	onOpenChange,
}: ArtistDetailsSheetProps) {
	const res = useCorsairQuery(
		'get albums by artist id',
		{
			artistId: artist?.id || '',
		},
		{
			enabled: !!artist?.id,
		},
	);

	// Client-side query hooks
	const {
		data: albums,
		isLoading: albumsLoading,
		refetch: refetchAlbums,
	} = useAlbumsByArtistId(artist?.id || null);
	const {
		data: tracks,
		isLoading: tracksLoading,
		refetch: refetchTracks,
	} = useTracksByArtistId(artist?.id || null);

	const updatePopularity = useCorsairMutation('update artist popularity');

	// Local state for optimistic updates
	const [localArtist, setLocalArtist] = useState(artist);

	useEffect(() => {
		setLocalArtist(artist);
	}, [artist]);

	if (!localArtist) return null;

	const handleIncreasePopularity = async () => {
		const newPopularity = Math.min(100, (localArtist.popularity || 0) + 5);
		setLocalArtist({ ...localArtist, popularity: newPopularity });

		await updatePopularity.mutateAsync({
			artistId: localArtist.id,
			popularity: newPopularity,
		});

		await refetchAlbums();
		await refetchTracks();
	};

	const handleDecreasePopularity = async () => {
		const newPopularity = Math.max(0, (localArtist.popularity || 0) - 5);
		setLocalArtist({ ...localArtist, popularity: newPopularity });

		await updatePopularity.mutateAsync({
			artistId: localArtist.id,
			popularity: newPopularity,
		});

		await refetchAlbums();
		await refetchTracks();
	};

	const formatFollowers = (count: number) => {
		if (count >= 1000000) {
			return `${(count / 1000000).toFixed(1)}M`;
		}
		if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}K`;
		}
		return count.toString();
	};

	const artistAlbums = albums || [];
	const artistTracks = tracks || [];

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-6">
				<SheetHeader className="space-y-3">
					<div className="flex items-center gap-4 mb-4">
						<Avatar className="h-24 w-24">
							<AvatarImage
								src={
									(localArtist.images as unknown as { url: string }[])?.[0]
										?.url || ''
								}
								alt={localArtist.name || ''}
							/>
							<AvatarFallback className="text-2xl">
								{localArtist.name?.charAt(0) || ''}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<SheetTitle className="text-3xl">{localArtist.name}</SheetTitle>
							{localArtist.followers && (
								<SheetDescription className="text-base mt-1">
									{formatFollowers(localArtist.followers)} followers
								</SheetDescription>
							)}
						</div>
					</div>

					<div className="flex items-center gap-2 flex-wrap">
						{localArtist.popularity !== undefined && (
							<div className="flex items-center gap-2">
								<Badge variant="secondary" className="text-sm">
									Popularity: {localArtist.popularity}
								</Badge>
								<Button
									size="sm"
									variant="outline"
									onClick={handleIncreasePopularity}
									disabled={updatePopularity.isPending}
								>
									+5
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={handleDecreasePopularity}
									disabled={updatePopularity.isPending}
								>
									-5
								</Button>
							</div>
						)}
						{!!localArtist.genres &&
							(localArtist.genres as string[]).length > 0 && (
								<>
									{(localArtist.genres as string[]).map((genre) => (
										<Badge key={genre} variant="outline">
											{genre}
										</Badge>
									))}
								</>
							)}
					</div>
				</SheetHeader>

				<div className="mt-6 space-y-6">
					{/* Albums Section */}
					<div>
						<h3 className="text-lg font-semibold mb-4">
							Albums ({artistAlbums.length})
						</h3>
						{albumsLoading ? (
							<p className="text-sm text-muted-foreground">Loading albums...</p>
						) : artistAlbums.length > 0 ? (
							<div className="grid grid-cols-2 gap-4">
								{artistAlbums.map((album) => (
									<Card key={album.id} className="overflow-hidden">
										<div className="relative aspect-square w-full">
											<Image
												src={
													(album.images as unknown as { url: string }[])?.[0]
														?.url || '/placeholder.png'
												}
												alt={album.name || ''}
												fill
												className="object-cover"
												sizes="(max-width: 768px) 50vw, 25vw"
											/>
										</div>
										<CardHeader className="p-3">
											<CardTitle className="text-sm line-clamp-2">
												{album.name}
											</CardTitle>
											<p className="text-xs text-muted-foreground">
												{new Date(album.release_date).getFullYear() || ''}
											</p>
										</CardHeader>
									</Card>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">
								No albums available
							</p>
						)}
					</div>

					{/* Tracks Section */}
					<div>
						<h3 className="text-lg font-semibold mb-4">
							Tracks ({artistTracks.length})
						</h3>
						{tracksLoading ? (
							<p className="text-sm text-muted-foreground">Loading tracks...</p>
						) : artistTracks.length > 0 ? (
							<TracksTable tracks={artistTracks} />
						) : (
							<p className="text-sm text-muted-foreground">
								No track data available
							</p>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
