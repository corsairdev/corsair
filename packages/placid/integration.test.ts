import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { PlacidAPIError } from './client';
import { placid } from './index';
import {
	imageFinished,
	imageQueued,
	templateList,
	unauthenticated,
} from './test-fixtures';

async function createClient(options: Parameters<typeof placid>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'placid', 'default');
	const corsair = createCorsair({
		plugins: [placid(options)],
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

describe('Placid plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.placid.keys.issue_new_dek();
			await expect(corsair.placid.api.templates.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account as a Bearer token', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.placid.keys.issue_new_dek();
			await corsair.placid.keys.set_api_key('placid-stored-key');
			respond(templateList);

			await corsair.placid.api.templates.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('authorization')).toBe('Bearer placid-stored-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('renders an image through the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'placid-test-key' });
		try {
			respond(imageQueued);

			const result = await corsair.placid.api.images.create({
				template_uuid: 'ospo24ysn',
				layers: { title: { text: 'Meet Singh' } },
			});

			expect(result.status).toBe('queued');
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.placid.app/api/rest/images');
		} finally {
			testDb.cleanup();
		}
	});

	it('polls an image until it reports its URL', async () => {
		const { corsair, testDb } = await createClient({ key: 'placid-test-key' });
		try {
			respond(imageFinished);

			const result = await corsair.placid.api.images.get({ id: 1 });

			expect(result.status).toBe('finished');
			expect(result.image_url).toContain('https://placid.app/u/');
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'placid-bad-key' });
		try {
			respond(unauthenticated, 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.placid.api.templates
				.list({})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(PlacidAPIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

/**
 * The live smoke test is opt-in through PLACID_API_KEY, and CI never sets it, so
 * this block is skipped there. The token is project-scoped: the template used
 * here must belong to the same project.
 */
const describeIfKey = process.env.PLACID_API_KEY ? describe : describe.skip;

describeIfKey('Placid live API', () => {
	it('authenticates and lists the project templates', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.PLACID_API_KEY,
		});
		try {
			const result = await corsair.placid.api.templates.list({});

			expect(Array.isArray(result.data)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});
});
