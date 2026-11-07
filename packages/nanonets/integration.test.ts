import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { NanonetsAPIError } from './client';
import { nanonets } from './index';
import {
	error402,
	modelId,
	predictionEnvelope,
	requestFileId,
} from './test-fixtures';

const describeIfKey = process.env.NANONETS_API_KEY ? describe : describe.skip;

async function createClient(options: Parameters<typeof nanonets>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'nanonets', 'default');
	const corsair = createCorsair({
		plugins: [nanonets(options)],
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

describe('Nanonets plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.nanonets.keys.issue_new_dek();
			await expect(corsair.nanonets.api.integrations.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored API key as the Basic Authorization header', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.nanonets.keys.issue_new_dek();
			await corsair.nanonets.keys.set_api_key('nn-stored-key');
			respond(predictionEnvelope);

			await corsair.nanonets.api.predictions.createFromFile({
				model_id: modelId,
				base64_data: 'aGVsbG8gbmFub25ldHM=',
			});

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				`https://app.nanonets.com/api/v2/OCR/Model/${modelId}/LabelFile/`,
			);
			const headers = new Headers(init.headers);
			expect(headers.get('authorization')).toBe(
				`Basic ${Buffer.from('nn-stored-key:').toString('base64')}`,
			);
			expect(headers.get('authorization')).not.toMatch(/^Bearer /);
		} finally {
			testDb.cleanup();
		}
	});

	it('runs createFromUrls with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'nn-test-key' });
		try {
			respond(predictionEnvelope);

			const result = await corsair.nanonets.api.predictions.createFromUrls({
				model_id: modelId,
				urls: ['https://img.example/a.png', 'https://img.example/b.png'],
			});

			expect(result.result?.[0]?.prediction?.[0]?.label).toBe('total_amount');
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				`https://app.nanonets.com/api/v2/OCR/Model/${modelId}/LabelUrls/`,
			);
			expect(typeof init.body).toBe('string');
			const params = new URLSearchParams(init.body as string);
			expect(params.getAll('urls')).toEqual([
				'https://img.example/a.png',
				'https://img.example/b.png',
			]);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 402 quota error', async () => {
		const { corsair, testDb } = await createClient({ key: 'nn-test-key' });
		try {
			respond(error402, 402);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.nanonets.api.predictions
				.createFromUrls({
					model_id: modelId,
					urls: ['https://img.example/a.png'],
				})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(NanonetsAPIError);
			expect(error).toMatchObject({ status: 402, isQuotaExhausted: true });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('resolves files.delete from an empty body', async () => {
		const { corsair, testDb } = await createClient({ key: 'nn-test-key' });
		try {
			fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

			const result = await corsair.nanonets.api.files.delete({
				model_id: modelId,
				file_id: requestFileId,
			});

			expect(result).toEqual({});
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(init.method).toBe('DELETE');
			expect(url).toBe(
				`https://app.nanonets.com/api/v2/Inferences/Model/${modelId}/InferenceRequestFiles/${requestFileId}`,
			);
		} finally {
			testDb.cleanup();
		}
	});
});

// Live read-only smoke tests; CI skips this file, so these run only with a
// local NANONETS_API_KEY.
describeIfKey('Nanonets live smoke', () => {
	it('lists external integrations', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.nanonets.keys.issue_new_dek();
			await corsair.nanonets.keys.set_api_key(
				process.env.NANONETS_API_KEY as string,
			);

			const result = await corsair.nanonets.api.integrations.list({});

			expect(Array.isArray(result.integrations)).toBe(true);

			// The wrapper can mask a wrong-shaped payload as an empty list, so
			// check the raw API answer directly.
			const key = process.env.NANONETS_API_KEY as string;
			const raw = await fetch(
				'https://app.nanonets.com/api/v2/externalIntegrations',
				{
					headers: {
						Authorization: `Basic ${Buffer.from(`${key}:`).toString('base64')}`,
					},
				},
			);
			// unknown: the raw body is whatever the API answers today.
			const body: unknown = await raw.json();
			expect(Array.isArray(body)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});
});
