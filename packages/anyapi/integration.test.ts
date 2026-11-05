import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { AnyApiAPIError } from './client';
import { anyapi } from './index';
import { company, errorBody, runResult } from './test-fixtures';

async function createClient(options: Parameters<typeof anyapi>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'anyapi', 'default');
	const corsair = createCorsair({
		plugins: [anyapi(options)],
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

const companyUrl = 'https://www.linkedin.com/company/fieldkit';

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('AnyAPI plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.anyapi.keys.issue_new_dek();
			await expect(corsair.anyapi.api.account.getBalance({})).rejects.toThrow(
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
			await corsair.anyapi.keys.issue_new_dek();
			await corsair.anyapi.keys.set_api_key('aa-stored-key');
			respond({ usd: 1.5 });

			await corsair.anyapi.api.account.getBalance({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer aa-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('runs a typed endpoint with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'aa-test-key' });
		try {
			respond(runResult(company));

			const result = await corsair.anyapi.api.linkedin.getCompany({
				url: companyUrl,
			});

			expect(result.output.data?.name).toBe('Fieldkit');
			expect(result.costUsd).toBe(0.0011);
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.getanyapi.com/v1/run/linkedin.company');
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 402', async () => {
		const { corsair, testDb } = await createClient({ key: 'aa-test-key' });
		try {
			respond(
				errorBody('insufficient balance', { code: 'insufficient_funds' }),
				402,
			);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.anyapi.api.linkedin
				.getCompany({ url: companyUrl })
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(AnyApiAPIError);
			expect(error).toMatchObject({ status: 402 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 502 that reports a payment', async () => {
		const { corsair, testDb } = await createClient({ key: 'aa-test-key' });
		try {
			respond(
				errorBody('settlement could not be confirmed', {
					payment: {
						rail: 'wallet',
						settlementState: 'indeterminate',
						costUsd: 0.0011,
					},
				}),
				502,
			);

			await expect(
				corsair.anyapi.api.linkedin.getCompany({ url: companyUrl }),
			).rejects.toMatchObject({ status: 502, charged: true });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 after Retry-After and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'aa-test-key' });
		try {
			respond(errorBody('upstream rate limited'), 429, { 'Retry-After': '1' });
			respond(runResult(company));

			const result = await corsair.anyapi.api.linkedin.getCompany({
				url: companyUrl,
			});

			expect(result.output.found).toBe(true);
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
			await expect(corsair.anyapi.api.account.getBalance({})).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
