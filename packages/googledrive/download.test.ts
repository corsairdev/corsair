import { download } from './endpoints/files';
import { GoogleDriveEndpointOutputSchemas } from './endpoints/types';
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

const originalFetch = global.fetch;
const asked: string[] = [];

function serve(body: Uint8Array, contentType: string) {
	global.fetch = (async (url: unknown) => {
		asked.push(String(url));
		return new Response(body, {
			status: 200,
			headers: { 'Content-Type': contentType },
		});
	}) as unknown as typeof fetch;
}

// unknown: the endpoint reads only ctx.key here, not a full plugin context.
const ctx = { key: 'test-token' } as unknown as GoogleDriveContext;

afterEach(() => {
	global.fetch = originalFetch;
	asked.length = 0;
});

describe('googledrive files.download', () => {
	it('returns a binary file byte for byte, as base64', async () => {
		serve(PDF, 'application/pdf');
		const out = await download(ctx, { fileId: 'file-1' });
		expect(out).toEqual({
			contentBase64: Buffer.from(PDF).toString('base64'),
			contentType: 'application/pdf',
			byteLength: PDF.byteLength,
		});
		expect(GoogleDriveEndpointOutputSchemas.filesDownload.parse(out)).toEqual(
			out,
		);
		expect(asked[0]).toContain('/drive/v3/files/file-1?');
		expect(asked[0]).toContain('alt=media');
	});

	it('returns a text file as text', async () => {
		serve(new TextEncoder().encode('id,name\n1,Zoë\n'), 'text/csv');
		const out = await download(ctx, { fileId: 'file-2' });
		expect(out.text).toBe('id,name\n1,Zoë\n');
		expect(out.contentBase64).toBeUndefined();
	});
});
