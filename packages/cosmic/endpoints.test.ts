import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import {
	makeCosmicReadRequest,
	makeCosmicUploadRequest,
	makeCosmicWriteRequest,
} from './client';
import {
	remove as mediaDelete,
	find as mediaFind,
	findOne as mediaFindOne,
	insert as mediaInsert,
	update as mediaUpdate,
} from './endpoints/media';
import {
	remove as objectTypesDelete,
	find as objectTypesFind,
	findOne as objectTypesFindOne,
	insert as objectTypesInsert,
	update as objectTypesUpdate,
} from './endpoints/object-types';
import {
	batch as objectsBatch,
	remove as objectsDelete,
	find as objectsFind,
	findOne as objectsFindOne,
	getById as objectsGetById,
	insert as objectsInsert,
	update as objectsUpdate,
} from './endpoints/objects';
import {
	find as revisionsFind,
	findOne as revisionsFindOne,
	insert as revisionsInsert,
} from './endpoints/revisions';
import { CosmicEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { cosmic } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeCosmicReadRequest: jest.fn(),
	makeCosmicWriteRequest: jest.fn(),
	makeCosmicUploadRequest: jest.fn(),
}));

const mockRead = makeCosmicReadRequest as jest.MockedFunction<
	typeof makeCosmicReadRequest
>;
const mockWrite = makeCosmicWriteRequest as jest.MockedFunction<
	typeof makeCosmicWriteRequest
>;
const mockUpload = makeCosmicUploadRequest as jest.MockedFunction<
	typeof makeCosmicUploadRequest
>;

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = {
	key: 'test-write-key',
	options: { bucketSlug: 'my-bucket', authType: 'api_key' },
} as unknown as Parameters<typeof objectsFind>[0];

const docObject = {
	id: '5ff75368c2dfa81a91695cec',
	title: 'Blog Post Example Title',
	slug: 'blog-post-example-title',
	type: 'posts',
	status: 'published',
	metadata: { featured_post: true },
};

const docObjectsEnvelope = {
	objects: [docObject],
	total: 1,
	limit: 10,
};

const docRevision = {
	id: '64fe8a1b24090e0008683e53',
	object_id: '5ff75368c2dfa81a91695cec',
	title: 'Blog Post Example Title',
	slug: 'blog-post-example-title',
	status: 'published',
};

const docMedia = {
	id: '602fd622853cca45f4c9fd96',
	name: 'c20391e0-test.png',
	original_name: 'test.png',
	folder: 'album-covers',
	type: 'image/png',
	url: 'https://cdn.cosmicjs.com/c20391e0-test.png',
	imgix_url: 'https://imgix.cosmicjs.com/c20391e0-test.png',
};

const docObjectType = {
	id: '63bde47897d49d0008a270b3',
	title: 'Bikes',
	slug: 'bikes',
	singular: 'Bike',
	emoji: '🏍️',
	singleton: false,
};

