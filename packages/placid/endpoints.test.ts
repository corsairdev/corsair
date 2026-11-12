import { Images, Pdfs, Videos } from './endpoints';
import {
	imageFailed,
	imageFinished,
	imageQueued,
	pdfQueued,
	videoQueued,
} from './test-fixtures';

// The endpoint functions take a live Corsair context. These tests only need the
// key plus the two context fields the call helper reads, so the fake is typed
// loosely here and cast once at the call site.

let fetchMock: jest.SpyInstance;

// unknown: the context is built field by field in contextFor(); call() reads
// only `key` and passes the rest to the event logger.
type Context = Parameters<typeof Images.create>[0];

// unknown: a stand-in for the real plugin context, which would need a database,
// a KEK and an issued DEK to build. Only `key` and `hooks` are read here.
function contextFor(key = 'placid-test-key'): Context {
	return {
		key,
		hooks: {},
		// The logger reads options to decide whether to print, and stays silent
		// when they are empty.
		options: {},
		// unknown: only `key` and `hooks` are read here; the real context needs
		// a database, a KEK and an issued DEK to build.
	} as unknown as Context;
}

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function respondEmpty(status = 204) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastCall() {
	return fetchMock.mock.calls[fetchMock.mock.calls.length - 1] as [
		string,
		RequestInit,
	];
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('images', () => {
	it('creates an image with the template uuid, layers and options', async () => {
		respond(imageQueued);

		const result = await Images.create(contextFor(), {
			template_uuid: 'ospo24ysn',
			layers: {
				title: { text: 'Meet Singh' },
				img: { image: 'https://example.com/lion.jpg' },
				badge: { hide: true },
			},
			modifications: { width: 1080, image_format: 'png' },
			create_now: true,
			passthrough: 'order-42',
		});

		expect(result.status).toBe('queued');
		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/images');
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({
			template_uuid: 'ospo24ysn',
			layers: {
				title: { text: 'Meet Singh' },
				img: { image: 'https://example.com/lion.jpg' },
				badge: { hide: true },
			},
			modifications: { width: 1080, image_format: 'png' },
			create_now: true,
			passthrough: 'order-42',
		});
	});

	it('keeps the render error fields on a failed image', async () => {
		respond(imageFailed);

		const result = await Images.get(contextFor(), { id: 7 });

		expect(result.status).toBe('error');
		expect(result.error_code).toBe('MEDIA_DOWNLOAD_FAILED');
		expect(result.error_details?.[0]?.layer).toBe('img');
	});

	it('reads a finished image URL', async () => {
		respond(imageFinished);

		const result = await Images.get(contextFor(), { id: 1 });

		expect(result.image_url).toContain('https://placid.app/u/');
		const [url] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/images/1');
	});

	it('reports a delete as done after the 204', async () => {
		respondEmpty(204);

		const result = await Images.remove(contextFor(), { id: 1 });

		expect(result).toEqual({ success: true, id: 1 });
		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/images/1');
		expect(init.method).toBe('DELETE');
	});

	it('rejects an image with no template uuid before calling', async () => {
		await expect(Images.create(contextFor(), {} as never)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('pdfs', () => {
	it('sends one page per template in order', async () => {
		respond(pdfQueued);

		await Pdfs.create(contextFor(), {
			pages: [
				{ template_uuid: 'cover', layers: { title: { text: 'Certificate' } } },
				{ template_uuid: 'body', layers: { name: { text: 'Jonathan Doe' } } },
			],
		});

		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/pdfs');
		const body = JSON.parse(String(init.body));
		expect(body.pages).toHaveLength(2);
		expect(
			body.pages.map((p: { template_uuid: string }) => p.template_uuid),
		).toEqual(['cover', 'body']);
	});

	it('merges existing PDFs from URLs', async () => {
		respond(pdfQueued);

		await Pdfs.merge(contextFor(), {
			urls: ['https://example.com/a.pdf', 'https://example.com/b.pdf'],
		});

		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/pdfs/merge');
		expect(JSON.parse(String(init.body)).urls).toHaveLength(2);
	});

	it('rejects a merge with fewer than two URLs', async () => {
		await expect(
			Pdfs.merge(contextFor(), { urls: ['https://example.com/a.pdf'] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads a finished PDF URL', async () => {
		respond({ ...pdfQueued, status: 'finished', pdf_url: 'https://x/y.pdf' });

		const result = await Pdfs.get(contextFor(), { id: 2 });

		expect(result.status).toBe('finished');
		expect(result.pdf_url).toBe('https://x/y.pdf');
		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/pdfs/2');
		expect(init.method).toBe('GET');
	});

	it('deletes a PDF', async () => {
		respondEmpty(204);

		await expect(Pdfs.remove(contextFor(), { id: 2 })).resolves.toEqual({
			success: true,
			id: 2,
		});
		expect(lastCall()[1].method).toBe('DELETE');
	});
});

describe('videos', () => {
	it('sends clips with their audio options', async () => {
		respond(videoQueued);

		await Videos.create(contextFor(), {
			clips: [
				{
					template_uuid: 'illcmemnt',
					layers: { title: { text: '@username' } },
					audio: 'https://example.com/track.mp3',
					audio_duration: 'auto',
					audio_trim_start: '00:00:05',
				},
			],
			modifications: { fps: 30, canvas_background: 'blur' },
		});

		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/videos');
		const body = JSON.parse(String(init.body));
		expect(body.clips[0].audio).toBe('https://example.com/track.mp3');
		expect(body.clips[0].audio_duration).toBe('auto');
		expect(body.modifications.fps).toBe(30);
	});

	it('rejects an fps beyond the documented maximum', async () => {
		await expect(
			Videos.create(contextFor(), {
				clips: [{ template_uuid: 'a' }],
				modifications: { fps: 60 },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads a finished video URL', async () => {
		respond({
			...videoQueued,
			status: 'finished',
			video_url: 'https://x/y.mp4',
		});

		const result = await Videos.get(contextFor(), { id: 3 });

		expect(result.status).toBe('finished');
		expect(result.video_url).toBe('https://x/y.mp4');
		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/videos/3');
		expect(init.method).toBe('GET');
	});

	it('deletes a video', async () => {
		respondEmpty(204);

		await expect(Videos.remove(contextFor(), { id: 3 })).resolves.toEqual({
			success: true,
			id: 3,
		});
	});
});
