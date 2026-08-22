import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
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
			encodeURIComponent(IMAGE),
			expect.objectContaining({
				input: IMAGE,
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
			encodeURIComponent(AUDIO),
			expect.objectContaining({ input: AUDIO, text: 'Hello', resultURI: null }),
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
	const base64 = 'A'.repeat(5000);

	it('keeps the entity id bounded instead of keying on the whole blob', async () => {
		mockRequest.mockResolvedValueOnce(okOcr);

		await ReadText.read(ctx, { input: base64 });

		const [id] = upserts.readTextResults.mock.calls[0] ?? [];
		expect(id).toBeDefined();
		expect((id as string).length).toBeLessThan(200);
	});

	it('distinguishes two different blobs of the same length', async () => {
		mockRequest.mockResolvedValueOnce(okOcr).mockResolvedValueOnce(okOcr);

		await ReadText.read(ctx, { input: `${'A'.repeat(4999)}X` });
		await ReadText.read(ctx, { input: `${'B'.repeat(4999)}Y` });

		const ids = upserts.readTextResults.mock.calls.map(([id]) => id);
		expect(ids[0]).not.toBe(ids[1]);
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
