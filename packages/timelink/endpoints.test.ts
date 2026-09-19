import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { deletePerson } from './endpoints/delete-person';
import { TimelinkEndpointInputSchemas } from './endpoints/types';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('Timelink deletePerson endpoint', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as any;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('sends DELETE clients/{id} with auth header and returns parsed response', async () => {
		const mockResponse = { success: true, data: { id: 'client-1' } };
		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await deletePerson(ctx, { id: 'client-1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: apiKey,
			}),
			expect.objectContaining({
				method: 'DELETE',
				url: 'clients/client-1',
			}),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
			}),
		);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'timelink.delete.person',
			{ id: 'client-1' },
			'completed',
		);
		expect(result).toEqual(mockResponse);
	});

	it('encodes path-unsafe ids into a single URL segment', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			data: { id: 'client 1' },
		});

		await deletePerson(ctx, { id: 'client 1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: 'clients/client%201',
			}),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
			}),
		);
	});

	it('rejects ids containing path delimiters or dot segments', async () => {
		const badIds = [
			'../accounts',
			'..',
			'.',
			'123?target=other',
			'123#fragment',
			'',
		];

		for (const id of badIds) {
			await expect(deletePerson(ctx, { id } as never)).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		}

		expect(
			TimelinkEndpointInputSchemas.deletePerson.safeParse({
				id: 'valid-client-id',
			}).success,
		).toBe(true);
	});

	it('rejects a response that is not a delete envelope', async () => {
		mockRequest.mockResolvedValueOnce({ ok: true });

		await expect(deletePerson(ctx, { id: 'client-1' })).rejects.toThrow();
	});
});
