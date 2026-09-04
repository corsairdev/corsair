import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import {
	createComponent,
	createRetriever,
	getComponent,
	getRetriever,
	listComponents,
	listRetrievers,
	queryRetriever,
	updateComponent,
	updateRetriever,
} from './endpoints/retrievers';
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

const ctx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('retrievers endpoints', () => {
	it('listRetrievers sends GET /retrievers with pagination', async () => {
		const payload = {
			items: [{ retriever_id: 'retriever-001', name: 'Docs retriever' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await listRetrievers(ctx, { page: 1, page_size: 10 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'retrievers' }),
		);
		expect(result).toEqual(payload);
	});

	it('createRetriever sends POST /retrievers', async () => {
		const payload = { retriever_id: 'retriever-002', name: 'New retriever' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await createRetriever(ctx, {
			body: { name: 'New retriever' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'retrievers' }),
		);
		expect(result).toEqual(payload);
	});

	it('getRetriever sends GET /retrievers/{retriever_id}', async () => {
		const payload = { retriever_id: 'retriever-003', name: 'KB retriever' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await getRetriever(ctx, { retriever_id: 'retriever-003' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'retrievers/retriever-003',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('updateRetriever sends PATCH /retrievers/{retriever_id}', async () => {
		const payload = { retriever_id: 'retriever-004', name: 'Renamed' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await updateRetriever(ctx, {
			retriever_id: 'retriever-004',
			body: { name: 'Renamed' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'retrievers/retriever-004',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('queryRetriever sends POST /retrievers/{retriever_id}/query', async () => {
		const payload = { matches: [{ score: 0.9, text: 'refund policy' }] };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await queryRetriever(ctx, {
			retriever_id: 'retriever-005',
			query: 'what is the refund policy?',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'retrievers/retriever-005/query',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('listComponents sends GET /retriever-components with pagination', async () => {
		const payload = {
			items: [{ retriever_component_id: 'component-001' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await listComponents(ctx, { page: 1, page_size: 10 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'retriever-components' }),
		);
		expect(result).toEqual(payload);
	});

	it('createComponent sends POST /retriever-components', async () => {
		const payload = { retriever_component_id: 'component-002' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await createComponent(ctx, { body: { kind: 'reranker' } });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'retriever-components' }),
		);
		expect(result).toEqual(payload);
	});

	it('getComponent sends GET /retriever-components/{retriever_component_id}', async () => {
		const payload = { retriever_component_id: 'component-003' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await getComponent(ctx, {
			retriever_component_id: 'component-003',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'retriever-components/component-003',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('updateComponent sends PATCH /retriever-components/{retriever_component_id}', async () => {
		const payload = { retriever_component_id: 'component-004' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await updateComponent(ctx, {
			retriever_component_id: 'component-004',
			body: { top_n: 5 },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'retriever-components/component-004',
			}),
		);
		expect(result).toEqual(payload);
	});
});

describe('retrievers input schemas', () => {
	it('accepts a valid retrieverQuery input', () => {
		const parsed = GriptapeEndpointInputSchemas.retrieverQuery.safeParse({
			retriever_id: 'retriever-005',
			query: 'what is the refund policy?',
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects an empty query for retrieverQuery', () => {
		const parsed = GriptapeEndpointInputSchemas.retrieverQuery.safeParse({
			retriever_id: 'retriever-005',
			query: '',
		});
		expect(parsed.success).toBe(false);
	});
});
