import { z } from 'zod';

export const SpotifyTrack = z.object({
	id: z.string(),
	name: z.string(),
	artists: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
			}),
		)
		.optional(),
	album: z
		.object({
			id: z.string(),
			name: z.string(),
			images: z
				.array(
					z.object({
						url: z.string(),
						height: z.number().optional(),
						width: z.number().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
	duration_ms: z.number().optional(),
	explicit: z.boolean().optional(),
	external_urls: z
		.object({
			spotify: z.string().optional(),
		})
		.optional(),
	href: z.string().optional(),
	is_local: z.boolean().optional(),
	popularity: z.number().optional(),
	preview_url: z.string().nullable().optional(),
	track_number: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const SpotifyAlbum = z.object({
	id: z.string(),
	name: z.string(),
	album_type: z.string().optional(),
	total_tracks: z.number().optional(),
	available_markets: z.array(z.string()).optional(),
	external_urls: z
		.object({
			spotify: z.string().optional(),
		})
		.optional(),
	href: z.string().optional(),
	images: z
		.array(
			z.object({
				url: z.string(),
				height: z.number().optional(),
				width: z.number().optional(),
			}),
		)
		.optional(),
	release_date: z.string().optional(),
	release_date_precision: z.string().optional(),
	artists: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				external_urls: z
					.object({
						spotify: z.string().optional(),
					})
					.optional(),
			}),
		)
		.optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const SpotifyArtist = z.object({
	id: z.string(),
	name: z.string(),
	external_urls: z
		.object({
			spotify: z.string().optional(),
		})
		.optional(),
	followers: z
		.object({
			total: z.number().optional(),
		})
		.optional(),
	genres: z.array(z.string()).optional(),
	href: z.string().optional(),
	images: z
		.array(
			z.object({
				url: z.string(),
				height: z.number().optional(),
				width: z.number().optional(),
			}),
		)
		.optional(),
	popularity: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const SpotifyPlaylist = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	public: z.boolean().optional(),
	collaborative: z.boolean().optional(),
	owner: z
		.object({
			id: z.string(),
			display_name: z.string().optional(),
			external_urls: z
				.object({
					spotify: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	followers: z
		.object({
			total: z.number().optional(),
		})
		.optional(),
	images: z
		.array(
			z.object({
				url: z.string(),
				height: z.number().optional(),
				width: z.number().optional(),
			}),
		)
		.optional(),
	tracks: z
		.object({
			href: z.string().optional(),
			total: z.number().optional(),
		})
		.optional(),
	external_urls: z
		.object({
			spotify: z.string().optional(),
		})
		.optional(),
	href: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const SpotifyPlaylistItem = z.object({
	id: z.string(),
	playlist_id: z.string(),
	track_id: z.string().optional(),
	added_at: z.string().optional(),
	added_by: z
		.object({
			id: z.string().optional(),
		})
		.optional(),
	is_local: z.boolean().optional(),
	position: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const SpotifyUser = z.object({
	id: z.string(),
	display_name: z.string().optional(),
	external_urls: z
		.object({
			spotify: z.string().optional(),
		})
		.optional(),
	followers: z
		.object({
			total: z.number().optional(),
		})
		.optional(),
	href: z.string().optional(),
	images: z
		.array(
			z.object({
				url: z.string(),
				height: z.number().optional(),
				width: z.number().optional(),
			}),
		)
		.optional(),
	product: z.string().optional(),
	type: z.string().optional(),
	uri: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type SpotifyTrack = z.infer<typeof SpotifyTrack>;
export type SpotifyAlbum = z.infer<typeof SpotifyAlbum>;
export type SpotifyArtist = z.infer<typeof SpotifyArtist>;
export type SpotifyPlaylist = z.infer<typeof SpotifyPlaylist>;
export type SpotifyPlaylistItem = z.infer<typeof SpotifyPlaylistItem>;
export type SpotifyUser = z.infer<typeof SpotifyUser>;