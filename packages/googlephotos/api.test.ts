/**
 * Live tests against the Google Photos Library API. They run only when
 * GOOGLE_PHOTOS_ACCESS_TOKEN is set (CI has none, so they skip):
 *
 *   GOOGLE_PHOTOS_ACCESS_TOKEN=ya29... pnpm test:live
 *
 * The token is a Google OAuth access token for a test account, with the
 * Photos Library API enabled on its Cloud project and the three scopes the
 * plugin requests: photoslibrary.appendonly,
 * photoslibrary.readonly.appcreateddata and photoslibrary.edit.appcreateddata.
 * Without them the calls answer 403, which is the failure the March 2025 scope
 * change causes, so a 403 here is a scope problem rather than a code problem.
 *
 * Since March 2025 the API reads only what the app created, so the suite makes
 * its own data and runs every operation on it: it creates an album, uploads a
 * tiny generated PNG into it, reads it back every way the API offers, edits
 * it, and moves it out of and back into the album.
 *
 * The Library API has no delete method for albums or media items, so what the
 * suite creates stays in the account. Everything is named "corsair-live-test"
 * so it is easy to find and delete by hand in Google Photos.
 */
import { deflateSync } from 'node:zlib';
import { mediaBytesUrl } from './client';
import {
	addEnrichment,
	create as albumsCreate,
	get as albumsGet,
	list as albumsList,
	update as albumsUpdate,
	batchAddMediaItems,
	batchRemoveMediaItems,
} from './endpoints/albums';
import {
	batchGet,
	create as mediaItemsCreate,
	get as mediaItemsGet,
	list as mediaItemsList,
	search as mediaItemsSearch,
	update as mediaItemsUpdate,
} from './endpoints/media-items';
import { isFailureStatus } from './endpoints/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const TOKEN = process.env.GOOGLE_PHOTOS_ACCESS_TOKEN?.trim();
const describeLive = TOKEN ? describe : describe.skip;

if (!TOKEN) {
	console.warn(
		'[googlephotos] skipping live tests: GOOGLE_PHOTOS_ACCESS_TOKEN is not set',
	);
}

// unknown: the endpoints read only `key` from the context.
const ctx = { key: TOKEN ?? '' } as unknown as Parameters<typeof albumsList>[0];

const LABEL = `corsair-live-test ${new Date().toISOString()}`;

/** CRC-32 as PNG chunks need it. */
function crc32(bytes: Buffer): number {
	let crc = 0xffffffff;
	for (const byte of bytes) {
		crc ^= byte;
		for (let bit = 0; bit < 8; bit++) {
			crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
		}
	}
	return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
	const length = Buffer.alloc(4);
	length.writeUInt32BE(data.length);
	const typed = Buffer.concat([Buffer.from(type, 'ascii'), data]);
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(typed));
	return Buffer.concat([length, typed, crc]);
}

/**
 * An 8x8 PNG of one random colour. A fresh colour each run means Google does
 * not match it to an upload from an earlier run.
 */
function tinyPng(): Buffer {
	const size = 8;
	const header = Buffer.alloc(13);
	header.writeUInt32BE(size, 0);
	header.writeUInt32BE(size, 4);
	header.writeUInt8(8, 8); // bit depth
	header.writeUInt8(2, 9); // truecolour RGB
	const rgb = Array.from({ length: 3 }, () => Math.floor(Math.random() * 256));
	const row = Buffer.concat([
		Buffer.from([0]), // filter: none
		Buffer.from(Array.from({ length: size }, () => rgb).flat()),
	]);
	const pixels = Buffer.concat(Array.from({ length: size }, () => row));
	return Buffer.concat([
		Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		pngChunk('IHDR', header),
		pngChunk('IDAT', deflateSync(pixels)),
		pngChunk('IEND', Buffer.alloc(0)),
	]);
}