describe('Cosmic objects endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('find sends type, encoded query and pagination', async () => {
		mockRead.mockResolvedValue(docObjectsEnvelope);

		const result = await objectsFind(ctx, {
			bucketSlug: 'my-bucket',
			type: 'posts',
			query: { status: 'published' },
			limit: 10,
		});

		expect(mockRead).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects',
			'test-write-key',
			{
				query: '{"status":"published","type":"posts"}',
				props: undefined,
				status: undefined,
				sort: undefined,
				limit: 10,
				skip: undefined,
				after: undefined,
				depth: undefined,
			},
		);
		expect(result).toEqual(docObjectsEnvelope);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'cosmic.objects.find',
			expect.objectContaining({ type: 'posts' }),
			'completed',
		);
	});

	it('findOne queries by slug and unwraps the first object', async () => {
		mockRead.mockResolvedValue(docObjectsEnvelope);

		const result = await objectsFindOne(ctx, {
			bucketSlug: 'my-bucket',
			type: 'posts',
			slug: 'blog-post-example-title',
		});

		expect(mockRead).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects',
			'test-write-key',
			expect.objectContaining({
				query: '{"type":"posts","slug":"blog-post-example-title"}',
				limit: 1,
			}),
		);
		expect(result).toEqual({ object: docObject });
	});

	it('findOne throws when nothing matches', async () => {
		mockRead.mockResolvedValue({ objects: [], total: 0 });

		await expect(
			objectsFindOne(ctx, {
				bucketSlug: 'my-bucket',
				type: 'posts',
				slug: 'missing',
			}),
		).rejects.toThrow('Cosmic object not found');
	});

	it('getById encodes the id into the path', async () => {
		mockRead.mockResolvedValue({ object: docObject });

		const result = await objectsGetById(ctx, {
			bucketSlug: 'my-bucket',
			id: '5ff75368c2dfa81a91695cec',
		});

		expect(mockRead).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects/5ff75368c2dfa81a91695cec',
			'test-write-key',
			{ props: undefined, status: undefined, depth: undefined },
		);
		expect(result).toEqual({ object: docObject });
	});

	it('insert posts title, type and metadata', async () => {
		mockWrite.mockResolvedValue({ object: docObject });

		const result = await objectsInsert(ctx, {
			bucketSlug: 'my-bucket',
			title: 'Blog Post Example Title',
			type: 'posts',
			metadata: { featured_post: true },
		});

		expect(mockWrite).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects',
			'test-write-key',
			{
				method: 'POST',
				body: {
					title: 'Blog Post Example Title',
					type: 'posts',
					metadata: { featured_post: true },
				},
			},
		);
		expect(result).toEqual({ object: docObject });
	});

	it('insert rejects a missing title', async () => {
		await expect(
			objectsInsert(ctx, {
				bucketSlug: 'my-bucket',
				title: '',
				type: 'posts',
			}),
		).rejects.toThrow(ZodError);
		expect(mockWrite).not.toHaveBeenCalled();
	});

	it('update patches title and metadata', async () => {
		mockWrite.mockResolvedValue({ object: docObject });

		await objectsUpdate(ctx, {
			bucketSlug: 'my-bucket',
			id: 'abc123',
			title: 'New Title Edit',
		});

		expect(mockWrite).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects/abc123',
			'test-write-key',
			{ method: 'PATCH', body: { title: 'New Title Edit' } },
		);
	});

	it('update rejects an id-only patch', async () => {
		await expect(
			objectsUpdate(ctx, { bucketSlug: 'my-bucket', id: 'abc123' }),
		).rejects.toThrow(ZodError);
		expect(mockWrite).not.toHaveBeenCalled();
	});

	it('delete calls DELETE on the object path', async () => {
		mockWrite.mockResolvedValue({ message: 'deleted' });

		const result = await objectsDelete(ctx, {
			bucketSlug: 'my-bucket',
			id: 'abc123',
		});

		expect(mockWrite).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects/abc123',
			'test-write-key',
			{ method: 'DELETE', query: undefined },
		);
		expect(result).toEqual({ message: 'deleted' });
	});

	it('batch posts up to 25 operations', async () => {
		const batchResponse = {
			operations: [{ method: 'add', status: 'success', object: docObject }],
		};
		mockWrite.mockResolvedValue(batchResponse);

		const result = await objectsBatch(ctx, {
			bucketSlug: 'my-bucket',
			operations: [
				{
					method: 'add',
					object: { title: 'New Post', type: 'posts' },
				},
			],
		});

		expect(mockWrite).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects/batch',
			'test-write-key',
			{
				method: 'POST',
				body: {
					operations: [
						{ method: 'add', object: { title: 'New Post', type: 'posts' } },
					],
				},
			},
		);
		expect(result).toEqual(batchResponse);
	});

	it('batch rejects more than 25 operations', async () => {
		const operations = Array.from({ length: 26 }, () => ({
			method: 'delete' as const,
			object_id: 'x',
		}));

		await expect(
			objectsBatch(ctx, { bucketSlug: 'my-bucket', operations }),
		).rejects.toThrow(ZodError);
		expect(mockWrite).not.toHaveBeenCalled();
	});

	it('batch rejects edit without object_id', async () => {
		await expect(
			objectsBatch(ctx, {
				bucketSlug: 'my-bucket',
				operations: [{ method: 'edit', object: { title: 'T' } }],
			}),
		).rejects.toThrow(ZodError);
		expect(mockWrite).not.toHaveBeenCalled();
	});
});

