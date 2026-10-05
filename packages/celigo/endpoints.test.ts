import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { Flow } from './endpoints';
import { CeligoEndpointInputSchemas } from './endpoints/types';
import type { CeligoContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

function createMockContext(key = 'test-api-key'): CeligoContext {
	return {
		key,
		$getAccountId: () => Promise.resolve('test-account-id'),
	} as CeligoContext;
}

describe('Celigo flow.get endpoint', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('fetches a flow by id and validates the response', async () => {
		const flowResponse = {
			_id: 'flow-123',
			name: 'Order sync',
			active: true,
		};
		mockRequest.mockResolvedValueOnce(flowResponse);
		const ctx = createMockContext();

		const result = await Flow.get(ctx, { id: 'flow-123' });

		expect(result).toEqual(flowResponse);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.integrator.io/v1',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'flows/flow-123',
			}),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'celigo.flow.get',
			{ id: 'flow-123' },
			'completed',
		);
	});

	it('encodes path-unsafe ids into a single URL segment', async () => {
		mockRequest.mockResolvedValueOnce({ _id: 'flow 1' });
		const ctx = createMockContext();

		await Flow.get(ctx, { id: 'flow 1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				url: 'flows/flow%201',
			}),
		);
	});

	it('rejects ids containing path delimiters or dot segments', async () => {
		const badIds = ['../flows', '..', '.', 'flow?x=1', 'flow#x', ''];

		for (const id of badIds) {
			await expect(
				Flow.get(createMockContext(), { id } as never),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		}

		expect(
			CeligoEndpointInputSchemas.getFlow.safeParse({ id: 'valid-flow-id' })
				.success,
		).toBe(true);
	});

	it('rejects malformed API responses', async () => {
		mockRequest.mockResolvedValueOnce({ name: 'missing _id' });

		await expect(
			Flow.get(createMockContext(), { id: 'flow-123' }),
		).rejects.toThrow();
	});

	it('preserves ApiError metadata for rate-limit handling', async () => {
		const rateLimitError = new ApiError(
			{ method: 'GET', url: 'flows/flow-123' },
			{
				body: { message: 'Too Many Requests' },
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://api.integrator.io/v1/flows/flow-123',
			},
			'Too Many Requests',
			{ retryAfter: 3000 },
		);
		mockRequest.mockRejectedValueOnce(rateLimitError);

		await expect(
			Flow.get(createMockContext(), { id: 'flow-123' }),
		).rejects.toBe(rateLimitError);
	});
});
