import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { create, remove, update } from './endpoints/assistants';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import type { GriptapeContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLog = jest.mocked(logEventFromContext);

describe('griptape assistants mutating endpoints', () => {
	const apiKey = 'test-api-key';
	// Narrow assertion: handlers under test only read ctx.key, and
	// logEventFromContext is mocked above.
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	it('create sends POST /assistants with the input body', async () => {
		const payload = { assistant_id: 'a-1', name: 'Support Bot' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await create(ctx, {
			body: { name: 'Support Bot', description: 'l1 support' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://cloud.griptape.ai/api',
				HEADERS: expect.objectContaining({
					Authorization: `Bearer ${apiKey}`,
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: 'assistants',
				body: { name: 'Support Bot', description: 'l1 support' },
			}),
		);
		expect(result).toEqual(payload);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'griptape.assistant.create',
			expect.anything(),
			'completed',
		);
	});

	it('update sends PATCH /assistants/{assistant_id} with the input body', async () => {
		const payload = { assistant_id: 'a-1', name: 'Renamed' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await update(ctx, {
			assistant_id: 'a-1',
			body: { name: 'Renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PATCH',
				url: 'assistants/a-1',
				body: { name: 'Renamed' },
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE /assistants/{assistant_id} with no body', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await remove(ctx, { assistant_id: 'a-1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: 'assistants/a-1',
			}),
		);
		expect(result).toBeUndefined();
	});

	it('validates assistantCreate input bodies', () => {
		expect(
			GriptapeEndpointInputSchemas.assistantCreate.safeParse({
				body: { name: 'Support Bot' },
			}).success,
		).toBe(true);
		expect(
			GriptapeEndpointInputSchemas.assistantCreate.safeParse({
				body: 'not-an-object',
			}).success,
		).toBe(false);
	});

	it('rejects assistantUpdate without an id', () => {
		expect(
			GriptapeEndpointInputSchemas.assistantUpdate.safeParse({
				body: { name: 'x' },
			}).success,
		).toBe(false);
		expect(
			GriptapeEndpointInputSchemas.assistantDelete.safeParse({
				assistant_id: '',
			}).success,
		).toBe(false);
	});
});
