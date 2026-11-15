import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { linksArchive, linksDelete, linksList } from './endpoints';
import { shortio } from './index';

const link = {
	originalURL: 'https://example.com',
	path: 'a',
	idString: 'lnk_1_a',
	id: '1',
	shortURL: 'http://short.example/a',
	secureShortURL: 'https://short.example/a',
	title: null,
};
const domain = {
	id: 7,
	hostname: 'short.example',
	unicodeHostname: 'short.example',
	state: 'configured',
	createdAt: '2024-01-01',
	updatedAt: '2024-01-01',
	hasFavicon: false,
	hideReferer: false,
	linkType: 'random',
	cloaking: false,
	hideVisitorIp: false,
	enableAI: false,
	httpsLevel: 'redirect',
	httpsLinks: null,
	clientStorage: {},
	caseSensitive: false,
	incrementCounter: '0',
	robots: 'allow',
	exportEnabled: false,
};

// unknown: each mocked Short.io reply is a different JSON shape.
function json(body: unknown) {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

async function setup() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'shortio');
	const corsair = createCorsair({
		plugins: [shortio({ key: 'test-key' })],
		database: testDb.db,
		kek: '0123456789abcdef0123456789abcdef',
	});
	await corsair.shortio.keys.issue_new_dek();
	return { corsair, testDb };
}

