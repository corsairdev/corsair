/**
 * Transport-level guarantees.
 *
 * These are the invariants every endpoint inherits, so they are asserted once
 * here rather than repeated 70 times: both credential halves are sent,
 * `x-client` is always present, the two non-versioned base URLs are used where
 * they should be, and a missing user id fails before a request is made.
 *
 * All credentials here are fictional.
 */
import {
	HABITICA_API_BASE,
	HABITICA_CLIENT_ID,
	HABITICA_RATE_LIMIT_CONFIG,
	HABITICA_ROOT_BASE,
	HabiticaUserIdMissingError,
	makeHabiticaAnonymousRequest,
	makeHabiticaExportRequest,
	makeHabiticaRequest,
	makeHabiticaTextRequest,
} from './client';

const USER_ID = '00000000-0000-4000-8000-000000000000';
const API_TOKEN = '11111111-1111-4111-8111-111111111111';
const CREDENTIALS = { userId: USER_ID, apiToken: API_TOKEN };

let captured:
	| {
			url: string;
			method: string;
			headers: Record<string, string>;
			body?: string;
	  }
	| undefined;

// Every test here replaces the global fetch. Restoring it afterwards keeps this
// file from deciding what any later suite sees.
const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

/**
 * Replaces `global.fetch` with a stub that records the request.
 *
 * The `as unknown as typeof global.fetch` cast at the end is deliberate and
 * confined to this helper. A faithful `fetch` implementation would have to
 * satisfy the whole `Response` interface - `blob`, `formData`, `clone`,
 * `bodyUsed` and the rest - none of which the transport touches. Widening the
 * stub to the real signature would mean writing a dozen unused members whose
 * only effect is to obscure the four fields that matter: `ok`, `status`,
 * `headers` and the body readers.
 */
function mockFetch(
	payload: unknown,
	{
		status = 200,
		contentType = 'application/json',
	}: { status?: number; contentType?: string } = {},
) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = value;
			}
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		const body =
			typeof payload === 'string' ? payload : JSON.stringify(payload);
		return {
			ok: status < 400,
			status,
			statusText: status < 400 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({ 'Content-Type': contentType }),
			json: async () => payload,
			text: async () => body,
		};
	}) as unknown as typeof global.fetch;
}

