/**
 * Covers the transport: authentication, the two API versions, and the two decisions where this
 * client deliberately differs from the generated template.
 *
 * Those two are the reason this file exists rather than being folded into the endpoint tests. Both
 * are invisible from an endpoint's perspective and both would break something important if changed
 * back.
 */
import { AuthMissingError } from 'corsair/core';
import {
	FORMBRICKS_CLOUD_HOST,
	makeFormbricksRequest,
	readRateLimit,
} from './client';
import type { FormbricksKeyBuilderContext } from './index';
import { formbricks } from './index';

const originalFetch = global.fetch;

afterAll(() => {
	global.fetch = originalFetch;
});

let captured:
	| {
			url: string;
			method: string;
			headers: Record<string, string>;
			body?: string;
	  }
	| undefined;

/**
 * Installs a fetch stub. `headers` is normalised to lower-cased keys because `request` may hand
 * fetch a plain object or a `Headers` instance, and asserting against one shape would silently pass
 * on the other.
 */
function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const raw = init?.headers;
		const headers: Record<string, string> = {};
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else if (raw && typeof raw === 'object') {
			for (const [key, value] of Object.entries(
				raw as Record<string, string>,
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
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

describe('authentication', () => {
	/**
	 * The header is `x-api-key`, **not** `Authorization: Bearer`. Both OpenAPI documents declare
	 * `apiKeyAuth` with that header name as the only security scheme, and getting it wrong produces a
	 * 401 that looks like a bad key rather than a bad header.
	 */
	it('sends the key as x-api-key rather than a bearer token', async () => {
		mockFetch({ data: {} });

		await makeFormbricksRequest('v1', 'management/surveys', 'test-key');

		expect(captured?.headers['x-api-key']).toBe('test-key');
		expect(captured?.headers.authorization).toBeUndefined();
	});

	it('sends JSON content type', async () => {
		mockFetch({ data: {} });

		await makeFormbricksRequest('v1', 'management/surveys', 'test-key');

		expect(captured?.headers['content-type']).toContain('application/json');
	});
});

describe('the two API versions', () => {
	/**
	 * The operation surface spans v1 and v2, so the version is a required argument rather than a
	 * default. A default would silently send a v2-only request to v1 and produce a 404 that reads as
	 * a missing record.
	 */
	it('builds the base URL from the version it is given', async () => {
		mockFetch({ data: {} });
		await makeFormbricksRequest('v1', 'management/surveys', 'k');
		expect(captured?.url).toBe(
			`${FORMBRICKS_CLOUD_HOST}/api/v1/management/surveys`,
		);

		mockFetch({ data: {} });
		await makeFormbricksRequest('v2', 'management/webhooks', 'k');
		expect(captured?.url).toBe(
			`${FORMBRICKS_CLOUD_HOST}/api/v2/management/webhooks`,
		);
	});

	/** Self-hosting differs only by host, so the option is a host override and nothing more. */
	it('honours a host override for self-hosted instances', async () => {
		mockFetch({ data: {} });

		await makeFormbricksRequest('v1', 'management/surveys', 'k', {
			host: 'https://forms.example.com',
		});

		expect(captured?.url).toBe(
			'https://forms.example.com/api/v1/management/surveys',
		);
	});
});

describe('what this client does differently from the template', () => {
	/**
	 * **Errors are not wrapped.**
	 *
	 * The generated template caught everything and rethrew it as a `FormbricksAPIError`, discarding
	 * the `ApiError` and with it the HTTP status. Every error handler in this plugin classifies on
	 * status, and the delete flow depends on telling a 404 from a 500 to decide whether a record is
	 * gone - so wrapping would quietly disable both.
	 *
	 * Asserted by checking the thrown error still carries a status, which a wrapper would have lost.
	 */
	it('lets the status-bearing error propagate instead of wrapping it', async () => {
		mockFetch({ message: 'Not found' }, 404);

		await expect(
			makeFormbricksRequest('v1', 'management/surveys/nope', 'k'),
		).rejects.toMatchObject({ status: 404 });
	});

	it('preserves the status for every class of failure', async () => {
		for (const status of [400, 401, 403, 404, 422, 429, 500]) {
			mockFetch({ message: 'x' }, status);
			await expect(
				makeFormbricksRequest('v1', 'management/surveys', 'k'),
			).rejects.toMatchObject({ status });
		}
	});

	/**
	 * **`query` is sent on every method, not only GET.**
	 *
	 * The template dropped it on writes. A silently discarded query parameter is the worst kind of
	 * bug: the request succeeds and does something other than what was asked.
	 */
	it('sends query parameters on a write, not only on a read', async () => {
		mockFetch({ data: {} });

		await makeFormbricksRequest('v1', 'management/responses', 'k', {
			method: 'PUT',
			body: { finished: true },
			query: { surveyId: 'survey-1' },
		});

		expect(decodeURIComponent(captured?.url ?? '')).toContain(
			'surveyId=survey-1',
		);
	});
});

describe('bodies', () => {
	it('sends a body on POST, PUT and PATCH', async () => {
		for (const method of ['POST', 'PUT', 'PATCH'] as const) {
			mockFetch({ data: {} });
			await makeFormbricksRequest('v1', 'management/surveys', 'k', {
				method,
				body: { name: 'x' },
			});
			expect(JSON.parse(captured?.body ?? '{}')).toEqual({ name: 'x' });
		}
	});

	/**
	 * A GET or DELETE carries no body. Formbricks answers a delete with the deleted record, so there
	 * is nothing to send - and a body on a GET is rejected by some runtimes outright.
	 */
	it('sends no body on GET or DELETE', async () => {
		for (const method of ['GET', 'DELETE'] as const) {
			mockFetch({ data: {} });
			await makeFormbricksRequest('v1', 'management/surveys', 'k', {
				method,
				body: { ignored: true },
			});
			expect(captured?.body).toBeUndefined();
		}
	});
});

describe('rate limit headers', () => {
	/**
	 * Formbricks documents no budget and returned no such headers on any observed response, so this
	 * reader exists for the case where that changes. It has to return an empty object rather than
	 * throwing or guessing - a caller checking `remaining` should see `undefined`, not `0`, which
	 * would read as "no requests left".
	 */
	it('returns an empty budget when the provider sends no headers', () => {
		const budget = readRateLimit(
			new Headers({ 'Content-Type': 'application/json' }),
		);

		expect(budget.limit).toBeUndefined();
		expect(budget.remaining).toBeUndefined();
		expect(budget.reset).toBeUndefined();
	});

	it('reads the headers when they are present', () => {
		const budget = readRateLimit(
			new Headers({
				'x-ratelimit-limit': '100',
				'x-ratelimit-remaining': '0',
				'x-ratelimit-reset': '1760000000',
			}),
		);

		// Zero remaining must survive as 0 rather than becoming undefined, which is what a
		// truthiness check would have done to it.
		expect(budget.limit).toBe(100);
		expect(budget.remaining).toBe(0);
		expect(budget.reset).toBe(1760000000);
	});

	it('ignores a header that is not a number', () => {
		const budget = readRateLimit(new Headers({ 'x-ratelimit-limit': 'lots' }));

		expect(budget.limit).toBeUndefined();
	});
});

describe('keyBuilder', () => {
	const plugin = formbricks();

	it('throws AuthMissingError instead of sending an empty x-api-key', async () => {
		const noKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as FormbricksKeyBuilderContext;

		await expect(
			plugin.keyBuilder!(noKeyCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when the stored key is an empty string', async () => {
		const emptyKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => '' },
		} as unknown as FormbricksKeyBuilderContext;

		await expect(
			plugin.keyBuilder!(emptyKeyCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns the stored key when one is available', async () => {
		const withKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => 'fbk_test' },
		} as unknown as FormbricksKeyBuilderContext;

		await expect(plugin.keyBuilder!(withKeyCtx, 'endpoint')).resolves.toBe(
			'fbk_test',
		);
	});
});
