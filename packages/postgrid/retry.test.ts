import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { POSTGRID_API_BASE, PostgridAPIError } from './client';
import { postgrid } from './index';
import { captureError } from './test-helpers';

async function createClient(options: Parameters<typeof postgrid>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'postgrid', 'default');
	const corsair = createCorsair({
		plugins: [postgrid(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** Queues one response for the next fetch call. */
function respond(
	body: unknown, // unknown: each test passes one of PostGrid's response shapes.
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

const page = { object: 'list', limit: 10, skip: 0, totalCount: 0, data: [] };

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('PostGrid plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is stored', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.postgrid.keys.issue_new_dek();
			await expect(corsair.postgrid.api.contacts.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the key the account stored, in the x-api-key header', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.postgrid.keys.issue_new_dek();
			await corsair.postgrid.keys.set_api_key('stored-key');
			respond(page);

			const result = await corsair.postgrid.api.contacts.list({ limit: 10 });

			expect(result.data).toEqual([]);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`${POSTGRID_API_BASE}/contacts?limit=10`);
			expect(new Headers(init.headers).get('x-api-key')).toBe('stored-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the key[] form for a list-valued query', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond({ id: 'letter_1', status: 'ready' });

			await corsair.postgrid.api.letters.get({
				id: 'letter_1',
				expand: ['template'],
			});

			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			// The provider reads `expand[]`; a bare `expand` would be the last value.
			expect(url).toBe(
				`${POSTGRID_API_BASE}/letters/letter_1?expand%5B%5D=template`,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('sends an Idempotency-Key on an order', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond({ id: 'letter_new', status: 'ready' });

			await corsair.postgrid.api.letters.create({
				to: { addressLine1: '145 Mulberry St', countryCode: 'US' },
				from: { id: 'contact_sender' },
				html: '<b>Hi</b>',
				idempotencyKey: 'my-attempt-1',
			});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('Idempotency-Key')).toBe(
				'my-attempt-1',
			);
			// The key is a header, never part of the JSON body.
			expect(JSON.parse(String(init.body))).not.toHaveProperty(
				'idempotencyKey',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected key', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respond(
				{
					object: 'error',
					error: {
						type: 'invalid_api_key_error',
						message: 'Invalid API key bad-key',
					},
				},
				401,
			);

			const error = await captureError(corsair.postgrid.api.contacts.list({}));

			expect(error).toBeInstanceOf(PostgridAPIError);
			expect(error).toMatchObject({
				status: 401,
				code: 'invalid_api_key_error',
				credentialsRejected: true,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
			// The key rode in a header, so no error may echo it.
			expect(JSON.stringify(error)).not.toContain('bad-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond({ object: 'error', error: { type: 'rate_limit_error' } }, 429, {
				'Retry-After': '1',
			});
			respond(page);

			const pending = corsair.postgrid.api.contacts.list({});
			await jest.advanceTimersByTimeAsync(5000);
			const result = await pending;

			expect(result.data).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('does not replay an order after a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond({ object: 'error', error: { type: 'server_error' } }, 503);

			await expect(
				corsair.postgrid.api.letters.create({
					to: { addressLine1: '145 Mulberry St', countryCode: 'US' },
					from: { id: 'contact_sender' },
					html: '<b>Hi</b>',
				}),
			).rejects.toBeInstanceOf(PostgridAPIError);
			// One attempt only: the letter may already be printing.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
