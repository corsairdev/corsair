import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { TikHubAPIError } from './client';
import { tikhub } from './index';
import { envelope, errorBody, tiktokVideo } from './test-fixtures';

const SEARCH_PATH = '/api/v1/tiktok/app/v3/fetch_video_search_result';

async function createClient(options: Parameters<typeof tikhub>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'tikhub', 'default');
	const corsair = createCorsair({
		plugins: [tikhub(options)],
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

describe('TikHub plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.tikhub.keys.issue_new_dek();
			await expect(
				corsair.tikhub.api.tiktok.searchVideos({ keyword: 'cats' }),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.tikhub.keys.issue_new_dek();
			await corsair.tikhub.keys.set_api_key('th-stored-key');
			respond(envelope('/api/v1/tiktok/web/fetch_user_profile', {}, {}));

			await corsair.tikhub.api.tiktok.getUserProfile({ uniqueId: 'tiktok' });

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer th-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('calls TikHub with the configured key and returns the parsed result', async () => {
		const { corsair, testDb } = await createClient({ key: 'th-test-key' });
		try {
			respond(
				envelope(
					SEARCH_PATH,
					{ keyword: 'cats' },
					{
						search_item_list: [{ aweme_info: tiktokVideo }],
						cursor: 20,
						has_more: 1,
					},
				),
			);

			const result = await corsair.tikhub.api.tiktok.searchVideos({
				keyword: 'cats',
				count: 20,
			});

			expect(result.data?.search_item_list?.[0]?.aweme_info?.aweme_id).toBe(
				'7350810998023949599',
			);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				`https://api.tikhub.io${SEARCH_PATH}?keyword=cats&count=20`,
			);
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer th-test-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 402 insufficient-balance response', async () => {
		const { corsair, testDb } = await createClient({ key: 'th-test-key' });
		try {
			respond(
				errorBody(
					402,
					SEARCH_PATH,
					'Insufficient balance, this endpoint requires payment and does not accept free credits.',
				),
				402,
			);

			const error = await corsair.tikhub.api.tiktok
				.searchVideos({ keyword: 'cats' })
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(TikHubAPIError);
			expect(error).toMatchObject({ status: 402 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401', async () => {
		const { corsair, testDb } = await createClient({ key: 'th-test-key' });
		try {
			respond(errorBody(401, SEARCH_PATH, 'Invalid API token'), 401);

			await expect(
				corsair.tikhub.api.tiktok.searchVideos({ keyword: 'cats' }),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 after Retry-After and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'th-test-key' });
		try {
			respond(errorBody(429, SEARCH_PATH, 'Request too fast'), 429, {
				'Retry-After': '1',
			});
			respond(envelope(SEARCH_PATH, { keyword: 'cats' }, { aweme_list: [] }));

			const result = await corsair.tikhub.api.tiktok.searchVideos({
				keyword: 'cats',
			});

			expect(result.data?.aweme_list).toEqual([]);
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
			await expect(corsair.tikhub.api.account.getInfo({})).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
