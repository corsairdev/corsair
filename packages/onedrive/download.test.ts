import {
	download,
	downloadAsFormat,
	downloadByPath,
	downloadVersion,
} from './endpoints/items';
import { OnedriveEndpointOutputSchemas } from './endpoints/types';
import type { OnedriveContext } from './index';

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

// unknown: the endpoints read only ctx.key here, not a full plugin context.
const ctx = { key: 'test-token' } as unknown as OnedriveContext;
const BASE = 'https://graph.microsoft.com/v1.0';
const asBase64 = {
	contentBase64: Buffer.from(PDF).toString('base64'),
	contentType: 'application/pdf',
	byteLength: PDF.byteLength,
	filename: 'a.pdf',
};

afterEach(() => {
	global.fetch = originalFetch;
	asked.length = 0;
});

describe('onedrive downloads', () => {
	it('items.download returns a binary file byte for byte', async () => {
		serve(PDF, 'application/pdf');
		const out = await download(ctx, { item_id: 'item-1', file_name: 'a.pdf' });
		expect(out).toEqual(asBase64);
		expect(OnedriveEndpointOutputSchemas.itemsDownload.parse(out)).toEqual(out);
		expect(asked[0]).toBe(`${BASE}/me/drive/items/item-1/content`);
	});

	it('the by-path, converted and version downloads keep the bytes too', async () => {
		serve(PDF, 'application/pdf');
		expect(
			await downloadByPath(ctx, {
				item_path: 'Docs/a.pdf',
				file_name: 'a.pdf',
			}),
		).toEqual(asBase64);
		expect(
			await downloadAsFormat(ctx, {
				path_and_filename: 'Docs/a.docx',
				format: 'pdf',
				file_name: 'a.pdf',
			}),
		).toEqual(asBase64);
		expect(
			await downloadVersion(ctx, {
				item_id: 'item-1',
				version_id: '2.0',
				file_name: 'a.pdf',
			}),
		).toEqual(asBase64);
		expect(asked).toEqual([
			`${BASE}/me/drive/root:/Docs/a.pdf:/content`,
			`${BASE}/me/drive/root:/Docs/a.docx:/content?format=pdf`,
			`${BASE}/me/drive/items/item-1/versions/2.0/content`,
		]);
	});

	it('returns a text file as text, including a CSV served as octet-stream', async () => {
		serve(new TextEncoder().encode('{"ok":true}'), 'application/json');
		const json = await download(ctx, {
			item_id: 'item-2',
			file_name: 'a.json',
		});
		expect(json.text).toBe('{"ok":true}');
		// OneDrive serves a CSV as application/octet-stream; its name makes it text.
		serve(new TextEncoder().encode('a,b\n1,2\n'), 'application/octet-stream');
		const csv = await download(ctx, { item_id: 'item-3', file_name: 'q3.csv' });
		expect(csv).toMatchObject({ text: 'a,b\n1,2\n', filename: 'q3.csv' });
	});
});
