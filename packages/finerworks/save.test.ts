import { createRequire } from 'node:module';
import path from 'node:path';
import { createCorsair } from 'corsair/core';
import type { createCorsairDatabase } from 'corsair/db';
import { setupCorsair } from 'corsair/setup';
import { finerworks } from './index';

const KEK = 'kek-for-finerworks-tests';
const SEAL_KEY = '_corsair_enc';

const load = createRequire(path.join(process.cwd(), 'package.json'));
const Database = load(
	path.resolve(process.cwd(), '../corsair/node_modules/better-sqlite3'),
	// as is necessary: createRequire returns an untyped module. A stricter constructor type is not practical.
) as new (
	filename: string,
) => {
	exec: (sql: string) => void;
	// unknown is necessary: better-sqlite3 rows are untyped. A stricter row type is not practical.
	prepare: (sql: string) => { all: (...params: string[]) => unknown[] };
	close: () => void;
};

const TABLES = `
	CREATE TABLE corsair_integrations (
		id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
		name TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
	);
	CREATE TABLE corsair_accounts (
		id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
		tenant_id TEXT NOT NULL, integration_id TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
	);
	CREATE TABLE corsair_entities (
		id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
		account_id TEXT NOT NULL, entity_id TEXT NOT NULL, entity_type TEXT NOT NULL,
		version TEXT NOT NULL, data TEXT NOT NULL
	);
	CREATE TABLE corsair_events (
		id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
		account_id TEXT NOT NULL, event_type TEXT NOT NULL, payload TEXT NOT NULL, status TEXT
	);
`;

const okStatus = {
	success: true,
	status_code: 200,
	message: '',
	debug: null,
	reference_id: 'ref-1',
	domain: null,
};

const IMAGE_GUID = 'ff754fa0-a73e-488a-8fea-9cf2cb15e6bd';
const HIRES_URI = 'https://files.finerworks.com/private/hires-secret.jpg';
const image = {
	id: 1,
	guid: IMAGE_GUID,
	title: 'Sunset over the bay',
	file_name: 'sunset.jpg',
	private_hires_uri: HIRES_URI,
	pix_w: 2000,
	pix_h: 3000,
};

const SKU = 'AP1556P79511';
const product = {
	id: 123456,
	sku: SKU,
	name: 'Sunset giclee print',
	asking_price: 200,
	image_guid: IMAGE_GUID,
};

const order = {
	order_id: 9001,
	order_po: 'PO-12345',
	order_status_id: 2,
	order_status_label: 'In Production',
};

// unknown is necessary: each test answers with a different JSON body. A stricter body type is not practical.
type Routes = Record<string, () => unknown>;

const originalFetch = globalThis.fetch;
let routes: Routes = {};
let requested: string[] = [];

beforeAll(() => {
	globalThis.fetch = async (input: Parameters<typeof fetch>[0]) => {
		const url = new URL(String(input));
		requested.push(url.pathname);
		const answer = routes[url.pathname];
		if (!answer) throw new Error(`unexpected request ${url.pathname}`);
		return new Response(JSON.stringify(answer()), {
			headers: { 'Content-Type': 'application/json' },
		});
	};
});

afterAll(() => {
	globalThis.fetch = originalFetch;
});

let sqlite: InstanceType<typeof Database>;

beforeEach(() => {
	routes = {};
	requested = [];
	sqlite = new Database(':memory:');
	sqlite.exec(TABLES);
});

afterEach(() => {
	sqlite.close();
});

async function encryptedCorsair() {
	const corsair = createCorsair({
		kek: KEK,
		plugins: [finerworks({ key: 'web-key', appKey: 'app-key' })],
		// as is necessary: the loaded driver has no shared Database type. A stricter driver type is not practical.
		database: sqlite as unknown as Parameters<typeof createCorsairDatabase>[0],
		encryptDataAtRest: true,
	});
	await setupCorsair(corsair, { silent: true });
	return corsair;
}

// unknown is necessary: the stored cell is a seal envelope or a plain document. A stricter type is not practical.
function storedCells(entityType: string): unknown[] {
	return sqlite
		.prepare('SELECT data FROM corsair_entities WHERE entity_type = ?')
		.all(entityType)
		.map((row) => {
			const text =
				row && typeof row === 'object' ? Reflect.get(row, 'data') : '';
			return typeof text === 'string' ? JSON.parse(text) : text;
		});
}

