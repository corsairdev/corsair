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

function context(key: string): SymplaContext {
	return { key } as SymplaContext;
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
	});
});
