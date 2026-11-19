import { makeCloudinaryUploadRequest } from './client';
import { createCloudinaryEndpoint } from './endpoints/factory';
import { CloudinaryEndpointInputSchemas } from './endpoints/types';
import { cloudinaryOperations } from './operations';
import type { CloudinaryContext } from './plugin-types';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeCloudinaryUploadRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

// The real resolveFileInput, with links served from memory instead of the network.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		resolveFileInput: (input: unknown, options: unknown, deps?: unknown) =>
			actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
	};
});

const mockLinks = {
	served: new Map<string, { body: Uint8Array; type: string }>(),
	requested: [] as string[],
	deps: {
		resolve: async () => ['93.184.216.34'],
		transport: async (url: URL) => {
			mockLinks.requested.push(url.toString());
			const file = mockLinks.served.get(url.toString());
			return {
				status: file ? 200 : 404,
				headers: file ? { 'content-type': file.type } : {},
				body: (async function* () {
					if (file) yield file.body;
				})(),
			};
		},
	},
};

const mockUpload = makeCloudinaryUploadRequest as jest.MockedFunction<
	typeof makeCloudinaryUploadRequest
>;

function makeCtx(): CloudinaryContext {
	return {
		key: 'test-key:test-secret',
		options: { cloudName: 'demo' },
		cloudName: 'demo',
		keys: { get_cloud_name: jest.fn().mockResolvedValue('demo') },
		db: {},
	} as unknown as CloudinaryContext;
}

function endpoint(key: string) {
	const operation = cloudinaryOperations.find((op) => op.key === key);
	if (!operation) throw new Error(`no operation ${key}`);
	// unknown: each case passes a different file form through the same endpoint.
	return createCloudinaryEndpoint(operation) as (
		ctx: CloudinaryContext,
		input: unknown,
	) => Promise<unknown>;
}

type SentUpload = {
	body: Record<string, unknown>;
	bodyKind?: string;
	headers?: Record<string, string>;
};

function sentUpload(): SentUpload {
	return mockUpload.mock.calls.at(-1)?.[3] as SentUpload;
}

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const link = 'https://files.example.com/photos/beach.png';

beforeEach(() => {
	mockUpload.mockReset();
	mockUpload.mockResolvedValue({ public_id: 'beach' });
	mockLinks.served.clear();
	mockLinks.requested.length = 0;
	mockLinks.served.set(link, { body: PNG, type: 'image/png' });
});

describe.each(['uploadAsset', 'uploadFileAutoDetect'])(
	'%s takes the file as FileInput',
	(key) => {
		it('passes a link through for Cloudinary to fetch, without downloading it', async () => {
			await endpoint(key)(makeCtx(), { file: link, public_id: 'beach' });

			expect(mockUpload).toHaveBeenCalledWith(
				'/upload',
				expect.any(Object),
				key === 'uploadAsset' ? 'image' : 'auto',
				expect.objectContaining({ method: 'POST', bodyKind: 'multipart' }),
			);
			expect(sentUpload().body).toEqual({ file: link, public_id: 'beach' });
			expect(mockLinks.requested).toEqual([]);
		});

		it('passes {url} through as the URL, and a data URI as given', async () => {
			await endpoint(key)(makeCtx(), {
				file: { url: link, filename: 'beach.png' },
			});
			expect(sentUpload().body.file).toBe(link);

			const dataUri = `data:image/png;base64,${Buffer.from(PNG).toString('base64')}`;
			await endpoint(key)(makeCtx(), { file: dataUri });
			expect(sentUpload().body.file).toBe(dataUri);
			expect(mockLinks.requested).toEqual([]);
		});

		it('decodes {base64, filename, contentType} into a multipart file', async () => {
			await endpoint(key)(makeCtx(), {
				file: {
					base64: Buffer.from(PNG).toString('base64'),
					filename: 'beach.png',
					contentType: 'image/png',
				},
			});

			const file = sentUpload().body.file as File;
			expect(file).toBeInstanceOf(File);
			expect(file.name).toBe('beach.png');
			expect(file.type).toBe('image/png');
			expect(new Uint8Array(await file.arrayBuffer())).toEqual(PNG);
		});

		it('still sends a Blob and a Buffer as they were given', async () => {
			const blob = new Blob([PNG], { type: 'image/png' });
			await endpoint(key)(makeCtx(), { file: blob });
			expect(sentUpload().body.file).toBe(blob);

			const buffer = Buffer.from(PNG);
			await endpoint(key)(makeCtx(), { file: buffer });
			expect(sentUpload().body.file).toBe(buffer);
		});
	},
);

describe('uploadChunk needs the chunk bytes', () => {
	const chunkInput = {
		content_range: 'bytes 0-7/8',
		x_unique_upload_id: 'unique-upload-id',
	};

	it('downloads a link and sends its bytes with the Content-Range header', async () => {
		await endpoint('uploadChunk')(makeCtx(), { ...chunkInput, file: link });

		expect(mockLinks.requested).toEqual([link]);
		const sent = sentUpload();
		const file = sent.body.file as File;
		expect(file).toBeInstanceOf(File);
		expect(file.name).toBe('beach.png');
		expect(file.type).toBe('image/png');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PNG);
		expect(sent.headers).toEqual({
			'Content-Range': 'bytes 0-7/8',
			'X-Unique-Upload-Id': 'unique-upload-id',
		});
	});

	it('decodes {base64} and still sends a Blob as given', async () => {
		await endpoint('uploadChunk')(makeCtx(), {
			...chunkInput,
			file: { base64: Buffer.from(PNG).toString('base64') },
		});
		expect(
			new Uint8Array(await (sentUpload().body.file as File).arrayBuffer()),
		).toEqual(PNG);

		const blob = new Blob([PNG]);
		await endpoint('uploadChunk')(makeCtx(), { ...chunkInput, file: blob });
		expect(sentUpload().body.file).toBe(blob);
	});

	it('refuses a private address before any Cloudinary request', async () => {
		await expect(
			endpoint('uploadChunk')(makeCtx(), {
				...chunkInput,
				file: 'https://127.0.0.1/chunk.bin',
			}),
		).rejects.toThrow(/file URL/);
		expect(mockUpload).not.toHaveBeenCalled();
	});
});

describe('file shapes', () => {
	it('refuses an object that is not a file before any request', async () => {
		await expect(
			endpoint('uploadAsset')(makeCtx(), { file: { path: '/tmp/a.png' } }),
		).rejects.toThrow(/file must be a URL/);
		expect(mockUpload).not.toHaveBeenCalled();
	});

	it('the input schema takes a link, {url}, {base64} or a Blob', () => {
		const schema = CloudinaryEndpointInputSchemas.uploadAsset;
		for (const file of [
			link,
			{ url: link },
			{ base64: 'iVBORw0KGgo=', filename: 'a.png' },
			new Blob(['x']),
		]) {
			expect(schema?.safeParse({ file }).success).toBe(true);
		}
		expect(schema?.safeParse({ file: { path: '/tmp/a.png' } }).success).toBe(
			false,
		);
	});
});
