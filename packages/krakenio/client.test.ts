import { describeKrakenError, makeKrakenRequest, readFailure } from './client';

const CREDENTIALS = {
	apiKey: 'kraken-test-key',
	apiSecret: 'kraken-test-secret',
};

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	fetchMock.mockResolvedValueOnce(
		new Response(
			contentType === 'application/json' ? JSON.stringify(body) : String(body),
			{ status, headers: { 'Content-Type': contentType } },
		),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the client serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('readFailure', () => {
	it('reads a failure envelope', () => {
		expect(readFailure({ success: false, message: 'Bad key' })).toEqual({
			success: false,
			message: 'Bad key',
		});
	});

	it('leaves success undefined when the body does not say', () => {
		expect(readFailure({ message: 'Something' })).toEqual({
			success: undefined,
			message: 'Something',
		});
	});

	it.each([[undefined], [null], [{}], [[]], ['text']])(
		'returns empty fields for %j',
		(body) => {
			expect(readFailure(body)).toEqual({
				success: undefined,
				message: undefined,
			});
		},
	);
});

describe('describeKrakenError', () => {
	it('puts the status in front of the message', () => {
		expect(describeKrakenError(401, { message: 'Unknown API Key' }, 'x')).toBe(
			'Kraken 401: Unknown API Key',
		);
	});

	it('handles a status with no message', () => {
		expect(describeKrakenError(200, {}, 'Kraken refused the request')).toBe(
			'Kraken 200: Kraken refused the request',
		);
	});
});

describe('makeKrakenRequest', () => {
	it('sends the pair in the auth block of the body', async () => {
		respond({ success: true });

		await makeKrakenRequest(CREDENTIALS, {
			path: '/v1/url',
			body: { url: 'https://a.example/x.jpg', wait: true },
		});

		expect(lastRequest().body).toEqual({
			url: 'https://a.example/x.jpg',
			wait: true,
			auth: { api_key: 'kraken-test-key', api_secret: 'kraken-test-secret' },
		});
	});

	it('sends no auth header, because the pair travels in the body', async () => {
		respond({ success: true });

		await makeKrakenRequest(CREDENTIALS, { path: '/user_status', body: {} });

		expect(lastRequest().headers.get('authorization')).toBeNull();
	});

	it('always POSTs', async () => {
		respond({ success: true });

		await makeKrakenRequest(CREDENTIALS, { path: '/user_status', body: {} });

		expect(lastRequest().method).toBe('POST');
	});

	it('turns a request failure into one error, keeping no cause', async () => {
		respond({ success: false, message: 'Unknown API Key' }, 401);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKrakenRequest(CREDENTIALS, {
			path: '/user_status',
			body: {},
		}).catch((caught: unknown) => caught)) as Error;

		expect(error).toMatchObject({
			name: 'KrakenAPIError',
			status: 401,
			message: 'Kraken 401: Unknown API Key',
			method: 'POST',
			transport: false,
		});
		// The cause would hold the request body, which carries the secret.
		expect(error.cause).toBeUndefined();
		expect(require('node:util').inspect(error)).not.toContain(
			CREDENTIALS.apiSecret,
		);
	});

	it('turns a 200 that says success false into an error', async () => {
		respond({ success: false, message: 'Unsupported format' });

		await expect(
			makeKrakenRequest(CREDENTIALS, { path: '/v1/url', body: {} }),
		).rejects.toMatchObject({
			status: 200,
			message: 'Kraken refused the request: Unsupported format',
		});
	});

	it('replaces an HTML crash page with a plain message', async () => {
		respond('<html><pre>Internal Server Error</pre></html>', 500, 'text/html');

		const error = (await makeKrakenRequest(CREDENTIALS, {
			path: '/v1/upload',
			body: {},
		}).catch((caught: unknown) => caught)) as Error;

		expect(error.message).toBe(
			'Kraken 500: Kraken failed to handle the request',
		);
		expect(error.message).not.toContain('<pre>');
	});

	it('keeps a Retry-After header as milliseconds', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ success: false, message: 'Slow' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '4' },
			}),
		);

		await expect(
			makeKrakenRequest(CREDENTIALS, { path: '/user_status', body: {} }),
		).rejects.toMatchObject({ retryAfter: 4000, isRateLimit: true });
	});

	it('keeps a transport failure’s cause, which never held a body', async () => {
		const dropped = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(dropped);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKrakenRequest(CREDENTIALS, {
			path: '/user_status',
			body: {},
		}).catch((caught: unknown) => caught)) as Error;

		expect(error).toMatchObject({ transport: true, method: 'POST' });
		expect(error.cause).toBe(dropped);
	});

	it('separates a timeout from a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		await expect(
			makeKrakenRequest(CREDENTIALS, { path: '/v1/url', body: {} }),
		).rejects.toMatchObject({ timedOut: true, transport: true });
	});
});
