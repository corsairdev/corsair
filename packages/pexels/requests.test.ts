import { logEventFromContext } from 'corsair/core';
import { Collections, Photos, Videos } from './endpoints';
import {
	collectionMedia,
	collectionsList,
	curatedPhotos,
	photo,
	popularVideos,
	searchPhotos,
	searchVideos,
	video,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'px-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
	};
}

function expectAuthenticated(path: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.pexels.com');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe('GET');
	expect(sent.headers.get('authorization')).toBe(API_KEY);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('photos', () => {
	it('search sends the query and filters', async () => {
		respond(searchPhotos);
		const page = (await invoke(Photos.search, {
			query: 'nature',
			orientation: 'landscape',
			color: 'green',
			page: 2,
			per_page: 25,
			// unknown: photo records are provider-shaped, so the cast keeps
			// them open.
		})) as { photos: unknown[]; total_results?: number };

		expect(page.photos).toHaveLength(1);
		expect(page.total_results).toBe(500);
		const sent = lastRequest();
		expectAuthenticated('/v1/search');
		expect(sent.query['query']).toBe('nature');
		expect(sent.query['orientation']).toBe('landscape');
		expect(sent.query['color']).toBe('green');
		expect(sent.query['page']).toBe('2');
		expect(sent.query['per_page']).toBe('25');
	});

	it('get reads one photo', async () => {
		respond(photo);
		const photoResult = (await invoke(Photos.get, { photoId: 2014422 })) as {
			id?: number;
		};
		expect(photoResult.id).toBe(2014422);
		expectAuthenticated('/v1/photos/2014422');
	});

	it('curated lists the curated feed', async () => {
		respond(curatedPhotos);
		await invoke(Photos.curated, { per_page: 10 });
		const sent = lastRequest();
		expectAuthenticated('/v1/curated');
		expect(sent.query['per_page']).toBe('10');
	});
});

describe('videos', () => {
	it('search sends the query', async () => {
		respond(searchVideos);
		await invoke(Videos.search, {
			query: 'waves',
			orientation: 'portrait',
			size: 'medium',
			locale: 'de-DE',
		});
		const sent = lastRequest();
		expect(sent.query['size']).toBe('medium');
		expect(sent.query['locale']).toBe('de-DE');
		expectAuthenticated('/v1/videos/search');
		expect(sent.query['query']).toBe('waves');
		expect(sent.query['orientation']).toBe('portrait');
	});

	it('get reads one video', async () => {
		respond(video);
		await invoke(Videos.get, { videoId: 2499611 });
		expectAuthenticated('/v1/videos/videos/2499611');
	});

	it('popular sends size and duration filters', async () => {
		respond(popularVideos);
		await invoke(Videos.popular, { min_width: 1280, min_duration: 5 });
		const sent = lastRequest();
		expectAuthenticated('/v1/videos/popular');
		expect(sent.query['min_width']).toBe('1280');
		expect(sent.query['min_duration']).toBe('5');
	});
});

describe('collections', () => {
	it('list and listFeatured call their routes', async () => {
		respond(collectionsList);
		await invoke(Collections.list, {});
		expectAuthenticated('/v1/collections');

		respond(collectionsList);
		await invoke(Collections.listFeatured, {});
		expectAuthenticated('/v1/collections/featured');
	});

	it('list reads the documented snake_case counts', async () => {
		respond(collectionsList);
		const page = (await invoke(Collections.list, {})) as {
			collections: Array<{ media_count?: number }>;
		};
		expect(page.collections[0]?.media_count).toBe(24);
	});

	it('listMedia GETs /v1/collections/:id with type and sort', async () => {
		respond({ id: '9nkrlyb', ...collectionMedia });
		const page = (await invoke(Collections.listMedia, {
			collectionId: '9nkrlyb',
			type: 'photos',
			sort: 'asc',
		})) as {
			media: Array<{
				type?: string;
				photographer_url?: string;
				video_files?: unknown[];
			}>; // unknown: rendition records are provider-shaped
		};
		expect(page.media).toHaveLength(2);
		expect(page.media[0]?.type).toBe('Photo');
		expect(page.media[0]?.photographer_url).toBe(
			'https://www.pexels.com/@jane',
		);
		expect(page.media[1]?.type).toBe('Video');
		expect(page.media[1]?.video_files?.length).toBeGreaterThan(0);
		expectAuthenticated('/v1/collections/9nkrlyb');
		expect(lastRequest().query).toEqual({ type: 'photos', sort: 'asc' });
	});

	it('listMedia refuses . and .. as the collection id', async () => {
		await expect(
			invoke(Collections.listMedia, { collectionId: '..' }),
		).rejects.toThrow('not a valid id');
	});
});
