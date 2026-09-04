import { request } from 'corsair/http';
import * as KnowledgeBases from './endpoints/knowledge-bases';
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

describe('griptape knowledge-bases endpoints', () => {
	const ctx = { key: 'test-api-key' } as unknown as GriptapeContext;
	const kbId = '550e8400-e29b-41d4-a716-446655440010';
	const jobId = '550e8400-e29b-41d4-a716-446655440011';
	const searchId = '550e8400-e29b-41d4-a716-446655440012';

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('list sends GET knowledge-bases with pagination', async () => {
		const payload = { data: [], pagination: { page_number: 1 } };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.list(ctx, {
			page: 1,
			page_size: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'knowledge-bases' }),
		);
		expect(result).toEqual(payload);
	});

	it('create sends POST knowledge-bases', async () => {
		const payload = { knowledge_base_id: kbId, name: 'kb-one' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.create(ctx, {
			body: { name: 'kb-one' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'knowledge-bases' }),
		);
		expect(result).toEqual(payload);
	});

	it('get sends GET knowledge-bases/{id}', async () => {
		const payload = { knowledge_base_id: kbId, name: 'kb-one' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.get(ctx, { knowledge_base_id: kbId });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-bases/${kbId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('update sends PATCH knowledge-bases/{id}', async () => {
		const payload = { knowledge_base_id: kbId, name: 'kb-renamed' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.update(ctx, {
			knowledge_base_id: kbId,
			body: { name: 'kb-renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: `knowledge-bases/${kbId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE knowledge-bases/{id}', async () => {
		const payload = undefined as unknown as Record<string, never>;
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.remove(ctx, {
			knowledge_base_id: kbId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: `knowledge-bases/${kbId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('query sends POST knowledge-bases/{id}/query', async () => {
		const payload = { answer: 'hello' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.query(ctx, {
			knowledge_base_id: kbId,
			query: 'hello',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: `knowledge-bases/${kbId}/query`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('search sends POST knowledge-bases/{id}/search', async () => {
		const payload = { results: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.search(ctx, {
			knowledge_base_id: kbId,
			query: 'hello',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: `knowledge-bases/${kbId}/search`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('listQueries sends GET knowledge-bases/{id}/queries', async () => {
		const payload = { data: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.listQueries(ctx, {
			knowledge_base_id: kbId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-bases/${kbId}/queries`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('listSearches sends GET knowledge-bases/{id}/searches', async () => {
		const payload = { data: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.listSearches(ctx, {
			knowledge_base_id: kbId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-bases/${kbId}/searches`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('getSearch sends GET knowledge-base-searches/{id}', async () => {
		const payload = { knowledge_base_search_id: searchId };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.getSearch(ctx, {
			knowledge_base_search_id: searchId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-base-searches/${searchId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('createJob sends POST knowledge-bases/{id}/knowledge-base-jobs', async () => {
		const payload = { knowledge_base_job_id: jobId, status: 'queued' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.createJob(ctx, {
			knowledge_base_id: kbId,
			body: { source: 's3' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: `knowledge-bases/${kbId}/knowledge-base-jobs`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('listJobs sends GET knowledge-bases/{id}/knowledge-base-jobs', async () => {
		const payload = { data: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.listJobs(ctx, {
			knowledge_base_id: kbId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-bases/${kbId}/knowledge-base-jobs`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('getJob sends GET knowledge-base-jobs/{id}', async () => {
		const payload = { knowledge_base_job_id: jobId, status: 'done' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.getJob(ctx, {
			knowledge_base_job_id: jobId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-base-jobs/${jobId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('validates knowledgeBaseQuery input', () => {
		const parsed = GriptapeEndpointInputSchemas.knowledgeBaseQuery.safeParse({
			knowledge_base_id: kbId,
			query: 'hello',
		});

		expect(parsed.success).toBe(true);
	});

	it('rejects knowledgeBaseQuery with an empty query', () => {
		const parsed = GriptapeEndpointInputSchemas.knowledgeBaseQuery.safeParse({
			knowledge_base_id: kbId,
			query: '',
		});

		expect(parsed.success).toBe(false);
	});

	it('validates knowledgeBaseSearch input', () => {
		const parsed = GriptapeEndpointInputSchemas.knowledgeBaseSearch.safeParse({
			knowledge_base_id: kbId,
			query: 'hello',
		});

		expect(parsed.success).toBe(true);
	});
});
