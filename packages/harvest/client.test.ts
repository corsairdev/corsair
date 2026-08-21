/**
 * Covers the transport: the three headers Harvest requires, how the account id
 * is resolved, and how account discovery behaves. Network access is mocked, so
 * this runs in CI.
 */
import { ApiError } from 'corsair/http';
import {
	discoverHarvestAccountId,
	HarvestAccountIdMissingError,
	makeHarvestRequest,
} from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
};

type MockResponse = {
	ok?: boolean;
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
};

let captured: Captured | undefined;
let attempts = 0;

/**
 * Installs a fetch stub that answers each call with the next response in the
 * list, repeating the last one once the list is exhausted. The cast is the
 * usual one for replacing a global: the stub implements only the slice of the
 * `fetch` contract `request` actually reads.
 */
function mockFetchSequence(responses: MockResponse[]) {
	captured = undefined;
	attempts = 0;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		// `request` may hand fetch either a plain object or a `Headers`
		// instance; both are normalised to lower-cased keys here.
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

		const response =
			responses[Math.min(attempts, responses.length - 1)] ??
			({} as MockResponse);
		attempts++;

		const status = response.status ?? 200;
		const payload = response.body ?? {};
		return {
			ok: response.ok ?? status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
				...response.headers,
			}),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function mockFetch(response: MockResponse) {
	mockFetchSequence([response]);
}

describe('makeHarvestRequest', () => {
	it('sends the bearer token, the account header and a user agent', async () => {
		mockFetch({ body: { id: 1 } });

		await makeHarvestRequest('clients', 'test-token', '1234567');

		expect(captured?.headers.authorization).toBe('Bearer test-token');
		expect(captured?.headers['harvest-account-id']).toBe('1234567');
		// Harvest answers 400 to any request without a User-Agent, so its
		// presence is not optional politeness.
		expect(captured?.headers['user-agent']).toBeDefined();
		expect(captured?.headers['user-agent']).toContain('Corsair');
	});

	it('targets the v2 API host', async () => {
		mockFetch({ body: {} });

		await makeHarvestRequest('clients/12345', 'test-token', '1234567');

		expect(captured?.url).toContain('https://api.harvestapp.com/v2/');
		expect(captured?.url).toContain('clients/12345');
	});

	it('refuses to call out without an account id', async () => {
		mockFetch({ body: {} });

		await expect(
			makeHarvestRequest('clients', 'test-token', ''),
		).rejects.toBeInstanceOf(HarvestAccountIdMissingError);

		// The request must not have been attempted: Harvest would answer 404
		// for the wrong account rather than a clear authentication failure.
		expect(captured).toBeUndefined();
	});

	it('sends a body on POST and PATCH but not on GET or DELETE', async () => {
		mockFetch({ body: {} });
		await makeHarvestRequest('clients', 'test-token', '1234567', {
			method: 'POST',
			body: { name: 'Acme' },
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.body).toContain('Acme');

		mockFetch({ body: {} });
		await makeHarvestRequest('clients/1', 'test-token', '1234567', {
			method: 'DELETE',
			body: { name: 'ignored' },
		});
		expect(captured?.method).toBe('DELETE');
		expect(captured?.body).toBeUndefined();
	});

	it('retries once Harvest answers 429 and honours Retry-After', async () => {
		mockFetchSequence([
			{ status: 429, body: {}, headers: { 'Retry-After': '1' } },
			{ status: 200, body: { clients: [] } },
		]);

		const result = await makeHarvestRequest<{ clients: unknown[] }>(
			'clients',
			'test-token',
			'1234567',
		);

		// The 429 is the only rate-limit signal Harvest sends, so the retry has
		// to come from it rather than from a remaining-quota header.
		expect(attempts).toBe(2);
		expect(result.clients).toEqual([]);
	});
});

describe('discoverHarvestAccountId', () => {
	it('returns the single Harvest account a token can reach', async () => {
		mockFetch({
			body: {
				accounts: [{ id: 1234567, name: 'testing', product: 'harvest' }],
			},
		});

		await expect(discoverHarvestAccountId('test-token')).resolves.toBe(
			'1234567',
		);
		expect(captured?.url).toBe('https://id.getharvest.com/api/v2/accounts');
	});

	it('ignores Forecast accounts, which the Harvest API rejects', async () => {
		mockFetch({
			body: {
				accounts: [
					{ id: 111, name: 'planning', product: 'forecast' },
					{ id: 1234567, name: 'testing', product: 'harvest' },
				],
			},
		});

		await expect(discoverHarvestAccountId('test-token')).resolves.toBe(
			'1234567',
		);
	});

	it('refuses to guess when several Harvest accounts are reachable', async () => {
		mockFetch({
			body: {
				accounts: [
					{ id: 111, name: 'one', product: 'harvest' },
					{ id: 222, name: 'two', product: 'harvest' },
				],
			},
		});

		await expect(discoverHarvestAccountId('test-token')).rejects.toBeInstanceOf(
			HarvestAccountIdMissingError,
		);
	});

	it('reports a missing account when the token reaches none', async () => {
		mockFetch({ body: { accounts: [] } });

		await expect(discoverHarvestAccountId('test-token')).rejects.toBeInstanceOf(
			HarvestAccountIdMissingError,
		);
	});

	it('surfaces the HTTP status when discovery itself fails', async () => {
		mockFetch({ ok: false, status: 401, body: {} });

		// A rejected token must not be reported as a missing account id: the
		// status is what tells the caller which credential to fix, and it is what
		// `AUTH_ERROR` matches on.
		const error = await discoverHarvestAccountId('bad-token').catch((e) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).not.toBeInstanceOf(HarvestAccountIdMissingError);
		expect((error as ApiError).status).toBe(401);
	});
});
