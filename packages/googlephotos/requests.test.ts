jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	album,
	BASE,
	callAt,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mediaItem,
	mockFetch,
	restoreFetchMock,
	sentBody,
	sentHeader,
	tokenResponse,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('request shape', () => {
	it('sends the OAuth token as a bearer', async () => {
		mockFetch(jsonResponse({ albums: [] }));

		await endpoints.albums.list(makeCtx(), {});

		expect(sentHeader('authorization')).toBe('Bearer test-token');
	});

	it('lists albums with the documented query parameters', async () => {
		mockFetch(jsonResponse({ albums: [album], nextPageToken: 'tok' }));

		const result = await endpoints.albums.list(makeCtx(), {
			pageSize: 50,
			pageToken: 'prev',
			excludeNonAppCreatedData: true,
		});

		expect(lastCall().init.method).toBe('GET');
		const query = new URL(lastCall().url).searchParams;
		expect(query.get('pageSize')).toBe('50');
		expect(query.get('pageToken')).toBe('prev');
		expect(query.get('excludeNonAppCreatedData')).toBe('true');
		expect(result.nextPageToken).toBe('tok');
	});

	it('omits an unset album page size rather than sending null', async () => {
		mockFetch(jsonResponse({ albums: [] }));

		await endpoints.albums.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/albums`);
	});

	it('rejects an album page size above the documented 50', async () => {
		await expect(
			endpoints.albums.list(makeCtx(), { pageSize: 51 }),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('reads an album by an encoded id', async () => {
		mockFetch(jsonResponse(album));

		await endpoints.albums.get(makeCtx(), { albumId: 'album/1' });

		expect(lastCall().url).toBe(`${BASE}/albums/album%2F1`);
	});

	it('creates an album with the title under an `album` key', async () => {
		mockFetch(jsonResponse(album));

		await endpoints.albums.create(makeCtx(), { title: 'Holiday' });

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/albums`);
		expect(sentBody()).toEqual({ album: { title: 'Holiday' } });
	});

	it('renames an album with a PATCH and the title mask', async () => {
		mockFetch(jsonResponse(album));

		await endpoints.albums.update(makeCtx(), {
			albumId: 'album-1',
			title: 'Summer',
		});

		expect(lastCall().init.method).toBe('PATCH');
		const query = new URL(lastCall().url).searchParams;
		expect(query.get('updateMask')).toBe('title');
		expect(sentBody()).toEqual({ title: 'Summer' });
	});
});

