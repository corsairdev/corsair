import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
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
