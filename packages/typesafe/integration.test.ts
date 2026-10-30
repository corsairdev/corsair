import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { TypeSafeAPIError } from './client';
import { typesafe } from './index';

async function createClient(options: Parameters<typeof typesafe>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'typesafe', 'default');
	const corsair = createCorsair({
		plugins: [typesafe(options)],
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

const question = { fits: { type: 'noul' as const, instructions: 'Is it?' } };
const answer = {
	model: 'jev-1.14.0',
	answers: { fits: { type: 'noul', noul: 0.8 } },
	usage: { input_tokens: 12, output_tokens: 3 },
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('TypeSafe plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.typesafe.keys.issue_new_dek();
			await expect(corsair.typesafe.api.models.list({})).rejects.toThrow(
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
			await corsair.typesafe.keys.issue_new_dek();
			await corsair.typesafe.keys.set_api_key('ts-stored-key');
			respond({ models: [] });

			await corsair.typesafe.api.models.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer ts-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('asks Jev with the configured key and returns the answers', async () => {
		const { corsair, testDb } = await createClient({ key: 'ts-test-key' });
		try {
			respond(answer);

			const result = await corsair.typesafe.api.systemOne.ask({
				state: { lead: 'VP Platform at a 60-person startup' },
				questions: question,
			});

			expect(result.answers.fits).toEqual({ type: 'noul', noul: 0.8 });
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.typesafe.ai/v1/systemone');
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer ts-test-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 422', async () => {
		const { corsair, testDb } = await createClient({ key: 'ts-test-key' });
		try {
			respond(
				{
					detail: [
						{
							type: 'missing',
							loc: ['body', 'questions'],
							msg: 'Field required',
						},
					],
				},
				422,
			);

			const call = corsair.typesafe.api.systemOne.ask({
				state: 'x',
				questions: question,
			});

			await expect(call).rejects.toBeInstanceOf(TypeSafeAPIError);
			await expect(call).rejects.toMatchObject({ status: 422 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401', async () => {
		const { corsair, testDb } = await createClient({ key: 'ts-test-key' });
		try {
			respond(
				{
					detail: {
						error_type: 'authentication_error',
						message: 'Cannot authenticate with the server.',
					},
				},
				401,
			);

			await expect(corsair.typesafe.api.models.list({})).rejects.toMatchObject({
				status: 401,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 after Retry-After and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'ts-test-key' });
		try {
			respond({ detail: { message: 'Too many requests' } }, 429, {
				'Retry-After': '1',
			});
			respond(answer);

			const result = await corsair.typesafe.api.systemOne.ask({
				state: 'x',
				questions: question,
			});

			expect(result.model).toBe('jev-1.14.0');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('requires Hub for managed_pricing auth', async () => {
		const { corsair, testDb } = await createClient({
			authType: 'managed_pricing',
		});
		try {
			await expect(corsair.typesafe.api.models.list({})).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
