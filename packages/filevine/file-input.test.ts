import { request } from 'corsair/http';
import * as Documents from './endpoints/documents';
import { UploadProjectDocumentInputSchema } from './endpoints/types';

// The shared request is stubbed; resolveFileInput is the real one, with links
// served from memory instead of the network.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
		resolveFileInput: (input: unknown, options: unknown, deps?: unknown) =>
			actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
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

const mockRequest = request as jest.Mock;

function createMockCtx() {
	return {
		key: 'test-token',
		db: {
			documents: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
		},
	} as unknown as Parameters<typeof Documents.upload>[0];
}

const PDF = Buffer.from('%PDF-1.4 engagement letter');
const link = 'https://files.example.com/matters/engagement-letter.pdf';

function sentDocumentPart(): File {
	const call = mockRequest.mock.calls.find(
		([, options]) => options?.url === '/fv-app/v2/Documents',
	);
	return (call?.[1]?.formData as Record<string, unknown>).file as File;
}

beforeEach(() => {
	jest.clearAllMocks();
	mockRequest.mockResolvedValue({
		documentId: 201,
		filename: 'engagement-letter.pdf',
		projectId: 1,
	});
	mockLinks.served.clear();
	mockLinks.requested.length = 0;
	mockLinks.served.set(link, {
		body: new Uint8Array(PDF),
		type: 'application/pdf',
	});
});

describe('documents.upload takes the file as FileInput', () => {
	it('downloads a link and sends it as the multipart file part', async () => {
		await Documents.upload(createMockCtx(), { projectId: 1, file: link });

		expect(mockLinks.requested).toEqual([link]);
		const part = sentDocumentPart();
		expect(part).toBeInstanceOf(File);
		expect(part.name).toBe('engagement-letter.pdf');
		expect(part.type).toBe('application/pdf');
		expect(Buffer.from(await part.arrayBuffer())).toEqual(PDF);
	});

	it('downloads {url, filename} and keeps the given name', async () => {
		await Documents.upload(createMockCtx(), {
			projectId: 1,
			file: { url: link, filename: 'letter.pdf' },
		});

		const part = sentDocumentPart();
		expect(part.name).toBe('letter.pdf');
		expect(Buffer.from(await part.arrayBuffer())).toEqual(PDF);
	});

	it('decodes {base64, filename, contentType} into the file part', async () => {
		await Documents.upload(createMockCtx(), {
			projectId: 1,
			file: {
				base64: PDF.toString('base64'),
				filename: 'letter.pdf',
				contentType: 'application/pdf',
			},
		});

		const part = sentDocumentPart();
		expect(part.name).toBe('letter.pdf');
		expect(part.type).toBe('application/pdf');
		expect(Buffer.from(await part.arrayBuffer())).toEqual(PDF);
		expect(mockLinks.requested).toEqual([]);
	});

	it('still sends a Blob as it was given', async () => {
		const blob = new Blob([PDF], { type: 'application/pdf' });

		await Documents.upload(createMockCtx(), { projectId: 1, file: blob });

		expect(sentDocumentPart()).toBe(blob);
	});

	it('uploads a link-shaped string as text when fileEncoding is set', async () => {
		await Documents.upload(createMockCtx(), {
			projectId: 1,
			filename: 'bookmark.txt',
			file: link,
			fileEncoding: 'text',
		});

		expect(mockLinks.requested).toEqual([]);
		expect(await sentDocumentPart().text()).toBe(link);
	});

	it('refuses a private address before any Filevine request', async () => {
		await expect(
			Documents.upload(createMockCtx(), {
				projectId: 1,
				file: 'https://127.0.0.1/letter.pdf',
			}),
		).rejects.toThrow(/file URL/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refuses an object that is not a file before any Filevine request', async () => {
		await expect(
			Documents.upload(createMockCtx(), {
				projectId: 1,
				// unknown: an untyped caller can send any object.
				file: { path: '/tmp/a.pdf' } as unknown as Blob,
			}),
		).rejects.toThrow(/must be a link/);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('documents.upload input schema', () => {
	it('accepts a link, {url} and {base64} beside the binary forms', () => {
		for (const file of [
			link,
			{ url: link },
			{ base64: PDF.toString('base64'), filename: 'a.pdf' },
			new Blob(['x']),
			new Uint8Array([1]),
			new ArrayBuffer(1),
		]) {
			expect(
				UploadProjectDocumentInputSchema.safeParse({ projectId: 1, file })
					.success,
			).toBe(true);
		}
		expect(
			UploadProjectDocumentInputSchema.safeParse({
				projectId: 1,
				file: { path: '/tmp/a.pdf' },
			}).success,
		).toBe(false);
	});
});
