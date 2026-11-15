import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { listComparisons } from './endpoints/comparisons';
import type { DraftableContext } from './index';

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
	count: 1,
	results: [{ identifier: 'cmp-1' }],
};

function context(key: string, upsert?: jest.Mock): DraftableContext {
	return {
		key,
		db: upsert ? { comparisons: { upsertByEntityId: upsert } } : undefined,
	} as unknown as DraftableContext;
}

describe('comparisons.list', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns comparisons and sends a Token header', async () => {
		mockRequest.mockResolvedValue(SAMPLE);
		const result = await listComparisons(context('test-key'), {
			limit: 20,
			offset: 0,
		});
		expect(result).toEqual(SAMPLE);
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://api.draftable.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({
			Authorization: 'Token test-key',
		});
		expect(options).toMatchObject({
			method: 'GET',
			url: '/v1/comparisons',
			query: { limit: 20, offset: 0 },
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'draftable.comparisons.list',
			{ offset: 0 },
			'completed',
		);
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(listComparisons(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/comparisons' },
			{
				url: 'https://api.draftable.com/v1/comparisons',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: 'Authentication credentials were not provided.',
			},
			'Authentication credentials were not provided.',
		);
		mockRequest.mockRejectedValue(error);
		await expect(listComparisons(context('test-key'), {})).rejects.toBe(error);
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a bad page size before calling the API', async () => {
		await expect(
			listComparisons(context('test-key'), { limit: 0 }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a response that has no count', async () => {
		mockRequest.mockResolvedValue({ results: [] });
		await expect(listComparisons(context('test-key'), {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('stores each comparison that has an identifier', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			count: 2,
			results: [{ identifier: 'cmp-1', ready: true }, { title: 'no id' }],
		});
		const result = await listComparisons(context('test-key', upsert), {});
		expect(result.count).toBe(2);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith('cmp-1', {
			identifier: 'cmp-1',
			ready: true,
		});
	});

	it('returns the list when the database write fails', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('disk full'));
		mockRequest.mockResolvedValue(SAMPLE);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(
			listComparisons(context('test-key', upsert), {}),
		).resolves.toEqual(SAMPLE);
		warn.mockRestore();
	});
});
