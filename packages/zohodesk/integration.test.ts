import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { ZohoDeskRegion } from './client';
import { ZohoDeskAPIError } from './client';
import { zohodesk } from './index';
import {
	CONTACT_ID,
	contact,
	errorBody,
	ORG_ID,
	organization,
	TICKET_ID,
	ticket,
	tokenResponse,
} from './test-fixtures';

// These run the real createCorsair binding against a mocked fetch: no call
// reaches Zoho. The refresh and retry cases depend on that binding, because it
// decides which context object reaches an endpoint.

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';
const ACCESS_TOKEN = '1000.stored-access-token';
const REFRESH_TOKEN = '1000.stored-refresh-token';

const nowSeconds = () => Math.floor(Date.now() / 1000);

type Seed = {
	expiresAt?: number;
	orgId?: string;
	options?: Parameters<typeof zohodesk>[0];
};

async function createClient({
	expiresAt = nowSeconds() + 3000,
	orgId = ORG_ID,
	options = {},
}: Seed = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'zohodesk', 'default');
	const corsair = createCorsair({
		plugins: [zohodesk(options)],
		database: testDb.db,
		kek: KEK,
	});
	await corsair.keys.zohodesk.issue_new_dek();
	await corsair.keys.zohodesk.set_client_id('client-id');
	await corsair.keys.zohodesk.set_client_secret('client-secret');
	await corsair.zohodesk.keys.issue_new_dek();
	await corsair.zohodesk.keys.set_access_token(ACCESS_TOKEN);
	await corsair.zohodesk.keys.set_refresh_token(REFRESH_TOKEN);
	await corsair.zohodesk.keys.set_expires_at(String(expiresAt));
	if (orgId) await corsair.zohodesk.keys.set_tenant_external_id(orgId);
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

