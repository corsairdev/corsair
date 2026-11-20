import { makeOcrSpacePostRequest } from './client';
import { Ocr } from './endpoints';
import { OcrSpaceEndpointInputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => {
	const actual = jest.requireActual('./client') as typeof import('./client');
	return { ...actual, makeOcrSpacePostRequest: jest.fn() };
});

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

const mockPost = jest.mocked(makeOcrSpacePostRequest);

const SUCCESS = {
	ParsedResults: [{ ParsedText: 'Invoice 42', FileParseExitCode: 1 }],
	OCRExitCode: 1,
	IsErroredOnProcessing: false,
};

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;
const parse = Ocr.parse as AnyEndpoint;

function createContext() {
	return {
		key: 'test-key',
		options: {},
		db: {
			ocrResults: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
		},
	};
}

function sentFile(): Blob {
	const options = mockPost.mock.calls.at(-1)?.[2] as {
		formData: Record<string, unknown>;
	};
	return options.formData.file as Blob;
}

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe('ocr.parse file input', () => {
	beforeEach(() => {
		mockPost.mockReset();
		mockPost.mockResolvedValue(SUCCESS);
		mockLinks.served.clear();
	});

	it('downloads a link and uploads it as the file part with its name and type', async () => {
		mockLinks.served.set('https://files.example.com/scans/receipt.png', {
			body: PNG,
			type: 'image/png',
		});

		await parse(createContext(), {
			file: 'https://files.example.com/scans/receipt.png',
		});

		expect(mockPost).toHaveBeenCalledTimes(1);
		expect(mockPost.mock.calls[0]?.[0]).toBe('/parse/image');
		const file = sentFile();
		expect(file).toBeInstanceOf(File);
		expect((file as File).name).toBe('receipt.png');
		expect(file.type).toBe('image/png');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PNG);
	});

	it('takes {url, filename, contentType} and names the part from them', async () => {
		mockLinks.served.set('https://files.example.com/download?id=7', {
			body: PNG,
			type: 'application/octet-stream',
		});

		await parse(createContext(), {
			file: {
				url: 'https://files.example.com/download?id=7',
				filename: 'page.png',
				contentType: 'image/png',
			},
		});

		const file = sentFile() as File;
		expect(file.name).toBe('page.png');
		expect(file.type).toBe('image/png');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PNG);
	});

	it('decodes {base64, filename, contentType} into the file part', async () => {
		await parse(createContext(), {
			file: {
				base64: Buffer.from(PNG).toString('base64'),
				filename: 'scan.png',
				contentType: 'image/png',
			},
		});

		const file = sentFile() as File;
		expect(file.name).toBe('scan.png');
		expect(file.type).toBe('image/png');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PNG);
	});

	it('still sends a Blob as it was given', async () => {
		const blob = new Blob([PNG], { type: 'image/png' });

		await parse(createContext(), { file: blob });

		expect(sentFile()).toBe(blob);
	});

	it('needs filetype when a link says nothing about what the file is', async () => {
		mockLinks.served.set('https://files.example.com/download', {
			body: PNG,
			type: 'application/octet-stream',
		});

		await expect(
			parse(createContext(), { file: 'https://files.example.com/download' }),
		).rejects.toThrow(/Set filetype/);
		expect(mockPost).not.toHaveBeenCalled();

		await parse(createContext(), {
			file: 'https://files.example.com/download',
			filetype: 'PNG',
		});
		expect(mockPost).toHaveBeenCalledTimes(1);
		expect(new Uint8Array(await sentFile().arrayBuffer())).toEqual(PNG);
	});

	it("keeps the file's name out of the filetype error", async () => {
		mockLinks.served.set('https://files.example.com/Jane_Doe_record', {
			body: PNG,
			type: 'application/octet-stream',
		});
		const error = await parse(createContext(), {
			file: {
				url: 'https://files.example.com/Jane_Doe_record',
				filename: 'Jane_Doe_record',
			},
		}).catch((e: Error) => e);
		expect(String(error)).toMatch(/Set filetype/);
		expect(String(error)).not.toMatch(/Jane_Doe/);

		// A name tucked into the media type stays out of it too.
		const typed = await parse(createContext(), {
			file: {
				url: 'https://files.example.com/Jane_Doe_record',
				contentType: 'application/octet-stream; name=Jane_Doe_record',
			},
		}).catch((e: Error) => e);
		expect(String(typed)).toMatch(/Set filetype/);
		expect(String(typed)).not.toMatch(/Jane_Doe/);
	});

	it('refuses a private address before any request to OCR.space', async () => {
		for (const file of [
			'https://127.0.0.1/scan.png',
			'http://169.254.169.254/latest/meta-data/',
		]) {
			await expect(parse(createContext(), { file })).rejects.toThrow(
				/file URL/,
			);
		}
		expect(mockPost).not.toHaveBeenCalled();
	});

	it('still takes only one of url, file and base64Image', async () => {
		await expect(
			parse(createContext(), {
				url: 'https://example.com/a.png',
				file: 'https://files.example.com/a.png',
			}),
		).rejects.toThrow(/exactly one/);
		expect(mockPost).not.toHaveBeenCalled();
	});

	it('accepts a link, {url} or {base64} as the file in the schema, which is what an agent can send', () => {
		for (const file of [
			'https://example.com/scan.png',
			{ url: 'https://example.com/scan', filename: 'scan.png' },
			{ base64: 'iVBORw0KGgo=', contentType: 'image/png' },
		]) {
			expect(
				OcrSpaceEndpointInputSchemas.parse.safeParse({ file }).success,
			).toBe(true);
		}
		expect(
			OcrSpaceEndpointInputSchemas.parse.safeParse({ file: { path: '/tmp/a' } })
				.success,
		).toBe(false);
		// An untyped Blob is still refused without filetype, as before.
		expect(
			OcrSpaceEndpointInputSchemas.parse.safeParse({ file: new Blob(['x']) })
				.success,
		).toBe(false);
	});
});
