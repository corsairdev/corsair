import type { QuickBooksCatalogTestCase } from './catalog-cases';
import {
	executeBatch,
	getChangedData,
	QuickBooksSpecialEndpointSchemas,
} from './special';

// Mocked request/response cases for endpoints.test.ts. Not imported by the plugin.
const cdcTestTimestamp = new Date().toISOString();
export const QuickBooksSpecialTestCases: QuickBooksCatalogTestCase[] = [
	{
		id: 'batch.execute',
		method: 'POST',
		expectedPath: '/v3/company/12345678/batch',
		expectedQuery: {},
		expectedBody: {
			BatchItemRequest: [{ bId: 'batch-1', Query: 'SELECT * FROM Account' }],
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				BatchItemResponse: [{ bId: 'batch-1', QueryResponse: { Account: [] } }],
			},
		},
		expectedResult: {
			BatchItemResponse: [{ bId: 'batch-1', QueryResponse: { Account: [] } }],
		},
		input: {
			realmId: '12345678',
			items: [{ bId: 'batch-1', Query: 'SELECT * FROM Account' }],
		},
		inputSchema: QuickBooksSpecialEndpointSchemas['batch.execute'].input,
		outputSchema: QuickBooksSpecialEndpointSchemas['batch.execute'].output,
		invoke: (ctx) =>
			executeBatch(ctx, {
				realmId: '12345678',
				items: [{ bId: 'batch-1', Query: 'SELECT * FROM Account' }],
			}),
	},
	{
		id: 'changeDataCapture.changes',
		method: 'GET',
		expectedPath: '/v3/company/12345678/cdc',
		expectedQuery: { entities: 'Customer', changedSince: cdcTestTimestamp },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				CDCResponse: [{ QueryResponse: [{}] }],
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CDCResponse: [{ QueryResponse: [{}] }],
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			entities: ['Customer'],
			changedSince: cdcTestTimestamp,
		},
		inputSchema:
			QuickBooksSpecialEndpointSchemas['changeDataCapture.changes'].input,
		outputSchema:
			QuickBooksSpecialEndpointSchemas['changeDataCapture.changes'].output,
		invoke: (ctx) =>
			getChangedData(ctx, {
				realmId: '12345678',
				entities: ['Customer'],
				changedSince: cdcTestTimestamp,
			}),
	},
];