describe('Cosmic revisions endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('find lists revisions for an object', async () => {
		const envelope = { revisions: [docRevision], total: 1, limit: 10 };
		mockRead.mockResolvedValue(envelope);

		const result = await revisionsFind(ctx, {
			bucketSlug: 'my-bucket',
			objectId: 'obj123',
			limit: 10,
		});

		expect(mockRead).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects/obj123/revisions',
			'test-write-key',
			expect.objectContaining({ limit: 10 }),
		);
		expect(result).toEqual(envelope);
	});

	it('findOne gets a single revision', async () => {
		mockRead.mockResolvedValue({ revision: docRevision });

		const result = await revisionsFindOne(ctx, {
			bucketSlug: 'my-bucket',
			objectId: 'obj123',
			revisionId: 'rev123',
		});

		expect(mockRead).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects/obj123/revisions/rev123',
			'test-write-key',
			{ props: undefined },
		);
		expect(result).toEqual({ revision: docRevision });
	});

	it('insert posts a draft revision', async () => {
		mockWrite.mockResolvedValue({ revision: docRevision });

		await revisionsInsert(ctx, {
			bucketSlug: 'my-bucket',
			objectId: 'obj123',
			title: 'Updated Title',
		});

		expect(mockWrite).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects/obj123/revisions',
			'test-write-key',
			{
				method: 'POST',
				body: { title: 'Updated Title' },
			},
		);
	});
});

describe('Cosmic media endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('find lists media with folder filter', async () => {
		const envelope = { media: [docMedia], total: 1, limit: 2 };
		mockRead.mockResolvedValue(envelope);

		const result = await mediaFind(ctx, {
			bucketSlug: 'my-bucket',
			query: { folder: 'album-covers' },
			limit: 2,
		});

		expect(mockRead).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/media',
			'test-write-key',
			expect.objectContaining({
				query: '{"folder":"album-covers"}',
				limit: 2,
			}),
		);
		expect(result).toEqual(envelope);
	});

	it('findOne unwraps a single media item', async () => {
		mockRead.mockResolvedValue({ media: [docMedia], total: 1 });

		const result = await mediaFindOne(ctx, {
			bucketSlug: 'my-bucket',
			name: 'c20391e0-test.png',
		});

		expect(result).toEqual({ media: docMedia });
	});

	it('findOne throws when nothing matches', async () => {
		mockRead.mockResolvedValue({ media: [], total: 0 });

		await expect(
			mediaFindOne(ctx, { bucketSlug: 'my-bucket', name: 'missing.png' }),
		).rejects.toThrow('Cosmic media not found');
	});

	it('insert uploads base64 data with folder', async () => {
		mockUpload.mockResolvedValue({ media: docMedia });

		const result = await mediaInsert(ctx, {
			bucketSlug: 'my-bucket',
			filename: 'test.png',
			contentType: 'image/png',
			data: Buffer.from([1, 2, 3]).toString('base64'),
			folder: 'album-covers',
			trigger_webhook: true,
		});

		expect(mockUpload).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/media',
			'test-write-key',
			expect.objectContaining({
				media: expect.objectContaining({ filename: 'test.png' }),
				folder: 'album-covers',
				trigger_webhook: true,
			}),
		);
		expect(result).toEqual({ media: docMedia });
	});

	it('insert rejects invalid base64 data', async () => {
		await expect(
			mediaInsert(ctx, {
				bucketSlug: 'my-bucket',
				filename: 'test.png',
				contentType: 'image/png',
				data: 'not-base64!!!',
			}),
		).rejects.toThrow(ZodError);
		expect(mockUpload).not.toHaveBeenCalled();
	});

	it('update returns the provider message envelope', async () => {
		mockWrite.mockResolvedValue({ message: 'Media edited successfully.' });

		const result = await mediaUpdate(ctx, {
			bucketSlug: 'my-bucket',
			id: 'media123',
			folder: 'national-parks',
			alt_text: 'Grand Teton',
		});

		expect(mockWrite).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/media/media123',
			'test-write-key',
			{
				method: 'PATCH',
				body: { folder: 'national-parks', alt_text: 'Grand Teton' },
			},
		);
		expect(result).toEqual({ message: 'Media edited successfully.' });
	});

	it('update rejects an id-only patch', async () => {
		await expect(
			mediaUpdate(ctx, { bucketSlug: 'my-bucket', id: 'media123' }),
		).rejects.toThrow(ZodError);
		expect(mockWrite).not.toHaveBeenCalled();
	});

	it('delete calls DELETE on the media path', async () => {
		mockWrite.mockResolvedValue({ message: 'deleted' });

		await mediaDelete(ctx, { bucketSlug: 'my-bucket', id: 'media123' });

		expect(mockWrite).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/media/media123',
			'test-write-key',
			{ method: 'DELETE', query: undefined },
		);
	});
});

