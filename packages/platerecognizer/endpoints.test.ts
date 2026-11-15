import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { PlateRecognizerContext } from './context';
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
