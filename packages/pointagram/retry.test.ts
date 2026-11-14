import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { POINTAGRAM_API_BASE, PointagramAPIError } from './client';
import { pointagram } from './index';

async function createClient(options: Parameters<typeof pointagram>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'pointagram', 'default');
	const corsair = createCorsair({
		plugins: [pointagram(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** Queues one response for the next fetch call. */
function respond(
	body: unknown, // unknown: each test passes one of Pointagram's response shapes.
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

const teamsPage = { status: 'Ok', message: 'ok', data: { teams: [] } };

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Pointagram plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when the account holds no key', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.pointagram.keys.issue_new_dek();
			await expect(corsair.pointagram.api.teams.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends both credential headers, reading Api-User from the account', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.pointagram.keys.issue_new_dek();
			await corsair.pointagram.keys.set_api_key('pg-stored-key');
			await corsair.pointagram.keys.set_api_user('ops@example.com');
			respond(teamsPage);

			await corsair.pointagram.api.teams.list({});

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(url).toBe(`${POINTAGRAM_API_BASE}/teams`);
			expect(headers.get('Api-Key')).toBe('pg-stored-key');
			expect(headers.get('Api-User')).toBe('ops@example.com');
			// The key is not a bearer token, so no Authorization header is sent.
			expect(headers.get('Authorization')).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('reads teams with the configured key and user', async () => {
		const { corsair, testDb } = await createClient({
			key: 'pg-inline-key',
			apiUser: 'ops@example.com',
		});
		try {
			respond({
				status: 'Ok',
				message: 'Teams retrieved successfully',
				data: { teams: [{ id: '3', name: 'The Bulls' }] },
			});

			const result = await corsair.pointagram.api.teams.list({});

			expect(result.teams[0]?.name).toBe('The Bulls');
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`${POINTAGRAM_API_BASE}/teams`);
			expect(new Headers(init.headers).get('Api-Key')).toBe('pg-inline-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'pg-inline-key',
			apiUser: 'ops@example.com',
		});
		try {
			respond({ status: 'Error', message: 'Too many requests' }, 429, {
				'Retry-After': '1',
			});
			respond(teamsPage);

			const pending = corsair.pointagram.api.teams.list({});
			await jest.advanceTimersByTimeAsync(2000);
			const result = await pending;

			expect(result.teams).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('gives up after the retry budget is spent', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'pg-inline-key',
			apiUser: 'ops@example.com',
		});
		try {
			// Four responses: the first call plus the three retries the handler allows.
			for (let attempt = 0; attempt < 4; attempt += 1) {
				respond({ status: 'Error', message: 'Too many requests' }, 429, {
					'Retry-After': '0',
				});
			}

			const pending = corsair.pointagram.api.teams.list({}).then(
				() => undefined,
				(caught) => caught,
			);
			await jest.advanceTimersByTimeAsync(30_000);
			const error = await pending;

			expect(error).toBeInstanceOf(PointagramAPIError);
			expect(error).toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('does not replay a write after a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: 'pg-inline-key',
			apiUser: 'ops@example.com',
		});
		try {
			respond({ status: 'Error', message: 'Server error' }, 503);

			await expect(
				corsair.pointagram.api.scoreSeries.addPoints({
					player_email: 'harry@pointagram.com',
					scoreseries_id: 180,
					points: 5,
				}),
			).rejects.toBeInstanceOf(PointagramAPIError);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx on a read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'pg-inline-key',
			apiUser: 'ops@example.com',
		});
		try {
			respond({ status: 'Error', message: 'Server error' }, 503);
			respond(teamsPage);

			const pending = corsair.pointagram.api.teams.list({});
			await jest.advanceTimersByTimeAsync(5000);
			const result = await pending;

			expect(result.teams).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('does not retry a rejected key, which Pointagram reports as a 404', async () => {
		const { corsair, testDb } = await createClient({
			key: 'pg-wrong-key',
			apiUser: 'ops@example.com',
		});
		try {
			respond(
				{ status: 'Error', message: 'Invalid Credentials', data: {} },
				404,
			);

			const error = await corsair.pointagram.api.teams.list({}).then(
				() => undefined,
				(caught) => caught,
			);

			expect(error).toBeInstanceOf(PointagramAPIError);
			expect(error).toMatchObject({ status: 404, credentialsRejected: true });
			expect(fetchMock).toHaveBeenCalledTimes(1);
			// The key rode in a header, so nothing on the error may repeat it.
			expect(JSON.stringify(error)).not.toContain('pg-wrong-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('stops on a 200 envelope that reports an error', async () => {
		const { corsair, testDb } = await createClient({
			key: 'pg-inline-key',
			apiUser: 'ops@example.com',
		});
		try {
			respond({
				status: 'Error',
				message: 'Player already exists.',
				data: {},
			});

			await expect(
				corsair.pointagram.api.players.create({ player_name: 'Axl Rose' }),
			).rejects.toThrow('Player already exists.');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
