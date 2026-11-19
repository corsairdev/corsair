import { dispositionFilename } from './client';
import { createSpeech } from './endpoints/audio';
import { retrieveFileContent } from './endpoints/containers';
import { downloadContent } from './endpoints/files';
import { OpenaiEndpointOutputSchemas } from './endpoints/types';
import { download } from './endpoints/videos';
import type { OpenaiContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

// An MP4 header, then bytes that are not valid UTF-8.
const MP4 = new Uint8Array([
	0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32, 0xff,
	0xfe, 0x80,
]);

const originalFetch = global.fetch;
const asked: Array<{ url: string; method?: string }> = [];

function serve(body: Uint8Array, headers: Record<string, string>) {
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		asked.push({ url: String(url), method: init?.method });
		return new Response(body, { status: 200, headers });
	}) as unknown as typeof fetch;
}

// unknown: the endpoints read only ctx.key here, not a full plugin context.
const ctx = { key: 'test-key' } as unknown as OpenaiContext;

afterEach(() => {
	global.fetch = originalFetch;
	asked.length = 0;
});

describe('openai downloads return a file output', () => {
	it('videos.download: the video as base64 with its type, size and a name', async () => {
		serve(MP4, { 'Content-Type': 'video/mp4' });
		const out = await download(ctx, { videoId: 'video_123' });
		expect(out).toEqual({
			videoId: 'video_123',
			contentType: 'video/mp4',
			byteLength: MP4.byteLength,
			filename: 'video_123.mp4',
			contentBase64: Buffer.from(MP4).toString('base64'),
		});
		expect(OpenaiEndpointOutputSchemas.videosDownload.parse(out)).toEqual(out);
		expect(asked[0]?.url).toContain('/videos/video_123/content');
	});

	it('videos.download: a video over 700 KB stays inline for a caller without a host', async () => {
		const big = new Uint8Array(1_000_000).fill(7);
		serve(big, { 'Content-Type': 'video/mp4' });
		const out = await download(ctx, { videoId: 'video_big' });
		expect(out.byteLength).toBe(1_000_000);
		expect(out.contentOmitted).toBeUndefined();
		expect(Buffer.from(out.contentBase64 ?? '', 'base64').equals(big)).toBe(
			true,
		);
	});

	it('files.downloadContent: a JSONL file named by Content-Disposition comes back as text', async () => {
		const jsonl = '{"custom_id":"a","ok":true}\n{"custom_id":"b","ok":false}\n';
		serve(new TextEncoder().encode(jsonl), {
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment; filename="batch_output.jsonl"',
		});
		const out = await downloadContent(ctx, { fileId: 'file-abc' });
		expect(out).toEqual({
			contentType: 'application/octet-stream',
			byteLength: new TextEncoder().encode(jsonl).byteLength,
			filename: 'batch_output.jsonl',
			text: jsonl,
		});
		// OpenAI's id is the input; fileId in the output is only ever where a host saved the file.
		expect(out.fileId).toBeUndefined();
		expect(OpenaiEndpointOutputSchemas.filesDownloadContent.parse(out)).toEqual(
			out,
		);
		expect(asked[0]?.url).toContain('/files/file-abc/content');
	});

	it('containerFiles.retrieveContent: the container file with the container id', async () => {
		serve(MP4, { 'Content-Type': 'application/octet-stream' });
		const out = await retrieveFileContent(ctx, {
			containerId: 'cntr_1',
			fileId: 'cfile_1',
		});
		expect(out).toEqual({
			containerId: 'cntr_1',
			contentType: 'application/octet-stream',
			byteLength: MP4.byteLength,
			contentBase64: Buffer.from(MP4).toString('base64'),
		});
		expect(
			OpenaiEndpointOutputSchemas.containerFilesRetrieveContent.parse(out),
		).toEqual(out);
		expect(asked[0]?.url).toContain('/containers/cntr_1/files/cfile_1/content');
	});

	it('audio.createSpeech: keeps audioBase64 and adds the type, size and a name', async () => {
		serve(MP4, { 'Content-Type': 'audio/mpeg' });
		const out = await createSpeech(ctx, {
			model: 'gpt-4o-mini-tts',
			input: 'hello',
			voice: 'alloy',
			responseFormat: 'wav',
		});
		expect(out).toEqual({
			contentType: 'audio/wav',
			byteLength: MP4.byteLength,
			filename: 'speech.wav',
			audioBase64: Buffer.from(MP4).toString('base64'),
			format: 'wav',
		});
		expect('contentBase64' in out).toBe(false);
		expect(OpenaiEndpointOutputSchemas.audioCreateSpeech.parse(out)).toEqual(
			out,
		);
		expect(asked[0]).toMatchObject({ method: 'POST' });
		expect(asked[0]?.url).toContain('/audio/speech');
	});
});

describe('dispositionFilename', () => {
	it('reads quoted, extended and bare file names', () => {
		expect(
			dispositionFilename('attachment; filename="report;2026.jsonl"'),
		).toBe('report;2026.jsonl');
		expect(
			dispositionFilename("attachment; filename*=UTF-8''r%C3%A9sum%C3%A9.pdf"),
		).toBe('résumé.pdf');
		expect(
			dispositionFilename(
				'attachment; filename="fallback.pdf"; filename*=UTF-8\'\'real%20name.pdf',
			),
		).toBe('real name.pdf');
		expect(dispositionFilename('attachment; filename=out.jsonl')).toBe(
			'out.jsonl',
		);
		expect(
			dispositionFilename('attachment; filename="a \\"quoted\\" name.txt"'),
		).toBe('a "quoted" name.txt');
	});

	it('falls back on a broken escape, and gives nothing without a name', () => {
		expect(
			dispositionFilename(
				'attachment; filename="plain.csv"; filename*=UTF-8\'\'bad%E0%A4',
			),
		).toBe('plain.csv');
		expect(dispositionFilename('attachment')).toBeUndefined();
		expect(dispositionFilename(null)).toBeUndefined();
	});
});
