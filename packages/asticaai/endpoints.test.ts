import { createHash } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { ASTICA_RATE_LIMIT_CONFIG } from './client';
import { AnalyzeAudio, ReadText } from './endpoints';
import type { AsticaAiContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;
const TEST_API_KEY = 'test-api-key';

type UpsertMock = jest.Mock<Promise<void>, [string, Record<string, unknown>]>;

let ctx: AsticaAiContext;
let upserts: { readTextResults: UpsertMock; audioTranscripts: UpsertMock };
let warnSpy: jest.SpyInstance;

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
	const makeUpsert = (): UpsertMock =>
		jest.fn<Promise<void>, [string, Record<string, unknown>]>(
			async () => undefined,
		);
	upserts = {
		readTextResults: makeUpsert(),
		audioTranscripts: makeUpsert(),
	};
	ctx = {
		key: TEST_API_KEY,
		db: {
			readTextResults: { upsertByEntityId: upserts.readTextResults },
			audioTranscripts: { upsertByEntityId: upserts.audioTranscripts },
		},
	} as unknown as AsticaAiContext;
	warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => warnSpy.mockRestore());

const IMAGE = 'https://www.astica.org/inputs/analyze_3.jpg';
const AUDIO = 'https://astica.ai/example/asticaListen_sample.wav';

const sha256 = (value: string) =>
	createHash('sha256').update(value).digest('hex');

const okOcr = {
	status: 'success',
	readResult: {
		stringIndexType: 'TextElements',
		content: 'Detected text',
		pages: [{ pageNumber: 1, lines: [{ text: 'Detected' }, { text: 'text' }] }],
	},
};

describe('readText', () => {
	it('posts the OCR request to the vision host', async () => {
		mockRequest.mockResolvedValueOnce(okOcr);

		await ReadText.read(ctx, { input: IMAGE, modelVersion: '2.5_full' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://vision.astica.ai' }),
			expect.objectContaining({
				method: 'POST',
				url: '/describe',
				body: {
					input: IMAGE,
					modelVersion: '2.5_full',
					visionParams: 'text_read',
					tkn: TEST_API_KEY,
				},
			}),
			expect.objectContaining({
				rateLimitConfig: ASTICA_RATE_LIMIT_CONFIG,
			}),
		);
	});

	it('applies the documented modelVersion default when omitted', async () => {
		mockRequest.mockResolvedValueOnce(okOcr);

		await ReadText.read(ctx, { input: IMAGE });

		const [, options] = mockRequest.mock.calls[0] ?? [];
		expect((options?.body as Record<string, unknown>).modelVersion).toBe(
			'2.5_full',
		);
	});

	it('rejects a modelVersion Astica does not publish', async () => {
		await expect(
			ReadText.read(ctx, {
				input: IMAGE,
				modelVersion: '9.9_full' as never,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('persists the flattened OCR result', async () => {
		mockRequest.mockResolvedValueOnce(okOcr);

		await ReadText.read(ctx, { input: IMAGE });

		expect(upserts.readTextResults).toHaveBeenCalledWith(
			sha256(IMAGE),
			expect.objectContaining({
				inputFingerprint: sha256(IMAGE),
				inputKind: 'url',
				inputLength: IMAGE.length,
				content: 'Detected text',
				pageCount: 1,
				lineCount: 2,
				readAt: expect.any(Date),
			}),
		);
	});

	it('still returns the result when persistence fails', async () => {
		mockRequest.mockResolvedValueOnce(okOcr);
		upserts.readTextResults.mockRejectedValueOnce(new Error('db offline'));

		await expect(ReadText.read(ctx, { input: IMAGE })).resolves.toMatchObject({
			status: 'success',
		});
		expect(warnSpy).toHaveBeenCalledTimes(1);
	});
});

describe('analyzeAudio', () => {
	it('posts the transcription request to the listen host', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success', text: 'Hello' });

		await AnalyzeAudio.analyze(ctx, {
			input: AUDIO,
			modelVersion: '1.0_full',
			doStream: 0,
			low_priority: 0,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://listen.astica.ai' }),
			expect.objectContaining({
				method: 'POST',
				url: '/transcribe',
				body: {
					input: AUDIO,
					modelVersion: '1.0_full',
					doStream: 0,
					low_priority: 0,
					tkn: TEST_API_KEY,
				},
			}),
			expect.objectContaining({
				rateLimitConfig: ASTICA_RATE_LIMIT_CONFIG,
			}),
		);
	});

	it('applies the documented defaults when only input is given', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success', text: 'Hello' });

		await AnalyzeAudio.analyze(ctx, { input: AUDIO });

		const [, options] = mockRequest.mock.calls[0] ?? [];
		expect(options?.body).toMatchObject({
			modelVersion: '1.0_full',
			doStream: 0,
			low_priority: 0,
		});
	});

	it('persists the transcript', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success', text: 'Hello' });

		await AnalyzeAudio.analyze(ctx, { input: AUDIO });

		expect(upserts.audioTranscripts).toHaveBeenCalledWith(
			sha256(AUDIO),
			expect.objectContaining({
				inputFingerprint: sha256(AUDIO),
				inputKind: 'url',
				text: 'Hello',
				resultURI: null,
			}),
		);
	});

	it('stores the resultURI when low_priority defers the work', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			resultURI: 'https://listen.astica.ai/result/abc',
		});

		await AnalyzeAudio.analyze(ctx, { input: AUDIO, low_priority: 1 });

		const [, row] = upserts.audioTranscripts.mock.calls[0] ?? [];
		expect(row?.resultURI).toBe('https://listen.astica.ai/result/abc');
		expect(row?.text).toBeNull();
	});

	it('rejects a doStream value outside the documented 0/1', async () => {
		await expect(
			AnalyzeAudio.analyze(ctx, { input: AUDIO, doStream: 2 as never }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

// Astica answers failures with HTTP 200 and status:'error'.
describe('in-body error reporting', () => {
	it('raises when the OCR response carries status error', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'error',
			error: 'Invalid API key',
		});

		await expect(ReadText.read(ctx, { input: IMAGE })).rejects.toThrow(
			'Invalid API key',
		);
		expect(upserts.readTextResults).not.toHaveBeenCalled();
	});

	it('raises when the transcription response carries status error', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'error',
			error: 'Insufficient credits',
		});

		await expect(AnalyzeAudio.analyze(ctx, { input: AUDIO })).rejects.toThrow(
			'Insufficient credits',
		);
		expect(upserts.audioTranscripts).not.toHaveBeenCalled();
	});

	it('falls back to a generic message when error text is absent', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'error' });

		await expect(ReadText.read(ctx, { input: IMAGE })).rejects.toThrow(
			'Astica API returned an error',
		);
	});
});

