import { logEventFromContext } from 'corsair/core';
import { KrakenAPIError } from './client';
import { Kraken } from './endpoints';
import {
	accountStatus,
	authRequired,
	optimized,
	partiallyFailed,
	queued,
	quotaExceeded,
	refusedOn200,
	unknownKey,
	waitRequired,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'kraken-test-key';
const API_SECRET = 'kraken-test-secret';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context carries what the endpoints read: the key option, and the
	// stored pair behind it.
	const ctx = {
		key: API_KEY,
		options: { apiKey: API_KEY, apiSecret: API_SECRET },
		keys: {
			get_api_key: jest.fn().mockResolvedValue(API_KEY),
			get_api_secret: jest.fn().mockResolvedValue(API_SECRET),
		},
	};
	return endpoint(ctx as never, input as never);
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
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('url.optimize', () => {
	it('POSTs the URL with the credentials in the auth block', async () => {
		respond(optimized);

		const result = (await invoke(Kraken.url, {
			url: 'https://acme.example/header.jpg',
			wait: true,
		})) as typeof optimized;

		expect(lastRequest()).toMatchObject({
			origin: 'https://api.kraken.io',
			method: 'POST',
			path: '/v1/url',
		});
		expect(lastRequest().body).toEqual({
			url: 'https://acme.example/header.jpg',
			wait: true,
			auth: { api_key: API_KEY, api_secret: API_SECRET },
		});
		expect(result.results['header.jpg']?.kraked_url).toContain('dl.kraken.io');
	});

	it('sends the resize, conversion and metadata options', async () => {
		respond(optimized);

		await invoke(Kraken.url, {
			url: 'https://acme.example/header.jpg',
			wait: true,
			lossy: true,
			quality: 80,
			auto_orient: true,
			preserve_meta: ['copyright', 'geotag'],
			convert: { format: 'webp' },
			resize: { width: 800, height: 420, strategy: 'fit' },
		});

		expect(lastRequest().body).toMatchObject({
			lossy: true,
			quality: 80,
			auto_orient: true,
			preserve_meta: ['copyright', 'geotag'],
			convert: { format: 'webp' },
			resize: { width: 800, height: 420, strategy: 'fit' },
		});
	});

	it('sends only the fields the caller gave', async () => {
		respond(optimized);

		await invoke(Kraken.url, {
			url: 'https://acme.example/header.jpg',
			wait: true,
		});

		expect(lastRequest().body).toEqual({
			url: 'https://acme.example/header.jpg',
			wait: true,
			auth: { api_key: API_KEY, api_secret: API_SECRET },
		});
	});

	it('accepts a callback URL instead of waiting', async () => {
		respond(queued);

		await invoke(Kraken.url, {
			url: 'https://acme.example/header.jpg',
			callback_url: 'https://acme.example/hooks/kraken',
		});

		expect(lastRequest().body).toMatchObject({
			callback_url: 'https://acme.example/hooks/kraken',
		});
	});

	it('logs sizes and counts, never the source URL or the secret', async () => {
		respond(optimized);

		await invoke(Kraken.url, {
			url: 'https://acme.example/header.jpg?token=abc123',
			wait: true,
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'krakenio.url.optimize',
			{
				success: true,
				originalBytes: 124000,
				krakedBytes: 48210,
				savedBytes: 75790,
				files: 1,
			},
			'completed',
		);
		// The first argument is the context, which holds the credentials by
		// definition; what matters is the payload the plugin chooses to log.
		for (const call of mockLog.mock.calls) {
			const payload = JSON.stringify(call[2]);
			expect(payload).not.toContain('token=abc123');
			expect(payload).not.toContain(API_SECRET);
		}
	});

	it('keeps a per-file failure inside a successful answer', async () => {
		respond(partiallyFailed);

		const result = (await invoke(Kraken.url, {
			url: 'https://acme.example/header.jpg',
			wait: true,
		})) as typeof partiallyFailed;

		expect(result.success).toBe(true);
		expect(result.results['header.jpg']?.success).toBe(false);
		expect(result.results['header.jpg']?.message).toBe(
			'Unable to download the image',
		);
	});

	it('throws on a 200 that says the optimization failed', async () => {
		respond(refusedOn200);

		const error = await caught(
			invoke(Kraken.url, {
				url: 'https://acme.example/header.jpg',
				wait: true,
			}),
		);

		expect(error).toBeInstanceOf(KrakenAPIError);
		expect(error).toMatchObject({ status: 200 });
		expect((error as Error).message).toContain('not supported');
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('surfaces an unknown key', async () => {
		respond(unknownKey, 401);

		await expect(
			invoke(Kraken.url, {
				url: 'https://acme.example/header.jpg',
				wait: true,
			}),
		).rejects.toMatchObject({
			status: 401,
			isAuthError: true,
			message:
				'Kraken 401: Unknown API Key. Please check your API key and try again.',
		});
	});

	it('surfaces a request with neither wait nor a callback', async () => {
		respond(waitRequired, 422);

		await expect(
			invoke(Kraken.url, { url: 'https://acme.example/header.jpg' }),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('never puts the secret in the error, its message or its inspect form', async () => {
		respond(unknownKey, 401);

		const error = await caught(
			invoke(Kraken.url, {
				url: 'https://acme.example/header.jpg',
				wait: true,
			}),
		);

		expect(JSON.stringify(error)).not.toContain(API_SECRET);
		expect(String(error)).not.toContain(API_SECRET);
		// `util.inspect` walks the cause chain, which is why the cause is dropped.
		expect(require('node:util').inspect(error)).not.toContain(API_SECRET);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});

	it.each([
		[{}],
		[{ wait: true }],
		[{ url: 'not-a-url', wait: true }],
		[{ url: 'https://a.example/x.jpg' }],
		[{ url: 'https://a.example/x.jpg', wait: true, quality: 0 }],
		[{ url: 'https://a.example/x.jpg', wait: true, quality: 101 }],
		[{ url: 'https://a.example/x.jpg', wait: true, resize: {} }],
		[
			{
				url: 'https://a.example/x.jpg',
				wait: true,
				resize: { strategy: 'fit' },
			},
		],
		[
			{
				url: 'https://a.example/x.jpg',
				wait: true,
				preserve_meta: ['everything'],
			},
		],
		[
			{
				url: 'https://a.example/x.jpg',
				wait: true,
				convert: { format: 'gif' },
			},
		],
	])('rejects %j before calling Kraken', async (input) => {
		await expect(invoke(Kraken.url, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('upload.optimize', () => {
	it('POSTs the base64 file with its name', async () => {
		respond(optimized);

		await invoke(Kraken.upload, {
			data: 'aGVsbG8=',
			filename: 'header.jpg',
			wait: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/upload',
		});
		expect(lastRequest().body).toEqual({
			data: 'aGVsbG8=',
			filename: 'header.jpg',
			wait: true,
			auth: { api_key: API_KEY, api_secret: API_SECRET },
		});
	});

	it('rejects an upload with no file', async () => {
		await expect(invoke(Kraken.upload, { wait: true })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('account.status', () => {
	it('POSTs an empty body with the credentials and reads the quota', async () => {
		respond(accountStatus);

		await expect(invoke(Kraken.account, {})).resolves.toMatchObject({
			active: true,
			plan_name: 'Enterprise',
			quota_remaining: 64111237830,
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/user_status',
		});
		expect(lastRequest().body).toEqual({
			auth: { api_key: API_KEY, api_secret: API_SECRET },
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'krakenio.account.status',
			{
				active: true,
				plan: 'Enterprise',
				remainingBytes: 64111237830,
			},
			'completed',
		);
	});

	it('surfaces a spent quota', async () => {
		respond(quotaExceeded, 403);

		await expect(invoke(Kraken.account, {})).rejects.toMatchObject({
			status: 403,
			isQuotaError: true,
		});
	});
});

describe('the credentials', () => {
	it('falls back to the stored pair when no option is set', async () => {
		respond(accountStatus);

		const ctx = {
			key: 'stored-key',
			options: {},
			keys: {
				get_api_key: jest.fn().mockResolvedValue('stored-key'),
				get_api_secret: jest.fn().mockResolvedValue('stored-secret'),
			},
		};
		await (Kraken.account as never as AnyEndpoint)(ctx as never, {} as never);

		expect(lastRequest().body).toEqual({
			auth: { api_key: 'stored-key', api_secret: 'stored-secret' },
		});
	});

	it('sends no auth header, because the pair travels in the body', async () => {
		respond(accountStatus);

		await invoke(Kraken.account, {});

		expect(lastRequest().headers.get('authorization')).toBeNull();
	});
});

describe('error envelopes', () => {
	it('reads a missing auth block', async () => {
		respond(authRequired, 422);

		await expect(invoke(Kraken.account, {})).rejects.toMatchObject({
			status: 422,
			message: 'Kraken 422: auth is required',
		});
	});

	it('keeps no body on the error', async () => {
		respond(unknownKey, 401);

		const error = await caught(invoke(Kraken.account, {}));

		expect(error).not.toHaveProperty('body');
	});

	it('replaces an HTML crash page rather than returning its markup', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				'<!DOCTYPE html><html><body><pre>Internal Server Error</pre></body></html>',
				{ status: 500, headers: { 'Content-Type': 'text/html' } },
			),
		);

		const error = await caught(invoke(Kraken.account, {}));

		expect((error as Error).message).toContain('failed to handle the request');
		expect((error as Error).message).not.toContain('<pre>');
	});

	it('marks a transport failure and keeps its cause, which never held a body', async () => {
		const dropped = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(dropped);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await invoke(Kraken.account, {}).catch(
			// unknown: a rejection can be any value; the assertion narrows it.
			(inner: unknown) => inner,
		)) as Error;

		expect(error).toMatchObject({ transport: true, method: 'POST' });
		expect(error.cause).toBe(dropped);
	});
});