describe('Habitica transport', () => {
	describe('authentication', () => {
		it('sends both halves of the credential', async () => {
			// Habitica checks the user id as well as the token: a valid token with
			// the wrong id is a 401. Sending only the token would fail everywhere.
			mockFetch({ success: true, data: {} });
			await makeHabiticaRequest('user', CREDENTIALS);

			expect(captured?.headers['x-api-user']).toBe(USER_ID);
			expect(captured?.headers['x-api-key']).toBe(API_TOKEN);
		});

		it('does not use an Authorization header', async () => {
			mockFetch({ success: true, data: {} });
			await makeHabiticaRequest('user', CREDENTIALS);

			expect(captured?.headers.authorization).toBeUndefined();
		});

		it('refuses to send a request when the user id is missing', async () => {
			// Failing here beats sending a request that is certain to come back as
			// an opaque 401.
			mockFetch({ success: true, data: {} });
			await expect(
				makeHabiticaRequest('user', { userId: '', apiToken: API_TOKEN }),
			).rejects.toBeInstanceOf(HabiticaUserIdMissingError);
			expect(captured).toBeUndefined();
		});

		it('sends no credential on an anonymous request', async () => {
			mockFetch({ success: true, data: {} });
			await makeHabiticaAnonymousRequest('status');

			expect(captured?.headers['x-api-user']).toBeUndefined();
			expect(captured?.headers['x-api-key']).toBeUndefined();
		});

		it('forwards the body on an anonymous POST', async () => {
			// The three authentication routes are `authOptional` and POST their
			// credentials through this helper. An earlier version destructured
			// only `method` and `query`, so registration and login were sending
			// an empty body - and asserting method and path alone did not notice.
			mockFetch({ success: true, data: {} });
			await makeHabiticaAnonymousRequest('user/auth/local/login', {
				method: 'POST',
				body: { username: 'someone', password: 'a-password' },
			});

			expect(captured?.body).toBeDefined();
			expect(JSON.parse(captured?.body ?? '{}')).toEqual({
				username: 'someone',
				password: 'a-password',
			});
		});

		it('sends no body on an anonymous GET', async () => {
			mockFetch({ success: true, data: {} });
			await makeHabiticaAnonymousRequest('content', {
				method: 'GET',
				body: { ignored: true },
			});

			expect(captured?.body).toBeUndefined();
		});
	});

	describe('the mandatory x-client header', () => {
		// Omitting it is a 400 - even on routes that need no credentials at all -
		// so it goes on every request rather than on the authenticated ones.
		it('is sent on an authenticated request', async () => {
			mockFetch({ success: true, data: {} });
			await makeHabiticaRequest('user', CREDENTIALS);
			expect(captured?.headers['x-client']).toBe(HABITICA_CLIENT_ID);
		});

		it('is sent on an anonymous request', async () => {
			mockFetch({ success: true, data: {} });
			await makeHabiticaAnonymousRequest('content');
			expect(captured?.headers['x-client']).toBe(HABITICA_CLIENT_ID);
		});

		it('is sent on an export request', async () => {
			mockFetch('a,b,c', { contentType: 'text/csv' });
			await makeHabiticaExportRequest('history.csv', CREDENTIALS);
			expect(captured?.headers['x-client']).toBe(HABITICA_CLIENT_ID);
		});

		it('is never empty, which Habitica rejects exactly as it rejects absence', () => {
			expect(HABITICA_CLIENT_ID.length).toBeGreaterThan(0);
		});

		it('carries no user id, so nothing account-specific reaches request logs', () => {
			expect(HABITICA_CLIENT_ID).not.toContain(USER_ID);
			expect(HABITICA_CLIENT_ID).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}/i);
		});
	});

	describe('base URLs', () => {
		it('uses the versioned base for ordinary operations', async () => {
			mockFetch({ success: true, data: {} });
			await makeHabiticaRequest('tags', CREDENTIALS);
			expect(captured?.url.startsWith(`${HABITICA_API_BASE}/tags`)).toBe(true);
		});

		it('uses the root base for the export documents', async () => {
			// These sit outside /api/v3 entirely.
			mockFetch('{}');
			await makeHabiticaExportRequest('userdata.json', CREDENTIALS);
			expect(captured?.url).toBe(`${HABITICA_ROOT_BASE}/export/userdata.json`);
			expect(captured?.url).not.toContain('/api/v3');
		});

		it('uses the versioned base for the challenge CSV, which is not an /export route', async () => {
			mockFetch('a,b,c', { contentType: 'text/csv' });
			await makeHabiticaTextRequest(
				'challenges/challenge-1/export/csv',
				CREDENTIALS,
			);
			expect(captured?.url).toBe(
				`${HABITICA_API_BASE}/challenges/challenge-1/export/csv`,
			);
		});
	});

	describe('non-JSON responses', () => {
		it('returns CSV as text with its content type', async () => {
			mockFetch('date,task\n2026-01-01,Read', { contentType: 'text/csv' });
			const result = await makeHabiticaExportRequest(
				'history.csv',
				CREDENTIALS,
			);

			expect(result.body).toContain('date,task');
			expect(result.contentType).toContain('text/csv');
		});

		it('returns HTML as text', async () => {
			mockFetch('<html><body>inbox</body></html>', {
				contentType: 'text/html',
			});
			const result = await makeHabiticaExportRequest('inbox.html', CREDENTIALS);

			expect(result.body).toContain('<html>');
			expect(result.contentType).toContain('text/html');
		});

		it('keeps the response body out of the error when an export fails', async () => {
			// A failed export can still carry account data - userdata.json contains
			// the account holder's email address - so the body must not be copied
			// into an error message or a log.
			const secret = 'someone@example.com';
			mockFetch(secret, { status: 500, contentType: 'application/json' });

			await expect(
				makeHabiticaExportRequest('userdata.json', CREDENTIALS),
			).rejects.toThrow(/HTTP 500/);
			await expect(
				makeHabiticaExportRequest('userdata.json', CREDENTIALS),
			).rejects.not.toThrow(new RegExp(secret));
		});

		it('keeps the response body out of the error on a text request too', async () => {
			const secret = 'participant@example.com';
			mockFetch(secret, { status: 403, contentType: 'text/csv' });

			await expect(
				makeHabiticaTextRequest(
					'challenges/challenge-1/export/csv',
					CREDENTIALS,
				),
			).rejects.not.toThrow(new RegExp(secret));
		});

		it('requires the user id before making an export request', async () => {
			mockFetch('{}');
			await expect(
				makeHabiticaExportRequest('userdata.json', {
					userId: '',
					apiToken: API_TOKEN,
				}),
			).rejects.toBeInstanceOf(HabiticaUserIdMissingError);
			expect(captured).toBeUndefined();
		});
	});

	describe('rate limiting on the raw-fetch paths', () => {
		/** A 429 carrying Habitica's fractional Retry-After. */
		function mock429(retryAfter = '21.069') {
			global.fetch = (async () =>
				({
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					url: 'https://habitica.com/export/history.csv',
					headers: new Headers({
						'Content-Type': 'application/json',
						'retry-after': retryAfter,
					}),
					json: async () => ({ error: 'TooManyRequests' }),
					text: async () => '{}',
				}) as unknown as Response) as unknown as typeof global.fetch;
		}

		it('preserves status and Retry-After through an export failure', async () => {
			// These paths bypass the shared transport, so they get no ApiError.
			// Throwing a bare Error would discard the delay and leave the handler
			// retrying blind against a fixed one-minute window.
			mock429();

			await expect(
				makeHabiticaExportRequest('history.csv', CREDENTIALS),
			).rejects.toMatchObject({
				name: 'HabiticaHttpError',
				status: 429,
				retryAfter: 21_069,
			});
		});

		it('preserves them through a challenge CSV failure too', async () => {
			mock429('5');

			await expect(
				makeHabiticaTextRequest('challenges/c1/export/csv', CREDENTIALS),
			).rejects.toMatchObject({ status: 429, retryAfter: 5_000 });
		});

		it('keeps the fraction instead of truncating it', async () => {
			// The shared transport parseInts to 21, retrying ~69ms early. Here the
			// parse is ours, so it rounds up and never fires inside the window.
			mock429('21.069');
			await expect(
				makeHabiticaExportRequest('history.csv', CREDENTIALS),
			).rejects.toMatchObject({ retryAfter: 21_069 });
			expect(21_069).toBeGreaterThan(21_000);
		});

		it('omits retryAfter when the server sent none', async () => {
			mockFetch('nope', { status: 500, contentType: 'text/csv' });

			await expect(
				makeHabiticaExportRequest('history.csv', CREDENTIALS),
			).rejects.toMatchObject({ status: 500, retryAfter: undefined });
		});

		it('ignores an unparseable Retry-After rather than passing NaN on', async () => {
			mock429('not-a-number');

			await expect(
				makeHabiticaExportRequest('history.csv', CREDENTIALS),
			).rejects.toMatchObject({ status: 429, retryAfter: undefined });
		});
	});

	describe('rate limiting', () => {
		it('reacts to retry-after', () => {
			expect(HABITICA_RATE_LIMIT_CONFIG.headerNames.retryAfter).toBe(
				'retry-after',
			);
		});

		it('does not configure x-ratelimit-reset', () => {
			// Habitica sends a Date.toString() there, which the shared helper would
			// parseInt to NaN. Naming the header would advertise pacing the plugin
			// cannot actually do.
			expect(HABITICA_RATE_LIMIT_CONFIG.headerNames.resetTime).toBeUndefined();
		});

		it('reads the remaining and limit counters', () => {
			expect(HABITICA_RATE_LIMIT_CONFIG.headerNames.remaining).toBe(
				'x-ratelimit-remaining',
			);
			expect(HABITICA_RATE_LIMIT_CONFIG.headerNames.limit).toBe(
				'x-ratelimit-limit',
			);
		});

		it('retries with backoff', () => {
			expect(HABITICA_RATE_LIMIT_CONFIG.enabled).toBe(true);
			expect(HABITICA_RATE_LIMIT_CONFIG.maxRetries).toBeGreaterThan(0);
			expect(HABITICA_RATE_LIMIT_CONFIG.backoffMultiplier).toBeGreaterThan(1);
		});

		it("truncates Habitica's fractional retry-after, which is why one extra 429 is expected", () => {
			// Documents the real arithmetic rather than asserting a wish: the
			// observed "21.069" becomes 21, i.e. 69ms early.
			expect(Number.parseInt('21.069', 10)).toBe(21);
			expect(Number.parseInt('21.069', 10)).toBeLessThan(21.069);
		});
	});
});
