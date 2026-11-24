import { setFileSink } from 'corsair/http';
import { getAttachment } from './messages';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

// Bytes that are not valid UTF-8, so a text round trip would lose them.
const BYTES = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0xff, 0xfe, 0x00, 0x80]);
const b64url = (b: Uint8Array) => Buffer.from(b).toString('base64url');

const message = {
	id: 'm1',
	payload: {
		partId: '',
		mimeType: 'multipart/mixed',
		parts: [
			{ partId: '0', mimeType: 'text/plain', body: { size: 2 } },
			{
				partId: '1',
				mimeType: 'application/pdf',
				filename: 'invoice.pdf',
				body: { attachmentId: 'att-1', size: BYTES.length },
			},
			{
				partId: '2',
				mimeType: 'application/octet-stream',
				filename: 'tiny.bin',
				body: { data: b64url(BYTES), size: BYTES.length },
			},
			{
				partId: '3',
				mimeType: 'text/plain',
				filename: 'empty.txt',
				body: { data: '', size: 0 },
			},
		],
	},
};

const asked: URL[] = [];
const originalFetch = global.fetch;

beforeEach(() => {
	global.fetch = (async (input: string | URL | Request) => {
		const url = new URL(input instanceof Request ? input.url : String(input));
		asked.push(url);
		return Response.json(
			url.pathname.endsWith('/attachments/att-1')
				? { size: BYTES.length, data: b64url(BYTES) }
				: message,
		);
	}) as typeof fetch;
});

afterEach(() => {
	global.fetch = originalFetch;
	asked.length = 0;
	setFileSink(() => undefined);
});

// unknown: the endpoint reads only ctx.key here, not a full plugin context.
const ctx = { key: 'test-token' } as any;
const b64 = Buffer.from(BYTES).toString('base64');

describe('gmail messages.getAttachment', () => {
	it('resolves a partId and returns the file with its name and type', async () => {
		const out = await getAttachment(ctx, { messageId: 'm1', partId: '1' });
		expect(out).toMatchObject({
			filename: 'invoice.pdf',
			contentType: 'application/pdf',
			byteLength: BYTES.length,
			contentBase64: b64,
		});
		expect(asked.map((u) => u.pathname)).toEqual([
			'/gmail/v1/users/me/messages/m1',
			'/gmail/v1/users/me/messages/m1/attachments/att-1',
		]);
		expect(asked[0]?.searchParams.get('format')).toBe('full');
	});

	it('fetches by attachmentId directly, without reading the message', async () => {
		const out = await getAttachment(ctx, {
			messageId: 'm1',
			attachmentId: 'att-1',
		});
		expect(out).toMatchObject({ byteLength: BYTES.length, contentBase64: b64 });
		expect(asked).toHaveLength(1);
	});

	it('reads a small part that carries body.data inline', async () => {
		const out = await getAttachment(ctx, { messageId: 'm1', partId: '2' });
		expect(out).toMatchObject({ filename: 'tiny.bin', contentBase64: b64 });
		expect(asked).toHaveLength(1);
	});

	it('names the part when it does not exist or has no attachment', async () => {
		await expect(
			getAttachment(ctx, { messageId: 'm1', partId: '9' }),
		).rejects.toThrow('no part 9');
		await expect(
			getAttachment(ctx, { messageId: 'm1', partId: '0' }),
		).rejects.toThrow('Part 0 of message m1 has no attachment');
	});

	it('reads the root part of a single-part message, whose partId is empty', async () => {
		const single = {
			id: 'm2',
			payload: {
				partId: '',
				mimeType: 'application/pdf',
				filename: 'scan.pdf',
				body: { data: b64url(BYTES), size: BYTES.length },
			},
		};
		global.fetch = (async () => Response.json(single)) as typeof fetch;
		const out = await getAttachment(ctx, { messageId: 'm2', partId: '' });
		expect(out).toMatchObject({ filename: 'scan.pdf', contentBase64: b64 });
	});

	it('returns an empty inline file as an empty file', async () => {
		const out = await getAttachment(ctx, { messageId: 'm1', partId: '3' });
		expect(out).toMatchObject({ filename: 'empty.txt', byteLength: 0 });
	});

	it('takes the bytes from the named part even when another attachmentId is given', async () => {
		const out = await getAttachment(ctx, {
			messageId: 'm1',
			partId: '1',
			attachmentId: 'att-other',
		});
		expect(out).toMatchObject({ filename: 'invoice.pdf', contentBase64: b64 });
		expect(asked.map((u) => u.pathname)).not.toContain(
			'/gmail/v1/users/me/messages/m1/attachments/att-other',
		);
	});

	it('returns the sink reference when a host keeps the file', async () => {
		const sink = jest.fn(() => 'file-123');
		setFileSink(() => sink, { everyFile: true });
		const out = await getAttachment(ctx, { messageId: 'm1', partId: '1' });
		expect(out).toMatchObject({ fileId: 'file-123', filename: 'invoice.pdf' });
		expect(sink).toHaveBeenCalledWith(
			expect.objectContaining({ contentType: 'application/pdf' }),
		);
	});
});
