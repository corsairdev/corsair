/**
 * Transport-level guarantees, one per base URL this plugin uses.
 *
 * All credentials here are fictional.
 */
import {
	DOPPLER_V1_SHARE_BASE,
	DOPPLER_V3_BASE,
	DopplerAPIError,
	makeDopplerRequest,
	makeDopplerShareRequest,
} from './client';

const TOKEN = 'dp.pt.fictional_test_token';

let captured:
	| {
			url: string;
			method: string;
			headers: Record<string, string>;
			body?: string;
	  }
	| undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

function mockFetch(payload: unknown, { status = 200 } = {}) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers)
			raw.forEach((v, k) => {
				headers[k.toLowerCase()] = v;
			});
		else
			for (const [k, v] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			))
				headers[k.toLowerCase()] = v;

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
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => body,
		};
	}) as unknown as typeof global.fetch;
}

describe('Doppler transport', () => {
	describe('base URLs', () => {
		it('v3 requests hit the documented base', async () => {
			mockFetch({ workplace: { id: 'x' } });
			await makeDopplerRequest('workplace', TOKEN);
			expect(captured?.url.startsWith(DOPPLER_V3_BASE)).toBe(true);
		});

		it('Share requests hit /v1/share, not /v3', async () => {
			mockFetch({ url: 'https://share.doppler.com/s/x', success: true });
			await makeDopplerShareRequest('secrets/plain', TOKEN, {
				method: 'POST',
				body: { secret: 'x' },
			});
			expect(captured?.url.startsWith(DOPPLER_V1_SHARE_BASE)).toBe(true);
		});
	});

	describe('authentication', () => {
		it('sends Bearer on v3', async () => {
			mockFetch({ workplace: { id: 'x' } });
			await makeDopplerRequest('workplace', TOKEN);
			expect(captured?.headers.authorization).toBe(`Bearer ${TOKEN}`);
		});

		/**
		 * Confirmed live this session: `/v1/share`'s own OpenAPI fragment
		 * declares HTTP Basic (`"scheme": "basic"`), but the same Bearer token
		 * used everywhere else on this plugin works identically there too - a
		 * structural 400 on a garbage body, not a 401. This plugin never sends
		 * Basic auth to Share; this test pins that it doesn't need to.
		 */
		it('sends the same Bearer scheme on Share, despite its spec declaring Basic', async () => {
			mockFetch({ url: 'https://share.doppler.com/s/x', success: true });
			await makeDopplerShareRequest('secrets/plain', TOKEN, {
				method: 'POST',
				body: { secret: 'x' },
			});
			expect(captured?.headers.authorization).toBe(`Bearer ${TOKEN}`);
		});
	});

	describe('request shape', () => {
		it('sends query params on a GET', async () => {
			mockFetch({ projects: [], page: 1, success: true });
			await makeDopplerRequest('projects', TOKEN, {
				query: { page: 2, per_page: 10 },
			});
			const url = new URL(captured?.url ?? '');
			expect(url.searchParams.get('page')).toBe('2');
			expect(url.searchParams.get('per_page')).toBe('10');
		});

		it('sends a JSON body on POST, and omits body on GET', async () => {
			mockFetch({ project: { id: 'x' }, success: true });
			await makeDopplerRequest('projects', TOKEN, {
				method: 'POST',
				body: { name: 'demo' },
			});
			expect(captured?.method).toBe('POST');
			expect(captured?.body).toBe(JSON.stringify({ name: 'demo' }));

			mockFetch({ projects: [], success: true });
			await makeDopplerRequest('projects', TOKEN);
			expect(captured?.body).toBeUndefined();
		});

		it('sends a body on DELETE too - several Doppler routes take DELETE with a JSON body', async () => {
			mockFetch({ success: true });
			await makeDopplerRequest('configs/config', TOKEN, {
				method: 'DELETE',
				body: { project: 'x', config: 'dev' },
			});
			expect(captured?.method).toBe('DELETE');
			expect(captured?.body).toBe(
				JSON.stringify({ project: 'x', config: 'dev' }),
			);
		});
	});

	describe('empty token', () => {
		it('rejects an empty token before sending a request, on both transports', async () => {
			mockFetch({});
			const v3Error = await makeDopplerRequest('me', '').catch(
				(e: unknown) => e,
			);
			expect(v3Error).toBeInstanceOf(DopplerAPIError);
			expect((v3Error as DopplerAPIError).status).toBe(401);
			expect(captured).toBeUndefined();

			const shareError = await makeDopplerShareRequest('secrets/plain', '', {
				method: 'POST',
				body: { secret: 'x' },
			}).catch((e: unknown) => e);
			expect(shareError).toBeInstanceOf(DopplerAPIError);
			expect((shareError as DopplerAPIError).status).toBe(401);
			expect(captured).toBeUndefined();
		});

		it('rejects a whitespace-only token the same way', async () => {
			mockFetch({});
			const error = await makeDopplerRequest('me', '   ').catch(
				(e: unknown) => e,
			);
			expect(error).toBeInstanceOf(DopplerAPIError);
			expect((error as DopplerAPIError).status).toBe(401);
		});
	});

	describe('error wrapping', () => {
		it('wraps a REST failure in DopplerAPIError with its status', async () => {
			mockFetch(
				{ messages: ['Invalid Auth token'], success: false },
				{
					status: 401,
				},
			);
			const error = await makeDopplerRequest('me', TOKEN).catch(
				(e: unknown) => e,
			);
			expect(error).toBeInstanceOf(DopplerAPIError);
			expect((error as DopplerAPIError).status).toBe(401);
		});

		it('wraps a network failure without a status', async () => {
			global.fetch = (async () => {
				throw new Error('network down');
			}) as unknown as typeof global.fetch;
			const error = await makeDopplerRequest('me', TOKEN).catch(
				(e: unknown) => e,
			);
			expect(error).toBeInstanceOf(DopplerAPIError);
			expect((error as DopplerAPIError).status).toBeUndefined();
		});

		/**
		 * A 1-second retry-after, not 30 - the shared `request()` helper
		 * genuinely sleeps for the header's value on each internal retry
		 * (`DOPPLER_RATE_LIMIT_CONFIG` allows up to 3), so a large header value
		 * here would make this test really wait tens of seconds. 1 second
		 * still exercises the real seconds-to-milliseconds conversion.
		 */
		it('converts a 429 retry-after header (seconds) to milliseconds', async () => {
			global.fetch = (async () => ({
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				headers: new Headers({ 'retry-after': '1' }),
				json: async () => ({ messages: ['rate limited'], success: false }),
				text: async () =>
					JSON.stringify({ messages: ['rate limited'], success: false }),
			})) as unknown as typeof global.fetch;
			const error = await makeDopplerRequest('me', TOKEN).catch(
				(e: unknown) => e,
			);
			expect(error).toBeInstanceOf(DopplerAPIError);
			expect((error as DopplerAPIError).retryAfter).toBe(1_000);
		}, 15_000);
	});
});