describe('large inline inputs', () => {
	it('keeps the entity id bounded instead of keying on the whole blob', async () => {
		mockRequest.mockResolvedValueOnce(okOcr);

		await ReadText.read(ctx, { input: 'A'.repeat(5000) });

		const [id] = upserts.readTextResults.mock.calls[0] ?? [];
		expect(id).toHaveLength(64);
	});

	// Same-format payloads share a long prefix, so truncating the input would
	// collide; every base64 JPEG opens with the same header.
	it('distinguishes blobs that share a long prefix and a length', async () => {
		mockRequest.mockResolvedValueOnce(okOcr).mockResolvedValueOnce(okOcr);
		const header =
			'/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsL';

		await ReadText.read(ctx, { input: `${header}${'A'.repeat(4000)}X` });
		await ReadText.read(ctx, { input: `${header}${'A'.repeat(4000)}Y` });

		const ids = upserts.readTextResults.mock.calls.map(([id]) => id);
		expect(ids[0]).not.toBe(ids[1]);
	});

	it('reuses the same id for the same input', async () => {
		mockRequest.mockResolvedValueOnce(okOcr).mockResolvedValueOnce(okOcr);

		await ReadText.read(ctx, { input: IMAGE });
		await ReadText.read(ctx, { input: IMAGE });

		const ids = upserts.readTextResults.mock.calls.map(([id]) => id);
		expect(ids[0]).toBe(ids[1]);
	});

	it('never writes the submitted input into the stored row', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success', text: 'Hi' });
		const secretAudio = `data:audio/wav;base64,${'Z'.repeat(3000)}`;

		await AnalyzeAudio.analyze(ctx, { input: secretAudio });

		const [, row] = upserts.audioTranscripts.mock.calls[0] ?? [];
		expect(JSON.stringify(row)).not.toContain('ZZZZ');
		expect(row).not.toHaveProperty('input');
	});

	it('never writes a signed url into the stored row', async () => {
		mockRequest.mockResolvedValueOnce(okOcr);

		await ReadText.read(ctx, { input: `${IMAGE}?sig=super-secret-signature` });

		const [, row] = upserts.readTextResults.mock.calls[0] ?? [];
		expect(JSON.stringify(row)).not.toContain('super-secret-signature');
		expect(row).not.toHaveProperty('input');
	});
});

// Base64 audio is voice data and URLs can carry signed query parameters, so the
// event payload must never contain the raw input.
describe('event payloads', () => {
	const base64Audio = `data:audio/wav;base64,${'Q'.repeat(4000)}`;

	it('logs OCR metadata without the image itself', async () => {
		mockRequest.mockResolvedValueOnce(okOcr);
		const signed = `${IMAGE}?token=super-secret-signature`;

		await ReadText.read(ctx, { input: signed });

		const [, , payload] = mockLogEvent.mock.calls[0] ?? [];
		expect(JSON.stringify(payload)).not.toContain('super-secret-signature');
		expect(payload).toEqual({
			inputKind: 'url',
			inputLength: signed.length,
			modelVersion: '2.5_full',
			pageCount: 1,
		});
	});

	it('logs audio metadata without the recording itself', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success', text: 'Hello' });

		await AnalyzeAudio.analyze(ctx, { input: base64Audio });

		const [, , payload] = mockLogEvent.mock.calls[0] ?? [];
		expect(JSON.stringify(payload)).not.toContain('QQQQ');
		expect(payload).toMatchObject({
			inputKind: 'inline',
			inputLength: base64Audio.length,
			deferred: false,
		});
	});
});