describe('Cosmic object-types endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('find lists object types', async () => {
		const envelope = { object_types: [docObjectType] };
		mockRead.mockResolvedValue(envelope);

		const result = await objectTypesFind(ctx, { bucketSlug: 'my-bucket' });

		expect(mockRead).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/object-types',
			'test-write-key',
			{},
		);
		expect(result).toEqual(envelope);
	});

	it('findOne gets an object type by slug', async () => {
		mockRead.mockResolvedValue({ object_type: docObjectType });

		const result = await objectTypesFindOne(ctx, {
			bucketSlug: 'my-bucket',
			slug: 'bikes',
		});

		expect(mockRead).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/object-types/bikes',
			'test-write-key',
			{},
		);
		expect(result).toEqual({ object_type: docObjectType });
	});

	it('insert posts title and metafields', async () => {
		mockWrite.mockResolvedValue({ object_type: docObjectType });

		await objectTypesInsert(ctx, {
			bucketSlug: 'my-bucket',
			title: 'Bikes',
			slug: 'bikes',
			emoji: '🏍️',
		});

		expect(mockWrite).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/object-types',
			'test-write-key',
			{
				method: 'POST',
				body: { title: 'Bikes', slug: 'bikes', emoji: '🏍️' },
			},
		);
	});

	it('update patches an object type', async () => {
		mockWrite.mockResolvedValue({ object_type: docObjectType });

		await objectTypesUpdate(ctx, {
			bucketSlug: 'my-bucket',
			slug: 'bikes',
			title: 'Motorcycles',
		});

		expect(mockWrite).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/object-types/bikes',
			'test-write-key',
			{ method: 'PATCH', body: { title: 'Motorcycles' } },
		);
	});

	it('update rejects a slug-only patch', async () => {
		await expect(
			objectTypesUpdate(ctx, { bucketSlug: 'my-bucket', slug: 'bikes' }),
		).rejects.toThrow(ZodError);
		expect(mockWrite).not.toHaveBeenCalled();
	});

	it('delete calls DELETE on the object-type path', async () => {
		mockWrite.mockResolvedValue({ message: 'deleted' });

		await objectTypesDelete(ctx, {
			bucketSlug: 'my-bucket',
			slug: 'bikes',
		});

		expect(mockWrite).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/object-types/bikes',
			'test-write-key',
			{ method: 'DELETE', query: undefined },
		);
	});
});

describe('Cosmic bucket slug resolution', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('falls back to the plugin bucketSlug option', async () => {
		mockRead.mockResolvedValue(docObjectsEnvelope);

		await objectsFind(ctx, { type: 'posts' });

		expect(mockRead).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects',
			'test-write-key',
			{
				query: '{"type":"posts"}',
				props: undefined,
				status: undefined,
				sort: undefined,
				limit: undefined,
				skip: undefined,
				after: undefined,
				depth: undefined,
			},
		);
	});

	it('throws when no bucket slug is available', async () => {
		const noSlugCtx = {
			key: 'k',
			options: { authType: 'api_key' },
		} as unknown as Parameters<typeof objectsFind>[0];

		await expect(objectsFind(noSlugCtx, { type: 'posts' })).rejects.toThrow(
			'bucket slug is required',
		);
		expect(mockRead).not.toHaveBeenCalled();
	});

	it('prefers the readKey option for reads', async () => {
		mockRead.mockResolvedValue(docObjectsEnvelope);
		const readCtx = {
			key: 'write-key',
			options: {
				bucketSlug: 'my-bucket',
				authType: 'api_key',
				readKey: 'read-key',
			},
		} as unknown as Parameters<typeof objectsFind>[0];

		await objectsFind(readCtx, { type: 'posts' });

		expect(mockRead).toHaveBeenCalledWith(
			'/v3/buckets/my-bucket/objects',
			'read-key',
			{
				query: '{"type":"posts"}',
				props: undefined,
				status: undefined,
				sort: undefined,
				limit: undefined,
				skip: undefined,
				after: undefined,
				depth: undefined,
			},
		);
	});
});

