import {
	DropcontactAPIError,
	describeDropcontactError,
	isFailedBody,
	makeDropcontactRequest,
	readReason,
	statusOnlyDescription,
} from './client';
import {
	rateLimited,
	resultsNotReady,
	tooManyRecords,
	unauthorized,
	validationError,
	validationErrorString,
} from './test-fixtures';

const API_KEY = 'dc-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(
	promise: Promise<unknown>,
): Promise<DropcontactAPIError> {
	// unknown: a rejection can be any value until the instanceof check narrows it.
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(DropcontactAPIError);
	if (!(error instanceof DropcontactAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeDropcontactRequest', () => {
	it('sends the key in X-Access-Token and no Authorization header', async () => {
		respond({ credits: 15277 }, 200);

		const result = await makeDropcontactRequest(API_KEY, {
			method: 'GET',
			path: '/v1/account/credits',
		});

		expect(result).toEqual({ credits: 15277 });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.dropcontact.com/v1/account/credits');
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('x-access-token')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(init.body).toBeUndefined();
	});

	it('POSTs JSON with the body and a JSON content type', async () => {
		respond({ request_id: 'abc', success: true }, 200);

		await makeDropcontactRequest(API_KEY, {
			method: 'POST',
			path: '/v1/enrich/all',
			body: { data: [{ email: 'dc@dropcontact.io' }] },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			data: [{ email: 'dc@dropcontact.io' }],
		});
	});

	it('never puts the key in the query string', async () => {
		respond({}, 200);

		await makeDropcontactRequest(API_KEY, {
			method: 'GET',
			path: '/v1/enrich/all',
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).not.toContain(API_KEY);
	});

	it('reads the reason of a 401', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeDropcontactRequest(API_KEY, {
				method: 'GET',
				path: '/v1/account/credits',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.reason).toContain('No api key received');
		expect(error.message).toBe(
			"Dropcontact 401: No api key received. Please set 'X-Access-Token' header with your api key as value.",
		);
		expect(error.method).toBe('GET');
	});

	it('reads a FastAPI detail list into one message', async () => {
		respond(validationError, 422);

		const error = await failure(
			makeDropcontactRequest(API_KEY, {
				method: 'POST',
				path: '/v1/enrich/all',
			}),
		);
		expect(error.status).toBe(422);
		expect(error.reason).toBe(
			'body.data.0.custom_callback_url: Input should be a valid URL',
		);
	});

	it('reads a plain string detail', async () => {
		respond(validationErrorString, 422);

		const error = await failure(
			makeDropcontactRequest(API_KEY, {
				method: 'POST',
				path: '/v1/enrich/all',
			}),
		);
		expect(error.reason).toBe(
			'custom_callback_url is longer than 2083 characters',
		);
	});

	it('reads the 400 reason for too many records', async () => {
		respond(tooManyRecords, 400);

		const error = await failure(
			makeDropcontactRequest(API_KEY, {
				method: 'POST',
				path: '/v1/enrich/all',
			}),
		);
		expect(error.status).toBe(400);
		expect(error.message).toContain('up to 250 records');
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(rateLimited, 429, { 'Retry-After': '3' });

		const error = await failure(
			makeDropcontactRequest(API_KEY, {
				method: 'GET',
				path: '/v1/account/credits',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);
		// The client makes one attempt; error-handlers.ts owns the retry.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('keeps only the reason on the error, never the submitted records', async () => {
		// An error body can echo the contacts that were sent, and those carry
		// personal data, so nothing but the reason is retained.
		respond(
			{
				error: true,
				success: false,
				reason: 'Too many records',
				data: [{ email: 'someone@example.com' }],
			},
			400,
		);

		const error = await failure(
			makeDropcontactRequest(API_KEY, {
				method: 'POST',
				path: '/v1/enrich/all',
			}),
		);
		expect(error.body).toEqual({ reason: 'Too many records' });
		expect(require('node:util').inspect(error, { depth: null })).not.toContain(
			'example.com',
		);
	});

	it('never prints the key', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeDropcontactRequest(API_KEY, {
				method: 'GET',
				path: '/v1/account/credits',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(require('node:util').inspect(error, { depth: null })).not.toContain(
			API_KEY,
		);
	});

	it('wraps a transport failure and keeps its method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeDropcontactRequest(API_KEY, {
				method: 'POST',
				path: '/v1/enrich/all',
			}),
		);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('POST');
		expect(error.message).toContain('fetch failed');
	});
});

describe('readReason', () => {
	it('reads the provider envelope', () => {
		expect(readReason(unauthorized)).toContain('No api key received');
	});

	it('reads a string detail', () => {
		expect(readReason(validationErrorString)).toBe(
			'custom_callback_url is longer than 2083 characters',
		);
	});

	it('joins a detail list with its field paths', () => {
		expect(readReason(validationError)).toBe(
			'body.data.0.custom_callback_url: Input should be a valid URL',
		);
	});

	it('returns undefined when there is nothing to read', () => {
		expect(readReason(null)).toBeUndefined();
		expect(readReason({})).toBeUndefined();
		expect(readReason('<html>Bad Gateway</html>')).toBeUndefined();
	});
});

describe('isFailedBody', () => {
	it('is true when success is false, whatever the status was', () => {
		// A 200 with success false is how a not-ready batch answers.
		expect(isFailedBody(resultsNotReady)).toBe(true);
	});

	it('is false when success is true or absent', () => {
		expect(isFailedBody({ success: true })).toBe(false);
		expect(isFailedBody({ credits: 1 })).toBe(false);
		expect(isFailedBody(null)).toBe(false);
	});
});

describe('describeDropcontactError', () => {
	it('prefixes the status', () => {
		expect(describeDropcontactError(400, tooManyRecords, 'fallback')).toBe(
			'Dropcontact 400: Too many records, you can only submit up to 250 records',
		);
	});

	it('falls back when the body carries nothing', () => {
		expect(describeDropcontactError(undefined, null, 'fetch failed')).toBe(
			'fetch failed',
		);
	});
});

describe('statusOnlyDescription', () => {
	it('names no body content, so it is safe as a fallback', () => {
		expect(statusOnlyDescription(504, 'Gateway Timeout')).toBe(
			'request failed (Gateway Timeout)',
		);
		expect(statusOnlyDescription(504, undefined)).toBe('request failed');
		expect(statusOnlyDescription(undefined, undefined)).toBe('request failed');
	});
});

describe('an unmapped status', () => {
	it('does not put the echoed contacts in the message', async () => {
		// The shared client has no message for 504, so its ApiError.message embeds
		// the whole response body. A failed enrich body can echo the submitted
		// contacts, so that message must never become the plugin error's text.
		respond(
			{
				detail: null,
				data: [{ email: 'someone@example.com', first_name: 'Denis' }],
			},
			504,
		);

		const error = await failure(
			makeDropcontactRequest(API_KEY, {
				method: 'POST',
				path: '/v1/enrich/all',
			}),
		);

		// No reason field in that body, so the fallback is status-only.
		expect(error.status).toBe(504);
		expect(error.message).toBe('Dropcontact 504: request failed');
		expect(error.message).not.toContain('example.com');
		expect(require('node:util').inspect(error, { depth: null })).not.toContain(
			'example.com',
		);
	});
});
