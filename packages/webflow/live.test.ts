import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { WebflowAPIError } from './client';
import { webflow } from './index';

loadLocalEnvFile(join(__dirname, '.env'));

const TOKEN = process.env.WEBFLOW_TOKEN?.trim();
const describeLive = TOKEN ? describe : describe.skip;

function loadLocalEnvFile(file: string) {
	if (!existsSync(file)) return;
	for (const raw of readFileSync(file, 'utf8').split('\n')) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;
		const eq = line.indexOf('=');
		if (eq < 1) continue;
		const key = line.slice(0, eq).trim();
		let value = line.slice(eq + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		if (process.env[key] === undefined) {
			process.env[key] = value;
		}
	}
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	return undefined;
}

function asRows(value: unknown, key: string): Record<string, unknown>[] {
	const list = asRecord(value)?.[key];
	if (!Array.isArray(list)) return [];
	return list.filter(
		(item): item is Record<string, unknown> =>
			typeof item === 'object' && item !== null && !Array.isArray(item),
	);
}

function stringId(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function probeFieldData(
	fields: unknown,
): { name: string; slug: string } | undefined {
	if (!Array.isArray(fields)) return undefined;
	const required = fields.flatMap((field) => {
		const row = asRecord(field);
		if (!row?.isRequired) return [];
		const slug = stringId(row.slug);
		return slug ? [slug] : [];
	});
	if (required.some((slug) => slug !== 'name' && slug !== 'slug')) {
		return undefined;
	}
	const stamp = `corsair-live-probe-${Date.now()}`;
	return { name: stamp, slug: stamp };
}

describeLive('Webflow live API', () => {
	jest.setTimeout(60_000);

	const token = TOKEN as string;
	let testDb: ReturnType<typeof createTestDatabase>;
	let corsair: ReturnType<typeof createCorsair>;
	let siteId: string;

	beforeAll(async () => {
		testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'webflow');
		corsair = createCorsair({
			plugins: [webflow({ key: token })],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});

		const listed = await corsair.webflow.api.sites.listSites({});
		siteId = stringId(asRows(listed, 'sites')[0]?.id) ?? '';
		if (!siteId) {
			throw new Error(
				'[webflow live] token returned no sites. Use a site or workspace token.',
			);
		}
	});

	afterAll(() => {
		testDb?.cleanup();
	});

	it('lists sites through the plugin and caches them', async () => {
		const authorized = asRecord(
			await corsair.webflow.api.token.getTokenAuthorizedBy({}),
		);
		expect(authorized).toBeDefined();

		const listed = await corsair.webflow.api.sites.listSites({});
		const sites = asRows(listed, 'sites');
		expect(sites.length).toBeGreaterThan(0);
		expect(stringId(sites[0]?.id)).toBe(siteId);

		const cached = await corsair.webflow.db.sites.findByEntityId(siteId);
		expect(cached?.data.id).toBe(siteId);

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'webflow.sites.listSites' },
		});
		expect(events.length).toBeGreaterThan(0);
	});

	it('reads site, pages, collections, and assets', async () => {
		const site = asRecord(
			await corsair.webflow.api.sites.getSite({ site_id: siteId }),
		);
		expect(stringId(site?.id)).toBe(siteId);

		const pages = asRows(
			await corsair.webflow.api.pages.listPages({ site_id: siteId }),
			'pages',
		);
		expect(Array.isArray(pages)).toBe(true);

		const collections = asRows(
			await corsair.webflow.api.collections.listCollections({
				site_id: siteId,
			}),
			'collections',
		);
		expect(Array.isArray(collections)).toBe(true);

		const assets = asRows(
			await corsair.webflow.api.assets.listAssets({ site_id: siteId }),
			'assets',
		);
		expect(Array.isArray(assets)).toBe(true);

		if (collections[0]) {
			const collectionId = stringId(collections[0].id);
			expect(collectionId).toBeTruthy();
			const items = asRows(
				await corsair.webflow.api.collectionItems.listCollectionItems({
					collection_id: collectionId as string,
				}),
				'items',
			);
			expect(Array.isArray(items)).toBe(true);
		}
	});

	it('creates and deletes a staged CMS probe when the schema allows', async () => {
		const collections = asRows(
			await corsair.webflow.api.collections.listCollections({
				site_id: siteId,
			}),
			'collections',
		);
		const collectionId = stringId(collections[0]?.id);
		if (!collectionId) {
			return;
		}

		const collection = asRecord(
			await corsair.webflow.api.collections.getCollection({
				collection_id: collectionId,
			}),
		);
		const fieldData = probeFieldData(collection?.fields);
		if (!fieldData) {
			return;
		}

		let itemId: string | undefined;
		try {
			const created = asRecord(
				await corsair.webflow.api.collectionItems.createCollectionItem({
					collection_id: collectionId,
					body: { fieldData, isDraft: true },
				}),
			);
			itemId = stringId(created?.id);
			expect(itemId).toBeTruthy();

			const cached = await corsair.webflow.db.collectionItems.findByEntityId(
				itemId as string,
			);
			expect(cached?.data.id).toBe(itemId);
		} finally {
			if (itemId) {
				try {
					await corsair.webflow.api.collectionItems.deleteCollectionItem({
						collection_id: collectionId,
						item_id: itemId,
					});
				} catch (error) {
					if (!(error instanceof WebflowAPIError && error.status === 404)) {
						throw error;
					}
				}
			}
		}
	});
});
