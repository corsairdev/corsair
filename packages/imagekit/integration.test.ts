import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { imagekit } from './index';
import { file, fileNotFound, serverError } from './test-fixtures';

async function createClient(options: Parameters<typeof imagekit>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'imagekit', 'default');
	const corsair = createCorsair({
		plugins: [imagekit(options)],
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

describe('ImageKit plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.imagekit.keys.issue_new_dek();
			await expect(corsair.imagekit.api.files.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the Basic header built from the stored key', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.imagekit.keys.issue_new_dek();
			await corsair.imagekit.keys.set_api_key('ik-stored-key');
			respond([file]);

			await corsair.imagekit.api.files.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('authorization')).toBe(
				`Basic ${Buffer.from('ik-stored-key:').toString('base64')}`,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 404 on delete', async () => {
		const { corsair, testDb } = await createClient({
			key: 'ik-test-key',
		});
		try {
			respond(fileNotFound, 404);

			await expect(
				corsair.imagekit.api.files.delete({ fileId: file.fileId }),
			).rejects.toMatchObject({ status: 404 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('surfaces a 503 with its status and no key in the message', async () => {
		const { corsair, testDb } = await createClient({
			key: 'ik-secret-key',
		});
		try {
			// A list is a flagged read, so the 503 exhausts both retries.
			respond(serverError, 503);
			respond(serverError, 503);
			respond(serverError, 503);

			const error = (await corsair.imagekit.api.files
				.list({})
				.catch((e: unknown) => e)) as { message?: string; status?: number };
			expect(error.status).toBe(503);
			expect(error.message).not.toContain('ik-secret-key');
		} finally {
			testDb.cleanup();
		}
	});
});

// Live smoke: read-only calls against the real API when a key is present.
const describeIfKey = process.env.IMAGEKIT_API_KEY ? describe : describe.skip;

describeIfKey('live ImageKit', () => {
	const key = process.env.IMAGEKIT_API_KEY as string;

	it('lists files from the live account', async () => {
		const { corsair, testDb } = await createClient({ key });
		try {
			const result = await corsair.imagekit.api.files.list({ limit: 5 });
			expect(Array.isArray(result)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects a bad key with a 401 from the live API', async () => {
		const { corsair, testDb } = await createClient({ key: 'wrong-key' });
		try {
			await expect(
				corsair.imagekit.api.files.list({ limit: 5 }),
			).rejects.toMatchObject({ status: 401 });
		} finally {
			testDb.cleanup();
		}
	});
});
