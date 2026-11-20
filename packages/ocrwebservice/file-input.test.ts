import { makeOcrWebServicePostRequest } from './client';
import { recognize } from './endpoints/process-document';
import { RecognizeInputSchema } from './endpoints/types';
import type { OcrWebServiceContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client') as typeof import('./client');
	return { ...actual, makeOcrWebServicePostRequest: jest.fn() };
});

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
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

const mockPost = jest.mocked(makeOcrWebServicePostRequest);

// unknown: recognize reads only ctx.key, not a full plugin context.
const ctx = {
	key: 'test-user:test-license',
	options: {},
} as unknown as OcrWebServiceContext;

const PDF = new TextEncoder().encode('%PDF-1.4 scanned invoice');

function sentBody(): Blob {
	const options = mockPost.mock.calls.at(-1)?.[2] as { body: Blob };
	return options.body;
}

describe('ocr.recognize file input', () => {
	beforeEach(() => {
		mockPost.mockReset();
		mockPost.mockResolvedValue({ ErrorMessage: null, OCRText: [['ok']] });
		mockLinks.served.clear();
	});

	it('downloads a link and sends its bytes as the request body with its type', async () => {
		mockLinks.served.set('https://files.example.com/invoice.pdf', {
			body: PDF,
			type: 'application/pdf',
		});

		await recognize(ctx, {
			file: 'https://files.example.com/invoice.pdf',
			language: 'english',
			gettext: true,
		});

		expect(mockPost).toHaveBeenCalledTimes(1);
		expect(mockPost.mock.calls[0]?.[0]).toBe('/restservices/processDocument');
		const body = sentBody();
		expect(body).toBeInstanceOf(File);
		expect((body as File).name).toBe('invoice.pdf');
		expect(body.type).toBe('application/pdf');
		expect(new Uint8Array(await body.arrayBuffer())).toEqual(PDF);
	});

	it('takes {url, filename, contentType} over what the server states', async () => {
		mockLinks.served.set('https://files.example.com/get?id=1', {
			body: PDF,
			type: 'application/octet-stream',
		});

		await recognize(ctx, {
			file: {
				url: 'https://files.example.com/get?id=1',
				filename: 'scan.pdf',
				contentType: 'application/pdf',
			},
			language: 'english',
			gettext: true,
		});

		const body = sentBody() as File;
		expect(body.name).toBe('scan.pdf');
		expect(body.type).toBe('application/pdf');
	});

	it('decodes {base64, filename, contentType} into the request body', async () => {
		await recognize(ctx, {
			file: {
				base64: Buffer.from(PDF).toString('base64'),
				filename: 'scan.pdf',
				contentType: 'application/pdf',
			},
			language: 'english',
			gettext: true,
		});

		const body = sentBody() as File;
		expect(body.name).toBe('scan.pdf');
		expect(body.type).toBe('application/pdf');
		expect(new Uint8Array(await body.arrayBuffer())).toEqual(PDF);
	});

	it('refuses {base64} over the 25 MB limit before any request', async () => {
		// Core checks the encoded length before decoding, so no 26 MB buffer is built.
		const base64 = 'A'.repeat(Math.ceil((26 * 1024 * 1024 * 4) / 3));
		await expect(
			recognize(ctx, {
				file: { base64, filename: 'big.pdf', contentType: 'application/pdf' },
				language: 'english',
				gettext: true,
			}),
		).rejects.toThrow(/limit|too large|bytes/i);
		expect(mockPost).not.toHaveBeenCalled();
	});

	it('still sends a Blob as it was given', async () => {
		const blob = new Blob([PDF], { type: 'application/pdf' });

		await recognize(ctx, { file: blob, language: 'english', gettext: true });

		expect(sentBody()).toBe(blob);
	});

	it('refuses a private address before any request to OCR Web Service', async () => {
		for (const file of [
			'https://127.0.0.1/scan.pdf',
			'http://169.254.169.254/latest/meta-data/',
		]) {
			await expect(
				recognize(ctx, { file, language: 'english', gettext: true }),
			).rejects.toThrow(/file URL/);
		}
		expect(mockPost).not.toHaveBeenCalled();
	});

	it('accepts a link or base64 in the schema and still refuses an unknown shape', () => {
		for (const file of [
			'https://example.com/a.pdf',
			{ url: 'https://example.com/a', filename: 'a.pdf' },
			{ base64: 'JVBERi0=' },
			new Blob(['x']),
		]) {
			expect(
				RecognizeInputSchema.safeParse({ file, gettext: true }).success,
			).toBe(true);
		}
		expect(
			RecognizeInputSchema.safeParse({ file: { path: '/a' }, gettext: true })
				.success,
		).toBe(false);
	});
});
