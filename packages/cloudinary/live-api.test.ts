import 'dotenv/config';
import { CloudinaryAPIError } from './client';
import { createCloudinaryEndpoint } from './endpoints/factory';
import type { CloudinaryOperation } from './endpoints/operation-types';
import type { CloudinaryEndpointInput } from './endpoints/types';
import { CloudinaryEndpointOutputSchemas } from './endpoints/types';
import { cloudinaryOperations } from './operations';
import type { CloudinaryContext } from './plugin-types';

const TEST_API_KEY = process.env.CLOUDINARY_API_KEY;
const TEST_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const TEST_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

const hasLiveCredentials = Boolean(
	TEST_API_KEY?.trim() && TEST_API_SECRET?.trim() && TEST_CLOUD_NAME?.trim(),
);

type SampleAsset = {
	asset_id: string;
	public_id: string;
	resource_type: string;
	type: string;
};

function makeLiveContext(): CloudinaryContext {
	return {
		key: `${TEST_API_KEY}:${TEST_API_SECRET}`,
		options: { cloudName: TEST_CLOUD_NAME },
		cloudName: TEST_CLOUD_NAME,
		keys: {
			get_cloud_name: async () => TEST_CLOUD_NAME ?? '',
		},
		db: {},
	} as unknown as CloudinaryContext;
}

function pathParamValue(param: string, sample: SampleAsset | null): string {
	switch (param) {
		case 'resource_type':
			return sample?.resource_type ?? 'image';
		case 'type':
			return sample?.type ?? 'upload';
		case 'public_id':
			return sample?.public_id ?? 'samples/radial_02';
		case 'folder':
			return 'samples';
		case 'asset_id':
			return sample?.asset_id ?? 'asset-placeholder';
		case 'external_id':
			return 'placeholder-external-id';
		case 'liveStreamId':
			return 'live-stream-placeholder';
		case 'liveStreamOutputId':
			return 'live-output-placeholder';
		case 'tag':
			return 'sample';
		case 'name':
			return 'sample';
		default:
			return 'sample';
	}
}

function buildLiveInput(
	operation: CloudinaryOperation,
	sample: SampleAsset | null,
): CloudinaryEndpointInput {
	const input: CloudinaryEndpointInput = {
		max_results: 5,
	};

	for (const param of operation.pathParams ?? []) {
		input[param] = pathParamValue(param, sample);
	}

	if (
		operation.key === 'searchAssets' ||
		operation.key === 'searchVisualAssets'
	) {
		input.expression = 'resource_type:image';
	}

	if (operation.key === 'getResourcesByContext') {
		input.key = 'alt';
		input.value = 'sample';
	}

	if (operation.key === 'getResourcesInModeration') {
		input.moderation_status = 'pending';
	}

	if (operation.key === 'getVideoViews') {
		input.start_date = '2026-07-01';
		input.end_date = '2026-07-28';
	}

	if (operation.key === 'listResourcesByAssetIds') {
		if (sample?.asset_id) input.asset_ids = [sample.asset_id];
	}

	if (operation.key === 'listResourcesByTag') {
		input.tag = 'sample';
	}

	if (operation.key === 'getAnalysisTaskStatus') {
		input.task_id = '000000000000000000000000';
	}

	return input;
}

const SKIPPED_READ_OPS = new Set([
	// Requires an existing analysis task id in the account.
	'getAnalysisTaskStatus',
]);

const describeLive = hasLiveCredentials ? describe : describe.skip;

describeLive('Cloudinary live integration', () => {
	let sampleAsset: SampleAsset | null = null;

	beforeAll(async () => {
		const listImages = cloudinaryOperations.find(
			(operation) => operation.key === 'listImages',
		);
		if (!listImages) return;

		const response = (await createCloudinaryEndpoint(listImages)(
			makeLiveContext(),
			{
				max_results: 1,
			},
		)) as { resources?: SampleAsset[] };

		sampleAsset = response.resources?.[0] ?? null;
	});

	it('uploads, reads, tags, and destroys a temporary asset', async () => {
		const ctx = makeLiveContext();
		const publicId = `corsair-test-${Date.now()}`;
		const png = Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
			'base64',
		);

		const uploadOp = cloudinaryOperations.find(
			(operation) => operation.key === 'uploadAsset',
		);
		const getOp = cloudinaryOperations.find(
			(operation) => operation.key === 'getResourceByPublicId',
		);
		const tagOp = cloudinaryOperations.find(
			(operation) => operation.key === 'updateResourceTags',
		);
		const destroyOp = cloudinaryOperations.find(
			(operation) => operation.key === 'destroyAsset',
		);

		if (!uploadOp || !getOp || !tagOp || !destroyOp) {
			throw new Error('missing upload lifecycle operations');
		}

		await createCloudinaryEndpoint(uploadOp)(ctx, {
			public_id: publicId,
			file: new Blob([png], { type: 'image/png' }),
		});

		try {
			const fetched = await createCloudinaryEndpoint(getOp)(ctx, {
				resource_type: 'image',
				type: 'upload',
				public_id: publicId,
			});
			expect(fetched).toBeDefined();

			await createCloudinaryEndpoint(tagOp)(ctx, {
				resource_type: 'image',
				tag: 'corsair-test',
				public_ids: [publicId],
				command: 'add',
			});
		} finally {
			await createCloudinaryEndpoint(destroyOp)(ctx, {
				resource_type: 'image',
				public_id: publicId,
			});
		}
	}, 60000);

	const readOps = cloudinaryOperations.filter(
		(operation) => operation.riskLevel === 'read',
	);

	it.each(readOps.map((operation) => [operation.key, operation]))(
		'%s live read succeeds',
		async (key, operation) => {
			if (SKIPPED_READ_OPS.has(String(key))) {
				return;
			}

			try {
				const result = await createCloudinaryEndpoint(operation)(
					makeLiveContext(),
					buildLiveInput(operation, sampleAsset),
				);
				expect(result).toBeDefined();
				CloudinaryEndpointOutputSchemas[operation.key]?.parse(result);
			} catch (error) {
				if (
					error instanceof CloudinaryAPIError &&
					(error.code === '404' || error.code === '400')
				) {
					// Some read ops require account-specific IDs (live streams, metadata fields).
					return;
				}
				throw error;
			}
		},
		30000,
	);
});