describe('Short.io local entities', () => {
	afterEach(() => jest.restoreAllMocks());

	it('saves listed links and removes a deleted one only after Short.io confirms', async () => {
		const { corsair, testDb } = await setup();
		try {
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockResolvedValueOnce(
					json({ count: 2, links: [link, { ...link, idString: 'lnk_2_b' }] }),
				)
				.mockResolvedValueOnce(json({ success: false, error: 'not found' }))
				.mockResolvedValueOnce(json({ success: true, idString: 'lnk_1_a' }));
			await corsair.shortio.api.links.list({ domain_id: 7 });
			expect(await corsair.shortio.db.links.findByEntityId('lnk_1_a')).toEqual(
				expect.objectContaining({
					data: expect.objectContaining({ originalURL: 'https://example.com' }),
				}),
			);

			await corsair.shortio.api.links.delete({ link_id: 'lnk_1_a' });
			expect(
				await corsair.shortio.db.links.findByEntityId('lnk_1_a'),
			).not.toBeNull();

			await corsair.shortio.api.links.delete({ link_id: 'lnk_1_a' });
			expect(
				await corsair.shortio.db.links.findByEntityId('lnk_1_a'),
			).toBeNull();
			expect(
				await corsair.shortio.db.links.findByEntityId('lnk_2_b'),
			).not.toBeNull();
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('saves a created link without the success and duplicate flags', async () => {
		const { corsair, testDb } = await setup();
		try {
			jest
				.spyOn(globalThis, 'fetch')
				.mockResolvedValueOnce(
					json({ ...link, success: true, duplicate: false }),
				);
			await corsair.shortio.api.links.create({
				domain: 'short.example',
				originalURL: 'https://example.com',
			});
			const row = await corsair.shortio.db.links.findByEntityId('lnk_1_a');
			expect(row?.data).toEqual(
				expect.objectContaining({ idString: 'lnk_1_a' }),
			);
			expect(row?.data).not.toHaveProperty('success');
			expect(row?.data).not.toHaveProperty('duplicate');
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps detail-only domain fields when a later list saves the domain', async () => {
		const { corsair, testDb } = await setup();
		try {
			jest
				.spyOn(globalThis, 'fetch')
				.mockResolvedValueOnce(
					json({ ...domain, ipExclusions: ['10.0.0.1'], userPlan: 'standard' }),
				)
				.mockResolvedValueOnce(json([{ ...domain, isFavorite: true }]));
			await corsair.shortio.api.domains.get({ domainId: 7 });
			await corsair.shortio.api.domains.list({});
			const row = await corsair.shortio.db.domains.findByEntityId('7');
			expect(row?.data).toEqual(
				expect.objectContaining({
					hostname: 'short.example',
					isFavorite: true,
					ipExclusions: ['10.0.0.1'],
					userPlan: 'standard',
				}),
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('updates the saved archived flag after Short.io confirms', async () => {
		const { corsair, testDb } = await setup();
		try {
			jest
				.spyOn(globalThis, 'fetch')
				.mockResolvedValueOnce(
					json({ count: 1, links: [{ ...link, archived: false }] }),
				)
				.mockResolvedValueOnce(json({ success: true }))
				.mockResolvedValueOnce(json({ success: false, error: 'not found' }))
				.mockResolvedValueOnce(json({ success: true }));
			const archived = async () =>
				(await corsair.shortio.db.links.findByEntityId('lnk_1_a'))?.data
					.archived;
			await corsair.shortio.api.links.list({ domain_id: 7 });
			expect(await archived()).toBe(false);

			await corsair.shortio.api.links.archive({ link_id: 'lnk_1_a' });
			expect(await archived()).toBe(true);

			await corsair.shortio.api.links.unarchiveBulk({
				link_ids: ['lnk_1_a'],
			});
			expect(await archived()).toBe(true);

			await corsair.shortio.api.links.unarchiveBulk({
				link_ids: ['lnk_1_a', 'lnk_never_saved'],
			});
			expect(await archived()).toBe(false);
			expect(
				await corsair.shortio.db.links.findByEntityId('lnk_never_saved'),
			).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Short.io without a database', () => {
	afterEach(() => jest.restoreAllMocks());

	it('returns Short.io results without trying local saves', async () => {
		const corsair = createCorsair({ plugins: [shortio({ key: 'test-key' })] });
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(json({ count: 1, links: [link] }))
			.mockResolvedValueOnce(json({ ...link, success: true, duplicate: false }))
			.mockResolvedValueOnce(json({ success: true }))
			.mockResolvedValueOnce(json([domain]));
		await expect(
			corsair.shortio.api.links.list({ domain_id: 7 }),
		).resolves.toEqual(expect.objectContaining({ count: 1 }));
		await expect(
			corsair.shortio.api.links.create({
				domain: 'short.example',
				originalURL: 'https://example.com',
			}),
		).resolves.toEqual(expect.objectContaining({ idString: 'lnk_1_a' }));
		await expect(
			corsair.shortio.api.links.archive({ link_id: 'lnk_1_a' }),
		).resolves.toEqual({ success: true });
		await expect(corsair.shortio.api.domains.list({})).resolves.toHaveLength(1);
	});
});

describe('Short.io saved-row writes run in order per row', () => {
	afterEach(() => jest.restoreAllMocks());

	// A fake entity client whose first read takes a snapshot, then waits until
	// released: an unordered second write would land first and be overwritten.
	// unknown: the fake store holds saved link rows of any shape, like core's.
	function racingStore(initial: Record<string, unknown> | null) {
		let row = initial;
		let readStarted!: () => void;
		const started = new Promise<void>((resolve) => {
			readStarted = resolve;
		});
		let release!: () => void;
		const released = new Promise<void>((resolve) => {
			release = resolve;
		});
		let reads = 0;
		const links = {
			findByEntityId: jest.fn(async () => {
				reads += 1;
				const snapshot = row;
				if (reads === 1) {
					readStarted();
					await released;
				}
				return snapshot ? { data: snapshot } : null;
			}),
			upsertByEntityId: jest.fn(
				// unknown: the row written is whatever the endpoint saves.
				async (_id: string, data: Record<string, unknown>) => {
					row = data;
				},
			),
			deleteByEntityId: jest.fn(async () => {
				row = null;
				return true;
			}),
		};
		// `unknown` cast: the endpoints read only key, database, tenantId and db.links.
		const ctx = (fresh = true) =>
			({
				key: 'test-key',
				database: sharedDatabase,
				tenantId: 'acme',
				// A new entity client object per call, as withTenant() builds.
				db: { links: fresh ? { ...links } : links },
			}) as unknown as Parameters<typeof linksArchive>[0];
		return { ctx, started, release, row: () => row };
	}
	const sharedDatabase = {};

	it('keeps a newer list save that lands while an archive is merging', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async (url) =>
				String(url).includes('/links/archive')
					? json({ success: true })
					: json({ count: 1, links: [{ ...link, title: 'New title' }] }),
			);
		const store = racingStore({ ...link, title: 'Old title' });
		const archive = linksArchive(store.ctx(), { link_id: 'lnk_1_a' });
		await store.started;
		const list = linksList(store.ctx(), { domain_id: 7 });
		await new Promise((resolve) => setTimeout(resolve, 10));
		store.release();
		await Promise.all([archive, list]);
		expect(store.row()?.title).toBe('New title');
	});

	it('does not recreate a link deleted while an archive is merging', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async () => json({ success: true }));
		const store = racingStore({ ...link });
		const archive = linksArchive(store.ctx(), { link_id: 'lnk_1_a' });
		await store.started;
		const deletion = linksDelete(store.ctx(), { link_id: 'lnk_1_a' });
		await new Promise((resolve) => setTimeout(resolve, 10));
		store.release();
		await Promise.all([archive, deletion]);
		expect(store.row()).toBeNull();
	});
});
