import { Collections } from './endpoints/collections';
import { Destinations } from './endpoints/destinations';
import { Products } from './endpoints/products';
import { Requests } from './endpoints/requests';
import { Search } from './endpoints/search';
import {
	AsinDataApiEndpointInputSchemas,
	AsinDataApiEndpointOutputSchemas,
} from './endpoints/types';
import { AsinDataApiSchema } from './schema';
import {
	CollectionCompletedPayloadSchema,
	createAsinDataApiMatch,
} from './webhooks/types';

describe('AsinDataApi schema', () => {
	it('declares a semver version', () => {
		expect(AsinDataApiSchema.version).toBeDefined();
		expect(AsinDataApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AsinDataApiSchema.entities).toBe('object');
		expect(AsinDataApiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AsinDataApiSchema.entities))).toBe(true);
		for (const entity of Object.values(AsinDataApiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('has collections and resultSets entities', () => {
		expect(AsinDataApiSchema.entities.collections).toBeDefined();
		expect(AsinDataApiSchema.entities.resultSets).toBeDefined();
	});
});

describe('AsinDataApi endpoint schemas', () => {
	it('has input schemas for all endpoints', () => {
		const endpoints = [
			'productsGet',
			'searchGet',
			'offersGet',
			'categoriesGet',
			'identifiersResolve',
			'collectionsCreate',
			'collectionsList',
			'collectionsGet',
			'collectionsUpdate',
			'collectionsDelete',
			'collectionsStart',
			'requestsList',
			'requestsAdd',
			'requestsUpdate',
			'requestsClear',
			'requestsDelete',
			'resultSetsList',
			'resultSetsGet',
			'destinationsList',
			'destinationsCreate',
			'destinationsUpdate',
			'destinationsDelete',
		] as const;

		for (const endpoint of endpoints) {
			expect(AsinDataApiEndpointInputSchemas[endpoint]).toBeDefined();
			expect(AsinDataApiEndpointOutputSchemas[endpoint]).toBeDefined();
		}
	});

	it('validates a valid product get input', () => {
		const result = AsinDataApiEndpointInputSchemas.productsGet.safeParse({
			asin: 'B00I8RKMSM',
			amazon_domain: 'amazon.com',
		});
		expect(result.success).toBe(true);
	});

	it('validates a valid search get input', () => {
		const result = AsinDataApiEndpointInputSchemas.searchGet.safeParse({
			search_term: 'highlighter pens',
			amazon_domain: 'amazon.com',
		});
		expect(result.success).toBe(true);
	});

	it('validates a valid offers get input', () => {
		const result = AsinDataApiEndpointInputSchemas.offersGet.safeParse({
			asin: 'B00I8RKMSM',
			amazon_domain: 'amazon.com',
		});
		expect(result.success).toBe(true);
	});

	it('validates a valid categories get input', () => {
		const result = AsinDataApiEndpointInputSchemas.categoriesGet.safeParse({
			category_id: '1064954',
			amazon_domain: 'amazon.com',
		});
		expect(result.success).toBe(true);
	});

	it('validates a valid identifiers resolve input', () => {
		const result = AsinDataApiEndpointInputSchemas.identifiersResolve.safeParse(
			{
				gtin: '0123456789012',
				amazon_domain: 'amazon.com',
			},
		);
		expect(result.success).toBe(true);
	});

	it('validates a valid collections create input', () => {
		const result = AsinDataApiEndpointInputSchemas.collectionsCreate.safeParse({
			name: 'Test Collection',
			schedule_type: 'manual',
		});
		expect(result.success).toBe(true);
	});

	it('validates a valid requests clear input', () => {
		const result = AsinDataApiEndpointInputSchemas.requestsClear.safeParse({
			collectionId: 'ABC123',
			requestIds: ['req1', 'req2'],
		});
		expect(result.success).toBe(true);
	});

	it('validates a valid destinations create input', () => {
		const result = AsinDataApiEndpointInputSchemas.destinationsCreate.safeParse(
			{
				name: 'Test Destination',
				type: 's3',
				s3_access_key_id: 'AKIAIOSFODNN7EXAMPLE',
				s3_secret_access_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
				s3_bucket_name: 'test-bucket',
			},
		);
		expect(result.success).toBe(true);
	});

	it('validates a valid destinations list input', () => {
		const result = AsinDataApiEndpointInputSchemas.destinationsList.safeParse({
			page: 1,
			type: 'all',
			sort_by: 'name',
			sort_direction: 'descending',
		});
		expect(result.success).toBe(true);
	});

	it('validates a valid destinations delete input', () => {
		const result = AsinDataApiEndpointInputSchemas.destinationsDelete.safeParse(
			{
				ids: ['371D9C46'],
			},
		);
		expect(result.success).toBe(true);
	});
});

describe('AsinDataApi endpoint implementations', () => {
	const mockCtx = {
		key: 'test-api-key',
		db: {
			collections: {
				upsertByEntityId: jest.fn().mockResolvedValue({ id: 'test' }),
				deleteByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('products.get is a function', () => {
		expect(typeof Products.get).toBe('function');
	});

	it('search.get is a function', () => {
		expect(typeof Search.get).toBe('function');
	});

	it('collections.create is a function', () => {
		expect(typeof Collections.create).toBe('function');
	});

	it('collections.list is a function', () => {
		expect(typeof Collections.list).toBe('function');
	});

	it('collections.get is a function', () => {
		expect(typeof Collections.get).toBe('function');
	});

	it('collections.update is a function', () => {
		expect(typeof Collections.update).toBe('function');
	});

	it('collections.delete is a function', () => {
		expect(typeof Collections.delete).toBe('function');
	});

	it('collections.start is a function', () => {
		expect(typeof Collections.start).toBe('function');
	});

	it('requests.list is a function', () => {
		expect(typeof Requests.list).toBe('function');
	});

	it('requests.add is a function', () => {
		expect(typeof Requests.add).toBe('function');
	});

	it('requests.update is a function', () => {
		expect(typeof Requests.update).toBe('function');
	});

	it('requests.clear is a function', () => {
		expect(typeof Requests.clear).toBe('function');
	});

	it('requests.delete is a function', () => {
		expect(typeof Requests.delete).toBe('function');
	});

	it('destinations.list is a function', () => {
		expect(typeof Destinations.list).toBe('function');
	});

	it('destinations.create is a function', () => {
		expect(typeof Destinations.create).toBe('function');
	});

	it('destinations.update is a function', () => {
		expect(typeof Destinations.update).toBe('function');
	});

	it('destinations.delete is a function', () => {
		expect(typeof Destinations.delete).toBe('function');
	});
});

describe('AsinDataApi output schema validation', () => {
	it('validates a product response', () => {
		const result = AsinDataApiEndpointOutputSchemas.productsGet.safeParse({
			request_info: { success: true, credits_used: 1, credits_remaining: 999 },
			product: { asin: 'B00I8RKMSM', title: 'Test Product' },
		});
		expect(result.success).toBe(true);
	});

	it('validates a search response', () => {
		const result = AsinDataApiEndpointOutputSchemas.searchGet.safeParse({
			request_info: { success: true },
			search_results: [{ asin: 'B00I8RKMSM', title: 'Test', position: 1 }],
		});
		expect(result.success).toBe(true);
	});

	it('validates a collection response', () => {
		const result = AsinDataApiEndpointOutputSchemas.collectionsGet.safeParse({
			request_info: { success: true },
			collection: { id: 'ABC123', name: 'Test', status: 'idle' },
		});
		expect(result.success).toBe(true);
	});

	it('validates a collection ack response', () => {
		const result = AsinDataApiEndpointOutputSchemas.collectionsDelete.safeParse(
			{
				request_info: { success: true, message: 'collection deleted' },
			},
		);
		expect(result.success).toBe(true);
	});

	it('validates a destinations list response', () => {
		const result = AsinDataApiEndpointOutputSchemas.destinationsList.safeParse({
			request_info: { success: true },
			destinations: [
				{ id: '371D9C46', name: 'test', type: 's3', enabled: true },
			],
		});
		expect(result.success).toBe(true);
	});

	it('validates a destinations create response', () => {
		const result =
			AsinDataApiEndpointOutputSchemas.destinationsCreate.safeParse({
				request_info: { success: true },
				usage: { used: 1, limit: 50, available: 49 },
				destination: { id: 'DB409F46', name: 'test', type: 's3' },
			});
		expect(result.success).toBe(true);
	});
});

describe('AsinDataApi webhook', () => {
	it('collection_resultset_completed matcher identifies correct events', () => {
		const matcher = createAsinDataApiMatch('collection_resultset_completed');

		expect(
			matcher({
				headers: {},
				body: {
					request_info: { type: 'collection_resultset_completed' },
					collection: { id: '123' },
					result_set: { id: 1 },
				},
			}),
		).toBe(true);

		expect(
			matcher({
				headers: {},
				body: {
					request_info: { type: 'other_event' },
				},
			}),
		).toBe(false);

		expect(
			matcher({
				headers: {},
				body: null,
			}),
		).toBe(false);
	});
});
