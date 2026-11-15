import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { EcologiContext } from './context';
import { getImpact, getTrees } from './endpoints/get';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(db?: EcologiContext['db']): EcologiContext {
	return { key: 'sekrit', db } as unknown as EcologiContext;
}

describe('ecologi reads', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores a tree total and does not send the key', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ total: 10, pending: 1, extra: 'no' });
		const result = await getTrees(
			context({
				trees: { upsertByEntityId: upsert },
			} as unknown as EcologiContext['db']),
			{ username: 'ecologi' },
		);
		expect(result.total).toEqual({ id: 'ecologi', total: 10, pending: 1 });
		expect(upsert).toHaveBeenCalledWith('ecologi', result.total);
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('extra');
		const config = mockRequest.mock.calls[0]?.[0];
		expect(config?.BASE).toBe('https://public.ecologi.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toEqual({ Accept: 'application/json' });
		expect(JSON.stringify(config)).not.toContain('sekrit');
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/users/ecologi/trees',
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('ecologi');
	});

	it('stores combined impact', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			trees: 1,
			carbonOffset: 2,
			carbonRemoval: 3,
			habitatRestoration: 4,
			pending: {
				trees: 5,
				carbonOffset: 6,
				carbonRemoval: 7,
				habitatRestoration: 8,
			},
		});
		const result = await getImpact(
			context({
				impacts: { upsertByEntityId: upsert },
			} as unknown as EcologiContext['db']),
			{ username: 'acme' },
		);
		expect(result.impact.pendingHabitatRestoration).toBe(8);
		expect(upsert).toHaveBeenCalledWith('acme', result.impact);
	});

	it('rejects a total body that is missing pending', async () => {
		mockRequest.mockResolvedValue({ total: 1 });
		await expect(getTrees(context(), { username: 'acme' })).rejects.toThrow(
			'missing total or pending',
		);
	});

	it('rejects a username with a slash before calling the API', async () => {
		await expect(getTrees(context(), { username: 'a/b' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 404 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/users/missing/trees' },
			{
				url: 'https://public.ecologi.com/users/missing/trees',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: { error: 'User missing not found or is private' },
			},
			'not found',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getTrees(context(), { username: 'missing' })).rejects.toBe(
			error,
		);
	});

	it('returns the total when the database write fails', async () => {
		mockRequest.mockResolvedValue({ total: 3, pending: 0 });
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const result = await getTrees(
			context({
				trees: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db')),
				},
			} as unknown as EcologiContext['db']),
			{ username: 'acme' },
		);
		expect(result.total.total).toBe(3);
		expect(warn).toHaveBeenCalledWith('Failed to save Ecologi total');
		warn.mockRestore();
	});
});
