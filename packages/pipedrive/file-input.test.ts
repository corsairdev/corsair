import * as client from './client';
import { Products } from './endpoints';
import { PipedriveEndpointInputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});
jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePipedriveRequest: jest.fn() };
});
// The real resolveFileInput, with links served from memory instead of the network.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		// unknown: a pass-through to the real resolveFileInput, which checks its own arguments.
		resolveFileInput: (input: unknown, options: unknown, deps?: unknown) =>
			actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
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

const mockedRequest = jest.mocked(client.makePipedriveRequest);
// unknown: the image endpoints read only ctx.key and ctx.options here.
const ctx = {
	key: 'test-api-token',
	options: { authType: 'api_key' },
} as unknown as Parameters<typeof Products.images.upload>[0];

// A PNG signature, then a byte that is not valid UTF-8.
const PNG = new Uint8Array([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0xff,
]);

/** The image part of the last request, with the method it went out with. */
function sent(): { method: unknown; url: unknown; image: File } {
	const call = mockedRequest.mock.calls.at(-1);
	const body = call?.[3]?.body;
	if (!(body instanceof FormData)) throw new Error('Expected multipart body');
	const image = body.get('data');
	if (!(image instanceof File)) throw new Error('Expected an image part');
	return { method: call?.[3]?.method, url: call?.[0], image };
}

describe('Pipedrive product images take a link, base64 or a Blob', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedRequest.mockResolvedValue({
			success: true,
			data: { id: 54, product_id: 52 },
		});
		mockLinks.served.clear();
	});

	it.each(['upload', 'update'] as const)(
		'%s downloads a link and sends it as the data part, named from the link',
		async (action) => {
			mockLinks.served.set('https://cdn.example.com/catalog/shoe.webp', {
				body: PNG,
				type: 'image/webp',
			});
			await Products.images[action](ctx, {
				id: 52,
				data: 'https://cdn.example.com/catalog/shoe.webp',
			});
			const { method, url, image } = sent();
			expect(url).toBe('/products/52/images');
			expect(method).toBe(action === 'upload' ? 'POST' : 'PUT');
			expect(image.name).toBe('shoe.webp');
			expect(image.type).toBe('image/webp');
			expect(new Uint8Array(await image.arrayBuffer())).toEqual(PNG);
		},
	);

	it('names a link without an extension from its type, and file_name still wins', async () => {
		mockLinks.served.set('https://cdn.example.com/download?id=7', {
			body: PNG,
			type: 'image/jpeg',
		});
		await Products.images.upload(ctx, {
			id: 52,
			data: { url: 'https://cdn.example.com/download?id=7' },
		});
		expect(sent().image.name).toBe('image.jpg');
		await Products.images.upload(ctx, {
			id: 52,
			data: { url: 'https://cdn.example.com/download?id=7' },
			file_name: 'boot.jpeg',
		});
		expect(sent().image.name).toBe('boot.jpeg');
	});

	it.each(['upload', 'update'] as const)(
		'%s decodes {base64, filename, contentType} into the data part',
		async (action) => {
			await Products.images[action](ctx, {
				id: 52,
				data: {
					base64: Buffer.from(PNG).toString('base64'),
					filename: 'logo.png',
					contentType: 'image/png',
				},
			});
			const { image } = sent();
			expect(image.name).toBe('logo.png');
			expect(image.type).toBe('image/png');
			expect(new Uint8Array(await image.arrayBuffer())).toEqual(PNG);
		},
	);

	it('still sends a Blob as before, named from its type', async () => {
		const blob = new Blob([PNG], { type: 'image/png' });
		await Products.images.upload(ctx, { id: 52, data: blob });
		const { image } = sent();
		expect(image.name).toBe('image.png');
		expect(image.type).toBe('image/png');
		expect(new Uint8Array(await image.arrayBuffer())).toEqual(PNG);
	});

	it('refuses a private address before any Pipedrive request', async () => {
		for (const data of [
			'https://127.0.0.1/x.png',
			'http://169.254.169.254/latest/meta-data/',
			'file:///etc/passwd',
		]) {
			await expect(
				Products.images.upload(ctx, { id: 52, data }),
			).rejects.toThrow(/file URL/);
		}
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts the file forms in the image schemas and refuses other values', () => {
		for (const schema of [
			PipedriveEndpointInputSchemas.productImageUpload,
			PipedriveEndpointInputSchemas.productImageUpdate,
		]) {
			for (const data of [
				'https://cdn.example.com/a.png',
				'fil_abc123',
				{ url: 'https://cdn.example.com/a.png', contentType: 'image/png' },
				{ base64: 'iVBORw0KGgo=', filename: 'a.png' },
				new Blob(['x'], { type: 'image/png' }),
			]) {
				expect(schema.safeParse({ id: 52, data }).success).toBe(true);
			}
			for (const data of [undefined, '', 42, { path: '/tmp/a.png' }]) {
				expect(schema.safeParse({ id: 52, data }).success).toBe(false);
			}
		}
	});
});
