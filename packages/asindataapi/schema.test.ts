import {
	AsinDataApiEndpointInputSchemas,
	ProductResponseSchema,
} from './endpoints/types';
import { AsinDataApiSchema } from './schema';
import {
	AsinDataApiCollection,
	AsinDataApiCollectionRequest,
	AsinDataApiDestination,
	AsinDataApiResultSet,
} from './schema/database';
import {
	CollectionCompletedPayloadSchema,
	createAsinDataApiMatch,
} from './webhooks/types';

const COLLECTION_KEYS = [
	'id',
	'created_at',
	'last_run',
	'name',
	'schedule_type',
	'priority',
	'destination_ids',
	'enabled',
	'status',
	'request_total_count',
	'request_page_count',
	'requests_total_count',
	'requests_page_count',
	'credits_required',
	'next_result_set_id',
	'results_count',
	'schedule_hours',
	'schedule_days_of_week',
	'schedule_days_of_month',
	'schedule_minutes',
	'notification_email',
	'notification_webhook',
	'notification_as_json',
	'notification_as_jsonlines',
	'notification_as_csv',
	'notification_csv_fields',
	'request_type',
	'request_type_locked',
	'requests_type',
];

const DESTINATION_KEYS = [
	'id',
	'name',
	'type',
	'enabled',
	'used_by',
	's3_bucket_name',
	's3_path_prefix',
	's3_endpoint',
	's3_region',
	'gcs_bucket_name',
	'gcs_path_prefix',
	'azure_account_name',
	'azure_container_name',
	'azure_path_prefix',
	'oss_bucket_name',
	'oss_region_id',
	'oss_path_prefix',
];

const REQUEST_KEYS = [
	'id',
	'custom_id',
	'type',
	'amazon_domain',
	'asin',
	'url',
	'gtin',
	'search_term',
	'category_id',
	'refinements',
	'sort_by',
	'exclude_sponsored',
	'direct_search',
	'page',
	'max_page',
	'include_html',
	'skip_gtin_cache',
	'show_different_asins',
];

const RESULT_SET_KEYS = [
	'id',
	'collection_id',
	'started_at',
	'ended_at',
	'expires_at',
	'results_page_count',
	'requests_completed',
	'requests_failed',
	'requests_total',
	'download_links',
	'webhook_status',
	'destination_status',
];

function declaredKeys(schema: { shape: Record<string, unknown> }) {
	return Object.keys(schema.shape).sort();
}

