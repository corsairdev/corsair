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

function context(key: string, upsert?: jest.Mock): SensiboContext {
	return {
		key,
		db: upsert ? { pods: { upsertByEntityId: upsert } } : undefined,
	} as unknown as SensiboContext;
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
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects an empty fields list before calling the API', async () => {
		await expect(
			listDevices(context('test-key'), { fields: '' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a response that has no result array', async () => {
		mockRequest.mockResolvedValue({ status: 'success' });
		await expect(listDevices(context('test-key'), {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('stores each pod that has an id', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			status: 'success',
			result: [{ id: 'pod-1', room: { name: 'Kitchen' } }, { room: {} }],
		});
		const result = await listDevices(context('test-key', upsert), {});
		expect(result.result).toHaveLength(2);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith('pod-1', {
			id: 'pod-1',
			roomName: 'Kitchen',
		});
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('test-key');
	});

	it('returns the list when the database write fails', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('disk full'));
		mockRequest.mockResolvedValue(SAMPLE);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(listDevices(context('test-key', upsert), {})).resolves.toEqual(
			SAMPLE,
		);
		warn.mockRestore();
	});
});
