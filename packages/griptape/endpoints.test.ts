import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type {
	AssistantGetResponse,
	AssistantListResponse,
} from './endpoints/types';
import {
	GriptapeEndpointInputSchemas,
	GriptapeEndpointOutputSchemas,
} from './endpoints/types';
import type { GriptapeContext } from './index';
import { griptape } from './index';

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

describe('Griptape Plugin API', () => {
	const apiKey = 'test-api-key';

	const griptapePlugin = griptape({ key: apiKey });
	const endpoints = griptapePlugin.endpoints;
	if (!endpoints) throw new Error('griptape plugin must expose endpoints');

	// Narrow assertion: the handlers under test only read ctx.key, and
	// logEventFromContext is mocked above, so a partial context is safe here.
	// A full context would require constructing the encrypted key manager.
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	describe('assistant.list', () => {
		it('sends GET /assistants with pagination parameters', async () => {
			const mockResponse: AssistantListResponse = {
				assistants: [
					{
						assistant_id: '550e8400-e29b-41d4-a716-446655440000',
						created_at: '2026-01-01T00:00:00Z',
						created_by: 'user@example.com',
						description: 'Test assistant',
						input: 'text',
						knowledge_base_ids: [],
						model: 'gpt-5',
						name: 'Test Assistant',
						organization_id: '550e8400-e29b-41d4-a716-446655440001',
						retriever_ids: [],
						ruleset_ids: [],
						structure_ids: [],
						tool_ids: [],
						updated_at: '2026-01-01T00:00:00Z',
					},
				],
				pagination: {
					page_number: 1,
					page_size: 10,
					total_count: 1,
					total_pages: 1,
					next_page: 2,
					previous_page: 0,
				},
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await endpoints.assistant.list(ctx, {
				page: 1,
				page_size: 10,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://cloud.griptape.ai/api',
					HEADERS: expect.objectContaining({
						Authorization: `Bearer ${apiKey}`,
					}),
				}),
				expect.objectContaining({
					method: 'GET',
					url: 'assistants',
					query: {
						page: 1,
						page_size: 10,
					},
				}),
			);

			expect(result).toEqual(mockResponse);
		});

		it('lists assistants without optional pagination parameters', async () => {
			const mockResponse: AssistantListResponse = {
				assistants: [],
				pagination: {
					page_number: 1,
					page_size: 20,
					total_count: 0,
					total_pages: 0,
				},
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await endpoints.assistant.list(ctx, {});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'assistants',
					query: {
						page: undefined,
						page_size: undefined,
					},
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('assistant.get', () => {
		it('sends GET /assistants/{assistant_id}', async () => {
			const mockResponse: AssistantGetResponse = {
				assistant_id: '550e8400-e29b-41d4-a716-446655440000',
				created_at: '2026-01-01T00:00:00Z',
				created_by: 'user@example.com',
				description: 'Test assistant',
				knowledge_base_ids: [],
				name: 'Test Assistant',
				organization_id: '550e8400-e29b-41d4-a716-446655440001',
				retriever_ids: [],
				ruleset_ids: [],
				structure_ids: [],
				tool_ids: [],
				updated_at: '2026-01-01T00:00:00Z',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await endpoints.assistant.get(ctx, {
				assistant_id: '550e8400-e29b-41d4-a716-446655440000',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://cloud.griptape.ai/api',
					HEADERS: expect.objectContaining({
						Authorization: `Bearer ${apiKey}`,
					}),
				}),
				expect.objectContaining({
					method: 'GET',
					url: 'assistants/550e8400-e29b-41d4-a716-446655440000',
				}),
			);

			expect(result).toEqual(mockResponse);
		});

		it('propagates ApiError unchanged so status-based handlers keep working', async () => {
			const requestOptions = {
				method: 'GET' as const,
				url: 'assistants/550e8400-e29b-41d4-a716-446655440000',
			};
			const rateLimitError = new ApiError(
				requestOptions,
				{
					url: 'https://cloud.griptape.ai/api/assistants/550e8400-e29b-41d4-a716-446655440000',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { message: 'Too Many Requests' },
				},
				'Too Many Requests',
				{ retryAfter: 30000 },
			);

			mockRequest.mockRejectedValueOnce(rateLimitError);

			await expect(
				endpoints.assistant.get(ctx, {
					assistant_id: '550e8400-e29b-41d4-a716-446655440000',
				}),
			).rejects.toBe(rateLimitError);
			expect(mockLog).not.toHaveBeenCalled();
		});

		it('rejects non-UUID assistant ids at the input schema boundary', () => {
			const result = GriptapeEndpointInputSchemas.assistantGet.safeParse({
				assistant_id: 'not-a-uuid',
			});

			expect(result.success).toBe(false);
		});
	});

	describe('endpoint schemas', () => {
		it('validates well-formed list responses through the output schema', () => {
			const parsed = GriptapeEndpointOutputSchemas.assistantList.safeParse({
				assistants: [],
				pagination: {
					page_number: 2,
					page_size: 20,
					total_count: 41,
					total_pages: 3,
					next_page: 3,
					previous_page: 1,
				},
			});

			expect(parsed.success).toBe(true);
		});

		it('rejects responses with missing pagination fields', () => {
			const parsed = GriptapeEndpointOutputSchemas.assistantList.safeParse({
				assistants: [],
			});

			expect(parsed.success).toBe(false);
		});

		it('rejects detail payloads where ids are not UUIDs', () => {
			const parsed = GriptapeEndpointOutputSchemas.assistantGet.safeParse({
				assistant_id: 'garbage-id',
				created_at: '2026-01-01T00:00:00Z',
				created_by: 'user@example.com',
				description: 'Test assistant',
				knowledge_base_ids: [],
				name: 'Test Assistant',
				organization_id: '550e8400-e29b-41d4-a716-446655440001',
				retriever_ids: [],
				ruleset_ids: [],
				structure_ids: [],
				tool_ids: [],
				updated_at: '2026-01-01T00:00:00Z',
			});

			expect(parsed.success).toBe(false);
		});
	});
});
