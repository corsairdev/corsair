import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { WoodpeckerCoAPIError } from './client';
import { woodpeckerco } from './index';
import {
	campaign,
	prospectsAdded,
	v1BadKey,
	v1RateLimited,
	v2Domain,
	v2Problem,
} from './test-fixtures';

async function createClient(options: Parameters<typeof woodpeckerco>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'woodpeckerco', 'default');
	const corsair = createCorsair({
		plugins: [woodpeckerco(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
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

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Woodpecker plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.woodpeckerco.keys.issue_new_dek();
			await expect(corsair.woodpeckerco.api.campaigns.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.woodpeckerco.keys.issue_new_dek();
			await corsair.woodpeckerco.keys.set_api_key('wp-stored-key');
			respond([campaign]);

			await corsair.woodpeckerco.api.campaigns.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('x-api-key')).toBe('wp-stored-key');
			expect(headers.get('authorization')).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('reads campaigns with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'wp-test-key' });
		try {
			respond([campaign]);

			const result = await corsair.woodpeckerco.api.campaigns.list({
				status: ['RUNNING'],
			});

			expect(result.campaigns[0]?.name).toBe('Field teams Q4');
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				'https://api.woodpecker.co/rest/v1/campaign_list?status=RUNNING',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists webhook events without an HTTP call', async () => {
		const { corsair, testDb } = await createClient({ key: 'wp-test-key' });
		try {
			const result = await corsair.woodpeckerco.api.webhooks.listEvents({});

			expect(result.events).toHaveLength(27);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a v1 409 rate limit and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'wp-test-key' });
		try {
			respond(v1RateLimited, 409, { 'Retry-After': '1' });
			respond([campaign]);

			const result = await corsair.woodpeckerco.api.campaigns.list({});

			expect(result.campaigns).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a rate-limited write, which Woodpecker dropped unprocessed', async () => {
		const { corsair, testDb } = await createClient({ key: 'wp-test-key' });
		try {
			respond(v1RateLimited, 409, { 'Retry-After': '1' });
			respond(prospectsAdded);

			const result = await corsair.woodpeckerco.api.prospects.addToCampaign({
				campaign: { campaign_id: 1 },
				prospects: [{ email: 'priya@northwind.example' }],
			});

			expect(result.prospects).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a v2 429 and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'wp-test-key' });
		try {
			respond(v2Problem(429, 'Too Many Requests', 'Too many requests.'), 429, {
				'Retry-After': '1',
			});
			fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

			await expect(
				corsair.woodpeckerco.api.campaigns.pause({ campaign_id: 1 }),
			).resolves.toEqual({ success: true, campaign_id: 1 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a v2 409 that is a real conflict', async () => {
		const { corsair, testDb } = await createClient({ key: 'wp-test-key' });
		try {
			respond(
				v2Domain('BRANCH_NOT_DELETABLE', 'Step is not allowed to be deleted'),
				409,
			);

			await expect(
				corsair.woodpeckerco.api.campaigns.deleteStep({
					campaign_id: 1,
					step_id: 'a',
				}),
			).rejects.toMatchObject({ status: 409, code: 'BRANCH_NOT_DELETABLE' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'wp-bad-key' });
		try {
			respond(v1BadKey, 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.woodpeckerco.api.campaigns
				.list({})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(WoodpeckerCoAPIError);
			expect(error).toMatchObject({ status: 401, code: 'E_SESSION' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
