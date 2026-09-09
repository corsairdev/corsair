import {
	encodeQueryFilter,
	makeCosmicReadRequest,
	makeCosmicUploadRequest,
	makeCosmicWriteRequest,
} from './client';
import { CosmicEndpointOutputSchemas } from './endpoints/types';

const BUCKET_SLUG = process.env.COSMIC_BUCKET_SLUG ?? '';
const READ_KEY = process.env.COSMIC_READ_KEY ?? '';
const WRITE_KEY = process.env.COSMIC_WRITE_KEY ?? '';
const describeLive =
	BUCKET_SLUG && READ_KEY && WRITE_KEY ? describe : describe.skip;

jest.setTimeout(60_000);

const RUN_ID = `live-${Date.now()}`;
const TYPE_SLUG = `corsair-${RUN_ID}`;
const createdObjectIds: string[] = [];
let createdMediaId = '';
let createdRevisionId = '';

async function cleanup(): Promise<void> {
	if (createdMediaId) {
		await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/media/${createdMediaId}`,
			WRITE_KEY,
			{ method: 'DELETE' },
		).catch(() => undefined);
	}
	for (const id of createdObjectIds) {
		await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects/${id}`,
			WRITE_KEY,
			{ method: 'DELETE' },
		).catch(() => undefined);
	}
	await makeCosmicWriteRequest(
		`/v3/buckets/${BUCKET_SLUG}/object-types/${TYPE_SLUG}`,
		WRITE_KEY,
		{ method: 'DELETE' },
	).catch(() => undefined);
}