describeLive('googlephotos live API', () => {
	jest.setTimeout(120_000);

	let albumId = '';
	let mediaItemId = '';
	// The album and the uploaded item are made once here, so any single test
	// can run on its own (jest -t) without depending on another test's state.
	let createdAlbum: Awaited<ReturnType<typeof albumsCreate>>;
	let createdItems: Awaited<ReturnType<typeof mediaItemsCreate>>;

	beforeAll(async () => {
		createdAlbum = await albumsCreate(ctx, { title: LABEL });
		albumId = createdAlbum.id;
		createdItems = await mediaItemsCreate(ctx, {
			newMediaItems: [
				{
					file: {
						base64: tinyPng().toString('base64'),
						filename: 'corsair-live-test.png',
						contentType: 'image/png',
					},
					description: 'corsair-live-test upload',
				},
			],
			albumId,
		});
		mediaItemId = createdItems.newMediaItemResults[0]?.mediaItem?.id ?? '';
	}, 120_000);

	it('albums.create makes an app-created album', () => {
		expect(typeof createdAlbum.id).toBe('string');
		expect(createdAlbum.title).toBe(LABEL);
	});

	it('albums.get reads it back', async () => {
		const album = await albumsGet(ctx, { albumId });

		expect(album.id).toBe(albumId);
		expect(album.isWriteable).toBe(true);
	});

	it('albums.list finds it, following nextPageToken', async () => {
		let pageToken: string | undefined;
		let found = false;
		// Earlier runs leave albums behind, so the new one can be on a later page.
		for (let page = 0; page < 20 && !found; page++) {
			const result = await albumsList(ctx, {
				pageSize: 50,
				pageToken,
				excludeNonAppCreatedData: true,
			});
			found = (result.albums ?? []).some((album) => album.id === albumId);
			pageToken = result.nextPageToken ?? undefined;
			if (!pageToken) break;
		}

		expect(found).toBe(true);
	});

	it('albums.update renames it', async () => {
		const album = await albumsUpdate(ctx, {
			albumId,
			title: `${LABEL} (renamed)`,
		});

		expect(album.title).toBe(`${LABEL} (renamed)`);
	});

	it('albums.addEnrichment adds a text note', async () => {
		const result = await addEnrichment(ctx, {
			albumId,
			text: 'corsair-live-test note',
		});

		expect(typeof result.enrichmentItem?.id).toBe('string');
	});

	it('mediaItems.create uploads a PNG and creates it in the album', () => {
		expect(createdItems.newMediaItemResults).toHaveLength(1);
		const [entry] = createdItems.newMediaItemResults;
		expect(isFailureStatus(entry?.status)).toBe(false);
		expect(typeof entry?.mediaItem?.id).toBe('string');
	});

	it('mediaItems.get reads the new item, with int64 sizes as strings', async () => {
		const item = await mediaItemsGet(ctx, { mediaItemId });

		expect(item.id).toBe(mediaItemId);
		expect(item.mimeType).toBe('image/png');
		const width = item.mediaMetadata?.width;
		expect(width === undefined || typeof width === 'string').toBe(true);
	});

	it('mediaBytesUrl builds a URL that serves the bytes', async () => {
		const item = await mediaItemsGet(ctx, { mediaItemId });
		const response = await fetch(mediaBytesUrl(item, { width: 8, height: 8 }));

		expect(response.ok).toBe(true);
		expect(response.headers.get('content-type')).toMatch(/^image\//);
	});

	it('mediaItems.batchGet reads it with a per-id status', async () => {
		const result = await batchGet(ctx, { mediaItemIds: [mediaItemId] });

		expect(result.mediaItemResults).toHaveLength(1);
		expect(result.mediaItemResults[0]?.mediaItem?.id).toBe(mediaItemId);
		expect(isFailureStatus(result.mediaItemResults[0]?.status)).toBe(false);
	});

	it('mediaItems.list returns a parseable page of app-created items', async () => {
		const page = await mediaItemsList(ctx, { pageSize: 100 });

		expect(Array.isArray(page.mediaItems ?? [])).toBe(true);
		for (const item of page.mediaItems ?? []) {
			expect(typeof item.id).toBe('string');
		}
	});

	it('mediaItems.search lists the album and finds the item', async () => {
		const page = await mediaItemsSearch(ctx, { albumId, pageSize: 100 });

		expect((page.mediaItems ?? []).map((item) => item.id)).toContain(
			mediaItemId,
		);
	});

	it('mediaItems.search takes a whole-year date filter (month and day 0)', async () => {
		const page = await mediaItemsSearch(ctx, {
			filters: {
				dateFilter: {
					dates: [{ year: new Date().getUTCFullYear(), month: 0, day: 0 }],
				},
				excludeNonAppCreatedData: true,
			},
			orderBy: 'MediaMetadata.creation_time desc',
			pageSize: 25,
		});

		expect(Array.isArray(page.mediaItems ?? [])).toBe(true);
	});

	it('mediaItems.update changes the description', async () => {
		const item = await mediaItemsUpdate(ctx, {
			mediaItemId,
			description: 'corsair-live-test (edited)',
		});

		expect(item.description).toBe('corsair-live-test (edited)');
	});

	it('albums.batchRemoveMediaItems takes the item out and batchAddMediaItems puts it back', async () => {
		// One test, so the item is always restored to the album it started in.
		await batchRemoveMediaItems(ctx, { albumId, mediaItemIds: [mediaItemId] });
		const removed = await mediaItemsSearch(ctx, { albumId, pageSize: 100 });
		expect((removed.mediaItems ?? []).map((item) => item.id)).not.toContain(
			mediaItemId,
		);

		await batchAddMediaItems(ctx, { albumId, mediaItemIds: [mediaItemId] });
		const restored = await mediaItemsSearch(ctx, { albumId, pageSize: 100 });
		expect((restored.mediaItems ?? []).map((item) => item.id)).toContain(
			mediaItemId,
		);
	});
});
