import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import * as AssistantRuns from './endpoints/assistant-runs';
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

describe('griptape assistant runs', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;
	const assistantId = '550e8400-e29b-41d4-a716-446655440000';
	const runId = '660e8400-e29b-41d4-a716-446655440000';

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	describe('createRun', () => {
		it('sends POST /assistants/{assistant_id}/runs with explicit body fields', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'running',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await AssistantRuns.createRun(ctx, {
				assistant_id: assistantId,
				input: 'Hello',
				model: 'gpt-5',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'POST',
					url: `assistants/${assistantId}/runs`,
					body: expect.objectContaining({
						input: 'Hello',
						model: 'gpt-5',
					}),
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('listRuns', () => {
		it('sends GET /assistants/{assistant_id}/runs with pagination', async () => {
			const mockResponse = {
				pagination: {
					page_number: 1,
					page_size: 10,
					total_count: 1,
					total_pages: 1,
				},
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await AssistantRuns.listRuns(ctx, {
				assistant_id: assistantId,
				page: 1,
				page_size: 10,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistants/${assistantId}/runs`,
					query: { page: 1, page_size: 10 },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('getRun', () => {
		it('sends GET /assistant-runs/{assistant_run_id}', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'completed',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await AssistantRuns.getRun(ctx, {
				assistant_run_id: runId,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('cancelRun', () => {
		it('sends POST /assistant-runs/{assistant_run_id}/cancel', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'cancelled',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await AssistantRuns.cancelRun(ctx, {
				assistant_run_id: runId,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'POST',
					url: `assistant-runs/${runId}/cancel`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('getResult', () => {
		it('sends GET /assistant-runs/{assistant_run_id} for the run result', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'completed',
				output: 'Hello back',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await AssistantRuns.getResult(ctx, {
				assistant_run_id: runId,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('retryRun', () => {
		it('sends GET /assistant-runs/{assistant_run_id} for the current run state', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'running',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await AssistantRuns.retryRun(ctx, {
				assistant_run_id: runId,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('getErrorDetails', () => {
		it('sends GET /assistant-runs/{assistant_run_id} carrying embedded error details', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'failed',
				error: 'Upstream model timed out',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await AssistantRuns.getErrorDetails(ctx, {
				assistant_run_id: runId,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('listLogs', () => {
		it('sends GET /assistant-runs/{assistant_run_id}/events with limit/offset', async () => {
			const mockResponse = {
				events: [],
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await AssistantRuns.listLogs(ctx, {
				assistant_run_id: runId,
				limit: 20,
				offset: 0,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}/events`,
					query: { limit: 20, offset: 0 },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('listEvents', () => {
		it('sends GET /assistant-runs/{assistant_run_id}/events with limit/offset', async () => {
			const mockResponse = {
				events: [
					{
						event_id: '770e8400-e29b-41d4-a716-446655440000',
						type: 'run_started',
					},
				],
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await AssistantRuns.listEvents(ctx, {
				assistant_run_id: runId,
				limit: 10,
				offset: 0,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}/events`,
					query: { limit: 10, offset: 0 },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('input schemas', () => {
		it('accepts a well-formed assistantRunCreate payload', () => {
			const parsed = GriptapeEndpointInputSchemas.assistantRunCreate.safeParse({
				assistant_id: assistantId,
				input: 'Hello',
				model: 'gpt-5',
			});

			expect(parsed.success).toBe(true);
		});

		it('rejects assistantRunEvents with an empty run id', () => {
			const parsed = GriptapeEndpointInputSchemas.assistantRunEvents.safeParse({
				assistant_run_id: '',
				limit: 10,
			});

			expect(parsed.success).toBe(false);
		});
	});
});
