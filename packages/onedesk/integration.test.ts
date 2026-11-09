import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { onedesk } from './index';
import {
	item,
	itemResult,
	organizationItemTypes,
	pagedIds,
	securityAccessError,
	serviceUnavailableError,
} from './test-fixtures';

async function createClient(options: Parameters<typeof onedesk>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'onedesk', 'default');
	const corsair = createCorsair({
		plugins: [onedesk(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or a bare code string.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function calls(): number {
	return fetchMock.mock.calls.length;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('OneDesk plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.onedesk.keys.issue_new_dek();
			await expect(
				corsair.onedesk.api.organization.itemTypes({}),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.onedesk.keys.issue_new_dek();
			await corsair.onedesk.keys.set_api_key('od-stored-key');
			respond(organizationItemTypes);

			await corsair.onedesk.api.organization.itemTypes({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('od-public-api-key')).toBe(
				'od-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 and succeeds on the next attempt', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'od-key' });
		try {
			await corsair.onedesk.keys.issue_new_dek();
			respond({ message: 'Rate limit reached' }, 429);
			respond(organizationItemTypes);

			const pending = corsair.onedesk.api.organization.itemTypes({});
			await jest.advanceTimersByTimeAsync(2000);
			await expect(pending).resolves.toMatchObject({ code: 'SUCCESS' });
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('gives up after the rate-limit attempts are spent', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'od-key' });
		try {
			await corsair.onedesk.keys.issue_new_dek();
			for (let i = 0; i < 6; i++) {
				respond({ message: 'Rate limit reached' }, 429);
			}

			const pending = corsair.onedesk.api.organization.itemTypes({});
			pending.catch(() => undefined);
			await jest.advanceTimersByTimeAsync(20_000);
			await expect(pending).rejects.toThrow();
			// One attempt plus the three retries the handler allows.
			expect(calls()).toBe(4);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('does not retry a rejected key', async () => {
		const { corsair, testDb } = await createClient({ key: 'od-key' });
		try {
			await corsair.onedesk.keys.issue_new_dek();
			respond(null, 401);

			await expect(
				corsair.onedesk.api.organization.itemTypes({}),
			).rejects.toThrow();
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails a call whose 200 envelope carries a security error', async () => {
		const { corsair, testDb } = await createClient({ key: 'od-key' });
		try {
			await corsair.onedesk.keys.issue_new_dek();
			respond(securityAccessError);

			await expect(
				corsair.onedesk.api.items.filter({ itemType: ['Ticket'] }),
			).rejects.toThrow(/ERROR_SECURITY_ACCESS/);
			// A permission problem is not retried.
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries ERROR_SERVICE_UNAVAILABLE on a read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'od-key' });
		try {
			await corsair.onedesk.keys.issue_new_dek();
			respond(serviceUnavailableError);
			respond(pagedIds);

			const pending = corsair.onedesk.api.items.filter({
				itemType: ['Ticket'],
			});
			await jest.advanceTimersByTimeAsync(3000);
			await expect(pending).resolves.toMatchObject({ code: 'SUCCESS' });
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('does not repeat a write that reported ERROR_SERVICE_UNAVAILABLE', async () => {
		const { corsair, testDb } = await createClient({ key: 'od-key' });
		try {
			await corsair.onedesk.keys.issue_new_dek();
			respond(serviceUnavailableError);

			await expect(
				corsair.onedesk.api.items.create({ name: 'Ticket one' }),
			).rejects.toThrow(/ERROR_SERVICE_UNAVAILABLE/);
			// The record may already exist; a replay would duplicate it.
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a create after a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: 'od-key' });
		try {
			await corsair.onedesk.keys.issue_new_dek();
			respond({ message: 'Internal Server Error' }, 500);

			await expect(
				corsair.onedesk.api.items.create({ name: 'Ticket one' }),
			).rejects.toThrow();
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns the item through the bound endpoint', async () => {
		const { corsair, testDb } = await createClient({ key: 'od-key' });
		try {
			await corsair.onedesk.keys.issue_new_dek();
			respond(itemResult);

			const result = await corsair.onedesk.api.items.get({ externalId: 'i-1' });
			expect(result.data?.name).toBe(item.name);
		} finally {
			testDb.cleanup();
		}
	});
});