describe('AsinDataApi schema', () => {
	it('declares a semver version', () => {
		expect(AsinDataApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official entities', () => {
		expect(Object.keys(AsinDataApiSchema.entities).sort()).toEqual([
			'collections',
			'destinations',
			'requests',
			'resultSets',
		]);
	});

	it('uses official collection keys', () => {
		expect(declaredKeys(AsinDataApiCollection)).toEqual(
			[...COLLECTION_KEYS].sort(),
		);
	});

	it('uses official destination keys', () => {
		expect(declaredKeys(AsinDataApiDestination)).toEqual(
			[...DESTINATION_KEYS].sort(),
		);
	});

	it('uses official request keys', () => {
		expect(declaredKeys(AsinDataApiCollectionRequest)).toEqual(
			[...REQUEST_KEYS].sort(),
		);
	});

	it('uses official result set keys', () => {
		expect(declaredKeys(AsinDataApiResultSet)).toEqual(
			[...RESULT_SET_KEYS].sort(),
		);
	});

	it('parses the official get-collection example', () => {
		const parsed = AsinDataApiCollection.safeParse({
			id: '123456',
			created_at: '2020-01-01T00:00:00.000Z',
			name: 'My First Collection',
			schedule_type: 'daily',
			priority: 'normal',
			destination_ids: ['destination_id_1'],
			enabled: true,
			status: 'idle',
			request_total_count: 0,
			request_page_count: 0,
			credits_required: 0,
			next_result_set_id: 1,
			results_count: 0,
			schedule_hours: [9, 17],
			notification_email: 'john.smith@example.com',
			notification_as_json: false,
			notification_as_jsonlines: false,
			notification_as_csv: true,
		});
		expect(parsed.success).toBe(true);
	});

	it('parses the official list-destinations example', () => {
		const parsed = AsinDataApiDestination.safeParse({
			id: 'ABCDEFG',
			name: 'My First S3 Destination',
			type: 's3',
			enabled: true,
			used_by: 0,
			s3_bucket_name: 's3_bucket_name',
			s3_path_prefix: 'my_path_prefix',
		});
		expect(parsed.success).toBe(true);
	});
});

describe('AsinDataApi agent-doc inputs', () => {
	it('accepts GET_COLLECTION collection_id', () => {
		expect(
			AsinDataApiEndpointInputSchemas.collectionsGet.safeParse({
				collection_id: 'ABC123',
			}).success,
		).toBe(true);
	});

	it('accepts LIST_COLLECTION_REQUESTS collection_id and optional page', () => {
		expect(
			AsinDataApiEndpointInputSchemas.requestsList.safeParse({
				collection_id: 'ABC123',
			}).success,
		).toBe(true);
		expect(
			AsinDataApiEndpointInputSchemas.requestsList.safeParse({
				collection_id: 'ABC123',
				page: 2,
			}).success,
		).toBe(true);
	});

	it('accepts CLEAR_COLLECTION_REQUESTS request_ids', () => {
		expect(
			AsinDataApiEndpointInputSchemas.requestsClear.safeParse({
				collection_id: 'ABC123',
				request_ids: ['req1', 'req2'],
			}).success,
		).toBe(true);
	});

	it('accepts LIST_DESTINATIONS official filters', () => {
		expect(
			AsinDataApiEndpointInputSchemas.destinationsList.safeParse({
				page: 1,
				search_term: 's3',
				sort_by: 'name',
				sort_direction: 'descending',
			}).success,
		).toBe(true);
		expect(
			AsinDataApiEndpointInputSchemas.destinationsList.safeParse({
				sort_by: 'status',
			}).success,
		).toBe(false);
	});

	it('accepts UPDATE_DESTINATION official fields', () => {
		expect(
			AsinDataApiEndpointInputSchemas.destinationsUpdate.safeParse({
				destination_id: 'ABCDEFG',
				name: 'Renamed',
				enabled: false,
				gcs_access_key: 'key',
				gcs_secret_key: 'secret',
				oss_region_id: 'oss-us-east-1',
			}).success,
		).toBe(true);
	});

	it('accepts DELETE_DESTINATION destination_id', () => {
		expect(
			AsinDataApiEndpointInputSchemas.destinationsDelete.safeParse({
				destination_id: '371D9C46',
			}).success,
		).toBe(true);
		expect(
			AsinDataApiEndpointInputSchemas.destinationsDelete.safeParse({
				ids: ['371D9C46'],
			}).success,
		).toBe(false);
	});

	it('rejects missing or out-of-range inputs', () => {
		expect(
			AsinDataApiEndpointInputSchemas.collectionsCreate.safeParse({}).success,
		).toBe(false);
		expect(
			AsinDataApiEndpointInputSchemas.collectionsList.safeParse({
				page_size: 1001,
			}).success,
		).toBe(false);
		expect(
			AsinDataApiEndpointInputSchemas.requestsAdd.safeParse({
				collection_id: 'ABC123',
				requests: [],
			}).success,
		).toBe(false);
		expect(
			AsinDataApiEndpointInputSchemas.requestsAdd.safeParse({
				collection_id: 'ABC123',
				requests: Array.from({ length: 1001 }, () => ({
					asin: 'B00I8RKMSM',
				})),
			}).success,
		).toBe(false);
	});

	it('requires official destination types', () => {
		expect(
			AsinDataApiEndpointInputSchemas.destinationsCreate.safeParse({
				name: 'Test Destination',
				type: 's3',
				enabled: true,
				s3_access_key_id: 'AKIAIOSFODNN7EXAMPLE',
				s3_secret_access_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
				s3_bucket_name: 'test-bucket',
			}).success,
		).toBe(true);
		expect(
			AsinDataApiEndpointInputSchemas.destinationsCreate.safeParse({
				name: 'Test Destination',
				type: 'azure_blob',
				enabled: true,
			}).success,
		).toBe(false);
	});
});

describe('AsinDataApi product response', () => {
	it('requires product.asin on success and allows a failed response without product', () => {
		expect(
			ProductResponseSchema.safeParse({
				request_info: { success: true },
				product: { asin: 'B00I8RKMSM', title: 'Probe' },
			}).success,
		).toBe(true);
		expect(
			ProductResponseSchema.safeParse({
				request_info: { success: true },
				product: { title: 'missing asin' },
			}).success,
		).toBe(false);
		expect(
			ProductResponseSchema.safeParse({
				request_info: { success: false, message: 'Invalid ASIN' },
			}).success,
		).toBe(true);
	});
});

describe('AsinDataApi webhook', () => {
	it('matches the official collection_resultset_completed payload', () => {
		const payload = {
			request_info: { success: true, type: 'collection_resultset_completed' },
			collection: { id: '9E867FAA', name: 'My Second Collection' },
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
					},
				},
			},
		};
		expect(CollectionCompletedPayloadSchema.safeParse(payload).success).toBe(
			true,
		);
		expect(
			createAsinDataApiMatch('collection_resultset_completed')({
				headers: {},
				body: payload,
			}),
		).toBe(true);
		expect(
			createAsinDataApiMatch('collection_resultset_completed')({
				headers: {},
				body: { request_info: { type: 'other' } },
			}),
		).toBe(false);
	});
});