describe('media items', () => {
	it('searches with a POST and the filters in the body', async () => {
		mockFetch(jsonResponse({ mediaItems: [mediaItem] }));

		const result = await endpoints.mediaItems.search(makeCtx(), {
			filters: {
				mediaTypeFilter: { mediaTypes: ['PHOTO'] },
				dateFilter: {
					ranges: [{ startDate: { year: 2024, month: 1, day: 1 } }],
				},
			},
			orderBy: 'MediaMetadata.creation_time desc',
			pageSize: 100,
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/mediaItems:search`);
		expect(sentBody()).toEqual({
			filters: {
				mediaTypeFilter: { mediaTypes: ['PHOTO'] },
				dateFilter: {
					ranges: [{ startDate: { year: 2024, month: 1, day: 1 } }],
				},
			},
			orderBy: 'MediaMetadata.creation_time desc',
			pageSize: 100,
		});
		expect(result.mediaItems).toHaveLength(1);
	});

	it('searches inside an album by albumId alone', async () => {
		mockFetch(jsonResponse({ mediaItems: [] }));

		await endpoints.mediaItems.search(makeCtx(), { albumId: 'album-1' });

		expect(sentBody()).toEqual({ albumId: 'album-1' });
	});

	it('refuses filters combined with an albumId, which the API rejects', async () => {
		await expect(
			endpoints.mediaItems.search(makeCtx(), {
				albumId: 'album-1',
				filters: { mediaTypeFilter: { mediaTypes: ['PHOTO'] } },
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('refuses orderBy without a date filter, which the API ignores', async () => {
		await expect(
			endpoints.mediaItems.search(makeCtx(), {
				orderBy: 'MediaMetadata.creation_time desc',
				filters: { mediaTypeFilter: { mediaTypes: ['PHOTO'] } },
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('refuses more than one media type in a filter', async () => {
		await expect(
			endpoints.mediaItems.search(makeCtx(), {
				filters: { mediaTypeFilter: { mediaTypes: ['PHOTO', 'VIDEO'] } },
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('refuses more than ten content categories', async () => {
		const eleven = [
			'LANDSCAPES',
			'RECEIPTS',
			'CITYSCAPES',
			'LANDMARKS',
			'SELFIES',
			'PEOPLE',
			'PETS',
			'WEDDINGS',
			'BIRTHDAYS',
			'DOCUMENTS',
			'TRAVEL',
		] as const;

		await expect(
			endpoints.mediaItems.search(makeCtx(), {
				filters: { contentFilter: { includedContentCategories: [...eleven] } },
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('lists media items with paging parameters', async () => {
		mockFetch(jsonResponse({ mediaItems: [mediaItem] }));

		await endpoints.mediaItems.list(makeCtx(), { pageSize: 25 });

		expect(lastCall().init.method).toBe('GET');
		expect(new URL(lastCall().url).searchParams.get('pageSize')).toBe('25');
	});

	it('reads one media item', async () => {
		mockFetch(jsonResponse(mediaItem));

		const result = await endpoints.mediaItems.get(makeCtx(), {
			mediaItemId: 'item-1',
		});

		expect(lastCall().url).toBe(`${BASE}/mediaItems/item-1`);
		expect(result.filename).toBe('beach.jpg');
	});

	it('batch-gets items by comma-joined ids', async () => {
		mockFetch(
			jsonResponse({
				mediaItemResults: [
					{ mediaItem },
					{ status: { code: 5, message: 'not found' } },
				],
			}),
		);

		const result = await endpoints.mediaItems.batchGet(makeCtx(), {
			mediaItemIds: ['item-1', 'item-2'],
		});

		expect(new URL(lastCall().url).searchParams.get('mediaItemIds')).toBe(
			'item-1,item-2',
		);
		// A failed id keeps its status rather than disappearing.
		expect(result.mediaItemResults[1]?.status?.code).toBe(5);
	});

	it('updates a description with the description mask', async () => {
		mockFetch(jsonResponse(mediaItem));

		await endpoints.mediaItems.update(makeCtx(), {
			mediaItemId: 'item-1',
			description: 'Sunset over the bay',
		});

		expect(lastCall().init.method).toBe('PATCH');
		expect(new URL(lastCall().url).searchParams.get('updateMask')).toBe(
			'description',
		);
		expect(sentBody()).toEqual({ description: 'Sunset over the bay' });
	});
});

describe('mediaItems.create', () => {
	it('uploads the bytes, then creates the item with the returned token', async () => {
		mockFetch(tokenResponse('upload-token-1'));
		mockFetch(
			jsonResponse({
				newMediaItemResults: [{ uploadToken: 'upload-token-1', mediaItem }],
			}),
		);

		const result = await endpoints.mediaItems.create(makeCtx(), {
			newMediaItems: [
				{
					fileName: 'beach.jpg',
					contentType: 'image/jpeg',
					bytes: Buffer.from('hello').toString('base64'),
				},
			],
		});

		// The upload is a separate call with the three documented headers.
		const upload = callAt(0);
		expect(upload.url).toBe(`${BASE}/uploads`);
		expect(upload.init.method).toBe('POST');
		const headers = new Headers(upload.init.headers);
		expect(headers.get('content-type')).toBe('application/octet-stream');
		expect(headers.get('x-goog-upload-content-type')).toBe('image/jpeg');
		expect(headers.get('x-goog-upload-protocol')).toBe('raw');

		// The create sends the token, not the bytes.
		const create = callAt(1);
		expect(create.url).toBe(`${BASE}/mediaItems:batchCreate`);
		const body = JSON.parse(String(create.init.body)) as Record<
			string,
			unknown
		>; // unknown: JSON.
		expect(body).toEqual({
			newMediaItems: [
				{
					simpleMediaItem: {
						uploadToken: 'upload-token-1',
						fileName: 'beach.jpg',
					},
				},
			],
		});
		expect(result.newMediaItemResults).toHaveLength(1);
	});

	it('adds an album and a position when asked', async () => {
		mockFetch(tokenResponse('tok'));
		mockFetch(jsonResponse({ newMediaItemResults: [{}] }));

		await endpoints.mediaItems.create(makeCtx(), {
			newMediaItems: [
				{ fileName: 'a.jpg', contentType: 'image/jpeg', bytes: 'aGk=' },
			],
			albumId: 'album-1',
			albumPosition: { position: 'FIRST_IN_ALBUM' },
		});

		// unknown: parsed JSON has no static shape; the test reads named keys.
		const body = JSON.parse(String(callAt(1).init.body)) as Record<
			string,
			unknown
		>;
		expect(body.albumId).toBe('album-1');
		expect(body.albumPosition).toEqual({ position: 'FIRST_IN_ALBUM' });
	});

	it('refuses more than 50 items, the documented batch limit', async () => {
		await expect(
			endpoints.mediaItems.create(makeCtx(), {
				newMediaItems: Array.from({ length: 51 }, (_, index) => ({
					fileName: `f${index}.jpg`,
					contentType: 'image/jpeg',
					bytes: 'aGk=',
				})),
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('refuses an empty body because the upload would return nothing', async () => {
		mockFetch(new Response('', { status: 200 }));

		await expect(
			endpoints.mediaItems.create(makeCtx(), {
				newMediaItems: [
					{ fileName: 'a.jpg', contentType: 'image/jpeg', bytes: 'aGk=' },
				],
			}),
		).rejects.toThrow(/empty body/);
	});
});

describe('album membership', () => {
	it('adds media items to an album', async () => {
		mockFetch(jsonResponse({}));

		await endpoints.albums.batchAddMediaItems(makeCtx(), {
			albumId: 'album-1',
			mediaItemIds: ['item-1', 'item-2'],
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/albums/album-1:batchAddMediaItems`);
		expect(sentBody()).toEqual({ mediaItemIds: ['item-1', 'item-2'] });
	});

	it('removes media items from an album', async () => {
		mockFetch(jsonResponse({}));

		await endpoints.albums.batchRemoveMediaItems(makeCtx(), {
			albumId: 'album-1',
			mediaItemIds: ['item-1'],
		});

		expect(lastCall().url).toBe(`${BASE}/albums/album-1:batchRemoveMediaItems`);
		expect(sentBody()).toEqual({ mediaItemIds: ['item-1'] });
	});

	it('refuses more than 50 ids per membership call', async () => {
		await expect(
			endpoints.albums.batchAddMediaItems(makeCtx(), {
				albumId: 'album-1',
				mediaItemIds: Array.from({ length: 51 }, (_, index) => `i${index}`),
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});
});

describe('albums.addEnrichment', () => {
	it('adds a text note at the end by default', async () => {
		mockFetch(jsonResponse({ enrichmentItem: { id: 'enr-1' } }));

		const result = await endpoints.albums.addEnrichment(makeCtx(), {
			albumId: 'album-1',
			text: 'Day one',
		});

		expect(lastCall().url).toBe(`${BASE}/albums/album-1:addEnrichment`);
		expect(sentBody()).toEqual({
			newEnrichmentItem: { textEnrichment: { text: 'Day one' } },
			// The position is required by the API.
			albumPosition: { position: 'LAST_IN_ALBUM' },
		});
		expect(result.enrichmentItem?.id).toBe('enr-1');
	});

	it('adds a location with its coordinates', async () => {
		mockFetch(jsonResponse({ enrichmentItem: { id: 'enr-2' } }));

		await endpoints.albums.addEnrichment(makeCtx(), {
			albumId: 'album-1',
			location: {
				locationName: 'Cape Town',
				latlng: { latitude: -33.9249, longitude: 18.4241 },
			},
			position: { position: 'FIRST_IN_ALBUM' },
		});

		expect(sentBody()).toEqual({
			newEnrichmentItem: {
				locationEnrichment: {
					location: {
						locationName: 'Cape Town',
						latlng: { latitude: -33.9249, longitude: 18.4241 },
					},
				},
			},
			albumPosition: { position: 'FIRST_IN_ALBUM' },
		});
	});

	it('refuses both a text note and a location', async () => {
		await expect(
			endpoints.albums.addEnrichment(makeCtx(), {
				albumId: 'album-1',
				text: 'Note',
				location: { locationName: 'Cape Town' },
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('refuses an AFTER_MEDIA_ITEM position with no relative item', async () => {
		await expect(
			endpoints.albums.addEnrichment(makeCtx(), {
				albumId: 'album-1',
				text: 'Note',
				position: { position: 'AFTER_MEDIA_ITEM' },
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});
});
