import * as client from './client';
import { Files } from './endpoints';
import type { ConversiontoolsContext } from './index';
import { DEFAULT_TRANSFER_TIMEOUT_MS } from './limits';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeConversiontoolsRequest: jest.fn() };
});

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

const mockedRequest = jest.mocked(client.makeConversiontoolsRequest);

// unknown: the file endpoints read only ctx.key and ctx.options here.
const ctx = {
	key: 'test-api-key',
	options: {},
} as unknown as ConversiontoolsContext;
const FILE_ID = '0123456789abcdef0123456789abcdef';
const uploadUrl =
	'https://api.conversiontools.io/v1/upload-sessions/session-id';
const xml = '<rows><row id="1"/></rows>';
const link = 'https://files.example.com/exports/rows.xml';

beforeEach(() => {
	mockedRequest.mockReset();
	mockLinks.served.clear();
	mockLinks.requested.length = 0;
	mockLinks.served.set(link, {
		body: new TextEncoder().encode(xml),
		type: 'application/xml',
	});
});

function sentMultipartFile(): File {
	const options = mockedRequest.mock.calls.at(-1)?.[2] as {
		formData: { file: File };
	};
	return options.formData.file;
}

function sentSessionBody(): File {
	const options = mockedRequest.mock.calls.at(-1)?.[2] as { body: File };
	return options.body;
}

describe('files.upload takes the file as FileInput', () => {
	beforeEach(() => {
		mockedRequest.mockResolvedValue({ error: null, file_id: FILE_ID });
	});

	it('downloads a link and sends it as the multipart file field', async () => {
		await expect(Files.upload(ctx, { file: link })).resolves.toEqual({
			error: null,
			file_id: FILE_ID,
		});

		expect(mockLinks.requested).toEqual([link]);
		expect(mockedRequest).toHaveBeenCalledWith('/files', 'test-api-key', {
			method: 'POST',
			formData: { file: expect.any(File) },
			timeoutMs: DEFAULT_TRANSFER_TIMEOUT_MS,
		});
		const file = sentMultipartFile();
		expect(file.name).toBe('rows.xml');
		expect(file.type).toBe('application/xml');
		expect(await file.text()).toBe(xml);
	});

	it('decodes {base64, filename, contentType} into the file field', async () => {
		await Files.upload(ctx, {
			file: {
				base64: Buffer.from(xml).toString('base64'),
				filename: 'input.xml',
				contentType: 'application/xml',
			},
		});

		const file = sentMultipartFile();
		expect(file.name).toBe('input.xml');
		expect(file.type).toBe('application/xml');
		expect(await file.text()).toBe(xml);
		expect(mockLinks.requested).toEqual([]);
	});

	it('still sends a Blob as it was given', async () => {
		const file = new Blob([xml], { type: 'application/xml' });

		await Files.upload(ctx, { file });

		expect(sentMultipartFile()).toBe(file);
	});

	it('refuses a private address or a bare file name before any request', async () => {
		for (const file of ['https://127.0.0.1/rows.xml', 'input.xml']) {
			await expect(Files.upload(ctx, { file })).rejects.toThrow();
		}
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockLinks.requested).toEqual([]);
	});
});

describe('files.uploadToSession takes the file as FileInput', () => {
	beforeEach(() => {
		mockedRequest.mockResolvedValue({
			file_id: FILE_ID,
			filename: 'rows.xml',
			size: xml.length,
		});
	});

	it('downloads a link and PUTs its bytes to the session URL', async () => {
		await Files.uploadToSession(ctx, { upload_url: uploadUrl, file: link });

		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/upload-sessions/session-id',
			undefined,
			{
				method: 'PUT',
				body: expect.any(File),
				baseUrl: 'https://api.conversiontools.io',
				timeoutMs: DEFAULT_TRANSFER_TIMEOUT_MS,
			},
		);
		const body = sentSessionBody();
		expect(body.name).toBe('rows.xml');
		expect(body.type).toBe('application/xml');
		expect(await body.text()).toBe(xml);
	});

	it('decodes {base64, filename, contentType} into the session body', async () => {
		await Files.uploadToSession(ctx, {
			upload_url: uploadUrl,
			file: {
				base64: Buffer.from(xml).toString('base64'),
				filename: 'input.xml',
				contentType: 'application/xml',
			},
		});

		const body = sentSessionBody();
		expect(body.name).toBe('input.xml');
		expect(await body.text()).toBe(xml);
	});

	it('still PUTs a Blob as it was given', async () => {
		const file = new Blob([xml]);

		await Files.uploadToSession(ctx, { upload_url: uploadUrl, file });

		expect(sentSessionBody()).toBe(file);
	});

	it('fetches nothing when the session URL is not the provider’s', async () => {
		await expect(
			Files.uploadToSession(ctx, {
				upload_url: 'https://example.com/v1/upload-sessions/session-id',
				file: link,
			}),
		).rejects.toThrow('Invalid Conversion Tools upload session URL');
		expect(mockLinks.requested).toEqual([]);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('refuses a private address before the PUT', async () => {
		await expect(
			Files.uploadToSession(ctx, {
				upload_url: uploadUrl,
				file: 'https://169.254.169.254/latest/meta-data/',
			}),
		).rejects.toThrow(/file URL/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
