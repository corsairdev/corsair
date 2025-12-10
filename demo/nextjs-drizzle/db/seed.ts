import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';
import {
	album_artists,
	albums,
	artists,
	track_artists,
	tracks,
} from './schema';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

interface SpotifyArtist {
	id: string;
	name: string;
	popularity: number;
	followers: { total: number };
	genres: string[];
	images: any[];
	external_urls: any;
	uri: string;
	href: string;
}

interface SpotifyAlbum {
	id: string;
	name: string;
	album_type: string;
	artists: { id: string; name: string }[];
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	images: any[];
	external_urls: any;
	uri: string;
	href: string;
}

interface SpotifyTrackResponse {
	items: SpotifyTrack[];
}

interface SpotifyTrack {
	id: string;
	name: string;
	artists: { id: string; name: string }[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	track_number: number;
	preview_url: string | null;
	is_local: boolean;
	external_urls: any;
	uri: string;
	href: string;
}

async function seedDatabase() {
	try {
		console.log('Starting database seeding...');

		// Read JSON files
		const artistsData: SpotifyArtist[] = JSON.parse(
			fs.readFileSync(path.join(__dirname, '../data/artists.json'), 'utf-8'),
		);

		const albumsData: SpotifyAlbum[] = JSON.parse(
			fs.readFileSync(path.join(__dirname, '../data/albums.json'), 'utf-8'),
		);

		const tracksResponseData: SpotifyTrackResponse[] = JSON.parse(
			fs.readFileSync(path.join(__dirname, '../data/tracks.json'), 'utf-8'),
		);

		// Extract tracks from the response format
		const tracksData: SpotifyTrack[] = tracksResponseData.flatMap(
			(response) => response.items || [],
		);

		console.log(
			`Found ${artistsData.length} artists, ${albumsData.length} albums, ${tracksData.length} tracks`,
		);

		// Step 1: Collect ALL unique artists from all sources
		console.log('Collecting all unique artists...');
		const allArtistsMap = new Map<string, any>();

		// Add artists from artists.json (full data)
		artistsData.forEach((artist) => {
			allArtistsMap.set(artist.id, {
				id: artist.id,
				name: artist.name,
				popularity: artist.popularity,
				followers: artist.followers.total,
				genres: artist.genres,
				images: artist.images,
				external_urls: artist.external_urls,
				uri: artist.uri,
				href: artist.href,
			});
		});

		// Add artists from albums (minimal data)
		albumsData.forEach((album) => {
			album.artists.forEach((artist) => {
				if (!allArtistsMap.has(artist.id)) {
					allArtistsMap.set(artist.id, {
						id: artist.id,
						name: artist.name,
						popularity: null,
						followers: null,
						genres: [],
						images: [],
						external_urls: {},
					});
				}
			});
		});

		// Add artists from tracks (minimal data)
		tracksData.forEach((track) => {
			track.artists.forEach((artist) => {
				if (!allArtistsMap.has(artist.id)) {
					allArtistsMap.set(artist.id, {
						id: artist.id,
						name: artist.name,
						popularity: null,
						followers: null,
						genres: [],
						images: [],
						external_urls: {},
					});
				}
			});
		});

		console.log(`Total unique artists: ${allArtistsMap.size}`);

		// Step 2: Seed all artists first
		console.log('Seeding all artists...');
		for (const artistData of allArtistsMap.values()) {
			await db.insert(artists).values(artistData).onConflictDoNothing();
		}

		// Step 3: Seed albums
		console.log('Seeding albums...');
		for (const album of albumsData) {
			await db
				.insert(albums)
				.values({
					id: album.id,
					name: album.name,
					album_type: album.album_type,
					release_date: album.release_date,
					release_date_precision: album.release_date_precision,
					total_tracks: album.total_tracks,
					images: album.images,
					external_urls: album.external_urls,
					uri: album.uri,
					href: album.href,
				})
				.onConflictDoNothing();

			// Seed album-artist relationships
			for (const artist of album.artists) {
				await db
					.insert(album_artists)
					.values({
						album_id: album.id,
						artist_id: artist.id,
					})
					.onConflictDoNothing();
			}
		}

		// Step 4: Seed tracks
		console.log('Seeding tracks...');
		for (const track of tracksData) {
			await db
				.insert(tracks)
				.values({
					id: track.id,
					name: track.name,
					disc_number: track.disc_number,
					duration_ms: track.duration_ms,
					explicit: track.explicit,
					track_number: track.track_number,
					preview_url: track.preview_url,
					is_local: track.is_local,
					external_urls: track.external_urls,
					uri: track.uri,
					href: track.href,
				})
				.onConflictDoNothing();

			// Seed track-artist relationships
			for (const artist of track.artists) {
				await db
					.insert(track_artists)
					.values({
						track_id: track.id,
						artist_id: artist.id,
					})
					.onConflictDoNothing();
			}
		}

		console.log('Database seeding completed successfully!');
	} catch (error) {
		console.error('Error seeding database:', error);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

// Run the seeding function
// seedDatabase();
