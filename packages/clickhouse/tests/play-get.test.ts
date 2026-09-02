import { ClickhouseAPIError } from '../client';
import { Play } from '../endpoints';
import { ClickhouseEndpointOutputSchemas } from '../endpoints/types';

const originalFetch = globalThis.fetch;

type FetchCall = [unknown, RequestInit | undefined];

afterEach(() => {
	globalThis.fetch = originalFetch;
	jest.restoreAllMocks();
});

function makeCtx(opts: { baseUrl?: string; key: string }) {
	return {
		key: opts.key,
		options: { authType: 'api_key' as const, baseUrl: opts.baseUrl },
		$getAccountId: async () => null,
		db: undefined,
	};
}

/**
 * Build a minimal Response-like object whose `body.getReader()` yields the
 * supplied string in 64 KiB chunks. Enough for the streaming reader in
 * fetchPlayHtml to work in tests without pulling in a full Response mock.
 */
function streamingResponse(
	body: string,
	init?: { status?: number; statusText?: string; contentLength?: number },
): Response {
	const status = init?.status ?? 200;
	const statusText = init?.statusText ?? 'OK';
	const contentLength = init?.contentLength ?? body.length;
	const headers = new Headers({
		'content-length': String(contentLength),
	});
	const encoder = new TextEncoder();
	const CHUNK = 64 * 1024;
	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			const bytes = encoder.encode(body);
			for (let i = 0; i < bytes.length; i += CHUNK) {
				controller.enqueue(
					bytes.subarray(i, Math.min(i + CHUNK, bytes.length)),
				);
			}
			controller.close();
		},
	});
	return {
		ok: status >= 200 && status < 300,
		status,
		statusText,
		headers,
		body: stream,
	} as unknown as Response;
}

describe('Play.get', () => {
	it('fetches /play and returns the HTML', async () => {
		const html = '<html><body>ClickHouse Play</body></html>';
		globalThis.fetch = jest.fn(async () =>
			streamingResponse(html),
		) as unknown as typeof fetch;

		const result = await Play.get(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{},
		);

		const parsed =
			ClickhouseEndpointOutputSchemas.getPlayInterface.parse(result);
		expect(parsed.url).toBe('https://ch.example.com/play');
		expect(parsed.html).toBe(html);
		expect(parsed.sizeBytes).toBe(html.length);
	});

	it('strips a trailing slash before appending /play', async () => {
		const fetchSpy = jest.fn<Promise<Response>, FetchCall>(async () =>
			streamingResponse('<html/>'),
		);
		globalThis.fetch = fetchSpy as unknown as typeof fetch;

		await Play.get(
			makeCtx({
				baseUrl: 'https://ch.example.com/',
				key: 'Basic AAA=',
			}) as never,
			{},
		);

		const call = fetchSpy.mock.calls[0] as FetchCall;
		expect(call[0]).toBe('https://ch.example.com/play');
	});

	it('throws ClickhouseAPIError on a 4xx response', async () => {
		globalThis.fetch = jest.fn(async () =>
			streamingResponse('', { status: 401, statusText: 'Unauthorized' }),
		) as unknown as typeof fetch;

		await expect(
			Play.get(
				makeCtx({
					baseUrl: 'https://ch.example.com',
					key: 'Basic bad',
				}) as never,
				{},
			),
		).rejects.toBeInstanceOf(ClickhouseAPIError);
	});

	it('throws and cancels the reader when the response exceeds MAX_PLAY_BYTES', async () => {
		// 6 MB body — exceeds the 5 MB cap. The streaming reader must cancel
		// before buffering the full body so the in-memory peak stays bounded.
		const bigBody = 'x'.repeat(6 * 1024 * 1024);
		let cancelCalled = false;
		const stream = new ReadableStream<Uint8Array>({
			start(controller) {
				const encoder = new TextEncoder();
				const bytes = encoder.encode(bigBody);
				const CHUNK = 64 * 1024;
				for (let i = 0; i < bytes.length; i += CHUNK) {
					controller.enqueue(
						bytes.subarray(i, Math.min(i + CHUNK, bytes.length)),
					);
				}
				controller.close();
			},
			cancel() {
				cancelCalled = true;
			},
		});
		globalThis.fetch = jest.fn(
			async () =>
				({
					ok: true,
					status: 200,
					statusText: 'OK',
					headers: new Headers({
						'content-length': String(bigBody.length),
					}),
					body: stream,
				}) as unknown as Response,
		) as unknown as typeof fetch;

		await expect(
			Play.get(
				makeCtx({
					baseUrl: 'https://ch.example.com',
					key: 'Basic AAA=',
				}) as never,
				{},
			),
		).rejects.toBeInstanceOf(ClickhouseAPIError);

		expect(cancelCalled).toBe(true);
	});
});
