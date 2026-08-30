import { Aryn } from './endpoints';
import {
	ArynEndpointInputSchemas,
	ArynEndpointOutputSchemas,
	DocumentGetBinaryResponseSchema,
	DocumentPartitionResponseSchema,
} from './endpoints/types';
import type { ArynContext } from './index';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
	ApiError: class extends Error {
		constructor(
			request: unknown,
			response: {
				url: string;
				status: number;
				statusText: string;
				body: unknown;
			},
			message: string,
			rateLimitInfo?: { retryAfter?: number },
		) {
			super(message);
			this.name = 'ApiError';
			this.url = response.url;
			this.status = response.status;
			this.statusText = response.statusText;
			this.body = response.body;
			this.request = request;
			this.retryAfter = rateLimitInfo?.retryAfter;
		}
		url: string;
		status: number;
		statusText: string;
		body: unknown;
		request: unknown;
		retryAfter?: number;
	},
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

import { request } from 'corsair/http';

const mockRequest = jest.mocked(request);

const docSetFixture = {
	docset_id: 'ds_123',
	name: 'test-docset',
	readonly: false,
};

const mockCtx = { key: 'test-api-key' } as never as ArynContext;

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Aryn endpoints (mocked)', () => {
	it('docsetCreate posts to /v1/storage/docsets and validates output', async () => {
		mockRequest.mockResolvedValueOnce(docSetFixture);

		const result = await Aryn.docsetCreate(mockCtx, { name: 'test-docset' });

		const call = mockRequest.mock.calls[0];
		expect(call?.[0]).toMatchObject({ BASE: 'https://api.aryn.ai' });
		expect(call?.[1]).toMatchObject({
			method: 'POST',
			url: '/v1/storage/docsets',
		});
		const validated = ArynEndpointOutputSchemas.docsetCreate.parse(result);
		expect(validated.docset_id).toBe('ds_123');
	});

	it('docsetGet fetches by id and validates output', async () => {
		mockRequest.mockResolvedValueOnce(docSetFixture);

		const result = await Aryn.docsetGet(mockCtx, { docset_id: 'ds_123' });

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v1/storage/docsets/ds_123',
		});
		const validated = ArynEndpointOutputSchemas.docsetGet.parse(result);
		expect(validated.name).toBe('test-docset');
	});

	it('docsetDelete sends DELETE and validates output', async () => {
		mockRequest.mockResolvedValueOnce(docSetFixture);

		const result = await Aryn.docsetDelete(mockCtx, { docset_id: 'ds_123' });

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'DELETE',
			url: '/v1/storage/docsets/ds_123',
		});
		expect(ArynEndpointOutputSchemas.docsetDelete.parse(result)).toBeDefined();
	});

	it('encodes reserved characters in path ids', async () => {
		mockRequest.mockResolvedValueOnce(docSetFixture);

		await Aryn.docsetGet(mockCtx, { docset_id: 'ds/a b' });

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: `/v1/storage/docsets/${encodeURIComponent('ds/a b')}`,
		});
	});

	it('documentGet validates parsed elements against the schema', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 'doc_1',
			elements: [
				{
					id: 'el_1',
					type: 'Table',
					properties: { score: 0.93, page_number: 1 },
					text_representation: 'cell',
				},
			],
			properties: { source: 'test' },
		});

		const result = await Aryn.documentGet(mockCtx, {
			docset_id: 'ds_123',
			doc_id: 'doc_1',
		});

		// Inclusion flags must travel as GET query parameters, not a request
		// body (which the transport layer discards on GET requests).
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			query: {
				include_elements: true,
				include_binary: false,
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]?.query).not.toHaveProperty(
			'include_original_elements',
		);
		const validated = ArynEndpointOutputSchemas.documentGet.parse(result);
		expect(validated.id).toBe('doc_1');
		expect(validated.elements?.[0]?.type).toBe('Table');
		expect(validated.elements?.[0]?.properties?.page_number).toBe(1);
	});
});

