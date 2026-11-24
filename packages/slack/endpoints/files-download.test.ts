import { setFileSink } from 'corsair/http';
import type { SlackContext } from '../index';
import { download } from './files';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

// Bytes that are not valid UTF-8, so a text round trip would lose them.
const BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0xff, 0xfe, 0x00, 0x80]);
const PRIVATE_URL = 'https://files.slack.com/files-pri/T1-F1/download/cat.png';

type Asked = { url: URL; auth: string | null };
const asked: Asked[] = [];
const originalFetch = global.fetch;

function serve(
	file: Record<string, unknown>,
	content: () => Response = () =>
		new Response(BYTES, { headers: { 'Content-Type': 'image/png' } }),
) {
	global.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
		const url = new URL(input instanceof Request ? input.url : String(input));
		asked.push({
			url,
			auth: new Headers(init?.headers).get('Authorization'),
		});
		return url.hostname === 'slack.com'
			? Response.json({ ok: true, file })
			: content();
	}) as typeof fetch;
}

const file = {
	id: 'F1',
	name: 'cat.png',
	mimetype: 'image/png',
	url_private_download: PRIVATE_URL,
};

// The endpoint reads only key and keys; a full SlackContext carries the whole
// plugin runtime, so the stand-in is cast once, here.
const ctxOf = (userToken: string | null): SlackContext =>
	({
		key: 'xoxb-bot',
		keys: {
			get_access_token: async () => 'xoxb-bot',
			get_user_token: async () => userToken,
		},
		db: {},
		endpoints: {},
	}) as unknown as SlackContext;

beforeEach(() => serve(file));
afterEach(() => {
	global.fetch = originalFetch;
	asked.length = 0;
	setFileSink(() => undefined);
});

describe('slack files.download', () => {
	it('returns the bytes intact with the file name and type', async () => {
		const out = await download(ctxOf(null), { file: 'F1' });
		expect(out).toMatchObject({
			filename: 'cat.png',
			contentType: 'image/png',
			byteLength: BYTES.length,
			contentBase64: Buffer.from(BYTES).toString('base64'),
		});
		expect(asked.map((a) => a.url.pathname)).toEqual([
			'/api/files.info',
			'/files-pri/T1-F1/download/cat.png',
		]);
		expect(asked[0]?.url.searchParams.get('file')).toBe('F1');
	});

	it('uses the user token for both calls when the connection has one', async () => {
		await download(ctxOf('xoxp-user'), { file: 'F1' });
		expect(asked.map((a) => a.auth)).toEqual([
			'Bearer xoxp-user',
			'Bearer xoxp-user',
		]);
	});

	it('falls back to the bot token', async () => {
		await download(ctxOf(null), { file: 'F1' });
		expect(asked.map((a) => a.auth)).toEqual([
			'Bearer xoxb-bot',
			'Bearer xoxb-bot',
		]);
	});

	it('refuses the HTML login page Slack serves when the token cannot see the file', async () => {
		serve(
			file,
			() =>
				new Response('<html>Sign in</html>', {
					headers: { 'Content-Type': 'text/html; charset=utf-8' },
				}),
		);
		await expect(download(ctxOf(null), { file: 'F1' })).rejects.toMatchObject({
			name: 'SlackAPIError',
			code: 'file_not_accessible',
		});
	});

	it('returns an HTML file when the file itself is HTML', async () => {
		serve({ ...file, name: 'a.html', mimetype: 'text/html' }, () =>
			Response.json('x', { headers: { 'Content-Type': 'text/html' } }),
		);
		const out = await download(ctxOf(null), { file: 'F1' });
		expect(out).toMatchObject({ filename: 'a.html', contentType: 'text/html' });
	});

	it('errors on a non-2xx response', async () => {
		serve(file, () => new Response('nope', { status: 403 }));
		await expect(download(ctxOf(null), { file: 'F1' })).rejects.toMatchObject({
			status: 403,
		});
	});

	it('errors when the file has no private download url', async () => {
		serve({ id: 'F1', name: 'x', is_external: true });
		await expect(download(ctxOf(null), { file: 'F1' })).rejects.toMatchObject({
			code: 'file_not_downloadable',
		});
	});

	it('hands the file to the host sink and returns its fileId', async () => {
		const sink = jest.fn(() => 'file-1');
		setFileSink(() => sink, { everyFile: true });
		const out = await download(ctxOf(null), { file: 'F1' });
		expect(out).toMatchObject({ fileId: 'file-1', filename: 'cat.png' });
		expect(sink).toHaveBeenCalledWith(
			expect.objectContaining({
				filename: 'cat.png',
				contentType: 'image/png',
			}),
		);
	});
});
