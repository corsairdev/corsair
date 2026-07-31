import { logEventFromContext } from 'corsair/core';
import {
	makeCloudinaryAdminRequest,
	makeCloudinaryLiveRequest,
	makeCloudinaryUploadRequest,
} from './client';
import {
	createCloudinaryEndpoint,
	encodeCloudinaryPathPart,
	resolveCloudinaryPath,
} from './endpoints/factory';
import type { CloudinaryOperation } from './endpoints/operation-types';
import type { CloudinaryEndpointInput } from './endpoints/types';
import { cloudinaryOperations } from './operations';
import type { CloudinaryContext } from './plugin-types';

jest.mock('./client', () => ({
	makeCloudinaryAdminRequest: jest.fn(),
	makeCloudinaryLiveRequest: jest.fn(),
	makeCloudinaryUploadRequest: jest.fn(),
	parseCloudinaryCredentials:
		jest.requireActual('./client').parseCloudinaryCredentials,
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockAdmin = makeCloudinaryAdminRequest as jest.MockedFunction<
	typeof makeCloudinaryAdminRequest
>;
const mockLive = makeCloudinaryLiveRequest as jest.MockedFunction<
	typeof makeCloudinaryLiveRequest
>;
const mockUpload = makeCloudinaryUploadRequest as jest.MockedFunction<
	typeof makeCloudinaryUploadRequest
>;

function makeCtx(): CloudinaryContext {
	return {
		key: 'test-key:test-secret',
		options: { cloudName: 'demo' },
		cloudName: 'demo',
		keys: {
			get_cloud_name: jest.fn().mockResolvedValue('demo'),
		},
		db: {},
	} as unknown as CloudinaryContext;
}

function pathParamValue(param: string): string {
	switch (param) {
		case 'resource_type':
			return 'image';
		case 'type':
			return 'upload';
		case 'public_id':
			return 'folder/sample-asset';
		case 'folder':
			return 'parent/child';
		case 'asset_id':
			return 'abc123def456';
		case 'external_id':
			return 'color_id';
		case 'liveStreamId':
			return 'stream-1';
		case 'liveStreamOutputId':
			return 'output-1';
		case 'tag':
			return 'sample-tag';
		case 'name':
			return 'sample-name';
		default:
			return 'sample';
	}
}

function buildMinimalInput(
	operation: CloudinaryOperation,
): CloudinaryEndpointInput {
	const input: CloudinaryEndpointInput = {};

	for (const param of operation.pathParams ?? []) {
		input[param] = pathParamValue(param);
	}

	if (operation.key === 'updateFolder') {
		input.to_folder = 'renamed-folder';
	}

	if (operation.api === 'upload') {
		if (operation.key === 'updateResourceTags') {
			input.tag = 'animal';
			input.public_ids = ['dog'];
			input.command = 'add';
		}
		if (
			operation.key === 'destroyAsset' ||
			operation.key === 'explicitResource' ||
			operation.key === 'renameResource'
		) {
			input.public_id = 'sample-asset';
		}
		if (operation.key === 'destroyAssetById') {
			input.asset_id = 'abc123def456';
		}
		if (operation.key === 'uploadChunk') {
			input.content_range = 'bytes 0-999/5000';
			input.x_unique_upload_id = 'unique-upload-id';
			input.file = new Blob(['chunk']);
		}
		if (
			operation.key === 'uploadAsset' ||
			operation.key === 'uploadFileAutoDetect'
		) {
			input.file = new Blob(['file']);
		}
	}

	if (operation.method === 'POST' && operation.api === 'admin') {
		if (
			operation.key === 'searchAssets' ||
			operation.key === 'searchVisualAssets'
		) {
			input.expression = 'resource_type:image';
		}
		if (operation.key === 'searchFoldersV2') {
			input.max_results = 5;
		}
	}

	if (operation.method === 'DELETE' || operation.method === 'PUT') {
		input.keep_original = false;
	}

	return input;
}

describe('cloudinary path encoding', () => {
	it('preserves slash separators while encoding each segment', () => {
		expect(encodeCloudinaryPathPart('folder/sub/file')).toBe('folder/sub/file');
		expect(encodeCloudinaryPathPart('folder name/sub')).toBe(
			'folder%20name/sub',
		);
	});

	it('resolveCloudinaryPath substitutes nested public IDs correctly', () => {
		expect(
			resolveCloudinaryPath('/resources/{resource_type}/{type}/{public_id}', {
				resource_type: 'image',
				type: 'upload',
				public_id: 'products/shoe/front',
			}),
		).toBe('/resources/image/upload/products/shoe/front');
	});
});

describe('cloudinary operation catalog', () => {
	it('defines exactly 110 operations with unique keys', () => {
		expect(cloudinaryOperations).toHaveLength(110);
		const keys = cloudinaryOperations.map((operation) => operation.key);
		expect(new Set(keys).size).toBe(110);
	});
});

describe('cloudinary endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockAdmin.mockResolvedValue({});
		mockLive.mockResolvedValue({ id: 'stream-1' });
		mockUpload.mockResolvedValue({ public_id: 'sample' });
	});

	it.each(cloudinaryOperations.map((operation) => [operation.key, operation]))(
		'%s routes through the correct Cloudinary API client',
		async (_key, operation) => {
			const endpoint = createCloudinaryEndpoint(operation);
			const input = buildMinimalInput(operation);
			const result = await endpoint(makeCtx(), input);

			if (operation.key === 'listResourceTypes') {
				expect(result).toEqual({ resource_types: ['image', 'video', 'raw'] });
				return;
			}

			const mock =
				operation.api === 'admin'
					? mockAdmin
					: operation.api === 'upload'
						? mockUpload
						: mockLive;

			expect(mock).toHaveBeenCalledTimes(1);

			const call = mock.mock.calls[0];
			if (!call) {
				throw new Error(`missing mock call for ${operation.key}`);
			}

			const path = call[0];
			const credentials = call[1] as { cloudName: string };

			expect(credentials.cloudName).toBe('demo');
			expect(path).toBe(resolveCloudinaryPath(operation.path, input));

			if (operation.api === 'upload') {
				const options = (call[3] ?? {}) as {
					method?: string;
					bodyKind?: string;
					headers?: Record<string, string>;
				};
				expect(options.method ?? 'POST').toBe(operation.method);
				expect(call[2]).toBeTruthy();
				expect(options.bodyKind ?? 'form').toBe(
					operation.bodyKind === 'multipart' ? 'multipart' : 'form',
				);
				if (operation.key === 'uploadChunk') {
					expect(options.headers?.['Content-Range']).toBe('bytes 0-999/5000');
					expect(options.headers?.['X-Unique-Upload-Id']).toBe(
						'unique-upload-id',
					);
				}
				if (operation.key === 'updateResourceTags') {
					expect(path).toBe('/tags');
				}
				return;
			}

			const options = (call[2] ?? {}) as { method?: string };
			expect(options.method ?? 'GET').toBe(operation.method);
		},
	);
});

describe('cloudinary endpoint side effects', () => {
	it('returns API results even when event logging fails', async () => {
		const mockLog = logEventFromContext as jest.MockedFunction<
			typeof logEventFromContext
		>;
		mockLog.mockRejectedValueOnce(new Error('log failed'));
		mockAdmin.mockResolvedValueOnce({ status: 'ok' });

		const operation = cloudinaryOperations.find(
			(candidate) => candidate.key === 'pingCloudinaryServers',
		);
		if (!operation) throw new Error('missing ping operation');

		const result = await createCloudinaryEndpoint(operation)(makeCtx(), {});
		expect(result).toEqual({ status: 'ok' });
	});
});
