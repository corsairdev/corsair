jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { ApiError } from 'corsair/http';
import { mediaBytesUrl, retryAfterMs } from './client';
import {
	album,
	endpoints,
	googleError,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mediaItem,
	mockFetch,
	restoreFetchMock,
	tokenResponse,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

/** The error a call rejects with. Callers narrow it to the class they assert on. */
async function failure(
	promise: Promise<unknown>, // unknown: a promise can reject with any value.
): Promise<Error> {
	try {
		await promise;
	} catch (error) {
		if (error instanceof Error) return error;
		throw error;
	}
	throw new Error('Expected the call to reject, but it resolved.');
}

describe('response parsing', () => {
	it('keeps an empty album list as an empty page', async () => {
		mockFetch(jsonResponse({ albums: [] }));

		const result = await endpoints.albums.list(makeCtx(), {});

		expect(result.albums).toEqual([]);
	});

	it('accepts a page with no albums key, which Google omits when the library is empty', async () => {
		mockFetch(jsonResponse({}));

		const result = await endpoints.albums.list(makeCtx(), {});

		expect(result.albums).toBeUndefined();
	});

	it('rejects an album with no id as a wrongly shaped body', async () => {
		mockFetch(jsonResponse({ albums: [{ title: 'No id' }] }));

		const error = await failure(endpoints.albums.list(makeCtx(), {}));

		expect(error.name).toBe('ZodError');
	});

	it('rejects a mediaItemsCount that arrived as a number, not the documented string', async () => {
		mockFetch(jsonResponse({ id: 'album-1', mediaItemsCount: 12 }));

		const error = await failure(
			endpoints.albums.get(makeCtx(), { albumId: 'album-1' }),
		);

		expect(error.name).toBe('ZodError');
	});

	it('rejects an unknown video status rather than passing it through', async () => {
		mockFetch(
			jsonResponse({
				...mediaItem,
				mediaMetadata: { video: { status: 'TRANSCODING' } },
			}),
		);

		const error = await failure(
			endpoints.mediaItems.get(makeCtx(), { mediaItemId: 'item-1' }),
		);

		expect(error.name).toBe('ZodError');
	});

	it('keeps undocumented extra fields on a media item', async () => {
		mockFetch(jsonResponse({ ...mediaItem, archived: true }));

		const result = await endpoints.mediaItems.get(makeCtx(), {
			mediaItemId: 'item-1',
		});

		expect(result).toMatchObject({ archived: true });
	});

	it('surfaces a 207 partial success with each item status', async () => {
		// A batchCreate that creates some items answers 207, not an error, so the
		// per-item statuses are the only signal. The upload runs first.
		mockFetch(tokenResponse('tok-1'));
		mockFetch(
			jsonResponse(
				{
					newMediaItemResults: [
						{ status: { message: 'Success' }, mediaItem },
						{
							uploadToken: 'tok-2',
							status: { code: 13, message: 'Internal error' },
						},
					],
				},
				{ status: 207 },
			),
		);

		const result = await endpoints.mediaItems.create(makeCtx(), {
			newMediaItems: [
				{ fileName: 'a.jpg', contentType: 'image/jpeg', bytes: 'aGk=' },
			],
		});

		expect(result.newMediaItemResults).toHaveLength(2);
		// Success carries no code, so a status with a message but no code is not
		// a failure and must parse.
		expect(result.newMediaItemResults[0]?.status?.code).toBeUndefined();
		expect(result.newMediaItemResults[0]?.mediaItem?.id).toBe('item-1');
	});

	it('keeps a per-item failure status instead of dropping the entry', async () => {
		mockFetch(
			jsonResponse({
				mediaItemResults: [
					{ mediaItem },
					{ status: { code: 3, message: 'Invalid upload token' } },
				],
			}),
		);

		const fetched = await endpoints.mediaItems.batchGet(makeCtx(), {
			mediaItemIds: ['item-1', 'item-2'],
		});

		// Every requested id gets an entry, and a failed one carries its status
		// rather than disappearing from the list.
		expect(fetched.mediaItemResults).toHaveLength(2);
		expect(fetched.mediaItemResults[1]?.status?.message).toBe(
			'Invalid upload token',
		);
		expect(fetched.mediaItemResults[1]?.mediaItem).toBeUndefined();
	});
});

describe('media base URLs', () => {
	// The docs are explicit that a base URL is not fetchable on its own.
	it('refuses a bare base URL', () => {
		expect(() => mediaBytesUrl('https://lh3/x')).toThrow(/needs a size/);
	});

	it('appends =d for the original bytes', () => {
		expect(mediaBytesUrl('https://lh3/x', { download: true })).toBe(
			'https://lh3/x=d',
		);
	});

	it('appends the width and height', () => {
		expect(mediaBytesUrl('https://lh3/x', { width: 2048, height: 1024 })).toBe(
			'https://lh3/x=w2048-h1024',
		);
	});

	it('adds -c when cropping to exact dimensions', () => {
		expect(
			mediaBytesUrl('https://lh3/x', { width: 100, height: 100, crop: true }),
		).toBe('https://lh3/x=w100-h100-c');
	});

	it('refuses a width with no height', () => {
		expect(() => mediaBytesUrl('https://lh3/x', { width: 100 })).toThrow(
			/together/,
		);
	});

	it('refuses a non-positive size', () => {
		expect(() =>
			mediaBytesUrl('https://lh3/x', { width: 0, height: 100 }),
		).toThrow(/positive integer/);
	});
});

describe('Google error envelopes', () => {
	it('keeps the provider body and status', async () => {
		mockFetch(googleError(403, 'PERMISSION_DENIED', 'No access to this album'));

		const error = await failure(
			endpoints.albums.get(makeCtx(), { albumId: 'album-1' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw error;
		expect(error.status).toBe(403);
		expect(JSON.stringify(error.body)).toContain('No access to this album');
	});

	it('does not put the bearer token in the error', async () => {
		mockFetch(googleError(401, 'UNAUTHENTICATED'));

		const error = await failure(endpoints.albums.list(makeCtx(), {}));

		expect(error.message).not.toContain('test-token');
		if (error instanceof ApiError) {
			expect(error.url).not.toContain('test-token');
		}
	});

	it('reports an upload failure with the provider status', async () => {
		mockFetch(
			jsonResponse(
				{
					error: {
						code: 400,
						message: 'Request contains an invalid argument.',
						status: 'INVALID_ARGUMENT',
					},
				},
				{ status: 400 },
			),
		);

		const error = await failure(
			endpoints.mediaItems.create(makeCtx(), {
				newMediaItems: [
					{ fileName: 'a.jpg', contentType: 'image/jpeg', bytes: 'aGk=' },
				],
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw error;
		expect(error.status).toBe(400);
		expect(error.message).toContain('invalid argument');
	});

	it('carries an upload Retry-After into the error, in milliseconds', async () => {
		mockFetch(
			jsonResponse(
				{
					error: {
						code: 429,
						message: 'slow down',
						status: 'RESOURCE_EXHAUSTED',
					},
				},
				{ status: 429, headers: { 'Retry-After': '120' } },
			),
		);

		const error = await failure(
			endpoints.mediaItems.create(makeCtx(), {
				newMediaItems: [
					{ fileName: 'a.jpg', contentType: 'image/jpeg', bytes: 'aGk=' },
				],
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw error;
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(120_000);
	});

	it('reports an upload failure with a text body as text', async () => {
		mockFetch(new Response('upstream unavailable', { status: 503 }));

		const error = await failure(
			endpoints.mediaItems.create(makeCtx(), {
				newMediaItems: [
					{ fileName: 'a.jpg', contentType: 'image/jpeg', bytes: 'aGk=' },
				],
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw error;
		expect(error.status).toBe(503);
	});
});

describe('album and item fixtures', () => {
	it('parses a documented album', async () => {
		mockFetch(jsonResponse(album));

		const result = await endpoints.albums.get(makeCtx(), {
			albumId: 'album-1',
		});

		expect(result.title).toBe('Holiday');
		// int64 arrives as a string, which is what the schema pins.
		expect(result.mediaItemsCount).toBe('12');
	});

	it('parses a documented media item with its dimensions as strings', async () => {
		mockFetch(jsonResponse(mediaItem));

		const result = await endpoints.mediaItems.get(makeCtx(), {
			mediaItemId: 'item-1',
		});

		expect(result.mediaMetadata?.width).toBe('4032');
		expect(result.baseUrl).toContain('googleusercontent.com');
	});
});

describe('Retry-After parsing', () => {
	it('reads delay-seconds', () => {
		expect(retryAfterMs('45')).toBe(45_000);
	});

	it('reads an HTTP date as the time left until it', () => {
		const at = new Date(Date.now() + 90_000).toUTCString();
		const ms = retryAfterMs(at) ?? 0;
		expect(ms).toBeGreaterThan(80_000);
		expect(ms).toBeLessThanOrEqual(90_000);
	});

	it('ignores a missing or unreadable header', () => {
		expect(retryAfterMs(null)).toBeUndefined();
		expect(retryAfterMs('soon')).toBeUndefined();
	});
});
