import { logEventFromContext } from 'corsair/core';
import { makeTpscheckRequest } from './client';
import { Batch, Check, Credits, Status } from './endpoints';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => ({
	makeTpscheckRequest: jest.fn(),
}));

const mockRequest = makeTpscheckRequest as jest.MockedFunction<
	typeof makeTpscheckRequest
>;

const mockContext = { key: 'test-api-key' } as never;

beforeEach(() => {
	mockRequest.mockReset();
	(jest.mocked(logEventFromContext) as jest.Mock).mockReset();
});

describe('check.post', () => {
	it('sends phone number and returns the parsed verification response', async () => {
		const mockResponse = {
			input: '01829 830730',
			e164: '+441829830730',
			valid: true,
			line: {
				type: 'landline',
				original_carrier: 'BT',
				location: 'Tarporley',
				country: 'England',
				prefix: '01829',
			},
			reachability: {
				status: 'unknown',
				confidence: 'medium',
			},
			tps: false,
			ctps: false,
		};
		mockRequest.mockResolvedValue(mockResponse);

		const result = await Check.post(mockContext, {
			phone: '01829 830730',
		});

		expect(result).toEqual(mockResponse);
		expect(mockRequest).toHaveBeenCalledWith('/check', 'test-api-key', {
			method: 'POST',
			body: { phone: '01829 830730' },
			query: { version: '2' },
		});
		expect(logEventFromContext).toHaveBeenCalledWith(
			mockContext,
			'tpscheck.check',
			{ phone: '01829 830730' },
			'completed',
		);
	});

	it('rejects invalid empty phone input before calling the API', async () => {
		await expect(Check.post(mockContext, { phone: '' })).rejects.toThrow();

		expect(mockRequest).not.toHaveBeenCalled();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('rejects response missing required valid boolean', async () => {
		mockRequest.mockResolvedValue({
			input: '01829 830730',
			// valid is missing
		});

		await expect(
			Check.post(mockContext, { phone: '01829 830730' }),
		).rejects.toThrow();

		expect(logEventFromContext).not.toHaveBeenCalled();
	});
});

describe('batch.post', () => {
	it('sends phones array and returns batch results', async () => {
		const mockResponse = {
			total: 2,
			results: [
				{
					input: '01564 331484',
					e164: '+441564331484',
					valid: true,
					tps: false,
					ctps: false,
				},
				{
					input: '01953 498974',
					e164: '+441953498974',
					valid: true,
					tps: true,
					ctps: false,
				},
			],
		};
		mockRequest.mockResolvedValue(mockResponse);

		const phones = ['01564 331484', '01953 498974'];
		const result = await Batch.post(mockContext, { phones });

		expect(result).toEqual(mockResponse);
		expect(mockRequest).toHaveBeenCalledWith('/batch', 'test-api-key', {
			method: 'POST',
			body: { phones },
			query: { version: '2' },
		});
		expect(logEventFromContext).toHaveBeenCalledWith(
			mockContext,
			'tpscheck.batch',
			{ count: 2 },
			'completed',
		);
	});

	it('rejects empty batch input', async () => {
		await expect(Batch.post(mockContext, { phones: [] })).rejects.toThrow();

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects batch input with more than 100 phones', async () => {
		const phones = Array.from({ length: 101 }, (_, i) => `070000000${i}`);
		await expect(Batch.post(mockContext, { phones })).rejects.toThrow();

		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('credits.get', () => {
	it('fetches and returns usage and remaining credits', async () => {
		const mockResponse = {
			requests_used: 245,
			requests_remaining: 9755,
			monthly_limit: 10000,
			plan: 'Starter',
			reset_date: '2025-07-01T00:00:00Z',
		};
		mockRequest.mockResolvedValue(mockResponse);

		const result = await Credits.get(mockContext, {});

		expect(result).toEqual(mockResponse);
		expect(mockRequest).toHaveBeenCalledWith('/credits', 'test-api-key', {
			method: 'GET',
		});
		expect(logEventFromContext).toHaveBeenCalledWith(
			mockContext,
			'tpscheck.credits',
			{},
			'completed',
		);
	});
});

describe('status.get', () => {
	it('checks public health status without requiring API key', async () => {
		const mockResponse = {
			status: 'ok',
			version: '1.0.0',
		};
		mockRequest.mockResolvedValue(mockResponse);

		const result = await Status.get(mockContext, {});

		expect(result).toEqual(mockResponse);
		expect(mockRequest).toHaveBeenCalledWith('/status', undefined, {
			method: 'GET',
		});
		expect(logEventFromContext).toHaveBeenCalledWith(
			mockContext,
			'tpscheck.status',
			{},
			'completed',
		);
	});
});
