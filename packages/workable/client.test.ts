import { WorkableAPIError } from './client';

/** Reads a fetch stub's headers into a plain object regardless of their shape. */
function readHeaders(init: RequestInit | undefined): Record<string, string> {
	const raw = init?.headers;
	if (!raw) return {};
	if (raw instanceof Headers) return Object.fromEntries(raw.entries());
	if (Array.isArray(raw)) return Object.fromEntries(raw);
	// why safe: test-only narrowing — Headers and array branches handled
	// above, so the remainder is the plain-object HeadersInit branch.
	return Object.fromEntries(Object.entries(raw as Record<string, string>));
}

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {
		constructor(
			public plugin: string,
			public credential: string,
			message?: string,
		) {
			super(message ?? `Missing ${credential} for ${plugin}`);
		}
	},
}));

describe('Workable client', () => {
	const originalFetch = globalThis.fetch;
	let calls: Array<{ url: string; init?: RequestInit }>;

	beforeEach(() => {
		calls = [];
		// why safe: test-only fetch stub — signature matches fetch, cast
		// bridges the local `(url: string)` narrowing to the global type.
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url: String(url), init });
			return new Response(JSON.stringify({ departments: [] }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	describe('credential validation', () => {
		it('rejects a missing access token before issuing a request', async () => {
			const { makeWorkableRequest } = await import('./client');
			await expect(
				makeWorkableRequest('/departments', '', 'example'),
			).rejects.toBeInstanceOf(WorkableAPIError);
			expect(calls).toHaveLength(0);
		});

		it('rejects a missing subdomain before issuing a request', async () => {
			const { makeWorkableRequest } = await import('./client');
			await expect(
				makeWorkableRequest('/departments', 'token-123', ''),
			).rejects.toBeInstanceOf(WorkableAPIError);
			expect(calls).toHaveLength(0);
		});

		it.each([
			['evil.com/', 'a slash'],
			['host.other.com', 'a dot'],
			['a b', 'a space'],
		])(
			'rejects a subdomain containing %s (%s) since it is interpolated into the hostname',
			async (subdomain) => {
				const { makeWorkableRequest } = await import('./client');
				await expect(
					makeWorkableRequest('/departments', 'token-123', subdomain),
				).rejects.toBeInstanceOf(WorkableAPIError);
				expect(calls).toHaveLength(0);
			},
		);

		it('accepts a subdomain of letters, digits and hyphens', async () => {
			const { makeWorkableRequest } = await import('./client');
			await makeWorkableRequest('/departments', 'token-123', 'my-account-1');
			expect(calls).toHaveLength(1);
		});
	});

	describe('rate limit', () => {
		// Live: Workable sends X-Rate-Limit-Reset (epoch seconds) and no
		// Retry-After, 10 requests per ~10 s per token.
		it('waits for X-Rate-Limit-Reset before retrying a throttled read', async () => {
			const { makeWorkableRequest } = await import('./client');
			const reset = Math.ceil(Date.now() / 1000) + 2;
			const times: number[] = [];
			// why safe: test-only fetch stub — signature matches fetch.
			globalThis.fetch = (async () => {
				times.push(Date.now());
				if (times.length === 1) {
					return new Response(
						JSON.stringify({ error: 'You have exceeded the rate limits' }),
						{
							status: 429,
							headers: {
								'Content-Type': 'application/json',
								'X-Rate-Limit-Limit': '10',
								'X-Rate-Limit-Remaining': '0',
								'X-Rate-Limit-Reset': String(reset),
							},
						},
					);
				}
				return new Response(JSON.stringify([]), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			}) as typeof fetch;
			await makeWorkableRequest('/departments', 'token-123', 'example');
			expect(times).toHaveLength(2);
			// The plain backoff would retry after 1 s; the reset is >= 2 s away.
			expect((times[1] ?? 0) - (times[0] ?? 0)).toBeGreaterThanOrEqual(1500);
		});
	});

	describe('request shape', () => {
		it('sends a Bearer token, not a query string', async () => {
			const { makeWorkableRequest } = await import('./client');
			await makeWorkableRequest('/departments', 'token-123', 'example');

			expect(calls).toHaveLength(1);
			const headers = readHeaders(calls[0]?.init);
			const headerNames = Object.keys(headers).map((h) => h.toLowerCase());
			expect(headerNames).toContain('authorization');
			expect(headers.Authorization ?? headers.authorization).toBe(
				'Bearer token-123',
			);
			expect(calls[0]?.url).not.toContain('token-123');
		});

		it('builds the subdomain-specific base URL', async () => {
			const { makeWorkableRequest } = await import('./client');
			await makeWorkableRequest('/departments', 'token-123', 'example');
			expect(calls[0]?.url).toBe(
				'https://example.workable.com/spi/v3/departments',
			);
		});
	});

	describe('public job-board request', () => {
		it('sends no Authorization header and hits www.workable.com', async () => {
			const { makeWorkablePublicRequest } = await import('./client');
			await makeWorkablePublicRequest('example');
			expect(calls).toHaveLength(1);
			expect(calls[0]?.url).toBe(
				'https://www.workable.com/api/accounts/example',
			);
			const headers = readHeaders(calls[0]?.init);
			expect(Object.keys(headers).map((h) => h.toLowerCase())).not.toContain(
				'authorization',
			);
		});

		it('rejects a missing subdomain before issuing a request', async () => {
			const { makeWorkablePublicRequest } = await import('./client');
			await expect(makeWorkablePublicRequest('')).rejects.toBeInstanceOf(
				WorkableAPIError,
			);
			expect(calls).toHaveLength(0);
		});

		it('routes the documented /locations suffix without authentication', async () => {
			const { makeWorkablePublicRequest } = await import('./client');
			await makeWorkablePublicRequest('example', undefined, '/locations');
			expect(calls).toHaveLength(1);
			expect(calls[0]?.url).toBe(
				'https://www.workable.com/api/accounts/example/locations',
			);
			const headers = readHeaders(calls[0]?.init);
			expect(Object.keys(headers).map((h) => h.toLowerCase())).not.toContain(
				'authorization',
			);
		});
	});

	describe('keyBuilder', () => {
		/** keyBuilder is optional on the shared plugin type; asserts it is wired. */
		function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
			const keyBuilder = plugin.keyBuilder;
			if (typeof keyBuilder !== 'function') {
				throw new Error('keyBuilder is not registered');
			}
			// why safe: test-only adapter — narrows the optional plugin field
			// to a callable with unknown context, matching keyBuilder's shape.
			return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
		}

		/** Builds a minimal keyBuilder context with a stubbed key manager. */
		function fakeKeyCtx(
			apiKey: string | null,
			operation = 'jobs.list',
			account: string | null = 'example',
		) {
			return {
				authType: 'api_key',
				options: {},
				keys: {
					get_api_key: jest.fn(async () => apiKey),
					get_account: jest.fn(async () => account),
				},
				tenantId: 'default',
				meteredOperationId: operation,
			};
		}

		/** Asserts the promise rejects with corsair's AuthMissingError. */
		async function expectAuthMissing(promise: Promise<string>) {
			const { AuthMissingError } = await import('corsair/core');
			await expect(promise).rejects.toBeInstanceOf(AuthMissingError);
		}

		/** A tenant that was never initialized: the key manager has no DEK. */
		function uninitializedCtx(operation: string) {
			const noDek = async (): Promise<string | null> => {
				throw new Error(
					'No DEK found for account (tenant: "default"). Initialize the account first.',
				);
			};
			return {
				authType: 'api_key',
				options: {},
				keys: { get_api_key: noDek, get_account: noDek },
				tenantId: 'default',
				meteredOperationId: operation,
			};
		}

		it('returns the configured options key without touching the key manager', async () => {
			const { workable } = await import('./index');
			const ctx = fakeKeyCtx(null);
			const key = await keyBuilderOf(
				workable({ key: 'opt-key', account: 'acme' }),
			)(ctx, 'endpoint');
			expect(key).toBe('opt-key');
			expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
		});

		it('returns the stored api key when the subdomain is stored too', async () => {
			const { workable } = await import('./index');
			const key = await keyBuilderOf(workable({}))(
				fakeKeyCtx('managed-key'),
				'endpoint',
			);
			expect(key).toBe('managed-key');
		});

		// The binder mints the connect link only for an AuthMissingError thrown
		// by the keyBuilder, so a missing credential has to fail here.
		it('throws AuthMissingError on an authenticated endpoint with no stored key', async () => {
			const { workable } = await import('./index');
			await expectAuthMissing(
				keyBuilderOf(workable({}))(fakeKeyCtx(null), 'endpoint'),
			);
		});

		it('throws AuthMissingError when the token is stored but the subdomain is not', async () => {
			const { workable } = await import('./index');
			await expectAuthMissing(
				keyBuilderOf(workable({}))(
					fakeKeyCtx('managed-key', 'departments.list', null),
					'endpoint',
				),
			);
		});

		it('throws AuthMissingError for a tenant that was never initialized', async () => {
			const { workable } = await import('./index');
			await expectAuthMissing(
				keyBuilderOf(workable({}))(uninitializedCtx('jobs.list'), 'endpoint'),
			);
		});

		it('resolves an empty key for the public job-board endpoints', async () => {
			const { workable } = await import('./index');
			const plugin = workable({});
			await expect(
				keyBuilderOf(plugin)(fakeKeyCtx(null, 'publicJobs.list'), 'endpoint'),
			).resolves.toBe('');
			await expect(
				keyBuilderOf(plugin)(
					uninitializedCtx('publicLocations.list'),
					'endpoint',
				),
			).resolves.toBe('');
		});

		it('refuses webhook keys (the plugin has no webhooks)', async () => {
			const { workable } = await import('./index');
			await expectAuthMissing(
				keyBuilderOf(workable({}))(fakeKeyCtx('managed-key'), 'webhook'),
			);
		});
	});
});