describe('Aryn remaining endpoints (mocked)', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('documentGetBinary returns base64 content via the binary request path', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				new Response(new Uint8Array([1, 2, 3]), { status: 200 }),
			);

		const result = await Aryn.documentGetBinary(mockCtx, {
			docset_id: 'ds_123',
			doc_id: 'doc_1',
		});

		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.aryn.ai/v1/storage/docsets/ds_123/docs/doc_1/binary',
			expect.objectContaining({ method: 'GET' }),
		);
		const validated = DocumentGetBinaryResponseSchema.parse(result);
		expect(validated.docset_id).toBe('ds_123');
		expect(validated.doc_id).toBe('doc_1');
		expect(validated.contentBase64).toBe('AQID');
	});

	it('documentPartition posts multipart form data and validates output', async () => {
		mockRequest.mockResolvedValueOnce({
			status: ['OK'],
			status_code: 200,
			elements: [
				{
					type: 'Text',
					properties: { score: 0.99, page_number: 1 },
					text_representation: 'hello',
				},
			],
		});

		const result = await Aryn.documentPartition(mockCtx, {
			file_url: 'https://example.com/doc.pdf',
			options: { threshold: 'auto' },
		});

		const call = mockRequest.mock.calls[0];
		expect(call?.[0]).toMatchObject({ BASE: 'https://api.aryn.cloud' });
		expect(call?.[1]).toMatchObject({
			method: 'POST',
			url: '/v1/document/partition',
		});
		const validated = DocumentPartitionResponseSchema.parse(result);
		expect(validated.status).toEqual(['OK']);
		expect(validated.status_code).toBe(200);
		expect(validated.elements?.[0]?.text_representation).toBe('hello');
	});

	it('rejects partition and async add without a file or file_url', async () => {
		expect(() =>
			ArynEndpointInputSchemas.documentPartition.parse({}),
		).toThrow();
		expect(() =>
			ArynEndpointInputSchemas.documentSubmitAsyncAdd.parse({
				docset_id: 'ds_123',
			}),
		).toThrow();
		await expect(Aryn.documentPartition(mockCtx, {})).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws when the API omits required output fields', async () => {
		mockRequest.mockResolvedValueOnce({});
		await expect(
			Aryn.docsetCreate(mockCtx, { name: 'test-docset' }),
		).rejects.toThrow();
	});

	it('documentSubmitAsyncAdd returns a task id and validates output', async () => {
		mockRequest.mockResolvedValueOnce({ task_id: 'task_9' });

		const result = await Aryn.documentSubmitAsyncAdd(mockCtx, {
			docset_id: 'ds_123',
			file_url: 'https://example.com/doc.pdf',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/v1/async/submit/storage/docsets/ds_123/docs',
		});
		const validated =
			ArynEndpointOutputSchemas.documentSubmitAsyncAdd.parse(result);
		expect(validated.task_id).toBe('task_9');
	});

	it('queryGeneratePlan posts the query and validates output', async () => {
		mockRequest.mockResolvedValueOnce({
			query: 'revenue by region',
			nodes: { 0: { node_id: 0, node_type: 'scan' } },
			result_node: 0,
		});

		const result = await Aryn.queryGeneratePlan(mockCtx, {
			query: 'revenue by region',
			docset_id: 'ds_123',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/v1/query/plan',
		});
		const validated = ArynEndpointOutputSchemas.queryGeneratePlan.parse(result);
		expect(validated.query).toBe('revenue by region');
		expect(validated.result_node).toBe(0);
		expect(validated.nodes['0']?.node_id).toBe(0);
	});

	it('asyncTasksList returns a tasks map and validates output', async () => {
		mockRequest.mockResolvedValueOnce({
			tasks: {
				'aryn:t-1': {
					action: '/v1/storage/docsets/{docset_id}/docs',
					task_status: 'done',
				},
			},
		});

		const result = await Aryn.asyncTasksList(mockCtx, {});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v1/async/list',
			query: {
				path_filter: '^/v1/storage/docsets/{docset_id}/docs$',
			},
		});
		const validated = ArynEndpointOutputSchemas.asyncTasksList.parse(result);
		expect(validated.tasks['aryn:t-1']?.task_status).toBe('done');
	});

	describe('path_filter input validation', () => {
		it('accepts the only value supported by the Aryn API', () => {
			const parsed = ArynEndpointInputSchemas.asyncTasksList.parse({
				path_filter: '^/v1/storage/docsets/{docset_id}/docs$',
			});
			expect(parsed.path_filter).toBe('^/v1/storage/docsets/{docset_id}/docs$');
		});

		it('accepts an omitted path_filter', () => {
			const parsed = ArynEndpointInputSchemas.asyncTasksList.parse({});
			expect(parsed.path_filter).toBeUndefined();
		});

		it('rejects values the Aryn API does not support', () => {
			expect(() =>
				ArynEndpointInputSchemas.asyncTasksList.parse({
					path_filter: '/some/other/filter',
				}),
			).toThrow();
		});
	});
});
