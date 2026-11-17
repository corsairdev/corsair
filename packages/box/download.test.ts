import { download } from './endpoints/files';
import { BoxEndpointOutputSchemas } from './endpoints/types';
import type { BoxContext } from './index';

// Only logEventFromContext is used by the download path; loading the real
// module pulls in core's ESM build, which this package's Jest can't parse.
jest.mock('corsair/core', () => ({ logEventFromContext: jest.fn() }));

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
const ctx = { key: 'test-token' } as unknown as BoxContext;

afterEach(() => {
	global.fetch = originalFetch;
	asked.length = 0;
});

describe('box files.download', () => {
	it('returns a binary file byte for byte, as base64', async () => {
		serve(PDF, 'application/pdf');
		const out = await download(ctx, { file_id: '123', version: '9' });
		expect(out).toEqual({
			contentBase64: Buffer.from(PDF).toString('base64'),
			contentType: 'application/pdf',
			byteLength: PDF.byteLength,
		});
		expect(BoxEndpointOutputSchemas.filesDownload.parse(out)).toEqual(out);
		expect(asked[0]).toBe(
			'https://api.box.com/2.0/files/123/content?version=9',
		);
	});

	it('returns a text file as text', async () => {
		serve(new TextEncoder().encode('# Notes\n'), 'text/markdown');
		const out = await download(ctx, { file_id: '124' });
		expect(out.text).toBe('# Notes\n');
	});
});
