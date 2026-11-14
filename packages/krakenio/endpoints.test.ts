import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { isKrakenAuthFailure, KrakenAPIError } from './client';
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
	userNotFound,
	userStatusNoAuth,
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
		expect(result.kraked_url).toContain('dl.kraken.io');
		expect(result.file_name).toBe('header.jpg');
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

	it('accepts a callback URL instead of waiting and returns the job id', async () => {
		respond(queued);

		// Kraken answers a callback request with only `{ id }`, no `success`.
		await expect(
			invoke(Kraken.url, {
				url: 'https://acme.example/header.jpg',
				callback_url: 'https://acme.example/hooks/kraken',
			}),
		).resolves.toEqual({ id: queued.id });

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
				originalBytes: 324520,
				krakedBytes: 165358,
				savedBytes: 159162,
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
			name: 'ApiError',
			status: 401,
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
				convert: { format: 'bmp' },
			},
		],
		// Kraken documents `strategy` as mandatory.
		[{ url: 'https://a.example/x.jpg', wait: true, resize: { width: 800 } }],
		[
			{
				url: 'https://a.example/x.jpg',
				wait: true,
				resize: { strategy: 'square' },
			},
		],
	])('rejects %j before calling Kraken', async (input) => {
		await expect(invoke(Kraken.url, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('url.optimize resize strategies', () => {
	it.each([
		[{ size: 200, strategy: 'square' }],
		[{ width: 100, height: 75, strategy: 'crop' }],
		[{ width: 100, height: 75, strategy: 'fill', background: '#ff6600' }],
	])('sends resize %j as given', async (resize) => {
		respond(optimized);

		await invoke(Kraken.url, {
			url: 'https://acme.example/header.jpg',
			wait: true,
			resize,
		});

		expect(lastRequest().body).toMatchObject({ resize });
	});
});

describe('upload.optimize', () => {
	it('sends the decoded file as a multipart part beside the JSON options', async () => {
		respond(optimized);

		await invoke(Kraken.upload, {
			data: 'aGVsbG8=',
			filename: 'header.jpg',
			wait: true,
		});

		// Kraken answers a JSON body on /v1/upload with a 500; it needs a form.
		const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(new URL(url).pathname).toBe('/v1/upload');
		expect(init.method).toBe('POST');
		expect(init.body).toBeInstanceOf(FormData);
		const form = init.body as FormData;
		const file = form.get('file');
		expect(file).toBeInstanceOf(File);
		expect((file as File).name).toBe('header.jpg');
		expect(Buffer.from(await (file as File).arrayBuffer()).toString()).toBe(
			'hello',
		);
		expect(JSON.parse(String(form.get('data')))).toEqual({
			wait: true,
			auth: { api_key: API_KEY, api_secret: API_SECRET },
		});
	});

	it('accepts a data URL and strips its prefix', async () => {
		respond(optimized);

		await invoke(Kraken.upload, {
			data: 'data:image/png;base64,aGVsbG8=',
			wait: true,
		});

		const [, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		const file = (init.body as FormData).get('file') as File;
		expect(file.name).toBe('upload');
		expect(Buffer.from(await file.arrayBuffer()).toString()).toBe('hello');
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
			name: 'ApiError',
			status: 403,
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

	it('uses an inline pair without a database (no ctx.keys)', async () => {
		respond(accountStatus);

		const ctx = {
			key: 'inline-key',
			options: { apiKey: 'inline-key', apiSecret: 'inline-secret' },
		};
		await (Kraken.account as never as AnyEndpoint)(ctx as never, {} as never);

		expect(lastRequest().body).toEqual({
			auth: { api_key: 'inline-key', api_secret: 'inline-secret' },
		});
	});

	it('sends the resolved key, not a different stored one', async () => {
		respond(accountStatus);

		const ctx = {
			key: 'option-key',
			options: { key: 'option-key', apiSecret: 'option-secret' },
			keys: {
				get_api_key: jest.fn().mockResolvedValue('stored-key'),
				get_api_secret: jest.fn().mockResolvedValue('stored-secret'),
			},
		};
		await (Kraken.account as never as AnyEndpoint)(ctx as never, {} as never);

		expect(lastRequest().body).toEqual({
			auth: { api_key: 'option-key', api_secret: 'option-secret' },
		});
	});

	it('throws AuthMissingError before the call when no secret is found', async () => {
		const ctx = {
			key: 'stored-key',
			options: {},
			keys: {
				get_api_key: jest.fn().mockResolvedValue('stored-key'),
				get_api_secret: jest.fn().mockResolvedValue(null),
			},
		};

		await expect(
			(Kraken.account as never as AnyEndpoint)(ctx as never, {} as never),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
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

	it('treats the 404 "User not found" from /user_status as an auth error', async () => {
		respond(userNotFound, 404);

		const error = await caught(invoke(Kraken.account, {}));

		expect(error).toMatchObject({
			status: 404,
			message: 'Kraken 404: User not found',
		});
		expect(isKrakenAuthFailure(error)).toBe(true);
	});

	it('does not call a 404 on another route an auth error', async () => {
		respond({ success: false, message: '404 Not Found' }, 404);

		const error = await caught(
			invoke(Kraken.url, { url: 'https://acme.example/a.jpg', wait: true }),
		);

		expect(error).toMatchObject({ status: 404 });
		expect(isKrakenAuthFailure(error)).toBe(false);
	});

	it('reads the `error` field that /user_status uses', async () => {
		respond(userStatusNoAuth, 400);

		await expect(invoke(Kraken.account, {})).rejects.toMatchObject({
			status: 400,
			message: `Kraken 400: ${userStatusNoAuth.error}`,
		});
	});

	it('keeps no request body, which holds the secret, on the error', async () => {
		respond(unknownKey, 401);

		const error = await caught(invoke(Kraken.account, {}));

		expect((error as { request?: object }).request).not.toHaveProperty('body');
		expect(JSON.stringify(error)).not.toContain('api_secret');
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
