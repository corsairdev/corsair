import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { craftmypdf } from './index';
import { accountInfo, generatedFile } from './test-fixtures';

async function createClient(options: Parameters<typeof craftmypdf>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'craftmypdf', 'default');
	const corsair = createCorsair({
		plugins: [craftmypdf(options)],
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

function calls(): number {
	return fetchMock.mock.calls.length;
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('CraftMyPDF plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.craftmypdf.keys.issue_new_dek();
			await expect(corsair.craftmypdf.api.account.getInfo({})).rejects.toThrow(
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
			await corsair.craftmypdf.keys.issue_new_dek();
			await corsair.craftmypdf.keys.set_api_key('cmp-stored-key');
			respond(accountInfo);

			await corsair.craftmypdf.api.account.getInfo({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('x-api-key')).toBe('cmp-stored-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 and succeeds on the next attempt', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'cmp-key' });
		try {
			await corsair.craftmypdf.keys.issue_new_dek();
			respond({ status: 'error', message: 'Too Many Requests' }, 429);
			respond(accountInfo);

			const pending = corsair.craftmypdf.api.account.getInfo({});
			await jest.advanceTimersByTimeAsync(2000);
			await expect(pending).resolves.toMatchObject({ status: 'success' });
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('gives up after the rate-limit attempts are spent', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'cmp-key' });
		try {
			await corsair.craftmypdf.keys.issue_new_dek();
			for (let i = 0; i < 6; i++) {
				respond({ status: 'error', message: 'Too Many Requests' }, 429);
			}

			const pending = corsair.craftmypdf.api.account.getInfo({});
			pending.catch(() => undefined);
			await jest.advanceTimersByTimeAsync(20_000);
			await expect(pending).rejects.toThrow(/Too Many Requests/);
			// One attempt plus the three retries the handler allows.
			expect(calls()).toBe(4);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('does not retry a rejected key', async () => {
		const { corsair, testDb } = await createClient({ key: 'cmp-key' });
		try {
			await corsair.craftmypdf.keys.issue_new_dek();
			respond({ status: 'error', message: 'Invalid API Key' }, 400);

			await expect(corsair.craftmypdf.api.account.getInfo({})).rejects.toThrow(
				'Invalid API Key',
			);
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a create after a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: 'cmp-key' });
		try {
			await corsair.craftmypdf.keys.issue_new_dek();
			respond({ status: 'error', message: 'Internal Server Error' }, 500);

			await expect(
				corsair.craftmypdf.api.pdf.create({
					template_id: 'abc',
					data: { a: 1 },
				}),
			).rejects.toThrow();
			// The PDF may have been generated and billed; a replay would bill twice.
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'cmp-key' });
		try {
			await corsair.craftmypdf.keys.issue_new_dek();
			respond({ status: 'error', message: 'Service Unavailable' }, 503);
			respond(accountInfo);

			const pending = corsair.craftmypdf.api.account.getInfo({});
			await jest.advanceTimersByTimeAsync(3000);
			await expect(pending).resolves.toMatchObject({ status: 'success' });
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('returns the generated file through the bound endpoint', async () => {
		const { corsair, testDb } = await createClient({ key: 'cmp-key' });
		try {
			await corsair.craftmypdf.keys.issue_new_dek();
			respond(generatedFile);

			const result = await corsair.craftmypdf.api.pdf.create({
				template_id: 'abc',
				data: { a: 1 },
			});
			expect(result.file).toBe(generatedFile.file);
		} finally {
			testDb.cleanup();
		}
	});
});
