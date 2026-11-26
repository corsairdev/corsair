import util from 'node:util';
import {
	describeMailerLiteError,
	MAILERLITE_API_BASE,
	MailerLiteAPIError,
	makeMailerLiteRequest,
	RATE_LIMIT_FALLBACK_MS,
} from './client';
import { tooManyAttemptsError, validationError } from './test-fixtures';
import { captureError } from './test-helpers';

const KEY = 'ml-secret-test-key-abc123';

// unknown: response bodies are arbitrary JSON, so each test states its own.
function respond(
	body: unknown, // unknown: each test states its own body shape.
	status = 200,
	headers: Record<string, string> = {},
) {
	return jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

const readRequest = {
	method: 'GET' as const,
	path: '/subscribers',
	replayable: true,
};

beforeEach(() => {
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('MailerLite http client', () => {
	it('sends the key as a bearer token, never the legacy classic header', async () => {
		respond({ data: {} });

		await makeMailerLiteRequest(KEY, readRequest);

		const [url, init] = jest.mocked(globalThis.fetch).mock.calls[0]!;
		expect(String(url)).toBe(`${MAILERLITE_API_BASE}/subscribers`);
		const headers = new Headers(init!.headers);
		expect(headers.get('Authorization')).toBe(`Bearer ${KEY}`);
		expect(headers.get('X-MailerLite-ApiKey')).toBeNull();
		expect(headers.get('Accept')).toBe('application/json');
		expect(headers.get('Content-Type')).toBe('application/json');
	});

	it('passes the envelope through unchanged instead of unwrapping data', async () => {
		respond({
			data: { id: '1' },
			links: { next: null },
			meta: { per_page: 25 },
		});

		const body = await makeMailerLiteRequest(KEY, {
			method: 'GET',
			path: '/groups',
			replayable: true,
		});

		expect(body).toEqual({
			data: { id: '1' },
			links: { next: null },
			meta: { per_page: 25 },
		});
	});

	it('sends query values and omits unset ones', async () => {
		respond({ data: [] });

		await makeMailerLiteRequest(KEY, {
			method: 'GET',
			path: '/groups',
			query: { limit: 5, sort: '-active_count', page: undefined },
			replayable: true,
		});

		const [url] = jest.mocked(globalThis.fetch).mock.calls[0]!;
		expect(String(url)).toBe(
			`${MAILERLITE_API_BASE}/groups?limit=5&sort=-active_count`,
		);
	});

	it('surfaces the provider message and field errors on the plugin error', async () => {
		respond(validationError, 422);

		const error = (await captureError(
			makeMailerLiteRequest(KEY, {
				method: 'POST',
				path: '/subscribers',
				replayable: true,
			}),
		)) as MailerLiteAPIError;

		expect(error).toBeInstanceOf(MailerLiteAPIError);
		expect(error.status).toBe(422);
		expect(error.message).toContain('The given data was invalid.');
		expect(error.message).toContain(
			'email: The email must be a valid email address.',
		);
		expect(error.fieldErrors?.email).toEqual([
			'The email must be a valid email address.',
		]);
	});

	it('reads Retry-After from a 429 into the error', async () => {
		respond(tooManyAttemptsError, 429, { 'Retry-After': '119' });

		const error = (await captureError(
			makeMailerLiteRequest(KEY, readRequest),
		)) as MailerLiteAPIError;

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(119_000);
	});

	it('never leaks the key through message, inspect or JSON', async () => {
		respond({ message: 'Unauthenticated.' }, 401);

		const error = (await captureError(
			makeMailerLiteRequest(KEY, readRequest),
		)) as MailerLiteAPIError;

		expect(error.status).toBe(401);
		// JSON.stringify hides a non-enumerable cause, so inspect is the check
		// that proves the ApiError chain carries no credential.
		expect(util.inspect(error)).not.toContain(KEY);
		expect(JSON.stringify(error)).not.toContain(KEY);
		expect(error.message).not.toContain(KEY);
	});

	it('marks transport failures and carries the request replay flag', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeMailerLiteRequest(KEY, {
				method: 'POST',
				path: '/campaigns/1/schedule',
				replayable: false,
			}),
		)) as MailerLiteAPIError;

		expect(error.transport).toBe(true);
		expect(error.replayable).toBe(false);
		expect(error.method).toBe('POST');
	});

	it('keeps bodyless 204 answers as undefined', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(new Response(null, { status: 204 }));

		await expect(
			makeMailerLiteRequest(KEY, {
				method: 'DELETE',
				path: '/subscribers/1',
				replayable: false,
			}),
		).resolves.toBeUndefined();
	});
});

describe('describeMailerLiteError', () => {
	it('prefers the body message and prefixes the status', () => {
		expect(
			describeMailerLiteError(
				404,
				{ message: 'Resource does not exist.' },
				'fallback',
			),
		).toBe('MailerLite 404 Resource does not exist.');
	});

	it('falls back when the body carries no message', () => {
		expect(describeMailerLiteError(500, { error: 'html' }, 'boom')).toBe(
			'MailerLite 500 boom',
		);
	});

	it('appends field errors from a 422 body', () => {
		const message = describeMailerLiteError(422, validationError, 'fallback');
		expect(message).toBe(
			'MailerLite 422 The given data was invalid. (email: The email must be a valid email address.)',
		);
	});
});

describe('rate limit fallback', () => {
	it('pins the no-header fallback at one minute', () => {
		expect(RATE_LIMIT_FALLBACK_MS).toBe(60_000);
	});
});
