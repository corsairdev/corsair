import { download } from './endpoints/files';
import { DropboxEndpointOutputSchemas } from './endpoints/types';
import type { DropboxContext } from './index';

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
const asked: Array<{ url: string; headers: Headers }> = [];

function serve(body: Uint8Array, contentType: string) {
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		asked.push({ url: String(url), headers: new Headers(init?.headers) });
		return new Response(body, {
			status: 200,
			headers: { 'Content-Type': contentType },
		});
	}) as unknown as typeof fetch;
}

// unknown: the endpoint reads only ctx.key here, not a full plugin context.
const ctx = { key: 'test-token' } as unknown as DropboxContext;

afterEach(() => {
	global.fetch = originalFetch;
	asked.length = 0;
});

describe('dropbox files.download', () => {
	it('returns a binary file byte for byte, named from its path', async () => {
		serve(PDF, 'application/octet-stream');
		const out = await download(ctx, { path: '/Reports/q3.pdf' });
		expect(out).toEqual({
			contentBase64: Buffer.from(PDF).toString('base64'),
			contentType: 'application/octet-stream',
			byteLength: PDF.byteLength,
			filename: 'q3.pdf',
		});
		expect(DropboxEndpointOutputSchemas.filesDownload.parse(out)).toEqual(out);
	});

	it('sends the path in Dropbox-API-Arg to the content host', async () => {
		serve(PDF, 'application/octet-stream');
		await download(ctx, { path: '/Reports/q3.pdf' });
		const [call] = asked;
		expect(call?.url).toBe('https://content.dropboxapi.com/2/files/download');
		expect(call?.headers.get('Dropbox-API-Arg')).toBe(
			JSON.stringify({ path: '/Reports/q3.pdf' }),
		);
	});

	it('returns a text file as text, and names no file for an id reference', async () => {
		serve(new TextEncoder().encode('a,b\n1,2\n'), 'text/csv');
		const out = await download(ctx, { path: 'id:a4ayc_80_OEAAAAAAAAAXw' });
		expect(out.text).toBe('a,b\n1,2\n');
		expect(out.filename).toBeUndefined();
	});
});
