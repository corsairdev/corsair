import { textItEndpointsNested } from './endpoints';
import { TextItEndpointInputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

// The real resolveFileInput, with its download served from mockLinks instead
// of the network: the guarded fetch, size cap and naming all still run.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual(
		'corsair/http',
	) as typeof import('corsair/http');
	return {
		...actual,
		resolveFileInput: (
			input: Parameters<typeof actual.resolveFileInput>[0],
			options: Parameters<typeof actual.resolveFileInput>[1],
			deps?: Parameters<typeof actual.resolveFileInput>[2],
		) => actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
	};
});

const mockLinks = {
	served: new Map<string, { body: Uint8Array; type: string }>(),
	deps: {
		resolve: async () => ['93.184.216.34'],
		transport: async (url: URL) => {
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

const ctx = { key: 'test-token' } as never;
const upload = textItEndpointsNested.media.upload as (
	ctx: never,
	input: unknown,
) => Promise<unknown>;

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
const UPLOADED = {
	uuid: 'media',
	content_type: 'image/jpeg',
	url: 'https://example.com/photo.jpg',
	filename: 'photo.jpg',
	size: 8,
};

let fetchMock: jest.SpyInstance;

function sentForm(): FormData {
	const [url, request] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	expect(url).toBe('https://textit.com/api/v2/media.json');
	expect(request.method).toBe('POST');
	expect(request.body).toBeInstanceOf(FormData);
	return request.body as FormData;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	fetchMock.mockResolvedValue(
		new Response(JSON.stringify(UPLOADED), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
	mockLinks.served.clear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('media.upload file input', () => {
	it('downloads a link and uploads it as the file part with its name and type', async () => {
		mockLinks.served.set('https://files.example.com/photos/photo.jpg', {
			body: JPEG,
			type: 'image/jpeg',
		});

		await expect(
			upload(ctx, { file: 'https://files.example.com/photos/photo.jpg' }),
		).resolves.toEqual(UPLOADED);

		const file = sentForm().get('file') as File;
		expect(file).toBeInstanceOf(File);
		expect(file.name).toBe('photo.jpg');
		expect(file.type).toBe('image/jpeg');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(JPEG);
	});

	it('decodes {base64, filename, contentType} into the file part', async () => {
		await upload(ctx, {
			file: {
				base64: Buffer.from(JPEG).toString('base64'),
				filename: 'photo.jpg',
				contentType: 'image/jpeg',
			},
		});

		const file = sentForm().get('file') as File;
		expect(file.name).toBe('photo.jpg');
		expect(file.type).toBe('image/jpeg');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(JPEG);
	});

	it('still sends a Blob as it was given', async () => {
		const blob = new Blob([JPEG], { type: 'image/jpeg' });

		await upload(ctx, { file: blob });

		const file = sentForm().get('file') as Blob;
		expect(file.type).toBe('image/jpeg');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(JPEG);
	});

	it('refuses a private address before any request to TextIt', async () => {
		for (const file of [
			'https://127.0.0.1/photo.jpg',
			'http://169.254.169.254/latest/meta-data/',
		]) {
			await expect(upload(ctx, { file })).rejects.toThrow(/file URL/);
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a link, {url} or {base64} in the schema and refuses an unknown shape', () => {
		const schema = TextItEndpointInputSchemas.mediaUpload;
		for (const file of [
			'https://example.com/photo.jpg',
			{ url: 'https://example.com/p', filename: 'photo.jpg' },
			{ base64: '/9j/4A==', contentType: 'image/jpeg' },
			new Blob(['x']),
		]) {
			expect(schema.safeParse({ file }).success).toBe(true);
		}
		expect(schema.safeParse({ file: { path: '/tmp/a' } }).success).toBe(false);
		expect(schema.safeParse({}).success).toBe(false);
	});
});
