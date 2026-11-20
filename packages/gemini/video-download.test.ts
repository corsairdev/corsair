import { GeminiEndpointOutputSchemas } from './endpoints/types';
import { waitForVideo } from './endpoints/videos';
import type { GeminiContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const VIDEO_URI =
	'https://generativelanguage.googleapis.com/v1beta/files/abc:download?alt=media';

const originalFetch = global.fetch;
const asked: string[] = [];

// The operation is done; the video download answers with `video`.
function serve(video: Uint8Array) {
	global.fetch = (async (url: unknown) => {
		asked.push(String(url));
		if (String(url).startsWith(VIDEO_URI)) {
			return new Response(video, {
				status: 200,
				headers: { 'Content-Type': 'video/mp4' },
			});
		}
		return Response.json({
			name: 'models/veo-2.0-generate-001/operations/op1',
			done: true,
			response: {
				generateVideoResponse: {
					generatedSamples: [{ video: { uri: VIDEO_URI } }],
				},
			},
		});
	}) as unknown as typeof fetch;
}

// unknown: the endpoint reads only ctx.key here, not a full plugin context.
const ctx = { key: 'test-key' } as unknown as GeminiContext;
const input = {
	operationName: 'models/veo-2.0-generate-001/operations/op1',
	pollIntervalMs: 10,
	timeoutMs: 1_000,
};

afterEach(() => {
	global.fetch = originalFetch;
	asked.length = 0;
});

describe('gemini videos.waitForVideo', () => {
	it('returns the finished video as a file output, keeping mimeType', async () => {
		const video = new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0xff]);
		serve(video);
		const out = await waitForVideo(ctx, input);
		expect(out).toEqual({
			operationName: input.operationName,
			done: true,
			data: {
				video_file: {
					mimeType: 'video/mp4',
					contentType: 'video/mp4',
					byteLength: video.byteLength,
					filename: 'video.mp4',
					contentBase64: Buffer.from(video).toString('base64'),
				},
			},
		});
		expect(GeminiEndpointOutputSchemas.waitForVideo.parse(out)).toEqual(out);
		expect(asked.some((u) => u.startsWith(VIDEO_URI))).toBe(true);
	});

	it('keeps a video over 700 KB inline for a caller without a host', async () => {
		const big = new Uint8Array(1_000_000).fill(9);
		serve(big);
		const out = await waitForVideo(ctx, input);
		const file = out.data?.video_file;
		expect(file?.byteLength).toBe(1_000_000);
		expect(file?.contentOmitted).toBeUndefined();
		expect(Buffer.from(file?.contentBase64 ?? '', 'base64').equals(big)).toBe(
			true,
		);
	});
});
