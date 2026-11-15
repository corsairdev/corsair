import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { listEvents } from './endpoints/events';
import type { SymplaContext } from './index';

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
	data: [{ id: 1, name: 'Show' }],
	pagination: { page: 1, page_size: 20, total: 1 },
};

function context(key: string, upsert?: jest.Mock): SymplaContext {
	return {
		key,
		db: upsert ? { events: { upsertByEntityId: upsert } } : undefined,
	} as unknown as SymplaContext;
}

describe('events.list', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns events and sends s_token', async () => {
		mockRequest.mockResolvedValue(SAMPLE);
		const result = await listEvents(context('test-key'), {
			page: 1,
			sort: 'ASC',
		});
		expect(result).toEqual(SAMPLE);
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://api.sympla.com.br');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({ s_token: 'test-key' });
		expect(options).toMatchObject({
			method: 'GET',
			url: '/public/v3/events',
			query: { page: 1, sort: 'ASC' },
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'sympla.events.list',
			{ page: 1 },
			'completed',
		);
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(listEvents(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/public/v3/events' },
			{
				url: 'https://api.sympla.com.br/public/v3/events',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { message: 'Wrong Credentials' },
			},
			'Wrong Credentials',
		);
		mockRequest.mockRejectedValue(error);
		await expect(listEvents(context('test-key'), {})).rejects.toBe(error);
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a bad page before calling the API', async () => {
		await expect(
			listEvents(context('test-key'), { page: 0 }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a response that has no data array', async () => {
		mockRequest.mockResolvedValue({ pagination: {} });
		await expect(listEvents(context('test-key'), {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('stores each event that has an id', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			data: [{ id: 1, name: 'Show' }, { name: 'Missing id' }],
			pagination: { page: 1 },
		});
		const result = await listEvents(context('test-key', upsert), {});
		expect(result.data).toHaveLength(2);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith('1', { id: '1', name: 'Show' });
	});

	it('returns the list when the database write fails', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('disk full'));
		mockRequest.mockResolvedValue(SAMPLE);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(listEvents(context('test-key', upsert), {})).resolves.toEqual(
			SAMPLE,
		);
		warn.mockRestore();
	});
});
