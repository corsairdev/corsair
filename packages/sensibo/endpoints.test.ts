import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { listDevices } from './endpoints/devices';
import type { SensiboContext } from './index';

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

const SAMPLE = {
	status: 'success',
	result: [{ id: 'pod-1', room: { name: 'Kitchen' } }],
};

function context(key: string): SensiboContext {
	return { key } as SensiboContext;
}

describe('devices.list', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns the pods and sends the key as apiKey', async () => {
		mockRequest.mockResolvedValue(SAMPLE);
		const result = await listDevices(context('test-key'), {
			fields: 'id,room',
		});
		expect(result).toEqual(SAMPLE);
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://home.sensibo.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(options).toMatchObject({
			method: 'GET',
			url: '/api/v2/users/me/pods',
			query: {
				apiKey: 'test-key',
				fields: 'id,room',
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'sensibo.devices.list',
			{},
			'completed',
		);
	});

	it('omits fields when the caller does', async () => {
		mockRequest.mockResolvedValue(SAMPLE);
		await listDevices(context('test-key'), {});
		const options = mockRequest.mock.calls[0]?.[1];
		expect(options?.query).toMatchObject({
			apiKey: 'test-key',
			fields: undefined,
		});
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(listDevices(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 403 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/api/v2/users/me/pods' },
			{
				url: 'https://home.sensibo.com/api/v2/users/me/pods',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: 'Invalid API key',
			},
			'Invalid API key',
		);
		mockRequest.mockRejectedValue(error);
		await expect(
			listDevices(context('test-key'), { fields: 'id' }),
		).rejects.toBe(error);
	});
});