describeLive('Cosmic live API', () => {
	afterAll(cleanup);

	it('reads object types, objects and media', async () => {
		const types = await makeCosmicReadRequest(
			`/v3/buckets/${BUCKET_SLUG}/object-types`,
			READ_KEY,
			{},
		);
		expect(
			CosmicEndpointOutputSchemas.objectTypesFind.safeParse(types).success,
		).toBe(true);

		const objects = await makeCosmicReadRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects`,
			READ_KEY,
			{ limit: 1, props: 'id,title' },
		);
		const parsedObjects =
			CosmicEndpointOutputSchemas.objectsFind.parse(objects);
		expect(parsedObjects.total).toBeGreaterThanOrEqual(0);

		const media = await makeCosmicReadRequest(
			`/v3/buckets/${BUCKET_SLUG}/media`,
			READ_KEY,
			{ limit: 1, props: 'id,name' },
		);
		expect(CosmicEndpointOutputSchemas.mediaFind.safeParse(media).success).toBe(
			true,
		);
	});

	it('runs object-type CRUD', async () => {
		const inserted = await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/object-types`,
			WRITE_KEY,
			{
				method: 'POST',
				body: {
					title: `Corsair ${RUN_ID}`,
					slug: TYPE_SLUG,
					metafields: [{ title: 'Headline', key: 'headline', type: 'text' }],
				},
			},
		);
		const parsedInsert =
			CosmicEndpointOutputSchemas.objectTypesInsert.parse(inserted);
		expect(parsedInsert.object_type.slug).toBe(TYPE_SLUG);

		const found = await makeCosmicReadRequest(
			`/v3/buckets/${BUCKET_SLUG}/object-types/${TYPE_SLUG}`,
			READ_KEY,
			{},
		);
		expect(
			CosmicEndpointOutputSchemas.objectTypesFindOne.parse(found).object_type
				.slug,
		).toBe(TYPE_SLUG);

		const updated = await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/object-types/${TYPE_SLUG}`,
			WRITE_KEY,
			{ method: 'PATCH', body: { title: `Corsair ${RUN_ID} R` } },
		);
		expect(
			CosmicEndpointOutputSchemas.objectTypesUpdate.parse(updated).object_type
				.title,
		).toBe(`Corsair ${RUN_ID} R`);
	});

	it('runs object CRUD', async () => {
		const inserted = await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects`,
			WRITE_KEY,
			{
				method: 'POST',
				body: {
					title: 'Live',
					type: TYPE_SLUG,
					metadata: { headline: 'hi' },
				},
			},
		);
		const object =
			CosmicEndpointOutputSchemas.objectsInsert.parse(inserted).object;
		createdObjectIds.push(object.id);

		const listed = await makeCosmicReadRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects`,
			READ_KEY,
			{ query: encodeQueryFilter({ type: TYPE_SLUG }), limit: 10 },
		);
		expect(
			CosmicEndpointOutputSchemas.objectsFind.parse(listed).total,
		).toBeGreaterThanOrEqual(1);

		const single = await makeCosmicReadRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects`,
			READ_KEY,
			{
				query: encodeQueryFilter({ type: TYPE_SLUG, slug: object.slug }),
				limit: 1,
			},
		);
		const envelope = CosmicEndpointOutputSchemas.objectsFind.parse(single);
		expect(envelope.objects[0]?.id).toBe(object.id);

		const byId = await makeCosmicReadRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects/${object.id}`,
			READ_KEY,
			{ props: 'id,title' },
		);
		expect(
			CosmicEndpointOutputSchemas.objectsGetById.parse(byId).object.id,
		).toBe(object.id);

		const updated = await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects/${object.id}`,
			WRITE_KEY,
			{ method: 'PATCH', body: { title: 'Live2' } },
		);
		expect(
			CosmicEndpointOutputSchemas.objectsUpdate.parse(updated).object.title,
		).toBe('Live2');
	});

	it('runs revision CRUD', async () => {
		const objectId = createdObjectIds[0] as string;
		const inserted = await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects/${objectId}/revisions`,
			WRITE_KEY,
			{ method: 'POST', body: { title: 'R1' } },
		);
		const revision =
			CosmicEndpointOutputSchemas.revisionsInsert.parse(inserted).revision;
		createdRevisionId = revision.id;

		const listed = await makeCosmicReadRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects/${objectId}/revisions`,
			READ_KEY,
			{ limit: 10 },
		);
		expect(
			CosmicEndpointOutputSchemas.revisionsFind.parse(listed).total,
		).toBeGreaterThanOrEqual(1);

		const single = await makeCosmicReadRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects/${objectId}/revisions/${createdRevisionId}`,
			READ_KEY,
			{},
		);
		expect(
			CosmicEndpointOutputSchemas.revisionsFindOne.parse(single).revision.id,
		).toBe(createdRevisionId);
	});

	it('runs media CRUD', async () => {
		const png = Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
			'base64',
		);
		const uploaded = await makeCosmicUploadRequest(
			`/v3/buckets/${BUCKET_SLUG}/media`,
			WRITE_KEY,
			{
				media: {
					filename: 'px.png',
					contentType: 'image/png',
					data: new Uint8Array(png),
				},
			},
		);
		const media = CosmicEndpointOutputSchemas.mediaInsert.parse(uploaded).media;
		createdMediaId = media.id;

		const single = await makeCosmicReadRequest(
			`/v3/buckets/${BUCKET_SLUG}/media`,
			READ_KEY,
			{ query: encodeQueryFilter({ name: media.name }), limit: 1 },
		);
		const envelope = CosmicEndpointOutputSchemas.mediaFind.parse(single);
		expect(envelope.media[0]?.id).toBe(media.id);

		const updated = await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/media/${media.id}`,
			WRITE_KEY,
			{ method: 'PATCH', body: { alt_text: 'live' } },
		);
		expect(
			CosmicEndpointOutputSchemas.mediaUpdate.parse(updated).message,
		).toEqual(expect.any(String));

		const deleted = await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/media/${media.id}`,
			WRITE_KEY,
			{ method: 'DELETE' },
		);
		expect(
			CosmicEndpointOutputSchemas.mediaDelete.parse(deleted).message,
		).toEqual(expect.any(String));
		createdMediaId = '';
	});

	it('runs batch add, edit and delete', async () => {
		const objectId = createdObjectIds[0] as string;
		const result = await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/objects/batch`,
			WRITE_KEY,
			{
				method: 'POST',
				body: {
					operations: [
						{
							method: 'add',
							object: { title: 'B', type: TYPE_SLUG },
						},
						{
							method: 'edit',
							object_id: objectId,
							object: { title: 'Batched' },
						},
						{ method: 'delete', object_id: objectId },
					],
				},
			},
		);
		const parsed = CosmicEndpointOutputSchemas.objectsBatch.parse(result);
		expect(parsed.operations.map((op) => op.status)).toEqual([
			'success',
			'success',
			'success',
		]);
		const added = parsed.operations[0]?.object as { id?: string } | undefined;
		if (added?.id) createdObjectIds.push(added.id);
		createdObjectIds.splice(createdObjectIds.indexOf(objectId), 1);
	});

	it('deletes the object and object type', async () => {
		for (const id of [...createdObjectIds]) {
			const deleted = await makeCosmicWriteRequest(
				`/v3/buckets/${BUCKET_SLUG}/objects/${id}`,
				WRITE_KEY,
				{ method: 'DELETE' },
			);
			expect(
				CosmicEndpointOutputSchemas.objectsDelete.parse(deleted).message,
			).toEqual(expect.any(String));
		}
		createdObjectIds.length = 0;

		const deletedType = await makeCosmicWriteRequest(
			`/v3/buckets/${BUCKET_SLUG}/object-types/${TYPE_SLUG}`,
			WRITE_KEY,
			{ method: 'DELETE' },
		);
		expect(
			CosmicEndpointOutputSchemas.objectTypesDelete.parse(deletedType).message,
		).toEqual(expect.any(String));
	});
});
