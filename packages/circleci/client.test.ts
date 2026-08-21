/**
 * Transport-level guarantees, one per base URL this plugin uses.
 *
 * All credentials here are fictional.
 */
import {
	CIRCLECI_GRAPHQL_URL,
	CIRCLECI_V1_BASE,
	CIRCLECI_V2_BASE,
	CIRCLECI_V3_BASE,
	CircleCIAPIError,
	CircleCIGraphQLError,
	makeCircleCIGraphQLRequest,
	makeCircleCIRequest,
	makeCircleCIV1Request,
	makeCircleCIV3Request,
} from './client';

const TOKEN = 'CCIPAT_test_token_fictional';

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

function mockFetch(
	payload: unknown,
	{ status = 200 }: { status?: number } = {},
) {
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

describe('CircleCI transport', () => {
	describe('base URLs', () => {
		it('v2 requests hit the documented base', async () => {
			mockFetch({ id: 'x' });
			await makeCircleCIRequest('me', TOKEN);
			expect(captured?.url.startsWith(CIRCLECI_V2_BASE)).toBe(true);
		});

		it('v3 requests hit the undocumented base', async () => {
			mockFetch({ data: { id: 'x' } });
			await makeCircleCIV3Request('orb/packages', TOKEN);
			expect(captured?.url.startsWith(CIRCLECI_V3_BASE)).toBe(true);
		});

		it('v1.1 requests hit the legacy base', async () => {
			mockFetch({ build_num: 1 });
			await makeCircleCIV1Request('project/gh/x/y/1', TOKEN);
			expect(captured?.url.startsWith(CIRCLECI_V1_BASE)).toBe(true);
		});

		it('GraphQL requests hit graphql-unstable', async () => {
			mockFetch({ data: { orb: null } });
			await makeCircleCIGraphQLRequest('query { x }', undefined, TOKEN);
			expect(captured?.url).toBe(CIRCLECI_GRAPHQL_URL);
		});
	});

	describe('authentication', () => {
		it('sends the recommended Bearer scheme on v2', async () => {
			mockFetch({ id: 'x' });
			await makeCircleCIRequest('me', TOKEN);
			expect(captured?.headers.authorization).toBe(`Bearer ${TOKEN}`);
		});

		it('sends the same Bearer scheme on v3, v1.1 and GraphQL', async () => {
			mockFetch({ data: {} });
			await makeCircleCIV3Request('orb/packages', TOKEN);
			expect(captured?.headers.authorization).toBe(`Bearer ${TOKEN}`);

			mockFetch({});
			await makeCircleCIV1Request('project/gh/x/y/1', TOKEN);
			expect(captured?.headers.authorization).toBe(`Bearer ${TOKEN}`);

			mockFetch({ data: { orb: null } });
			await makeCircleCIGraphQLRequest('query { x }', undefined, TOKEN);
			expect(captured?.headers.authorization).toBe(`Bearer ${TOKEN}`);
		});
	});

	describe('v3 envelope unwrapping', () => {
		it('unwraps a single-entity {"data": ...} envelope', async () => {
			mockFetch({ data: { id: 'ns-1', attributes: { name: 'circleci' } } });
			const result = await makeCircleCIV3Request<{ id: string }>(
				'namespaces',
				TOKEN,
			);
			expect(result).toEqual({ id: 'ns-1', attributes: { name: 'circleci' } });
		});

		it('unwraps a list {"data": [...]} envelope to the bare array', async () => {
			mockFetch({
				data: [{ id: 'orb-1' }, { id: 'orb-2' }],
				page: { next: null },
			});
			const result = await makeCircleCIV3Request<{ id: string }[]>(
				'orb/packages',
				TOKEN,
			);
			expect(result).toEqual([{ id: 'orb-1' }, { id: 'orb-2' }]);
		});

		it('returns a response with no "data" key as-is', async () => {
			mockFetch({ id: 'created', message: 'Created.' });
			const result = await makeCircleCIV3Request<{ message: string }>(
				'namespaces/x/rename',
				TOKEN,
			);
			expect(result).toEqual({ id: 'created', message: 'Created.' });
		});
	});

	describe('array query params', () => {
		it('serialises an array as a repeated key, matching the spec examples', async () => {
			mockFetch({});
			await makeCircleCIRequest('insights/x/pages/summary', TOKEN, {
				query: { branches: ['main', 'feature'] },
			});
			const params = new URL(captured?.url ?? '').searchParams.getAll(
				'branches',
			);
			expect(params).toEqual(['main', 'feature']);
		});
	});

	describe('GraphQL failure shape', () => {
		it('throws CircleCIGraphQLError on a 200 carrying errors[], not a plain success', async () => {
			mockFetch({ errors: [{ message: 'Permission denied' }] });
			await expect(
				makeCircleCIGraphQLRequest('query { x }', undefined, TOKEN),
			).rejects.toBeInstanceOf(CircleCIGraphQLError);
		});

		it('does not throw when errors[] is absent, even with partial data', async () => {
			mockFetch({ data: { orb: null } });
			await expect(
				makeCircleCIGraphQLRequest('query { orb }', undefined, TOKEN),
			).resolves.toEqual({ orb: null });
		});

		it('a REST failure throws CircleCIAPIError, not CircleCIGraphQLError', async () => {
			mockFetch({ message: 'Forbidden' }, { status: 403 });
			const error = await makeCircleCIRequest('me', TOKEN).catch(
				(e: unknown) => e,
			);
			expect(error).toBeInstanceOf(CircleCIAPIError);
			expect(error).not.toBeInstanceOf(CircleCIGraphQLError);
			expect((error as CircleCIAPIError).status).toBe(403);
		});

		it('a GraphQL network failure throws CircleCIAPIError, not CircleCIGraphQLError', async () => {
			global.fetch = (async () => {
				throw new Error('network down');
			}) as unknown as typeof global.fetch;
			const error = await makeCircleCIGraphQLRequest(
				'query { x }',
				undefined,
				TOKEN,
			).catch((e: unknown) => e);
			expect(error).toBeInstanceOf(CircleCIAPIError);
			expect(error).not.toBeInstanceOf(CircleCIGraphQLError);
		});

		it('a malformed body on a 200 response throws CircleCIAPIError, not a raw SyntaxError', async () => {
			global.fetch = (async () => ({
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => {
					throw new SyntaxError('Unexpected token < in JSON');
				},
				text: async () => '<html>not json</html>',
			})) as unknown as typeof global.fetch;
			const error = await makeCircleCIGraphQLRequest(
				'query { x }',
				undefined,
				TOKEN,
			).catch((e: unknown) => e);
			expect(error).toBeInstanceOf(CircleCIAPIError);
			expect(error).not.toBeInstanceOf(SyntaxError);
		});
	});

	describe('GraphQL Retry-After - re-supplied explicitly, since this path bypasses the shared transport that would otherwise parse it', () => {
		function mockFetchWithHeaders(
			status: number,
			responseHeaders: Record<string, string>,
		) {
			global.fetch = (async () => ({
				ok: status < 400,
				status,
				statusText: 'Too Many Requests',
				headers: new Headers(responseHeaders),
				json: async () => ({}),
				text: async () => '{}',
			})) as unknown as typeof global.fetch;
		}

		it('converts a 429 Retry-After header (seconds) to milliseconds on CircleCIAPIError', async () => {
			mockFetchWithHeaders(429, { 'retry-after': '30' });
			const error = await makeCircleCIGraphQLRequest(
				'query { x }',
				undefined,
				TOKEN,
			).catch((e: unknown) => e);
			expect(error).toBeInstanceOf(CircleCIAPIError);
			expect((error as CircleCIAPIError).retryAfter).toBe(30_000);
		});

		it('leaves retryAfter undefined when CircleCI sends no Retry-After header', async () => {
			mockFetchWithHeaders(429, {});
			const error = await makeCircleCIGraphQLRequest(
				'query { x }',
				undefined,
				TOKEN,
			).catch((e: unknown) => e);
			expect(error).toBeInstanceOf(CircleCIAPIError);
			expect((error as CircleCIAPIError).retryAfter).toBeUndefined();
		});

		it('leaves retryAfter undefined on a non-numeric Retry-After header rather than sending NaN', async () => {
			mockFetchWithHeaders(429, { 'retry-after': 'not-a-number' });
			const error = await makeCircleCIGraphQLRequest(
				'query { x }',
				undefined,
				TOKEN,
			).catch((e: unknown) => e);
			expect(error).toBeInstanceOf(CircleCIAPIError);
			expect((error as CircleCIAPIError).retryAfter).toBeUndefined();
		});
	});

	describe('GraphQL variables', () => {
		it('sends the query and variables in the request body', async () => {
			mockFetch({ data: { orb: null } });
			await makeCircleCIGraphQLRequest(
				'query($name: String!) { orb(name: $name) { id } }',
				{ name: 'circleci/node' },
				TOKEN,
			);
			const body = JSON.parse(captured?.body ?? '{}');
			expect(body.variables).toEqual({ name: 'circleci/node' });
			expect(body.query).toContain('orb(name: $name)');
		});
	});
});
