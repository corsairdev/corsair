import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { FollowUpBossAPIError } from './client';
import { followupboss } from './index';

async function createClient(options: Parameters<typeof followupboss>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'followupboss', 'default');
	const corsair = createCorsair({
		plugins: [followupboss(options)],
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

// Documented FUB shapes; the output schemas are `.loose()`, so only the fields
// the tests assert need to be present here.
const person = {
	id: 42,
	name: 'Priya Northwind',
	firstName: 'Priya',
	lastName: 'Northwind',
	stage: 'Lead',
	source: 'Zillow',
	contacted: false,
	emails: [{ value: 'priya@northwind.example', type: 'work' }],
	phones: [{ value: '+15550100001', type: 'mobile' }],
	tags: ['zillow-lead'],
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Follow Up Boss plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.followupboss.keys.issue_new_dek();
			await expect(corsair.followupboss.api.people.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account as Basic auth', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.followupboss.keys.issue_new_dek();
			await corsair.followupboss.keys.set_api_key('fub-stored-key');
			respond({ _metadata: { total: 1 }, people: [person] });

			await corsair.followupboss.api.people.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			// FUB Basic auth: the key is the username and the password is empty,
			// so the exact header is `Basic <base64(key + ':')>`, never a Bearer.
			expect(headers.get('authorization')).toBe(
				`Basic ${Buffer.from('fub-stored-key:').toString('base64')}`,
			);
			expect(headers.get('authorization')).not.toContain('Bearer');
			expect(headers.get('x-system')).toBe('corsair');
		} finally {
			testDb.cleanup();
		}
	});

	it('reads people with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'fub-test-key' });
		try {
			respond({ _metadata: { total: 1 }, people: [person] });

			const result = await corsair.followupboss.api.people.list({});

			expect(result.people).toHaveLength(1);
			expect(result.people[0]?.id).toBe(42);
			expect(result.people[0]?.name).toBe('Priya Northwind');
			expect(result.people[0]?.stage).toBe('Lead');
			expect(result.people[0]?.emails?.[0]?.value).toBe(
				'priya@northwind.example',
			);
			expect(result._metadata?.total).toBe(1);
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.followupboss.com/v1/people');
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the registered system identity headers when configured', async () => {
		const { corsair, testDb } = await createClient({
			key: 'fub-test-key',
			systemName: 'MyApp',
			systemKey: 'SK1',
		});
		try {
			respond({ _metadata: { total: 1 }, people: [person] });

			await corsair.followupboss.api.people.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('x-system')).toBe('MyApp');
			expect(headers.get('x-system-key')).toBe('SK1');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 with Retry-After and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'fub-test-key' });
		try {
			respond({ errorMessage: 'Too Many Requests' }, 429, {
				'Retry-After': '1',
			});
			respond({ _metadata: { total: 1 }, people: [person] });

			const result = await corsair.followupboss.api.people.list({});

			expect(result.people).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key and never leaks the key', async () => {
		const { corsair, testDb } = await createClient({ key: 'fub-bad-key' });
		try {
			respond({ errorMessage: 'Invalid API key' }, 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.followupboss.api.people
				.list({})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(FollowUpBossAPIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
			// The key travels only in the Authorization header, never in the error.
			const message = error instanceof Error ? error.message : '';
			expect(message).not.toContain('fub-bad-key');
			expect(JSON.stringify(error)).not.toContain('fub-bad-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a locked account', async () => {
		const { corsair, testDb } = await createClient({ key: 'fub-test-key' });
		try {
			respond({ errorMessage: 'Account locked' }, 403);

			await expect(
				corsair.followupboss.api.people.list({}),
			).rejects.toMatchObject({ status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('creates a note end to end', async () => {
		const { corsair, testDb } = await createClient({ key: 'fub-test-key' });
		try {
			respond({ notes: [{ id: 5, personId: 1, body: 'hello' }] });

			const result = await corsair.followupboss.api.notes.create({
				personId: 1,
				body: 'hello',
			});

			expect(result.id).toBe(5);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.followupboss.com/v1/notes');
			expect(init.method).toBe('POST');
			const body = String(init.body);
			expect(body).toContain('"personId":1');
			expect(body).toContain('"body":"hello"');
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Follow Up Boss live smoke (opt-in)', () => {
	const key = process.env.FOLLOWUPBOSS_API_KEY;
	const maybe = key ? it : it.skip;

	maybe('reads /me and /identity without throwing', async () => {
		const { corsair, testDb } = await createClient({ key });
		try {
			// No fetch mock here: these two read-only calls hit the real API and
			// must not throw. No mutation ops run live.
			const me = await corsair.followupboss.api.account.me({});
			expect(me.id).toBeDefined();

			const identity = await corsair.followupboss.api.account.identity({});
			expect(identity).toBeDefined();
		} finally {
			testDb.cleanup();
		}
	});
});
