import { download, exportFile } from './endpoints/files';
import {
	GoogleDriveEndpointInputSchemas,
	GoogleDriveEndpointOutputSchemas,
} from './endpoints/types';
import type { GoogleDriveContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

// A PDF header, then bytes that are not valid UTF-8. Read as text, each of
// those would come back as U+FFFD and the file would be lost.
const PDF = new Uint8Array([
	0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0xff, 0xfe, 0x00, 0x80,
	0xc3, 0x28,
]);

const DOC = 'application/vnd.google-apps.document';
const SHEET = 'application/vnd.google-apps.spreadsheet';
const XLSX =
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const originalFetch = global.fetch;
const asked: string[] = [];

/**
 * A Drive that answers the metadata call (fields=name,mimeType) with `meta`,
 * and the content call (alt=media or /export) with `body`.
 */
function serve(
	meta: { name?: string; mimeType?: string },
	body: Uint8Array,
	contentType: string,
) {
	global.fetch = (async (url: unknown) => {
		asked.push(String(url));
		if (String(url).includes('fields=name')) {
			return Response.json(meta);
		}
		return new Response(body, {
			status: 200,
			headers: { 'Content-Type': contentType },
		});
	}) as unknown as typeof fetch;
}

const contentCalls = () => asked.filter((url) => !url.includes('fields=name'));

// unknown: the endpoint reads only ctx.key here, not a full plugin context.
const ctx = { key: 'test-token' } as unknown as GoogleDriveContext;

afterEach(() => {
	global.fetch = originalFetch;
	asked.length = 0;
});

describe('googledrive files.download', () => {
	it('returns a binary file byte for byte, as base64, with its Drive name', async () => {
		serve(
			{ name: 'q3 report.pdf', mimeType: 'application/pdf' },
			PDF,
			'application/pdf',
		);
		const out = await download(ctx, { fileId: 'file-1' });
		expect(out).toEqual({
			contentBase64: Buffer.from(PDF).toString('base64'),
			contentType: 'application/pdf',
			byteLength: PDF.byteLength,
			filename: 'q3 report.pdf',
		});
		expect(GoogleDriveEndpointOutputSchemas.filesDownload.parse(out)).toEqual(
			out,
		);
		expect(contentCalls()[0]).toContain('/drive/v3/files/file-1?');
		expect(contentCalls()[0]).toContain('alt=media');
	});

	it('returns a text file as text', async () => {
		serve(
			{ name: 'people.csv', mimeType: 'text/csv' },
			new TextEncoder().encode('id,name\n1,Zoë\n'),
			'text/csv',
		);
		const out = await download(ctx, { fileId: 'file-2' });
		expect(out.text).toBe('id,name\n1,Zoë\n');
		expect(out.contentBase64).toBeUndefined();
		expect(out.filename).toBe('people.csv');
	});

	it('reads a CSV Drive serves as octet-stream as text, by its name', async () => {
		serve(
			{ name: 'people.csv', mimeType: 'text/csv' },
			new TextEncoder().encode('id\n1\n'),
			'application/octet-stream',
		);
		const out = await download(ctx, { fileId: 'file-3' });
		expect(out.text).toBe('id\n1\n');
	});

	it('refuses a Google Doc before asking Drive for its bytes, and names files.export', async () => {
		serve({ name: 'Plan', mimeType: DOC }, PDF, 'application/pdf');
		await expect(download(ctx, { fileId: 'doc-1' })).rejects.toThrow(
			/files\.export/,
		);
		expect(contentCalls()).toHaveLength(0);
	});

	it('leaves the content out over the limit and still says what the file is', async () => {
		const big = new Uint8Array(700_001);
		serve({ name: 'clip.mp4', mimeType: 'video/mp4' }, big, 'video/mp4');
		const out = await download(ctx, { fileId: 'file-4' });
		expect(out).toEqual({
			contentType: 'video/mp4',
			byteLength: 700_001,
			filename: 'clip.mp4',
			contentOmitted: 'over_limit',
		});
	});
});

describe('googledrive files.export', () => {
	it('exports a Doc as Markdown by default, named after the Doc', async () => {
		serve(
			{ name: 'Launch plan', mimeType: DOC },
			new TextEncoder().encode('# Launch plan\n\nShip it.\n'),
			'text/markdown',
		);
		const out = await exportFile(ctx, { fileId: 'doc-1' });
		expect(out).toEqual({
			text: '# Launch plan\n\nShip it.\n',
			contentType: 'text/markdown',
			byteLength: 24,
			filename: 'Launch plan.md',
		});
		expect(GoogleDriveEndpointOutputSchemas.filesExport.parse(out)).toEqual(
			out,
		);
		expect(contentCalls()[0]).toContain('/drive/v3/files/doc-1/export?');
		expect(contentCalls()[0]).toContain('mimeType=text%2Fmarkdown');
	});

	it('exports a Sheet as CSV by default', async () => {
		serve(
			{ name: 'Q3 numbers', mimeType: SHEET },
			new TextEncoder().encode('a,b\n1,2\n'),
			'text/csv',
		);
		const out = await exportFile(ctx, { fileId: 'sheet-1' });
		expect(out.text).toBe('a,b\n1,2\n');
		expect(out.filename).toBe('Q3 numbers.csv');
		expect(contentCalls()[0]).toContain('mimeType=text%2Fcsv');
	});

	it('exports to the format asked for, as base64 for a binary one', async () => {
		serve({ name: 'Q3 numbers', mimeType: SHEET }, PDF, XLSX);
		const out = await exportFile(ctx, { fileId: 'sheet-1', mimeType: XLSX });
		expect(out.contentBase64).toBe(Buffer.from(PDF).toString('base64'));
		expect(out.contentType).toBe(XLSX);
		expect(out.filename).toBe('Q3 numbers.xlsx');
	});

	it('keeps a name that already ends in the extension', async () => {
		serve(
			{ name: 'notes.md', mimeType: DOC },
			new TextEncoder().encode('x'),
			'text/markdown',
		);
		const out = await exportFile(ctx, { fileId: 'doc-2' });
		expect(out.filename).toBe('notes.md');
	});

	it('refuses a file that is not a Google file and names files.download', async () => {
		serve(
			{ name: 'a.pdf', mimeType: 'application/pdf' },
			PDF,
			'application/pdf',
		);
		await expect(exportFile(ctx, { fileId: 'file-1' })).rejects.toThrow(
			/files\.download/,
		);
		expect(contentCalls()).toHaveLength(0);
	});

	it('refuses a Google type Drive cannot export', async () => {
		serve(
			{ name: 'Survey', mimeType: 'application/vnd.google-apps.form' },
			PDF,
			'application/pdf',
		);
		await expect(exportFile(ctx, { fileId: 'form-1' })).rejects.toThrow(
			/cannot export/,
		);
		expect(contentCalls()).toHaveLength(0);
	});

	it('takes only a fileId and an optional format', () => {
		expect(
			GoogleDriveEndpointInputSchemas.filesExport.parse({ fileId: 'x' }),
		).toEqual({ fileId: 'x' });
		expect(() =>
			GoogleDriveEndpointInputSchemas.filesExport.parse({}),
		).toThrow();
	});
});