describe('finerworks saves with encryptDataAtRest', () => {
	it('seals listed images and reads them back by guid', async () => {
		const corsair = await encryptedCorsair();
		routes['/v3/list_images'] = () => ({ status: okStatus, images: [image] });

		await corsair.finerworks.api.images.list({
			library: { name: 'inventory' },
		});

		const cells = storedCells('images');
		expect(cells).toEqual([{ [SEAL_KEY]: expect.any(String) }]);
		expect(JSON.stringify(cells)).not.toContain(HIRES_URI);
		const read = await corsair.finerworks.db.images.findByEntityId(IMAGE_GUID);
		expect(read?.data).toMatchObject({
			guid: IMAGE_GUID,
			title: 'Sunset over the bay',
			private_hires_uri: HIRES_URI,
		});
	});

	it('removes the stored image once images.delete succeeds', async () => {
		const corsair = await encryptedCorsair();
		routes['/v3/list_images'] = () => ({ status: okStatus, images: [image] });
		routes['/v3/delete_images'] = () => ({ status: okStatus });

		await corsair.finerworks.api.images.list({
			library: { name: 'inventory' },
		});
		await corsair.finerworks.api.images.delete({ guids: [IMAGE_GUID] });

		expect(storedCells('images')).toEqual([]);
		expect(requested).toEqual(['/v3/list_images', '/v3/delete_images']);
	});

	it('drops cached products tied to a deleted image, and keeps the rest', async () => {
		const corsair = await encryptedCorsair();
		const other = { ...product, sku: 'OTHER-SKU', image_guid: 'other-guid' };
		routes['/v3/list_images'] = () => ({ status: okStatus, images: [image] });
		routes['/v3/list_virtual_inventory'] = () => ({
			status: okStatus,
			products: [{ ...product, image_guid: IMAGE_GUID }, other],
		});
		routes['/v3/delete_images'] = () => ({ status: okStatus });

		await corsair.finerworks.api.images.list({
			library: { name: 'inventory' },
		});
		await corsair.finerworks.api.inventory.list({});
		expect(storedCells('virtualInventoryProducts')).toHaveLength(2);

		await corsair.finerworks.api.images.delete({ guids: [IMAGE_GUID] });

		expect(storedCells('images')).toEqual([]);
		expect(
			await corsair.finerworks.db.virtualInventoryProducts.findByEntityId(SKU),
		).toBeNull();
		const kept =
			await corsair.finerworks.db.virtualInventoryProducts.findByEntityId(
				'OTHER-SKU',
			);
		expect(kept?.data).toMatchObject({ sku: 'OTHER-SKU' });
	});

	it('keeps local rows when the delete response does not confirm success', async () => {
		const corsair = await encryptedCorsair();
		routes['/v3/list_images'] = () => ({ status: okStatus, images: [image] });
		routes['/v3/list_virtual_inventory'] = () => ({
			status: okStatus,
			products: [product],
		});
		routes['/v3/delete_images'] = () => ({});
		routes['/v3/delete_virtual_inventory'] = () => ({ status: {} });

		await corsair.finerworks.api.images.list({
			library: { name: 'inventory' },
		});
		await corsair.finerworks.api.inventory.list({});
		await corsair.finerworks.api.images.delete({ guids: [IMAGE_GUID] });
		await corsair.finerworks.api.inventory.delete({ skus: [SKU] });

		expect(storedCells('images')).toHaveLength(1);
		expect(storedCells('virtualInventoryProducts')).toHaveLength(1);
	});

	it('keeps the stored image when FinerWorks reports the delete failed', async () => {
		const corsair = await encryptedCorsair();
		routes['/v3/list_images'] = () => ({ status: okStatus, images: [image] });
		routes['/v3/delete_images'] = () => ({
			status: { ...okStatus, success: false, message: 'not found' },
		});

		await corsair.finerworks.api.images.list({
			library: { name: 'inventory' },
		});
		await corsair.finerworks.api.images.delete({ guids: [IMAGE_GUID] });

		expect(storedCells('images')).toHaveLength(1);
	});

	it('seals virtual inventory products keyed by sku and drops them on delete', async () => {
		const corsair = await encryptedCorsair();
		routes['/v3/list_virtual_inventory'] = () => ({
			status: okStatus,
			products: [product],
		});
		routes['/v3/delete_virtual_inventory'] = () => ({ status: okStatus });

		await corsair.finerworks.api.inventory.list({});

		expect(storedCells('virtualInventoryProducts')).toEqual([
			{ [SEAL_KEY]: expect.any(String) },
		]);
		const read =
			await corsair.finerworks.db.virtualInventoryProducts.findByEntityId(SKU);
		expect(read?.data).toMatchObject({ sku: SKU, asking_price: 200 });

		await corsair.finerworks.api.inventory.delete({ skus: [SKU] });
		expect(storedCells('virtualInventoryProducts')).toEqual([]);
	});

	it('seals orders from fetchStatus keyed by order_id', async () => {
		const corsair = await encryptedCorsair();
		routes['/v3/fetch_order_status'] = () => ({
			status: okStatus,
			orders: [order, { order_po: 'PO-no-id' }],
		});

		await corsair.finerworks.api.orders.fetchStatus({ order_ids: [9001] });

		// The order without an order_id has no stable key, so it is not stored.
		expect(storedCells('orders')).toEqual([{ [SEAL_KEY]: expect.any(String) }]);
		const read = await corsair.finerworks.db.orders.findByEntityId('9001');
		expect(read?.data).toMatchObject({
			order_po: 'PO-12345',
			order_status_label: 'In Production',
		});
	});

	it('does not store catalog lookups', async () => {
		const corsair = await encryptedCorsair();
		routes['/v3/list_media_types'] = () => ({
			status: okStatus,
			media_types: [{ id: 1, name: 'Canvas' }],
		});

		await corsair.finerworks.api.products.listMediaTypes({});

		expect(
			sqlite.prepare('SELECT entity_type FROM corsair_entities').all(),
		).toEqual([]);
	});
});
