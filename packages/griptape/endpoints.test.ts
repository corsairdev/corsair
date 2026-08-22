import { request } from 'corsair/http';
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

describe('Griptape Plugin API', () => {
	const apiKey = 'test-api-key';
	const plugin = griptape({ key: apiKey }) as any;
	const ctx = { key: apiKey } as any;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	describe('listAssistants', () => {
		it('sends GET /assistants with pagination parameters', async () => {
			const mockResponse = {
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

			const result = await plugin.endpoints.assistant.list(ctx, {
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
			const mockResponse = {
				assistants: [],
				pagination: {
					page_number: 1,
					page_size: 20,
					total_count: 0,
					total_pages: 0,
				},
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await plugin.endpoints.assistant.list(ctx, {});

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

	describe('getAssistant', () => {
		it('sends GET /assistants/{assistant_id}', async () => {
			const mockResponse = {
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

			const result = await plugin.endpoints.assistant.get(ctx, {
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
	});
});