describe('Cosmic output schemas', () => {
	it('objects find schema validates the documented envelope', () => {
		const result =
			CosmicEndpointOutputSchemas.objectsFind.safeParse(docObjectsEnvelope);
		expect(result.success).toBe(true);
	});

	it('objects find schema accepts props-projected partial objects', () => {
		const result = CosmicEndpointOutputSchemas.objectsFind.safeParse({
			objects: [{ id: 'abc123', title: 'T' }],
			total: 1,
		});
		expect(result.success).toBe(true);
	});

	it('objects insert schema rejects a partial object', () => {
		const result = CosmicEndpointOutputSchemas.objectsInsert.safeParse({
			object: { id: 'abc123', title: 'T' },
		});
		expect(result.success).toBe(false);
	});

	it('objects find schema rejects a missing objects array', () => {
		const result = CosmicEndpointOutputSchemas.objectsFind.safeParse({
			total: 0,
		});
		expect(result.success).toBe(false);
	});

	it('batch schema validates mixed operation results', () => {
		const result = CosmicEndpointOutputSchemas.objectsBatch.safeParse({
			operations: [
				{ method: 'add', status: 'success', object: docObject },
				{ method: 'delete', status: 'success', message: 'deleted' },
			],
		});
		expect(result.success).toBe(true);
	});
});

describe('Cosmic keyBuilder', () => {
	it('throws AuthMissingError when no key is configured', async () => {
		const plugin = cosmic();
		const keyBuilder = plugin.keyBuilder;
		expect(keyBuilder).toBeDefined();
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('prefers an explicitly supplied key', async () => {
		const plugin = cosmic({ key: 'explicit-key' });
		const keyBuilder = plugin.keyBuilder;
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'from-store' },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).resolves.toBe(
			'explicit-key',
		);
	});

	it('returns the stored key when present', async () => {
		const plugin = cosmic();
		const keyBuilder = plugin.keyBuilder;
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored-key' },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).resolves.toBe('stored-key');
	});

	it('resolves the readKey option when no key is stored', async () => {
		const plugin = cosmic({ readKey: 'read-only-key' });
		const keyBuilder = plugin.keyBuilder;
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).resolves.toBe(
			'read-only-key',
		);
	});
});

describe('Cosmic error handlers', () => {
	it('matches RATE_LIMIT_ERROR for ApiError with status 429', async () => {
		const error = new ApiError(
			{ url: 'https://api.cosmicjs.com/v3/buckets/b/objects', method: 'GET' },
			{
				url: 'https://api.cosmicjs.com/v3/buckets/b/objects',
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
				ok: false,
			},
			'Rate limited',
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('matches AUTH_ERROR for ApiError with status 401 and 403', async () => {
		const unauthorized = new ApiError(
			{ url: 'https://api.cosmicjs.com/v3/buckets/b/objects', method: 'GET' },
			{
				url: 'https://api.cosmicjs.com/v3/buckets/b/objects',
				status: 401,
				statusText: 'Unauthorized',
				body: {},
				ok: false,
			},
			'Unauthorized',
		);
		const forbidden = new ApiError(
			{ url: 'https://api.cosmicjs.com/v3/buckets/b/objects', method: 'GET' },
			{
				url: 'https://api.cosmicjs.com/v3/buckets/b/objects',
				status: 403,
				statusText: 'Forbidden',
				body: {},
				ok: false,
			},
			'Forbidden',
		);

		expect(errorHandlers.AUTH_ERROR.match(unauthorized)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(forbidden)).toBe(true);
	});

	it('DEFAULT matches all other errors', async () => {
		const error = new Error('Something generic went wrong');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
	});
});