function calls() {
	return fetchMock.mock.calls.map(([url, init]) => {
		const headers = new Headers(init?.headers);
		return {
			url: String(url),
			authorization: headers.get('authorization'),
			orgId: headers.get('orgId'),
			body: init?.body,
		};
	});
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Zoho Desk plugin through createCorsair', () => {
	it('calls the API with the stored token and org', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ data: [ticket] });

			const result = await corsair.zohodesk.api.tickets.list({ limit: 1 });

			expect(result.data[0]?.id).toBe(TICKET_ID);
			expect(calls()).toEqual([
				expect.objectContaining({
					url: 'https://desk.zoho.com/api/v1/tickets?limit=1',
					authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
					orgId: ORG_ID,
				}),
			]);
		} finally {
			testDb.cleanup();
		}
	});

	it.each<[ZohoDeskRegion, string]>([
		['eu', 'desk.zoho.eu'],
		['in', 'desk.zoho.in'],
		['ca', 'desk.zohocloud.ca'],
	])('sends %s traffic to %s', async (region, host) => {
		const { corsair, testDb } = await createClient({ options: { region } });
		try {
			respond({ count: 1 });

			await corsair.zohodesk.api.agents.getCount({});

			expect(calls()[0]?.url).toBe(`https://${host}/api/v1/agents/count`);
		} finally {
			testDb.cleanup();
		}
	});

	it('takes the data center from a pasted api_domain', async () => {
		const { corsair, testDb } = await createClient({
			options: { apiDomain: 'https://www.zohoapis.jp' },
		});
		try {
			respond({ count: 1 });

			await corsair.zohodesk.api.agents.getCount({});

			expect(calls()[0]?.url).toBe('https://desk.zoho.jp/api/v1/agents/count');
		} finally {
			testDb.cleanup();
		}
	});

	it('uses the static key option without touching the token store', async () => {
		const { corsair, testDb } = await createClient({
			options: { key: 'static-token', orgId: '555' },
		});
		try {
			respond({ count: 1 });

			await corsair.zohodesk.api.agents.getCount({});

			expect(calls()[0]).toMatchObject({
				authorization: 'Zoho-oauthtoken static-token',
				orgId: '555',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('finds and keeps the org when none is stored yet', async () => {
		const { corsair, testDb } = await createClient({ orgId: '' });
		try {
			respond({ data: [organization] });
			respond({ data: [] });
			respond({ data: [] });

			await corsair.zohodesk.api.tickets.list({});
			await corsair.zohodesk.api.contacts.list({});

			expect(calls().map(({ url, orgId }) => [url, orgId])).toEqual([
				['https://desk.zoho.com/api/v1/organizations', null],
				['https://desk.zoho.com/api/v1/tickets', ORG_ID],
				['https://desk.zoho.com/api/v1/contacts', ORG_ID],
			]);
			await expect(
				corsair.zohodesk.keys.get_tenant_external_id(),
			).resolves.toBe(ORG_ID);
		} finally {
			testDb.cleanup();
		}
	});

	it('leaves the org to the token when the user has several', async () => {
		const { corsair, testDb } = await createClient({ orgId: '' });
		try {
			respond({ data: [{ id: '1' }, { id: '2' }] });
			respond({ data: [] });
			respond({ data: [] });

			await corsair.zohodesk.api.tickets.list({});
			await corsair.zohodesk.api.tickets.list({});

			expect(calls().map(({ url, orgId }) => [url, orgId])).toEqual([
				['https://desk.zoho.com/api/v1/organizations', null],
				['https://desk.zoho.com/api/v1/tickets', null],
				['https://desk.zoho.com/api/v1/tickets', null],
			]);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Zoho Desk token refresh through createCorsair', () => {
	it('refreshes an expired token at the data center that issued it', async () => {
		const { corsair, testDb } = await createClient({
			expiresAt: nowSeconds() - 60,
			options: { region: 'eu' },
		});
		try {
			respond(tokenResponse('1000.fresh'));
			respond({ data: [] });

			await corsair.zohodesk.api.tickets.list({});

			const [refresh, listCall] = calls();
			expect(refresh?.url).toBe('https://accounts.zoho.eu/oauth/v2/token');
			const form = new URLSearchParams(String(refresh?.body));
			expect(Object.fromEntries(form)).toEqual({
				grant_type: 'refresh_token',
				refresh_token: REFRESH_TOKEN,
				client_id: 'client-id',
				client_secret: 'client-secret',
			});
			expect(listCall?.authorization).toBe('Zoho-oauthtoken 1000.fresh');
			await expect(corsair.zohodesk.keys.get_access_token()).resolves.toBe(
				'1000.fresh',
			);
			// Zoho's refresh answer has no new refresh token; the old one stays.
			await expect(corsair.zohodesk.keys.get_refresh_token()).resolves.toBe(
				REFRESH_TOKEN,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('replaces a token Zoho rejects while it still looks valid', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(errorBody('INVALID_OAUTH', 'The OauthToken is invalid.'), 401);
			respond(tokenResponse('1000.fresh'));
			respond({ data: [ticket] });

			const result = await corsair.zohodesk.api.tickets.list({});

			expect(result.data).toHaveLength(1);
			expect(
				calls().map(({ url, authorization }) => [url, authorization]),
			).toEqual([
				[
					'https://desk.zoho.com/api/v1/tickets',
					`Zoho-oauthtoken ${ACCESS_TOKEN}`,
				],
				['https://accounts.zoho.com/oauth/v2/token', null],
				['https://desk.zoho.com/api/v1/tickets', 'Zoho-oauthtoken 1000.fresh'],
			]);
			await expect(corsair.zohodesk.keys.get_access_token()).resolves.toBe(
				'1000.fresh',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('refreshes for a logo download too', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(errorBody('INVALID_OAUTH'), 401);
			respond(tokenResponse('1000.fresh'));
			fetchMock.mockResolvedValueOnce(
				new Response(Buffer.from([1, 2]), {
					headers: { 'Content-Type': 'image/png' },
				}),
			);

			const logo = await corsair.zohodesk.api.departments.getLogo({
				departmentId: '1',
			});

			expect(logo).toMatchObject({ contentType: 'image/png', size: 2 });
			expect(calls()[2]?.authorization).toBe('Zoho-oauthtoken 1000.fresh');
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after one refresh if the new token is refused as well', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(errorBody('INVALID_OAUTH'), 401);
			respond(tokenResponse('1000.fresh'));
			respond(errorBody('INVALID_OAUTH'), 401);

			await expect(corsair.zohodesk.api.tickets.list({})).rejects.toMatchObject(
				{ status: 401, code: 'INVALID_OAUTH' },
			);
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not spend a refresh on a missing scope', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(errorBody('SCOPE_MISMATCH'), 401);

			await expect(corsair.zohodesk.api.tickets.list({})).rejects.toMatchObject(
				{ code: 'SCOPE_MISMATCH' },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('surfaces a refused refresh token', async () => {
		const { corsair, testDb } = await createClient({
			expiresAt: nowSeconds() - 60,
		});
		try {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify({ error: 'invalid_code' }), {
					status: 400,
				}),
			);

			await expect(corsair.zohodesk.api.tickets.list({})).rejects.toThrow(
				'OAuth token refresh failed (400)',
			);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Zoho Desk rate limits through createCorsair', () => {
	// Runs every wait at once and records how long it asked for. Fake timers
	// would stall the database driver these calls go through.
	function recordWaits() {
		const waits: number[] = [];
		const realSetTimeout = globalThis.setTimeout;
		const instant = (callback: () => void, ms?: number) => {
			waits.push(ms ?? 0);
			return realSetTimeout(callback, 0);
		};
		jest
			.spyOn(globalThis, 'setTimeout')
			.mockImplementation(instant as typeof setTimeout);
		return waits;
	}

	it('waits out a short Retry-After and tries again', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const waits = recordWaits();
			respond(errorBody('THRESHOLD_EXCEEDED'), 429, { 'Retry-After': '34' });
			respond({ data: [ticket] });

			await expect(
				corsair.zohodesk.api.tickets.list({}),
			).resolves.toMatchObject({ data: [{ id: TICKET_ID }] });

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(waits.filter((ms) => ms === 34_000)).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails at once when the daily credits are gone for hours', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const waits = recordWaits();
			respond(errorBody('THRESHOLD_EXCEEDED'), 429, {
				'Retry-After': '36000',
				'X-Rate-Limit-Remaining-v3': '0',
			});

			const error = await corsair.zohodesk.api.tickets
				.list({})
				.catch((caught) => caught);

			expect(error).toBeInstanceOf(ZohoDeskAPIError);
			expect(error).toMatchObject({
				status: 429,
				retryAfter: 36_000_000,
				creditsRemaining: 0,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(waits.filter((ms) => ms >= 36_000_000)).toEqual([]);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries the concurrency limit with backoff', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const waits = recordWaits();
			respond(errorBody('TOO_MANY_REQUESTS'), 429);
			respond(errorBody('TOO_MANY_REQUESTS'), 429);
			respond({ data: [] });

			await expect(corsair.zohodesk.api.tickets.list({})).resolves.toEqual({
				data: [],
			});

			expect(fetchMock).toHaveBeenCalledTimes(3);
			expect(waits.filter((ms) => ms >= 500).length).toBeGreaterThanOrEqual(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps a refreshed token for a retry after a rate limit', async () => {
		const { corsair, testDb } = await createClient();
		try {
			recordWaits();
			respond(errorBody('INVALID_OAUTH'), 401);
			respond(tokenResponse('1000.fresh'));
			respond(errorBody('TOO_MANY_REQUESTS'), 429);
			respond({ data: [] });

			await corsair.zohodesk.api.tickets.list({});

			expect(calls()[3]?.authorization).toBe('Zoho-oauthtoken 1000.fresh');
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Zoho Desk local sync through createCorsair', () => {
	it('stores listed tickets where the db client can read them', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ data: [ticket] });

			await corsair.zohodesk.api.tickets.list({});

			const stored =
				await corsair.zohodesk.db.tickets.findByEntityId(TICKET_ID);
			expect(stored?.data).toMatchObject({
				id: TICKET_ID,
				ticketNumber: '101',
				subject: ticket.subject,
				status: 'Open',
				contactId: CONTACT_ID,
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('stores fetched contacts', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(contact);

			await corsair.zohodesk.api.contacts.get({ contactId: CONTACT_ID });

			const stored =
				await corsair.zohodesk.db.contacts.findByEntityId(CONTACT_ID);
			expect(stored?.data).toMatchObject({
				email: contact.email,
				accountId: contact.accountId,
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps a stored ticket whole when a fields selection comes later', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(ticket);
			await corsair.zohodesk.api.tickets.get({ ticketId: TICKET_ID });

			respond({ data: [{ id: TICKET_ID, subject: 'Changed' }] });
			await corsair.zohodesk.api.tickets.list({ fields: ['subject'] });

			const stored =
				await corsair.zohodesk.db.tickets.findByEntityId(TICKET_ID);
			expect(stored?.data).toMatchObject({
				subject: ticket.subject,
				status: 'Open',
			});
		} finally {
			testDb.cleanup();
		}
	});
});
