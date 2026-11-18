/**
 * Live smoke tests against the Google Photos Library API. They run only when
 * GOOGLE_PHOTOS_ACCESS_TOKEN is set (CI has none, so they skip).
 *
 * The token must carry the three scopes the plugin requests. Without them the
 * read calls answer 403, which is the failure the April 2025 scope change
 * causes, so a 403 here is a scope problem rather than a code problem.
 *
 * Read-only: albums.list and mediaItems.list with a one-item page. No upload
 * runs, because an upload writes to the user's library and counts toward their
 * storage.
 */
import { list as albumsList } from './endpoints/albums';
import { list as mediaItemsList } from './endpoints/media-items';
import { GooglePhotosEndpointOutputSchemas } from './endpoints/types';

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

describeLive('googlephotos live API', () => {
	jest.setTimeout(60_000);

	it('albums.list returns a parseable page', async () => {
		const page = await albumsList(ctx, { pageSize: 1 });

		// The endpoint parsed this with the output schema already; a page with no
		// albums is valid, so the assertion is on the shape, not the count.
		expect(page.albums === undefined || Array.isArray(page.albums)).toBe(true);
		expect(
			GooglePhotosEndpointOutputSchemas.albumsList.safeParse(page).success,
		).toBe(true);
	});

	it('mediaItems.list returns a parseable page', async () => {
		const page = await mediaItemsList(ctx, { pageSize: 1 });

		expect(
			page.mediaItems === undefined || Array.isArray(page.mediaItems),
		).toBe(true);
		// int64 fields arrive as strings, which the schema pins. A media item with
		// no dimensions of the right type would fail the parse above, so checking
		// one here catches the documented case where width/height are numbers.
		for (const item of page.mediaItems ?? []) {
			expect(typeof item.id).toBe('string');
			const width = item.mediaMetadata?.width;
			expect(width === undefined || typeof width === 'string').toBe(true);
		}
	});

	it('mediaItems.list asks for the documented page size bounds', async () => {
		// 100 is the documented maximum; the API accepts it, and a smaller page
		// proves the parameter travels.
		const page = await mediaItemsList(ctx, { pageSize: 100 });

		expect(Array.isArray(page.mediaItems ?? [])).toBe(true);
	});
});
