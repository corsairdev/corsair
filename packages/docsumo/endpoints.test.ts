import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	AgentsEndpoints,
	AnalyticsEndpoints,
	DocumentsEndpoints,
	DocumentTypesEndpoints,
	FoldersEndpoints,
	TablesEndpoints,
	UserEndpoints,
} from './endpoints';
import type { DocsumoContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;
const TEST_API_KEY = 'test-api-key';
const ctx = { key: TEST_API_KEY } as unknown as DocsumoContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

function expectDocsumoAuth() {
	expect(mockRequest).toHaveBeenCalledWith(
		expect.objectContaining({
			BASE: 'https://app.docsumo.com',
			HEADERS: expect.objectContaining({ apikey: TEST_API_KEY }),
		}),
		expect.anything(),
	);
}

describe('TablesEndpoints.addRow', () => {
	it('posts to the table add-row endpoint', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success', data: [] });

		await TablesEndpoints.addRow(ctx, { ddid: 'table-1' });

		expectDocsumoAuth();
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/api/v1/raichu/drop_down/db/addrow/table-1/',
			}),
		);
	});
});

describe('TablesEndpoints.delete', () => {
	it('sends dd_ids in the delete request body', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success', status_code: 200 });

		await TablesEndpoints.delete(ctx, { dd_ids: ['a', 'b'] });

		expectDocsumoAuth();
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: '/api/v1/raichu/drop_down/db/delete/',
				body: { dd_ids: ['a', 'b'] },
			}),
		);
	});
});

describe('TablesEndpoints.getData', () => {
	it('fetches table data by ddid', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			data: { data: [{ id: 1 }] },
		});

		const result = await TablesEndpoints.getData(ctx, { ddid: 'table-9' });

		expectDocsumoAuth();
		expect(result.data?.data).toHaveLength(1);
	});
});

describe('FoldersEndpoints.create', () => {
	it('creates a folder with name and type', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success' });

		await FoldersEndpoints.create(ctx, {
			folder_name: 'Invoices',
			type: 'invoice',
		});

		expectDocsumoAuth();
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/api/v1/mew/folder/add/',
				body: { folder_name: 'Invoices', type: 'invoice' },
			}),
		);
	});
});

describe('DocumentTypesEndpoints', () => {
	it('getEnabled calls the documents summary endpoint', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success', data: {} });

		await DocumentTypesEndpoints.getEnabled(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				url: '/api/v1/mew/apikey/documents/summary/',
			}),
		);
	});

	it('listEnabled calls the enabled document types endpoint', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			data: { document: [{ doc_type: 'invoice' }] },
		});

		const result = await DocumentTypesEndpoints.listEnabled(ctx, {});

		expect(result.data?.document?.[0]?.doc_type).toBe('invoice');
	});
});

describe('DocumentsEndpoints.listAll', () => {
	it('passes pagination and filter query params', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			data: { documents: [], total: 0, limit: 10, offset: 5 },
		});

		await DocumentsEndpoints.listAll(ctx, {
			limit: 10,
			offset: 5,
			status: 'processed',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: { limit: 10, offset: 5, status: 'processed' },
			}),
		);
	});
});

describe('UserEndpoints.getDocumentTypes', () => {
	it('returns user document type metadata', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			data: {
				user_id: 'user-1',
				document_types: [{ title: 'Invoice', value: 'invoice' }],
			},
		});

		const result = await UserEndpoints.getDocumentTypes(ctx, {});

		expect(result.data?.user_id).toBe('user-1');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'docsumo.user.getDocumentTypes',
			{ user_id: 'user-1' },
			'completed',
		);
	});
});

describe('AgentsEndpoints', () => {
	it('listExternal requests agents with optional type filter', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			data: { agents: [{ agent_type: 'casetype' }] },
		});

		await AgentsEndpoints.listExternal(ctx, { type: 'casetype' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				url: '/api/v1/external/agents',
				query: { type: 'casetype' },
			}),
		);
	});

	it('listCases encodes casetype_id in the path', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			data: {
				cases: [{ case_id: 'case-1' }],
				pagination: { total: 1 },
			},
		});

		await AgentsEndpoints.listCases(ctx, {
			casetype_id: 'others__abc',
			limit: 20,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				url: '/api/v1/external/agents/others__abc/cases',
				query: { limit: 20 },
			}),
		);
	});
});

describe('AnalyticsEndpoints.mcaAnalysis', () => {
	it('posts doc_ids to the MCA analysis endpoint', async () => {
		mockRequest.mockResolvedValueOnce({
			account_summaries: [[{ account_info: { account_name: 'Acme' } }]],
		});

		const result = await AnalyticsEndpoints.mcaAnalysis(ctx, {
			doc_ids: ['doc-1', 'doc-2'],
			allow_partial: true,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/api/v1/skitty/analytics/account-summary/',
				body: { doc_ids: ['doc-1', 'doc-2'] },
				query: { allow_partial: true },
			}),
		);
		expect(result.account_summaries).toHaveLength(1);
	});
});

describe('makeDocsumoRequest error propagation', () => {
	it('preserves ApiError status for rate-limit handling', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/api/v1/eevee/apikey/limit/' },
				{
					url: 'https://app.docsumo.com/api/v1/eevee/apikey/limit/',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {},
				},
				'Too Many Requests',
			),
		);

		await expect(
			UserEndpoints.getDocumentTypes(ctx, {}),
		).rejects.toBeInstanceOf(ApiError);
	});
});
