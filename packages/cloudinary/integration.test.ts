import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { cloudinary } from './index';

async function createCloudinaryClient() {
	const apiKey = process.env.CLOUDINARY_API_KEY;
	const apiSecret = process.env.CLOUDINARY_API_SECRET;
	const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
	const kek = process.env.CORSAIR_KEK;
	if (!apiKey || !apiSecret || !cloudName || !kek) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'cloudinary');

	const corsair = createCorsair({
		plugins: [
			cloudinary({
				authType: 'api_key',
				credentials: {
					apiKey,
					apiSecret,
					cloudName,
				},
			}),
		],
		database: testDb.db,
		kek,
	});

	return { corsair, testDb, cloudName };
}

describe('Cloudinary plugin integration', () => {
	it('resource endpoints interact with API, events, and DB cache', async () => {
		const setup = await createCloudinaryClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const listInput = {
			max_results: 5,
		};

		const listResult = (await corsair.cloudinary.api.images.listImages(
			listInput,
		)) as {
			resources?: Array<{ asset_id?: string; public_id: string }>;
		};

		expect(listResult).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'cloudinary.images.listImages' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		const resources = Array.isArray(listResult.resources)
			? listResult.resources
			: [];

		if (resources.length > 0) {
			for (const resource of resources.slice(0, 3)) {
				const entityId = resource.asset_id ?? resource.public_id;
				if (!entityId) continue;
				const resourceFromDb =
					await corsair.cloudinary.db.resources.findByEntityId(entityId);
				expect(resourceFromDb).not.toBeNull();
				expect(resourceFromDb?.data.public_id).toBe(resource.public_id);
			}
		}

		const resourcesCount = await corsair.cloudinary.db.resources.count();
		expect(resourcesCount).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('folder endpoints interact with API, events, and DB cache', async () => {
		const setup = await createCloudinaryClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const listInput = {
			max_results: 5,
		};

		const foldersResult = (await corsair.cloudinary.api.root.getRootFolders(
			listInput,
		)) as {
			folders?: Array<{ path?: string; name: string }>;
		};

		expect(foldersResult).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'cloudinary.root.getRootFolders' },
		});

		expect(listEvents.length).toBeGreaterThan(0);

		const folders = Array.isArray(foldersResult.folders)
			? foldersResult.folders
			: [];

		if (folders.length > 0) {
			for (const folder of folders.slice(0, 3)) {
				const entityId = folder.path ?? folder.name;
				if (!entityId) continue;
				const folderFromDb =
					await corsair.cloudinary.db.folders.findByEntityId(entityId);
				expect(folderFromDb).not.toBeNull();
				expect(folderFromDb?.data.name).toBe(folder.name);
			}
		}

		testDb.cleanup();
	});

	it('upload lifecycle interacts with API, events, and DB cache', async () => {
		const setup = await createCloudinaryClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;
		const publicId = `corsair-integration-${Date.now()}`;
		const png = Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
			'base64',
		);

		const uploadInput = {
			public_id: publicId,
			file: new Blob([png], { type: 'image/png' }),
		};

		const uploaded = (await corsair.cloudinary.api.asset.uploadAsset(
			uploadInput,
		)) as { asset_id?: string; public_id?: string };
		expect(uploaded).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const uploadEvents = await orm.events.findMany({
			where: { event_type: 'cloudinary.asset.uploadAsset' },
		});
		expect(uploadEvents.length).toBeGreaterThan(0);

		const assetId =
			typeof uploaded.asset_id === 'string' ? uploaded.asset_id : undefined;
		if (assetId) {
			const resourceFromDb =
				await corsair.cloudinary.db.resources.findByEntityId(assetId);
			expect(resourceFromDb).not.toBeNull();
			expect(resourceFromDb?.data.public_id).toBe(publicId);
		}

		await corsair.cloudinary.api.asset.destroyAsset({
			resource_type: 'image',
			public_id: publicId,
		});

		testDb.cleanup();
	}, 60000);
});
