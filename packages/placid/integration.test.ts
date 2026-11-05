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
 * The live tests are opt-in through PLACID_API_KEY, and CI never sets it, so
 * this block is skipped there. The token is project-scoped: everything below
 * runs inside the project that owns it.
 *
 * The write cycle creates its own template, so it needs nothing to exist in the
 * project first, and deletes everything it makes.
 */
const describeIfKey = process.env.PLACID_API_KEY ? describe : describe.skip;

describeIfKey('Placid live API', () => {
	// unknown: a client stand-in typed through the factory's return type.
	function liveClient() {
		return createClient({ key: process.env.PLACID_API_KEY });
	}

	it('authenticates and lists the project templates', async () => {
		const { corsair, testDb } = await liveClient();
		try {
			const result = await corsair.placid.api.templates.list({});

			expect(Array.isArray(result.data)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('runs a template create, read, update and delete cycle', async () => {
		const { corsair, testDb } = await liveClient();
		let uuid: string | undefined;
		try {
			const created = await corsair.placid.api.templates.create({
				title: 'corsair-live-smoke',
				width: 640,
				height: 480,
			});
			uuid = created.uuid;
			expect(uuid).toBeTruthy();
			expect(created.title).toBe('corsair-live-smoke');

			const readBack = await corsair.placid.api.templates.get({
				template_uuid: uuid,
			});
			expect(readBack.uuid).toBe(uuid);

			const updated = await corsair.placid.api.templates.update({
				template_uuid: uuid,
				title: 'corsair-live-smoke-renamed',
			});
			expect(updated.title).toBe('corsair-live-smoke-renamed');

			await corsair.placid.api.templates.delete({ template_uuid: uuid });
			uuid = undefined;

			// The listing is the proof it is gone, not the delete reply.
			const after = await corsair.placid.api.templates.list({});
			expect(after.data.some((row) => row.uuid === created.uuid)).toBe(false);
		} finally {
			if (uuid) {
				await corsair.placid.api.templates
					.delete({ template_uuid: uuid })
					.catch(() => undefined);
			}
			testDb.cleanup();
		}
	}, 60_000);

	it('runs a collection create, update and delete cycle', async () => {
		const { corsair, testDb } = await liveClient();
		let id: string | undefined;
		try {
			const created = await corsair.placid.api.collections.create({
				title: 'corsair-live-smoke',
			});
			id = created.id;
			expect(id).toBeTruthy();

			const readBack = await corsair.placid.api.collections.get({
				collection_id: id,
			});
			expect(readBack.title).toBe('corsair-live-smoke');

			const updated = await corsair.placid.api.collections.update({
				collection_id: id,
				title: 'corsair-live-smoke-renamed',
			});
			expect(updated.title).toBe('corsair-live-smoke-renamed');

			await corsair.placid.api.collections.delete({ collection_id: id });
			id = undefined;

			const after = await corsair.placid.api.collections.list({});
			expect(after.data.some((row) => row.id === created.id)).toBe(false);
		} finally {
			if (id) {
				await corsair.placid.api.collections
					.delete({ collection_id: id })
					.catch(() => undefined);
			}
			testDb.cleanup();
		}
	}, 60_000);

	it('renders an image, reads it back and deletes it', async () => {
		const { corsair, testDb } = await liveClient();
		let template: string | undefined;
		let image: number | undefined;
		try {
			const created = await corsair.placid.api.templates.create({
				title: 'corsair-live-render',
				width: 640,
				height: 480,
			});
			template = created.uuid;

			const started = await corsair.placid.api.images.create({
				template_uuid: template,
				create_now: true,
			});
			image = started.id;
			expect(started.id).toBeGreaterThan(0);

			// `create_now` usually finishes inline; poll when it does not.
			let current = started;
			for (
				let attempt = 0;
				attempt < 20 && current.status === 'queued';
				attempt++
			) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				current = await corsair.placid.api.images.get({ id: started.id });
			}

			expect(current.status).toBe('finished');
			expect(current.image_url).toContain('http');

			await corsair.placid.api.images.delete({ id: started.id });
			image = undefined;

			// Placid answers 204 and clears `image_url`, but the record keeps
			// answering 200 with an empty URL rather than turning into a 404.
			// Asserting a 404 would encode behaviour the API does not have.
			const afterDelete = await corsair.placid.api.images.get({
				id: started.id,
			});
			expect(afterDelete.image_url).not.toContain('.jpg');
		} finally {
			if (image) {
				await corsair.placid.api.images
					.delete({ id: image })
					.catch(() => undefined);
			}
			if (template) {
				await corsair.placid.api.templates
					.delete({ template_uuid: template })
					.catch(() => undefined);
			}
			testDb.cleanup();
		}
	}, 90_000);
});
