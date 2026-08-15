import {
	AsinDataApiEndpointInputSchemas,
	AsinDataApiEndpointOutputSchemas,
} from './endpoints/types';
import { AsinDataApiSchema } from './schema';
import { CollectionCompletedPayloadSchema } from './webhooks/types';

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
		const result =
			AsinDataApiEndpointInputSchemas.destinationsCreate.safeParse({
				name: 'Test Destination',
				type: 's3',
				s3_access_key_id: 'AKIAIOSFODNN7EXAMPLE',
				s3_secret_access_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
				s3_bucket_name: 'test-bucket',
			});
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
		const result =
			AsinDataApiEndpointInputSchemas.destinationsDelete.safeParse({
				ids: ['371D9C46'],
			});
		expect(result.success).toBe(true);
	});
});

describe('AsinDataApi webhook schemas', () => {
	it('has the collection_completed payload schema', () => {
		expect(CollectionCompletedPayloadSchema).toBeDefined();
	});

	it('validates a sample collection completed payload', () => {
		const result = CollectionCompletedPayloadSchema.safeParse({
			request_info: {
				success: true,
				type: 'collection_resultset_completed',
			},
			collection: {
				id: '9E867FAA',
				name: 'Test Collection',
			},
			result_set: {
				id: 4,
				started_at: '2020-01-01T00:00:00.000Z',
				ended_at: '2020-01-01T00:00:10.000Z',
				requests_completed: 1,
				requests_failed: 0,
				download_links: {
					json: {
						pages: [
							'https://results.asindataapi.com/Collection_Results_9E867FAA_4_Page_1.json',
						],
						all_pages:
							'https://results.asindataapi.com/Collection_Results_9E867FAA_4_All_Pages.zip',
					},
				},
			},
		});
		expect(result.success).toBe(true);
	});
});
