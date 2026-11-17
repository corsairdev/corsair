import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { PlateRecognizerContext } from './context';
import { getOcrUsage, readOcr } from './endpoints/ocr';
import { readPlate } from './endpoints/reader';
import { getStatistics } from './endpoints/statistics';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(
	key: string,
	db?: PlateRecognizerContext['db'],
): PlateRecognizerContext {
	return { key, db } as unknown as PlateRecognizerContext;
}

describe('usage.get', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores the documented usage period and sends Authorization Token', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			usage: {
				month: 1,
				calls: 128,
				year: 2019,
				resets_on: '2019-01-14T00:00:00Z',
			},
			total_calls: 2500,
		});
		const result = await getStatistics(
			context('tok_test', {
				usage: { upsertByEntityId: upsert },
			} as unknown as PlateRecognizerContext['db']),
			{},
		);
		expect(result.total_calls).toBe(2500);
		expect(upsert).toHaveBeenCalledWith('2019-01', {
			id: '2019-01',
			year: 2019,
			month: 1,
			calls: 128,
			resetsOn: '2019-01-14T00:00:00Z',
			totalCalls: 2500,
		});
		const config = mockRequest.mock.calls[0]?.[0];
		expect(config?.BASE).toBe('https://api.platerecognizer.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({
			Authorization: 'Token tok_test',
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v1/statistics/',
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({});
	});

	it('does not store a body that is missing the period', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValue({ total_calls: 1 });
		await getStatistics(
			context('tok_test', {
				usage: { upsertByEntityId: upsert },
			} as unknown as PlateRecognizerContext['db']),
			{},
		);
		expect(upsert).not.toHaveBeenCalled();
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(getStatistics(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets the documented HTTP 403 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/statistics/' },
			{
				url: 'https://api.platerecognizer.com/v1/statistics/',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: { detail: 'Invalid token header. No credentials provided.' },
			},
			'Invalid token header. No credentials provided.',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getStatistics(context('tok_test'), {})).rejects.toBe(error);
	});
});

