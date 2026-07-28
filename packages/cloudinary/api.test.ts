import 'dotenv/config';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { CloudinaryCredentials } from './client';
import {
	encodeCloudinaryFormBody,
	makeCloudinaryAdminRequest,
	parseCloudinaryCredentials,
	signCloudinaryParams,
	verifyCloudinaryNotificationSignature,
} from './client';
import { CloudinaryUsageSchema } from './endpoints/schemas';
import { CloudinaryEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.CLOUDINARY_API_KEY;
const TEST_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const TEST_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const TEST_PUBLIC_ID = process.env.CLOUDINARY_TEST_PUBLIC_ID;
const TEST_RESOURCE_TYPE = process.env.CLOUDINARY_TEST_RESOURCE_TYPE ?? 'image';
const TEST_DELIVERY_TYPE =
	process.env.CLOUDINARY_TEST_DELIVERY_TYPE ?? 'upload';

const PingResponseSchema = z.object({ status: z.string() }).passthrough();

function parseEndpointOutput(
	key: keyof typeof CloudinaryEndpointOutputSchemas,
	result: unknown,
) {
	const schema = CloudinaryEndpointOutputSchemas[key];
	if (!schema) {
		throw new Error(`Missing output schema for ${String(key)}`);
	}
	schema.parse(result);
}

function requireCredentials(): CloudinaryCredentials {
	if (!TEST_API_KEY?.trim()) {
		throw new Error(
			'Set CLOUDINARY_API_KEY in packages/cloudinary/.env (see .env.example)',
		);
	}
	if (!TEST_API_SECRET?.trim()) {
		throw new Error(
			'Set CLOUDINARY_API_SECRET in packages/cloudinary/.env (see .env.example)',
		);
	}
	if (!TEST_CLOUD_NAME?.trim()) {
		throw new Error(
			'Set CLOUDINARY_CLOUD_NAME in packages/cloudinary/.env (see .env.example)',
		);
	}
	return {
		apiKey: TEST_API_KEY,
		apiSecret: TEST_API_SECRET,
		cloudName: TEST_CLOUD_NAME,
	};
}

const hasLiveCredentials = Boolean(
	TEST_API_KEY?.trim() && TEST_API_SECRET?.trim() && TEST_CLOUD_NAME?.trim(),
);

describe('Cloudinary client helpers', () => {
	it('parseCloudinaryCredentials splits api_key:api_secret', () => {
		expect(parseCloudinaryCredentials('key123:secret456')).toEqual({
			apiKey: 'key123',
			apiSecret: 'secret456',
		});
	});

	it('signCloudinaryParams produces a deterministic SHA-256 hex signature', () => {
		const params = { public_id: 'sample', timestamp: 1_700_000_000 };
		const signature = signCloudinaryParams(params, 'test-secret');
		const expected = createHash('sha256')
			.update('public_id=sample&timestamp=1700000000test-secret')
			.digest('hex');

		expect(signature).toBe(expected);
	});

	it('signCloudinaryParams excludes unsigned fields and joins arrays with commas', () => {
		const params = {
			api_key: 'should-not-sign',
			file: 'should-not-sign',
			eager: ['w_100', 'w_200'],
			tags: ['a', 'b'],
			timestamp: 1_700_000_000,
		};
		const signature = signCloudinaryParams(params, 'test-secret');
		const expected = createHash('sha256')
			.update('eager=w_100,w_200&tags=a,b&timestamp=1700000000test-secret')
			.digest('hex');

		expect(signature).toBe(expected);
	});

	it('encodeCloudinaryFormBody serializes arrays as comma-separated values', () => {
		const encoded = encodeCloudinaryFormBody({
			tags: ['one', 'two', 'three'],
			eager: ['w_100', 'w_200'],
			timestamp: 1_700_000_000,
			api_key: 'key',
		});
		const params = new URLSearchParams(encoded);

		expect(params.get('tags')).toBe('one,two,three');
		expect(params.get('eager')).toBe('w_100,w_200');
		expect(params.get('timestamp')).toBe('1700000000');
		expect(params.get('api_key')).toBe('key');
	});

	it('verifyCloudinaryNotificationSignature validates signed payloads', () => {
		const payload = '{"notification_type":"upload"}';
		const timestamp = String(Math.floor(Date.now() / 1000));
		const apiSecret = 'webhook-secret';
		const signature = createHash('sha256')
			.update(payload + timestamp + apiSecret)
			.digest('hex');

		expect(
			verifyCloudinaryNotificationSignature(
				payload,
				timestamp,
				signature,
				apiSecret,
			),
		).toBe(true);
		expect(
			verifyCloudinaryNotificationSignature(
				payload,
				timestamp,
				signature.toUpperCase(),
				apiSecret,
			),
		).toBe(true);
		expect(
			verifyCloudinaryNotificationSignature(
				payload,
				timestamp,
				'invalid',
				apiSecret,
			),
		).toBe(false);
		expect(
			verifyCloudinaryNotificationSignature(
				payload,
				'1700000000',
				signature,
				apiSecret,
			),
		).toBe(false);
	});
});

const describeLive = hasLiveCredentials ? describe : describe.skip;

describeLive('Cloudinary API Type Tests', () => {
	describe('health', () => {
		it('pingCloudinaryServers returns correct type', async () => {
			const credentials = requireCredentials();
			const result = await makeCloudinaryAdminRequest<{ status: string }>(
				'/ping',
				credentials,
				{ method: 'GET' },
			);

			PingResponseSchema.parse(result);
			parseEndpointOutput('pingCloudinaryServers', result);
		});
	});

	describe('resources', () => {
		it('listImages returns correct type', async () => {
			const credentials = requireCredentials();
			const result = await makeCloudinaryAdminRequest<unknown>(
				'/resources/image',
				credentials,
				{
					method: 'GET',
					query: { max_results: 5 },
				},
			);

			parseEndpointOutput('listImages', result);
		});

		it('listResourceTypes returns correct type', async () => {
			const credentials = requireCredentials();
			const result = await makeCloudinaryAdminRequest<unknown>(
				'/resources/types',
				credentials,
				{ method: 'GET' },
			);

			parseEndpointOutput('listResourceTypes', result);
		});

		it('getResourceByPublicId returns correct type', async () => {
			const credentials = requireCredentials();
			let publicId = TEST_PUBLIC_ID;

			if (!publicId) {
				const list = await makeCloudinaryAdminRequest<{
					resources?: Array<{ public_id?: string }>;
				}>('/resources/image', credentials, {
					method: 'GET',
					query: { max_results: 1 },
				});
				publicId = list.resources?.[0]?.public_id;
			}

			if (!publicId) {
				console.warn(
					'No image assets found — set CLOUDINARY_TEST_PUBLIC_ID or upload an asset to test getResourceByPublicId',
				);
				return;
			}

			const result = await makeCloudinaryAdminRequest<unknown>(
				`/resources/${TEST_RESOURCE_TYPE}/${TEST_DELIVERY_TYPE}/${publicId}`,
				credentials,
				{ method: 'GET' },
			);

			parseEndpointOutput('getResourceByPublicId', result);
		});
	});

	describe('folders', () => {
		it('getRootFolders returns correct type', async () => {
			const credentials = requireCredentials();
			const result = await makeCloudinaryAdminRequest<unknown>(
				'/folders',
				credentials,
				{
					method: 'GET',
					query: { max_results: 5 },
				},
			);

			parseEndpointOutput('getRootFolders', result);
		});
	});

	describe('upload presets', () => {
		it('listUploadPresets returns correct type', async () => {
			const credentials = requireCredentials();
			const result = await makeCloudinaryAdminRequest<unknown>(
				'/upload_presets',
				credentials,
				{
					method: 'GET',
					query: { max_results: 5 },
				},
			);

			parseEndpointOutput('listUploadPresets', result);
		});
	});

	describe('transformations', () => {
		it('getTransformations returns correct type', async () => {
			const credentials = requireCredentials();
			const result = await makeCloudinaryAdminRequest<unknown>(
				'/transformations',
				credentials,
				{
					method: 'GET',
					query: { max_results: 5 },
				},
			);

			parseEndpointOutput('getTransformations', result);
		});
	});

	describe('metadata', () => {
		it('listMetadataFields returns correct type', async () => {
			const credentials = requireCredentials();
			const result = await makeCloudinaryAdminRequest<unknown>(
				'/metadata_fields',
				credentials,
				{ method: 'GET' },
			);

			parseEndpointOutput('listMetadataFields', result);
		});
	});

	describe('tags', () => {
		it('getTags returns correct type', async () => {
			const credentials = requireCredentials();
			const result = await makeCloudinaryAdminRequest<unknown>(
				`/tags/${TEST_RESOURCE_TYPE}`,
				credentials,
				{
					method: 'GET',
					query: { max_results: 5 },
				},
			);

			parseEndpointOutput('getTags', result);
		});
	});

	describe('account', () => {
		it('getUsage returns correct type', async () => {
			const credentials = requireCredentials();
			const result = await makeCloudinaryAdminRequest<unknown>(
				'/usage',
				credentials,
				{ method: 'GET' },
			);

			CloudinaryUsageSchema.loose().parse(result);
			parseEndpointOutput('getUsage', result);
		});

		it('getConfig returns correct type', async () => {
			const credentials = requireCredentials();
			const result = await makeCloudinaryAdminRequest<unknown>(
				'/config',
				credentials,
				{ method: 'GET' },
			);

			parseEndpointOutput('getConfig', result);
		});
	});
});
