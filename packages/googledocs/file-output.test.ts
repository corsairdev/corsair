import { FILE_OUTPUT_MAX_BYTES, setFileSink } from 'corsair/http';
import { exportDocumentAsPdf } from './endpoints/documents';
import { GoogleDocsEndpointOutputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0xff, 0xfe, 0x00]);
const originalFetch = global.fetch;

function serve(pdf: Uint8Array, name: string | null) {
	// unknown: the stub answers the export and the name lookup by URL only; it is not a full fetch.
	global.fetch = (async (url: unknown) => {
		const u = String(url);
		if (u.includes('/export?')) {
			return new Response(pdf, {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			});
		}
		if (name === null) return new Response('{}', { status: 500 });
		return Response.json({ name });
	}) as unknown as typeof fetch;
}

// unknown: the endpoint reads only ctx.key here, not a full plugin context.
const ctx = { key: 'test-token' } as unknown as Parameters<
	typeof exportDocumentAsPdf
>[0];

afterEach(() => {
	global.fetch = originalFetch;
	setFileSink(() => undefined);
});

describe('googledocs documents.exportDocumentAsPdf', () => {
	it('returns the PDF as data with its type, size and the document name', async () => {
		serve(PDF, 'Q3 plan');
		const out = await exportDocumentAsPdf(ctx, { fileId: 'doc-1' });
		expect(out).toEqual({
			mimeType: 'application/pdf',
			contentType: 'application/pdf',
			byteLength: PDF.byteLength,
			filename: 'Q3 plan.pdf',
			data: Buffer.from(PDF).toString('base64'),
		});
		expect(
			GoogleDocsEndpointOutputSchemas.exportDocumentAsPdf.parse(out),
		).toEqual(out);
	});

	it('names the file after the id when the name cannot be read', async () => {
		serve(PDF, null);
		const out = await exportDocumentAsPdf(ctx, { fileId: 'doc-1' });
		expect(out.filename).toBe('doc-1.pdf');
		expect(out.data).toBe(Buffer.from(PDF).toString('base64'));
	});

	it('hands a host that keeps files a large PDF, which comes back as its fileId', async () => {
		const big = new Uint8Array(FILE_OUTPUT_MAX_BYTES + 1).fill(7);
		serve(big, 'Q3 plan');
		const held: string[] = [];
		setFileSink(() => (file) => {
			held.push(file.filename ?? '');
			return 'held_1';
		});
		const out = await exportDocumentAsPdf(ctx, { fileId: 'doc-1' });
		expect(out).toEqual({
			mimeType: 'application/pdf',
			contentType: 'application/pdf',
			byteLength: big.byteLength,
			filename: 'Q3 plan.pdf',
			fileId: 'held_1',
		});
		expect(held).toEqual(['Q3 plan.pdf']);
	});
});