describe('plates.read', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('posts the base64 upload and does not store the plate', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValue({
			results: [{ plate: 'ABC123', score: 0.904, dscore: 0.92 }],
		});
		const result = await readPlate(
			context('tok_test', {
				usage: { upsertByEntityId: upsert },
			} as unknown as PlateRecognizerContext['db']),
			{ upload: 'aW1hZ2U=', regions: ['us-ca'], mmc: true },
		);
		expect(result.results[0]?.plate).toBe('ABC123');
		expect(upsert).not.toHaveBeenCalled();
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/v1/plate-reader/',
			formData: {
				upload: 'aW1hZ2U=',
				regions: ['us-ca'],
				mmc: 'true',
			},
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		const payload = JSON.stringify(mockLog.mock.calls[0]?.[2]);
		expect(payload).not.toContain('ABC123');
		expect(payload).not.toContain('aW1hZ2U=');
	});

	it('sends upload_url, timestamp, direction and config as form fields', async () => {
		mockRequest.mockResolvedValue({ results: [] });
		await readPlate(context('tok_test'), {
			uploadUrl: 'https://app.platerecognizer.com/static/demo.jpg',
			timestamp: '2019-08-19T13:11:25',
			mmc: true,
			direction: true,
			config: { detection_mode: 'vehicle' },
		});
		const options = mockRequest.mock.calls[0]?.[1];
		expect(options?.formData).toMatchObject({
			upload_url: 'https://app.platerecognizer.com/static/demo.jpg',
			timestamp: '2019-08-19T13:11:25',
			mmc: 'true',
			direction: 'true',
			config: '{"detection_mode":"vehicle"}',
		});
		expect(options?.formData?.upload).toBeUndefined();
	});

	it('parses the vehicle-mode result, where plate is an object or null', async () => {
		mockRequest.mockResolvedValue({
			results: [
				{
					plate: {
						type: 'Plate',
						score: 0.925,
						props: { plate: [{ value: 'nhk552', score: 0.838 }] },
					},
					vehicle: { type: 'Sedan', score: 0.834 },
				},
				{ plate: null, vehicle: { type: 'SUV', score: 0.7 } },
			],
			image_width: 1080,
			image_height: 720,
		});
		const result = await readPlate(context('tok_test'), {
			upload: 'aW1hZ2U=',
			config: { detection_mode: 'vehicle' },
		});
		expect(result.results).toHaveLength(2);
		expect(result.results[1]?.plate).toBeNull();
	});

	it('refuses both or neither of upload and uploadUrl before any request', async () => {
		await expect(readPlate(context('tok_test'), {})).rejects.toThrow(
			/exactly one/,
		);
		await expect(
			readPlate(context('tok_test'), {
				upload: 'aW1hZ2U=',
				uploadUrl: 'https://example.com/car.jpg',
			}),
		).rejects.toThrow(/exactly one/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty upload before calling the API', async () => {
		await expect(
			readPlate(context('tok_test'), { upload: '' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a body with no results array before logging', async () => {
		mockRequest.mockResolvedValue({ filename: 'car.jpg' });
		await expect(
			readPlate(context('tok_test'), { upload: 'aW1hZ2U=' }),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('ocr', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('posts the type and image to the OCR reader with a long timeout', async () => {
		mockRequest.mockResolvedValue({
			processing_time: 128.758,
			results: [
				{
					identifier: {
						type: 'text',
						props: { code: [{ value: '12345' }], confidence: 0.8 },
					},
				},
			],
			filename: 'image.jpg',
			version: 1,
			camera_id: null,
			timestamp: '2025-03-22T13:26:01.683008Z',
		});
		const result = await readOcr(context('tok_test'), {
			type: 'trailer_id',
			uploadUrl: 'https://example.com/trailer.jpg',
		});
		expect(result.results).toHaveLength(1);
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config?.TIMEOUT).toBe(120_000);
		expect(config?.HEADERS).toMatchObject({ Authorization: 'Token tok_test' });
		expect(options).toMatchObject({
			method: 'POST',
			url: '/v1/ocr/reader/',
			formData: {
				type: 'trailer_id',
				upload_url: 'https://example.com/trailer.jpg',
			},
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({
			type: 'trailer_id',
			count: 1,
		});
	});

	it('rejects an unknown OCR type before any request', async () => {
		await expect(
			readOcr(context('tok_test'), {
				type: 'passport',
				upload: 'aW1hZ2U=',
			} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reads OCR usage from /v1/ocr/statistics/', async () => {
		mockRequest.mockResolvedValue({
			usage: { month: 11, calls: 3, year: 2026, resets_on: '2026-12-01' },
			total_calls: 100,
		});
		const result = await getOcrUsage(context('tok_test'), {});
		expect(result.total_calls).toBe(100);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v1/ocr/statistics/',
		});
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(
			readOcr(context(''), { type: 'vin', upload: 'aW1hZ2U=' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('failed reads', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('strips the image, image URL and camera id from a failed request', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'POST',
					url: '/v1/plate-reader/',
					formData: {
						upload: 'aW1hZ2U=',
						camera_id: 'gate-3',
						regions: ['us-ca'],
					},
				},
				{
					url: 'https://api.platerecognizer.com/v1/plate-reader/',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { detail: 'Request was throttled.' },
				},
				'Too Many Requests',
				{ retryAfter: 1 },
			),
		);
		const error = await readPlate(context('tok_test'), {
			upload: 'aW1hZ2U=',
			cameraId: 'gate-3',
			regions: ['us-ca'],
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(429);
		expect(apiError.retryAfter).toBe(1);
		expect(apiError.body).toEqual({ detail: 'Request was throttled.' });
		expect(apiError.request.formData).toEqual({
			upload: '[REDACTED]',
			camera_id: '[REDACTED]',
			regions: ['us-ca'],
		});
		expect(JSON.stringify(apiError)).not.toContain('aW1hZ2U=');
	});
});
