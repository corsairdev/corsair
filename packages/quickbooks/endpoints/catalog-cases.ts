import type { z } from 'zod';
import type { QuickBooksCatalogContext } from './catalog';
import {
	QuickBooksCatalogEndpointSchemas,
	QuickBooksCatalogEndpoints,
} from './catalog';

// Mocked request/response cases for endpoints.test.ts. Not imported by the plugin.

function schemasFor(id: string) {
	const entry = QuickBooksCatalogEndpointSchemas[id];
	if (!entry) throw new Error(`No schemas for ${id}`);
	return entry;
}
export type QuickBooksCatalogTestCase = {
	id: string;
	method: 'GET' | 'POST';
	expectedPath: string;
	expectedQuery: Record<string, string>;
	expectedBody?: object;
	requestKind: 'json' | 'form-data' | 'none';
	response:
		| { kind: 'json'; body: object }
		| { kind: 'text'; body: string }
		| { kind: 'binary'; bytes: number[] };
	expectedResult: object | string;
	input: object;
	inputSchema: z.ZodType;
	outputSchema: z.ZodType;
	invoke: (ctx: QuickBooksCatalogContext) => Promise<object | string>;
};
export const QuickBooksCatalogTestCases: QuickBooksCatalogTestCase[] = [
	{
		id: 'apAgingDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/AgedPayableDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('apAgingDetail.list').input,
		outputSchema: schemasFor('apAgingDetail.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['apAgingDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'apAgingSummary.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/AgedPayables',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('apAgingSummary.list').input,
		outputSchema: schemasFor('apAgingSummary.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['apAgingSummary']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'arAgingDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/AgedReceivableDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('arAgingDetail.list').input,
		outputSchema: schemasFor('arAgingDetail.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['arAgingDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'arAgingSummary.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/AgedReceivables',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('arAgingSummary.list').input,
		outputSchema: schemasFor('arAgingSummary.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['arAgingSummary']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'accounts.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/account',
		expectedQuery: {},
		expectedBody: { Id: '35', Name: 'sample', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Account: { Id: '1', Name: 'sample' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Account: { Id: '1', Name: 'sample' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', Name: 'sample', SyncToken: '0' },
		},
		inputSchema: schemasFor('accounts.update').input,
		outputSchema: schemasFor('accounts.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['accounts']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', Name: 'sample', SyncToken: '0' },
			}),
	},
	{
		id: 'accountListDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/AccountList',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('accountListDetail.list').input,
		outputSchema: schemasFor('accountListDetail.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['accountListDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'attachable.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/attachable',
		expectedQuery: {},
		expectedBody: {},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: {} },
		inputSchema: schemasFor('attachable.create').input,
		outputSchema: schemasFor('attachable.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['create'](ctx, {
				realmId: '12345678',
				body: {},
			}),
	},
	{
		id: 'attachable.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/attachable',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Attachable: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Attachable: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('attachable.delete').input,
		outputSchema: schemasFor('attachable.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'attachable.download',
		method: 'GET',
		expectedPath: '/v3/company/12345678/download/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'text',
			body: 'https://download.example.test/temporary-file',
		},
		expectedResult: 'https://download.example.test/temporary-file',
		input: { realmId: '12345678', attachableId: '35' },
		inputSchema: schemasFor('attachable.download').input,
		outputSchema: schemasFor('attachable.download').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['download'](ctx, {
				realmId: '12345678',
				attachableId: '35',
			}),
	},
	{
		id: 'attachable.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Attachable' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Attachable: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Attachable: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('attachable.list').input,
		outputSchema: schemasFor('attachable.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'attachable.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/attachable/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', attachableId: '35' },
		inputSchema: schemasFor('attachable.get').input,
		outputSchema: schemasFor('attachable.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['get'](ctx, {
				realmId: '12345678',
				attachableId: '35',
			}),
	},
	{
		id: 'attachable.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/attachable',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('attachable.update').input,
		outputSchema: schemasFor('attachable.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'attachable.upload',
		method: 'POST',
		expectedPath: '/v3/company/12345678/upload',
		expectedQuery: {},
		requestKind: 'form-data',
		response: {
			kind: 'json',
			body: {
				AttachableResponse: [{ Attachable: { Id: '1' } }],
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			AttachableResponse: [{ Attachable: { Id: '1' } }],
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			fileName: 'receipt.pdf',
			contentType: 'application/pdf',
			base64Content: 'JVBERg==',
			metadata: {},
		},
		inputSchema: schemasFor('attachable.upload').input,
		outputSchema: schemasFor('attachable.upload').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['upload'](ctx, {
				realmId: '12345678',
				fileName: 'receipt.pdf',
				contentType: 'application/pdf',
				base64Content: 'JVBERg==',
				metadata: {},
			}),
	},
	{
		id: 'balanceSheet.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/BalanceSheet',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('balanceSheet.list').input,
		outputSchema: schemasFor('balanceSheet.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['balanceSheet']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'bill.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/bill',
		expectedQuery: {},
		expectedBody: { VendorRef: { value: 'sample' }, Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { VendorRef: { value: 'sample' }, Line: [] },
		},
		inputSchema: schemasFor('bill.create').input,
		outputSchema: schemasFor('bill.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['bill']['create'](ctx, {
				realmId: '12345678',
				body: { VendorRef: { value: 'sample' }, Line: [] },
			}),
	},
	{
		id: 'bill.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/bill',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Bill: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Bill: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('bill.delete').input,
		outputSchema: schemasFor('bill.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['bill']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'bill.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Bill' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Bill: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Bill: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('bill.list').input,
		outputSchema: schemasFor('bill.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['bill']['list'](ctx, { realmId: '12345678' }),
	},
	{
		id: 'bill.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/bill/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', billId: '35' },
		inputSchema: schemasFor('bill.get').input,
		outputSchema: schemasFor('bill.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['bill']['get'](ctx, {
				realmId: '12345678',
				billId: '35',
			}),
	},
	{
		id: 'bill.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/bill',
		expectedQuery: {},
		expectedBody: {
			VendorRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('bill.update').input,
		outputSchema: schemasFor('bill.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['bill']['update'](ctx, {
				realmId: '12345678',
				body: {
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'billPayment.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/billpayment',
		expectedQuery: {},
		expectedBody: {
			VendorRef: { value: 'sample' },
			TotalAmt: 1,
			Line: [],
			PayType: 'Check',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				BillPayment: {
					VendorRef: { value: 'sample' },
					Line: [],
					TotalAmt: 1,
					PayType: 'Check',
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			BillPayment: {
				VendorRef: { value: 'sample' },
				Line: [],
				TotalAmt: 1,
				PayType: 'Check',
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				VendorRef: { value: 'sample' },
				TotalAmt: 1,
				Line: [],
				PayType: 'Check',
			},
		},
		inputSchema: schemasFor('billPayment.create').input,
		outputSchema: schemasFor('billPayment.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['create'](ctx, {
				realmId: '12345678',
				body: {
					VendorRef: { value: 'sample' },
					TotalAmt: 1,
					Line: [],
					PayType: 'Check',
				},
			}),
	},
	{
		id: 'billPayment.void',
		method: 'POST',
		expectedPath: '/v3/company/12345678/billpayment',
		expectedQuery: { operation: 'update', include: 'void' },
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				BillPayment: {
					VendorRef: { value: 'sample' },
					Line: [],
					TotalAmt: 1,
					PayType: 'Check',
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			BillPayment: {
				VendorRef: { value: 'sample' },
				Line: [],
				TotalAmt: 1,
				PayType: 'Check',
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: schemasFor('billPayment.void').input,
		outputSchema: schemasFor('billPayment.void').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['void'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'billPayment.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/billpayment',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				BillPayment: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			BillPayment: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('billPayment.delete').input,
		outputSchema: schemasFor('billPayment.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'billPayment.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM BillPayment' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { BillPayment: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { BillPayment: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('billPayment.list').input,
		outputSchema: schemasFor('billPayment.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'billPayment.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/billpayment/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				BillPayment: {
					VendorRef: { value: 'sample' },
					Line: [],
					TotalAmt: 1,
					PayType: 'Check',
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			BillPayment: {
				VendorRef: { value: 'sample' },
				Line: [],
				TotalAmt: 1,
				PayType: 'Check',
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', billpaymentId: '35' },
		inputSchema: schemasFor('billPayment.get').input,
		outputSchema: schemasFor('billPayment.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['get'](ctx, {
				realmId: '12345678',
				billpaymentId: '35',
			}),
	},
	{
		id: 'billPayment.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/billpayment',
		expectedQuery: {},
		expectedBody: {
			VendorRef: { value: 'sample' },
			Line: [],
			TotalAmt: 1,
			PayType: 'Check',
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				BillPayment: {
					VendorRef: { value: 'sample' },
					Line: [],
					TotalAmt: 1,
					PayType: 'Check',
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			BillPayment: {
				VendorRef: { value: 'sample' },
				Line: [],
				TotalAmt: 1,
				PayType: 'Check',
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				VendorRef: { value: 'sample' },
				Line: [],
				TotalAmt: 1,
				PayType: 'Check',
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('billPayment.update').input,
		outputSchema: schemasFor('billPayment.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['update'](ctx, {
				realmId: '12345678',
				body: {
					VendorRef: { value: 'sample' },
					Line: [],
					TotalAmt: 1,
					PayType: 'Check',
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'budget.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/budget',
		expectedQuery: {},
		expectedBody: { EndDate: 'sample', StartDate: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { EndDate: 'sample', StartDate: 'sample' },
		},
		inputSchema: schemasFor('budget.create').input,
		outputSchema: schemasFor('budget.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['budget']['create'](ctx, {
				realmId: '12345678',
				body: { EndDate: 'sample', StartDate: 'sample' },
			}),
	},
	{
		id: 'budget.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/budget',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Budget: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Budget: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('budget.delete').input,
		outputSchema: schemasFor('budget.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['budget']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'budget.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Budget' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Budget: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Budget: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('budget.list').input,
		outputSchema: schemasFor('budget.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['budget']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'budget.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/budget/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', budgetId: '35' },
		inputSchema: schemasFor('budget.get').input,
		outputSchema: schemasFor('budget.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['budget']['get'](ctx, {
				realmId: '12345678',
				budgetId: '35',
			}),
	},
	{
		id: 'budget.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/budget',
		expectedQuery: {},
		expectedBody: {
			EndDate: 'sample',
			StartDate: 'sample',
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				EndDate: 'sample',
				StartDate: 'sample',
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('budget.update').input,
		outputSchema: schemasFor('budget.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['budget']['update'](ctx, {
				realmId: '12345678',
				body: {
					EndDate: 'sample',
					StartDate: 'sample',
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'cashFlow.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/CashFlow',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('cashFlow.list').input,
		outputSchema: schemasFor('cashFlow.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['cashFlow']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'changeOrder.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/changeorder',
		expectedQuery: {},
		expectedBody: {
			ProjectRef: { value: 'sample' },
			Line: [
				{
					DetailType: 'SalesItemLineDetail',
					SalesItemLineDetail: {},
					Amount: 1,
					Id: '1',
				},
			],
			CustomerRef: { value: 'sample' },
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				ChangeOrder: {
					LinkedTxn: [],
					Line: [],
					ProjectRef: { value: 'sample' },
					CustomerRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ChangeOrder: {
				LinkedTxn: [],
				Line: [],
				ProjectRef: { value: 'sample' },
				CustomerRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				ProjectRef: { value: 'sample' },
				Line: [
					{
						DetailType: 'SalesItemLineDetail',
						SalesItemLineDetail: {},
						Amount: 1,
						Id: '1',
					},
				],
				CustomerRef: { value: 'sample' },
			},
		},
		inputSchema: schemasFor('changeOrder.create').input,
		outputSchema: schemasFor('changeOrder.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['changeOrder']['create'](ctx, {
				realmId: '12345678',
				body: {
					ProjectRef: { value: 'sample' },
					Line: [
						{
							DetailType: 'SalesItemLineDetail',
							SalesItemLineDetail: {},
							Amount: 1,
							Id: '1',
						},
					],
					CustomerRef: { value: 'sample' },
				},
			}),
	},
	{
		id: 'changeOrder.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/changeorder',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				ChangeOrder: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ChangeOrder: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('changeOrder.delete').input,
		outputSchema: schemasFor('changeOrder.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['changeOrder']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'changeOrder.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/changeorder/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				ChangeOrder: {
					LinkedTxn: [],
					Line: [],
					ProjectRef: { value: 'sample' },
					CustomerRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ChangeOrder: {
				LinkedTxn: [],
				Line: [],
				ProjectRef: { value: 'sample' },
				CustomerRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', changeorderId: '35' },
		inputSchema: schemasFor('changeOrder.get').input,
		outputSchema: schemasFor('changeOrder.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['changeOrder']['get'](ctx, {
				realmId: '12345678',
				changeorderId: '35',
			}),
	},
	{
		id: 'changeOrder.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/changeorder',
		expectedQuery: {},
		expectedBody: {
			LinkedTxn: [],
			Line: [],
			ProjectRef: { value: 'sample' },
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				ChangeOrder: {
					LinkedTxn: [],
					Line: [],
					ProjectRef: { value: 'sample' },
					CustomerRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ChangeOrder: {
				LinkedTxn: [],
				Line: [],
				ProjectRef: { value: 'sample' },
				CustomerRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				LinkedTxn: [],
				Line: [],
				ProjectRef: { value: 'sample' },
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('changeOrder.update').input,
		outputSchema: schemasFor('changeOrder.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['changeOrder']['update'](ctx, {
				realmId: '12345678',
				body: {
					LinkedTxn: [],
					Line: [],
					ProjectRef: { value: 'sample' },
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'class.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/class',
		expectedQuery: {},
		expectedBody: { Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Class: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Class: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Name: 'sample' } },
		inputSchema: schemasFor('class.create').input,
		outputSchema: schemasFor('class.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['class']['create'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample' },
			}),
	},
	{
		id: 'class.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Class' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Class: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Class: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('class.list').input,
		outputSchema: schemasFor('class.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['class']['list'](ctx, { realmId: '12345678' }),
	},
	{
		id: 'class.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/class/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Class: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Class: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', classId: '35' },
		inputSchema: schemasFor('class.get').input,
		outputSchema: schemasFor('class.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['class']['get'](ctx, {
				realmId: '12345678',
				classId: '35',
			}),
	},
	{
		id: 'class.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/class',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Class: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Class: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: schemasFor('class.update').input,
		outputSchema: schemasFor('class.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['class']['update'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'companyCurrency.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/companycurrency',
		expectedQuery: {},
		expectedBody: { Code: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CompanyCurrency: { Code: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CompanyCurrency: { Code: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Code: 'sample' } },
		inputSchema: schemasFor('companyCurrency.create').input,
		outputSchema: schemasFor('companyCurrency.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['companyCurrency']['create'](ctx, {
				realmId: '12345678',
				body: { Code: 'sample' },
			}),
	},
	{
		id: 'companyCurrency.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM CompanyCurrency' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { CompanyCurrency: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { CompanyCurrency: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('companyCurrency.list').input,
		outputSchema: schemasFor('companyCurrency.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['companyCurrency']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'companyCurrency.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/companycurrency/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				CompanyCurrency: { Code: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CompanyCurrency: { Code: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', companycurrencyId: '35' },
		inputSchema: schemasFor('companyCurrency.get').input,
		outputSchema: schemasFor('companyCurrency.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['companyCurrency']['get'](ctx, {
				realmId: '12345678',
				companycurrencyId: '35',
			}),
	},
	{
		id: 'companyCurrency.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/companycurrency',
		expectedQuery: {},
		expectedBody: { Code: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CompanyCurrency: { Code: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CompanyCurrency: { Code: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Code: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: schemasFor('companyCurrency.update').input,
		outputSchema: schemasFor('companyCurrency.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['companyCurrency']['update'](ctx, {
				realmId: '12345678',
				body: { Code: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'company.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/companyinfo',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { CompanyInfo: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { CompanyInfo: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('company.update').input,
		outputSchema: schemasFor('company.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['company']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'company.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/companyinfo',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { CompanyInfo: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { CompanyInfo: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: schemasFor('company.sparseUpdate').input,
		outputSchema: schemasFor('company.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['company']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'creditCardPayment.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditcardpayment',
		expectedQuery: {},
		expectedBody: {
			TxnDate: 'sample',
			Amount: 1,
			BankAccountRef: { value: 'sample' },
			CreditCardAccountRef: { value: 'sample' },
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditCardPaymentTxn: {
					CreditCardAccountRef: { value: 'sample' },
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditCardPaymentTxn: {
				CreditCardAccountRef: { value: 'sample' },
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				TxnDate: 'sample',
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				CreditCardAccountRef: { value: 'sample' },
			},
		},
		inputSchema: schemasFor('creditCardPayment.create').input,
		outputSchema: schemasFor('creditCardPayment.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['create'](ctx, {
				realmId: '12345678',
				body: {
					TxnDate: 'sample',
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					CreditCardAccountRef: { value: 'sample' },
				},
			}),
	},
	{
		id: 'creditCardPayment.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditcardpayment',
		expectedQuery: { operation: 'delete' },
		expectedBody: {
			CreditCardAccountRef: { value: 'sample' },
			Amount: 1,
			BankAccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditCardPaymentTxn: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditCardPaymentTxn: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				CreditCardAccountRef: { value: 'sample' },
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('creditCardPayment.delete').input,
		outputSchema: schemasFor('creditCardPayment.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['delete'](ctx, {
				realmId: '12345678',
				body: {
					CreditCardAccountRef: { value: 'sample' },
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'creditCardPayment.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM CreditCardPayment' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { CreditCardPaymentTxn: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { CreditCardPaymentTxn: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('creditCardPayment.list').input,
		outputSchema: schemasFor('creditCardPayment.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'creditCardPayment.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/creditcardpayment/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				CreditCardPaymentTxn: {
					CreditCardAccountRef: { value: 'sample' },
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditCardPaymentTxn: {
				CreditCardAccountRef: { value: 'sample' },
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', creditcardpaymentId: '35' },
		inputSchema: schemasFor('creditCardPayment.get').input,
		outputSchema: schemasFor('creditCardPayment.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['get'](ctx, {
				realmId: '12345678',
				creditcardpaymentId: '35',
			}),
	},
	{
		id: 'creditCardPayment.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditcardpayment',
		expectedQuery: {},
		expectedBody: {
			TxnDate: 'sample',
			Amount: 1,
			BankAccountRef: { value: 'sample' },
			CreditCardAccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditCardPaymentTxn: {
					CreditCardAccountRef: { value: 'sample' },
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditCardPaymentTxn: {
				CreditCardAccountRef: { value: 'sample' },
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				TxnDate: 'sample',
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				CreditCardAccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('creditCardPayment.update').input,
		outputSchema: schemasFor('creditCardPayment.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['update'](ctx, {
				realmId: '12345678',
				body: {
					TxnDate: 'sample',
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					CreditCardAccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'creditCardPayment.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditcardpayment',
		expectedQuery: {},
		expectedBody: {
			TxnDate: 'sample',
			Amount: 1,
			BankAccountRef: { value: 'sample' },
			CreditCardAccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditCardPaymentTxn: {
					CreditCardAccountRef: { value: 'sample' },
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditCardPaymentTxn: {
				CreditCardAccountRef: { value: 'sample' },
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				TxnDate: 'sample',
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				CreditCardAccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: schemasFor('creditCardPayment.sparseUpdate').input,
		outputSchema: schemasFor('creditCardPayment.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					TxnDate: 'sample',
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					CreditCardAccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'creditMemo.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditmemo',
		expectedQuery: {},
		expectedBody: {
			Line: [
				{
					DetailType: 'SalesItemLineDetail',
					SalesItemLineDetail: {},
					Amount: 1,
					Id: '1',
				},
			],
			CustomerRef: { value: 'sample' },
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [
					{
						DetailType: 'SalesItemLineDetail',
						SalesItemLineDetail: {},
						Amount: 1,
						Id: '1',
					},
				],
				CustomerRef: { value: 'sample' },
			},
		},
		inputSchema: schemasFor('creditMemo.create').input,
		outputSchema: schemasFor('creditMemo.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['create'](ctx, {
				realmId: '12345678',
				body: {
					Line: [
						{
							DetailType: 'SalesItemLineDetail',
							SalesItemLineDetail: {},
							Amount: 1,
							Id: '1',
						},
					],
					CustomerRef: { value: 'sample' },
				},
			}),
	},
	{
		id: 'creditMemo.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditmemo',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditMemo: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditMemo: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('creditMemo.delete').input,
		outputSchema: schemasFor('creditMemo.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'creditMemo.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/creditmemo/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', creditmemoId: '35' },
		inputSchema: schemasFor('creditMemo.getPdf').input,
		outputSchema: schemasFor('creditMemo.getPdf').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['getPdf'](ctx, {
				realmId: '12345678',
				creditmemoId: '35',
			}),
	},
	{
		id: 'creditMemo.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM CreditMemo' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { CreditMemo: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { CreditMemo: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('creditMemo.list').input,
		outputSchema: schemasFor('creditMemo.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'creditMemo.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/creditmemo/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', creditmemoId: '35' },
		inputSchema: schemasFor('creditMemo.get').input,
		outputSchema: schemasFor('creditMemo.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['get'](ctx, {
				realmId: '12345678',
				creditmemoId: '35',
			}),
	},
	{
		id: 'creditMemo.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditmemo/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			creditmemoId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: schemasFor('creditMemo.send').input,
		outputSchema: schemasFor('creditMemo.send').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['send'](ctx, {
				realmId: '12345678',
				creditmemoId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'creditMemo.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditmemo',
		expectedQuery: {},
		expectedBody: {
			Line: [],
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [],
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('creditMemo.update').input,
		outputSchema: schemasFor('creditMemo.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['update'](ctx, {
				realmId: '12345678',
				body: {
					Line: [],
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'customer.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/customer',
		expectedQuery: {},
		expectedBody: {},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: {} },
		inputSchema: schemasFor('customer.create').input,
		outputSchema: schemasFor('customer.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customer']['create'](ctx, {
				realmId: '12345678',
				body: {},
			}),
	},
	{
		id: 'customer.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Customer' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Customer: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Customer: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('customer.list').input,
		outputSchema: schemasFor('customer.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customer']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'customer.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/customer/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', customerId: '35' },
		inputSchema: schemasFor('customer.get').input,
		outputSchema: schemasFor('customer.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customer']['get'](ctx, {
				realmId: '12345678',
				customerId: '35',
			}),
	},
	{
		id: 'customer.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/customer',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('customer.update').input,
		outputSchema: schemasFor('customer.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customer']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'customer.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/customer',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: schemasFor('customer.sparseUpdate').input,
		outputSchema: schemasFor('customer.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customer']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'customerBalance.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/CustomerBalance',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('customerBalance.list').input,
		outputSchema: schemasFor('customerBalance.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customerBalance']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'customerBalanceDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/CustomerBalanceDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('customerBalanceDetail.list').input,
		outputSchema: schemasFor('customerBalanceDetail.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customerBalanceDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'customerIncome.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/CustomerIncome',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('customerIncome.list').input,
		outputSchema: schemasFor('customerIncome.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customerIncome']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'customerType.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM CustomerType' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { CustomerType: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { CustomerType: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('customerType.list').input,
		outputSchema: schemasFor('customerType.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customerType']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'customerType.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/customertype/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { CustomerType: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { CustomerType: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', id: '35' },
		inputSchema: schemasFor('customerType.get').input,
		outputSchema: schemasFor('customerType.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customerType']['get'](ctx, {
				realmId: '12345678',
				id: '35',
			}),
	},
	{
		id: 'department.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/department',
		expectedQuery: {},
		expectedBody: { Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Department: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Department: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Name: 'sample' } },
		inputSchema: schemasFor('department.create').input,
		outputSchema: schemasFor('department.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['department']['create'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample' },
			}),
	},
	{
		id: 'department.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Department' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Department: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Department: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('department.list').input,
		outputSchema: schemasFor('department.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['department']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'department.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/department/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Department: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Department: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', departmentId: '35' },
		inputSchema: schemasFor('department.get').input,
		outputSchema: schemasFor('department.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['department']['get'](ctx, {
				realmId: '12345678',
				departmentId: '35',
			}),
	},
	{
		id: 'department.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/department',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Department: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Department: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: schemasFor('department.update').input,
		outputSchema: schemasFor('department.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['department']['update'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'deposit.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/deposit',
		expectedQuery: {},
		expectedBody: {},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Deposit: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Deposit: { DepositToAccountRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: {} },
		inputSchema: schemasFor('deposit.create').input,
		outputSchema: schemasFor('deposit.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['create'](ctx, {
				realmId: '12345678',
				body: {},
			}),
	},
	{
		id: 'deposit.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/deposit',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Deposit: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Deposit: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('deposit.delete').input,
		outputSchema: schemasFor('deposit.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'deposit.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Deposit' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Deposit: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Deposit: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('deposit.list').input,
		outputSchema: schemasFor('deposit.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'deposit.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/deposit/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Deposit: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Deposit: { DepositToAccountRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', depositId: '35' },
		inputSchema: schemasFor('deposit.get').input,
		outputSchema: schemasFor('deposit.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['get'](ctx, {
				realmId: '12345678',
				depositId: '35',
			}),
	},
	{
		id: 'deposit.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/deposit',
		expectedQuery: {},
		expectedBody: {
			DepositToAccountRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Deposit: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Deposit: { DepositToAccountRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('deposit.update').input,
		outputSchema: schemasFor('deposit.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['update'](ctx, {
				realmId: '12345678',
				body: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'deposit.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/deposit',
		expectedQuery: {},
		expectedBody: {
			DepositToAccountRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Deposit: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Deposit: { DepositToAccountRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: schemasFor('deposit.sparseUpdate').input,
		outputSchema: schemasFor('deposit.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'employee.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/employee',
		expectedQuery: {},
		expectedBody: {},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: {} },
		inputSchema: schemasFor('employee.create').input,
		outputSchema: schemasFor('employee.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['employee']['create'](ctx, {
				realmId: '12345678',
				body: {},
			}),
	},
	{
		id: 'employee.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Employee' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Employee: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Employee: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('employee.list').input,
		outputSchema: schemasFor('employee.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['employee']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'employee.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/employee/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', employeeId: '35' },
		inputSchema: schemasFor('employee.get').input,
		outputSchema: schemasFor('employee.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['employee']['get'](ctx, {
				realmId: '12345678',
				employeeId: '35',
			}),
	},
	{
		id: 'employee.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/employee',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('employee.update').input,
		outputSchema: schemasFor('employee.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['employee']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'estimate.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/estimate',
		expectedQuery: {},
		expectedBody: {
			Line: [
				{
					DetailType: 'SalesItemLineDetail',
					SalesItemLineDetail: {},
					Amount: 1,
					Id: '1',
				},
			],
			CustomerRef: { value: 'sample' },
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [
					{
						DetailType: 'SalesItemLineDetail',
						SalesItemLineDetail: {},
						Amount: 1,
						Id: '1',
					},
				],
				CustomerRef: { value: 'sample' },
			},
		},
		inputSchema: schemasFor('estimate.create').input,
		outputSchema: schemasFor('estimate.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['create'](ctx, {
				realmId: '12345678',
				body: {
					Line: [
						{
							DetailType: 'SalesItemLineDetail',
							SalesItemLineDetail: {},
							Amount: 1,
							Id: '1',
						},
					],
					CustomerRef: { value: 'sample' },
				},
			}),
	},
	{
		id: 'estimate.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/estimate',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Estimate: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('estimate.delete').input,
		outputSchema: schemasFor('estimate.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'estimate.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/estimate/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', estimateId: '35' },
		inputSchema: schemasFor('estimate.getPdf').input,
		outputSchema: schemasFor('estimate.getPdf').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['getPdf'](ctx, {
				realmId: '12345678',
				estimateId: '35',
			}),
	},
	{
		id: 'estimate.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Estimate' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Estimate: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Estimate: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('estimate.list').input,
		outputSchema: schemasFor('estimate.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'estimate.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/estimate/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', estimateId: '35' },
		inputSchema: schemasFor('estimate.get').input,
		outputSchema: schemasFor('estimate.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['get'](ctx, {
				realmId: '12345678',
				estimateId: '35',
			}),
	},
	{
		id: 'estimate.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/estimate/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			estimateId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: schemasFor('estimate.send').input,
		outputSchema: schemasFor('estimate.send').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['send'](ctx, {
				realmId: '12345678',
				estimateId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'estimate.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/estimate',
		expectedQuery: {},
		expectedBody: {
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: schemasFor('estimate.sparseUpdate').input,
		outputSchema: schemasFor('estimate.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'estimate.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/estimate',
		expectedQuery: {},
		expectedBody: {
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { CustomerRef: { value: 'sample' }, Id: '35', SyncToken: '0' },
		},
		inputSchema: schemasFor('estimate.update').input,
		outputSchema: schemasFor('estimate.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['update'](ctx, {
				realmId: '12345678',
				body: { CustomerRef: { value: 'sample' }, Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'exchangerate.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/exchangerate',
		expectedQuery: { sourcecurrencycode: 'USD', asofdate: '2026-11-18' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				ExchangeRate: {
					SourceCurrencyCode: 'EUR',
					Rate: 1.08,
					TargetCurrencyCode: 'USD',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ExchangeRate: {
				SourceCurrencyCode: 'EUR',
				Rate: 1.08,
				TargetCurrencyCode: 'USD',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', currencyCode: 'USD', asOfDate: '2026-11-18' },
		inputSchema: schemasFor('exchangerate.get').input,
		outputSchema: schemasFor('exchangerate.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['exchangerate']['get'](ctx, {
				realmId: '12345678',
				currencyCode: 'USD',
				asOfDate: '2026-11-18',
			}),
	},
	{
		id: 'exchangerate.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Exchangerate' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { ExchangeRate: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { ExchangeRate: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('exchangerate.list').input,
		outputSchema: schemasFor('exchangerate.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['exchangerate']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'exchangerate.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/exchangerate',
		expectedQuery: {},
		expectedBody: {
			SyncToken: '0',
			SourceCurrencyCode: 'EUR',
			Rate: 1.08,
			AsOfDate: '2026-11-18',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				ExchangeRate: { SourceCurrencyCode: 'EUR', Rate: 1.08 },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ExchangeRate: { SourceCurrencyCode: 'EUR', Rate: 1.08 },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				SyncToken: '0',
				SourceCurrencyCode: 'EUR',
				Rate: 1.08,
				AsOfDate: '2026-11-18',
			},
		},
		inputSchema: schemasFor('exchangerate.update').input,
		outputSchema: schemasFor('exchangerate.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['exchangerate']['update'](ctx, {
				realmId: '12345678',
				body: {
					SyncToken: '0',
					SourceCurrencyCode: 'EUR',
					Rate: 1.08,
					AsOfDate: '2026-11-18',
				},
			}),
	},
	{
		id: 'generalLedger.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/GeneralLedger',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('generalLedger.list').input,
		outputSchema: schemasFor('generalLedger.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['generalLedger']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'inventoryAdjustment.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/inventoryadjustment',
		expectedQuery: {},
		expectedBody: {
			DocNumber: 'sample',
			AdjustAccountRef: { value: 'sample' },
			Line: [],
			TxnDate: 'sample',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				InventoryAdjustment: {
					TxnDate: 'sample',
					Line: [],
					AdjustAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			InventoryAdjustment: {
				TxnDate: 'sample',
				Line: [],
				AdjustAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				DocNumber: 'sample',
				AdjustAccountRef: { value: 'sample' },
				Line: [],
				TxnDate: 'sample',
			},
		},
		inputSchema: schemasFor('inventoryAdjustment.create').input,
		outputSchema: schemasFor('inventoryAdjustment.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryAdjustment']['create'](ctx, {
				realmId: '12345678',
				body: {
					DocNumber: 'sample',
					AdjustAccountRef: { value: 'sample' },
					Line: [],
					TxnDate: 'sample',
				},
			}),
	},
	{
		id: 'inventoryAdjustment.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/inventoryadjustment',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				InventoryAdjustment: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			InventoryAdjustment: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('inventoryAdjustment.delete').input,
		outputSchema: schemasFor('inventoryAdjustment.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryAdjustment']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'inventoryAdjustment.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/inventoryadjustment/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				InventoryAdjustment: {
					TxnDate: 'sample',
					Line: [],
					AdjustAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			InventoryAdjustment: {
				TxnDate: 'sample',
				Line: [],
				AdjustAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', inventoryadjustmentId: '35' },
		inputSchema: schemasFor('inventoryAdjustment.get').input,
		outputSchema: schemasFor('inventoryAdjustment.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryAdjustment']['get'](ctx, {
				realmId: '12345678',
				inventoryadjustmentId: '35',
			}),
	},
	{
		id: 'inventoryAdjustment.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/inventoryadjustment',
		expectedQuery: {},
		expectedBody: {
			AdjustAccountRef: { value: 'sample' },
			Line: [],
			TxnDate: 'sample',
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				InventoryAdjustment: {
					TxnDate: 'sample',
					Line: [],
					AdjustAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			InventoryAdjustment: {
				TxnDate: 'sample',
				Line: [],
				AdjustAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				AdjustAccountRef: { value: 'sample' },
				Line: [],
				TxnDate: 'sample',
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: schemasFor('inventoryAdjustment.sparseUpdate').input,
		outputSchema: schemasFor('inventoryAdjustment.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryAdjustment']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					AdjustAccountRef: { value: 'sample' },
					Line: [],
					TxnDate: 'sample',
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'inventoryValuationDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/InventoryValuationDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('inventoryValuationDetail.list').input,
		outputSchema: schemasFor('inventoryValuationDetail.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryValuationDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'inventoryValuationSummary.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/InventoryValuationSummary',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('inventoryValuationSummary.list').input,
		outputSchema: schemasFor('inventoryValuationSummary.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryValuationSummary']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'invoice.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice',
		expectedQuery: {},
		expectedBody: { CustomerRef: { value: 'sample' }, Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { CustomerRef: { value: 'sample' }, Line: [] },
		},
		inputSchema: schemasFor('invoice.create').input,
		outputSchema: schemasFor('invoice.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['create'](ctx, {
				realmId: '12345678',
				body: { CustomerRef: { value: 'sample' }, Line: [] },
			}),
	},
	{
		id: 'invoice.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Invoice: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('invoice.delete').input,
		outputSchema: schemasFor('invoice.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'invoice.void',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice',
		expectedQuery: { operation: 'void' },
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: schemasFor('invoice.void').input,
		outputSchema: schemasFor('invoice.void').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['void'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'invoice.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/invoice/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', invoiceId: '35' },
		inputSchema: schemasFor('invoice.getPdf').input,
		outputSchema: schemasFor('invoice.getPdf').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['getPdf'](ctx, {
				realmId: '12345678',
				invoiceId: '35',
			}),
	},
	{
		id: 'invoice.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Invoice' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Invoice: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Invoice: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('invoice.list').input,
		outputSchema: schemasFor('invoice.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'invoice.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/invoice/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', invoiceId: '35' },
		inputSchema: schemasFor('invoice.get').input,
		outputSchema: schemasFor('invoice.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['get'](ctx, {
				realmId: '12345678',
				invoiceId: '35',
			}),
	},
	{
		id: 'invoice.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			invoiceId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: schemasFor('invoice.send').input,
		outputSchema: schemasFor('invoice.send').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['send'](ctx, {
				realmId: '12345678',
				invoiceId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'invoice.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice',
		expectedQuery: {},
		expectedBody: {
			Line: [],
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [],
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: schemasFor('invoice.sparseUpdate').input,
		outputSchema: schemasFor('invoice.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					Line: [],
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'invoice.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice',
		expectedQuery: {},
		expectedBody: {
			CustomerRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				CustomerRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('invoice.update').input,
		outputSchema: schemasFor('invoice.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['update'](ctx, {
				realmId: '12345678',
				body: {
					CustomerRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'item.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/item',
		expectedQuery: {},
		expectedBody: { Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Item: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Item: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Name: 'sample' } },
		inputSchema: schemasFor('item.create').input,
		outputSchema: schemasFor('item.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['create'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample' },
			}),
	},
	{
		id: 'item.createCategory',
		method: 'POST',
		expectedPath: '/v3/company/12345678/item',
		expectedQuery: {},
		expectedBody: { Type: 'Category', Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Type: 'Category', Name: 'sample' } },
		inputSchema: schemasFor('item.createCategory').input,
		outputSchema: schemasFor('item.createCategory').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['createCategory'](ctx, {
				realmId: '12345678',
				body: { Type: 'Category', Name: 'sample' },
			}),
	},
	{
		id: 'item.listBundles',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: {
			query:
				"SELECT * FROM Item WHERE Type = 'Group' STARTPOSITION 1 MAXRESULTS 10",
		},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Item: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Item: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', startPosition: 1, maxResults: 10 },
		inputSchema: schemasFor('item.listBundles').input,
		outputSchema: schemasFor('item.listBundles').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['listBundles'](ctx, {
				realmId: '12345678',
				startPosition: 1,
				maxResults: 10,
			}),
	},
	{
		id: 'item.listCategories',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: {
			query:
				"SELECT * FROM Item WHERE Type = 'Category' STARTPOSITION 1 MAXRESULTS 10",
		},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Item: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Item: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', startPosition: 1, maxResults: 10 },
		inputSchema: schemasFor('item.listCategories').input,
		outputSchema: schemasFor('item.listCategories').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['listCategories'](ctx, {
				realmId: '12345678',
				startPosition: 1,
				maxResults: 10,
			}),
	},
	{
		id: 'item.listItems',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: {
			query:
				"SELECT * FROM Item WHERE Type IN ('Inventory', 'NonInventory', 'Service') STARTPOSITION 1 MAXRESULTS 10",
		},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Item: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Item: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', startPosition: 1, maxResults: 10 },
		inputSchema: schemasFor('item.listItems').input,
		outputSchema: schemasFor('item.listItems').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['listItems'](ctx, {
				realmId: '12345678',
				startPosition: 1,
				maxResults: 10,
			}),
	},
	{
		id: 'item.getBundle',
		method: 'GET',
		expectedPath: '/v3/company/12345678/item/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Item: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Item: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', itemId: '35' },
		inputSchema: schemasFor('item.getBundle').input,
		outputSchema: schemasFor('item.getBundle').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['getBundle'](ctx, {
				realmId: '12345678',
				itemId: '35',
			}),
	},
	{
		id: 'item.getCategory',
		method: 'GET',
		expectedPath: '/v3/company/12345678/item/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', itemId: '35' },
		inputSchema: schemasFor('item.getCategory').input,
		outputSchema: schemasFor('item.getCategory').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['getCategory'](ctx, {
				realmId: '12345678',
				itemId: '35',
			}),
	},
	{
		id: 'item.getItem',
		method: 'GET',
		expectedPath: '/v3/company/12345678/item/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Item: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Item: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', itemId: '35' },
		inputSchema: schemasFor('item.getItem').input,
		outputSchema: schemasFor('item.getItem').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['getItem'](ctx, {
				realmId: '12345678',
				itemId: '35',
			}),
	},
	{
		id: 'item.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/item',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Item: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Item: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: schemasFor('item.update').input,
		outputSchema: schemasFor('item.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['update'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'item.updateCategory',
		method: 'POST',
		expectedPath: '/v3/company/12345678/item',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Type: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Type: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: schemasFor('item.updateCategory').input,
		outputSchema: schemasFor('item.updateCategory').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['updateCategory'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Type: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'item.deleteCategory',
		method: 'POST',
		expectedPath: '/v3/company/12345678/item',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '20', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Item: { domain: 'QBO', status: 'Deleted', Id: '20' },
				time: '2026-11-23T00:13:01.362-08:00',
			},
		},
		expectedResult: {
			Item: { domain: 'QBO', status: 'Deleted', Id: '20' },
			time: '2026-11-23T00:13:01.362-08:00',
		},
		input: { realmId: '12345678', body: { Id: '20', SyncToken: '0' } },
		inputSchema: schemasFor('item.deleteCategory').input,
		outputSchema: schemasFor('item.deleteCategory').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['deleteCategory'](ctx, {
				realmId: '12345678',
				body: { Id: '20', SyncToken: '0' },
			}),
	},
	{
		id: 'journalEntry.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/journalentry',
		expectedQuery: {},
		expectedBody: { Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				JournalEntry: { Id: '1', Line: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			JournalEntry: { Id: '1', Line: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Line: [] } },
		inputSchema: schemasFor('journalEntry.create').input,
		outputSchema: schemasFor('journalEntry.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['create'](ctx, {
				realmId: '12345678',
				body: { Line: [] },
			}),
	},
	{
		id: 'journalEntry.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/journalentry',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				JournalEntry: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			JournalEntry: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('journalEntry.delete').input,
		outputSchema: schemasFor('journalEntry.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'journalEntry.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM JournalEntry' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { JournalEntry: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { JournalEntry: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('journalEntry.list').input,
		outputSchema: schemasFor('journalEntry.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'journalEntry.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/journalentry/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				JournalEntry: { Id: '1', Line: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			JournalEntry: { Id: '1', Line: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', journalentryId: '35' },
		inputSchema: schemasFor('journalEntry.get').input,
		outputSchema: schemasFor('journalEntry.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['get'](ctx, {
				realmId: '12345678',
				journalentryId: '35',
			}),
	},
	{
		id: 'journalEntry.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/journalentry',
		expectedQuery: {},
		expectedBody: { Id: '35', Line: [], SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				JournalEntry: { Id: '1', Line: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			JournalEntry: { Id: '1', Line: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', Line: [], SyncToken: '0' },
		},
		inputSchema: schemasFor('journalEntry.update').input,
		outputSchema: schemasFor('journalEntry.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', Line: [], SyncToken: '0' },
			}),
	},
	{
		id: 'journalEntry.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/journalentry',
		expectedQuery: {},
		expectedBody: { Id: '35', Line: [], SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				JournalEntry: { Id: '1', Line: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			JournalEntry: { Id: '1', Line: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', Line: [], SyncToken: '0', sparse: true },
		},
		inputSchema: schemasFor('journalEntry.sparseUpdate').input,
		outputSchema: schemasFor('journalEntry.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: { Id: '35', Line: [], SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'journalReport.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/JournalReport',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('journalReport.list').input,
		outputSchema: schemasFor('journalReport.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalReport']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'payment.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/payment',
		expectedQuery: {},
		expectedBody: { TotalAmt: 1, CustomerRef: { value: 'sample' } },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { TotalAmt: 1, CustomerRef: { value: 'sample' } },
		},
		inputSchema: schemasFor('payment.create').input,
		outputSchema: schemasFor('payment.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['create'](ctx, {
				realmId: '12345678',
				body: { TotalAmt: 1, CustomerRef: { value: 'sample' } },
			}),
	},
	{
		id: 'payment.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/payment',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Payment: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('payment.delete').input,
		outputSchema: schemasFor('payment.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'payment.void',
		method: 'POST',
		expectedPath: '/v3/company/12345678/payment',
		expectedQuery: { operation: 'update', include: 'void' },
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: schemasFor('payment.void').input,
		outputSchema: schemasFor('payment.void').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['void'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'payment.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/payment/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', paymentId: '35' },
		inputSchema: schemasFor('payment.getPdf').input,
		outputSchema: schemasFor('payment.getPdf').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['getPdf'](ctx, {
				realmId: '12345678',
				paymentId: '35',
			}),
	},
	{
		id: 'payment.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Payment' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Payment: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Payment: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('payment.list').input,
		outputSchema: schemasFor('payment.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'payment.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/payment/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', paymentId: '35' },
		inputSchema: schemasFor('payment.get').input,
		outputSchema: schemasFor('payment.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['get'](ctx, {
				realmId: '12345678',
				paymentId: '35',
			}),
	},
	{
		id: 'payment.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/payment/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			paymentId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: schemasFor('payment.send').input,
		outputSchema: schemasFor('payment.send').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['send'](ctx, {
				realmId: '12345678',
				paymentId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'payment.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/payment',
		expectedQuery: {},
		expectedBody: {
			TotalAmt: 1,
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				TotalAmt: 1,
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('payment.update').input,
		outputSchema: schemasFor('payment.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['update'](ctx, {
				realmId: '12345678',
				body: {
					TotalAmt: 1,
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'paymentMethod.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/paymentmethod',
		expectedQuery: {},
		expectedBody: { Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				PaymentMethod: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PaymentMethod: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Name: 'sample' } },
		inputSchema: schemasFor('paymentMethod.create').input,
		outputSchema: schemasFor('paymentMethod.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['paymentMethod']['create'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample' },
			}),
	},
	{
		id: 'paymentMethod.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM PaymentMethod' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { PaymentMethod: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { PaymentMethod: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('paymentMethod.list').input,
		outputSchema: schemasFor('paymentMethod.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['paymentMethod']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'paymentMethod.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/paymentmethod/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				PaymentMethod: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PaymentMethod: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', paymentmethodId: '35' },
		inputSchema: schemasFor('paymentMethod.get').input,
		outputSchema: schemasFor('paymentMethod.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['paymentMethod']['get'](ctx, {
				realmId: '12345678',
				paymentmethodId: '35',
			}),
	},
	{
		id: 'paymentMethod.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/paymentmethod',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				PaymentMethod: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PaymentMethod: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: schemasFor('paymentMethod.update').input,
		outputSchema: schemasFor('paymentMethod.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['paymentMethod']['update'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'preferences.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Preferences' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { Preferences: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { Preferences: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('preferences.list').input,
		outputSchema: schemasFor('preferences.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['preferences']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'preferences.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/preferences',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Preferences: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Preferences: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678' },
		inputSchema: schemasFor('preferences.get').input,
		outputSchema: schemasFor('preferences.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['preferences']['get'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'preferences.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/preferences',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Preferences: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Preferences: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('preferences.update').input,
		outputSchema: schemasFor('preferences.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['preferences']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'profitAndLoss.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/ProfitAndLoss',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('profitAndLoss.list').input,
		outputSchema: schemasFor('profitAndLoss.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['profitAndLoss']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'profitAndLossDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/ProfitAndLossDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('profitAndLossDetail.list').input,
		outputSchema: schemasFor('profitAndLossDetail.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['profitAndLossDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'purchase.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchase',
		expectedQuery: {},
		expectedBody: {
			PaymentType: 'sample',
			AccountRef: { value: 'sample' },
			Line: [],
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Purchase: {
					Line: [],
					PaymentType: 'sample',
					AccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Purchase: {
				Line: [],
				PaymentType: 'sample',
				AccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				PaymentType: 'sample',
				AccountRef: { value: 'sample' },
				Line: [],
			},
		},
		inputSchema: schemasFor('purchase.create').input,
		outputSchema: schemasFor('purchase.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchase']['create'](ctx, {
				realmId: '12345678',
				body: {
					PaymentType: 'sample',
					AccountRef: { value: 'sample' },
					Line: [],
				},
			}),
	},
	{
		id: 'purchase.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchase',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Purchase: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Purchase: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('purchase.delete').input,
		outputSchema: schemasFor('purchase.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchase']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'purchase.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Purchase' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Purchase: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Purchase: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('purchase.list').input,
		outputSchema: schemasFor('purchase.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchase']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'purchase.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/purchase/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Purchase: {
					Line: [],
					PaymentType: 'sample',
					AccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Purchase: {
				Line: [],
				PaymentType: 'sample',
				AccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', purchaseId: '35' },
		inputSchema: schemasFor('purchase.get').input,
		outputSchema: schemasFor('purchase.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchase']['get'](ctx, {
				realmId: '12345678',
				purchaseId: '35',
			}),
	},
	{
		id: 'purchase.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchase',
		expectedQuery: {},
		expectedBody: {
			Line: [],
			PaymentType: 'sample',
			AccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Purchase: {
					Line: [],
					PaymentType: 'sample',
					AccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Purchase: {
				Line: [],
				PaymentType: 'sample',
				AccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [],
				PaymentType: 'sample',
				AccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('purchase.update').input,
		outputSchema: schemasFor('purchase.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchase']['update'](ctx, {
				realmId: '12345678',
				body: {
					Line: [],
					PaymentType: 'sample',
					AccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'purchaseOrder.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchaseorder',
		expectedQuery: {},
		expectedBody: {
			APAccountRef: { value: 'sample' },
			VendorRef: { value: 'sample' },
			Line: [],
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				PurchaseOrder: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PurchaseOrder: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
			},
		},
		inputSchema: schemasFor('purchaseOrder.create').input,
		outputSchema: schemasFor('purchaseOrder.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['create'](ctx, {
				realmId: '12345678',
				body: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
				},
			}),
	},
	{
		id: 'purchaseOrder.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchaseorder',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				PurchaseOrder: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PurchaseOrder: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('purchaseOrder.delete').input,
		outputSchema: schemasFor('purchaseOrder.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'purchaseOrder.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/purchaseorder/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', purchaseorderId: '35' },
		inputSchema: schemasFor('purchaseOrder.getPdf').input,
		outputSchema: schemasFor('purchaseOrder.getPdf').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['getPdf'](ctx, {
				realmId: '12345678',
				purchaseorderId: '35',
			}),
	},
	{
		id: 'purchaseOrder.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM PurchaseOrder' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { PurchaseOrder: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { PurchaseOrder: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('purchaseOrder.list').input,
		outputSchema: schemasFor('purchaseOrder.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'purchaseOrder.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/purchaseorder/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				PurchaseOrder: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PurchaseOrder: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', purchaseorderId: '35' },
		inputSchema: schemasFor('purchaseOrder.get').input,
		outputSchema: schemasFor('purchaseOrder.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['get'](ctx, {
				realmId: '12345678',
				purchaseorderId: '35',
			}),
	},
	{
		id: 'purchaseOrder.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchaseorder/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				PurchaseOrder: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PurchaseOrder: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			purchaseorderId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: schemasFor('purchaseOrder.send').input,
		outputSchema: schemasFor('purchaseOrder.send').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['send'](ctx, {
				realmId: '12345678',
				purchaseorderId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'purchaseOrder.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchaseorder',
		expectedQuery: {},
		expectedBody: {
			APAccountRef: { value: 'sample' },
			VendorRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				PurchaseOrder: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PurchaseOrder: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('purchaseOrder.update').input,
		outputSchema: schemasFor('purchaseOrder.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['update'](ctx, {
				realmId: '12345678',
				body: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'recurringTransaction.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/recurringtransaction',
		expectedQuery: {},
		expectedBody: { Invoice: { RecurringInfo: {} } },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RecurringTransaction: { Invoice: { RecurringInfo: {}, Id: '1' } },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RecurringTransaction: { Invoice: { RecurringInfo: {}, Id: '1' } },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Invoice: { RecurringInfo: {} } } },
		inputSchema: schemasFor('recurringTransaction.create').input,
		outputSchema: schemasFor('recurringTransaction.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['recurringTransaction']['create'](ctx, {
				realmId: '12345678',
				body: { Invoice: { RecurringInfo: {} } },
			}),
	},
	{
		id: 'recurringTransaction.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/recurringtransaction',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Invoice: { Id: '35', SyncToken: '0' } },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RecurringTransaction: {
					status: 'Deleted',
					domain: 'QBO',
					Invoice: { Id: '35' },
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RecurringTransaction: {
				status: 'Deleted',
				domain: 'QBO',
				Invoice: { Id: '35' },
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Invoice: { Id: '35', SyncToken: '0' } },
		},
		inputSchema: schemasFor('recurringTransaction.delete').input,
		outputSchema: schemasFor('recurringTransaction.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['recurringTransaction']['delete'](ctx, {
				realmId: '12345678',
				body: { Invoice: { Id: '35', SyncToken: '0' } },
			}),
	},
	{
		id: 'recurringTransaction.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM RecurringTransaction' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { RecurringTransaction: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { RecurringTransaction: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('recurringTransaction.list').input,
		outputSchema: schemasFor('recurringTransaction.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['recurringTransaction']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'recurringTransaction.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/recurringtransaction/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				RecurringTransaction: { Invoice: { RecurringInfo: {}, Id: '1' } },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RecurringTransaction: { Invoice: { RecurringInfo: {}, Id: '1' } },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', recurringtransactionId: '35' },
		inputSchema: schemasFor('recurringTransaction.get').input,
		outputSchema: schemasFor('recurringTransaction.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['recurringTransaction']['get'](ctx, {
				realmId: '12345678',
				recurringtransactionId: '35',
			}),
	},
	{
		id: 'refundReceipt.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/refundreceipt',
		expectedQuery: {},
		expectedBody: { DepositToAccountRef: { value: 'sample' }, Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { DepositToAccountRef: { value: 'sample' }, Line: [] },
		},
		inputSchema: schemasFor('refundReceipt.create').input,
		outputSchema: schemasFor('refundReceipt.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['create'](ctx, {
				realmId: '12345678',
				body: { DepositToAccountRef: { value: 'sample' }, Line: [] },
			}),
	},
	{
		id: 'refundReceipt.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/refundreceipt',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('refundReceipt.delete').input,
		outputSchema: schemasFor('refundReceipt.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'refundReceipt.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/refundreceipt/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', refundreceiptId: '35' },
		inputSchema: schemasFor('refundReceipt.getPdf').input,
		outputSchema: schemasFor('refundReceipt.getPdf').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['getPdf'](ctx, {
				realmId: '12345678',
				refundreceiptId: '35',
			}),
	},
	{
		id: 'refundReceipt.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM RefundReceipt' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { RefundReceipt: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { RefundReceipt: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('refundReceipt.list').input,
		outputSchema: schemasFor('refundReceipt.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'refundReceipt.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/refundreceipt/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', refundreceiptId: '35' },
		inputSchema: schemasFor('refundReceipt.get').input,
		outputSchema: schemasFor('refundReceipt.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['get'](ctx, {
				realmId: '12345678',
				refundreceiptId: '35',
			}),
	},
	{
		id: 'refundReceipt.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/refundreceipt/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			refundreceiptId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: schemasFor('refundReceipt.send').input,
		outputSchema: schemasFor('refundReceipt.send').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['send'](ctx, {
				realmId: '12345678',
				refundreceiptId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'refundReceipt.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/refundreceipt',
		expectedQuery: {},
		expectedBody: {
			DepositToAccountRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: schemasFor('refundReceipt.sparseUpdate').input,
		outputSchema: schemasFor('refundReceipt.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'refundReceipt.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/refundreceipt',
		expectedQuery: {},
		expectedBody: {
			DepositToAccountRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('refundReceipt.update').input,
		outputSchema: schemasFor('refundReceipt.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['update'](ctx, {
				realmId: '12345678',
				body: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'reimburseCharge.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM ReimburseCharge' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { ReimburseCharge: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { ReimburseCharge: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('reimburseCharge.list').input,
		outputSchema: schemasFor('reimburseCharge.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['reimburseCharge']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'reimburseCharge.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reimbursecharge/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				ReimburseCharge: {
					Line: [],
					Amount: 1,
					CustomerRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ReimburseCharge: {
				Line: [],
				Amount: 1,
				CustomerRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', reimbursechargeId: '35' },
		inputSchema: schemasFor('reimburseCharge.get').input,
		outputSchema: schemasFor('reimburseCharge.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['reimburseCharge']['get'](ctx, {
				realmId: '12345678',
				reimbursechargeId: '35',
			}),
	},
	{
		id: 'salesByClassSummary.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/ClassSales',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('salesByClassSummary.list').input,
		outputSchema: schemasFor('salesByClassSummary.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesByClassSummary']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'salesByCustomer.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/CustomerSales',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('salesByCustomer.list').input,
		outputSchema: schemasFor('salesByCustomer.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesByCustomer']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'salesByDepartment.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/DepartmentSales',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('salesByDepartment.list').input,
		outputSchema: schemasFor('salesByDepartment.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesByDepartment']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'salesByProduct.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/ItemSales',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('salesByProduct.list').input,
		outputSchema: schemasFor('salesByProduct.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesByProduct']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'salesReceipt.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt',
		expectedQuery: {},
		expectedBody: { Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Line: [] } },
		inputSchema: schemasFor('salesReceipt.create').input,
		outputSchema: schemasFor('salesReceipt.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['create'](ctx, {
				realmId: '12345678',
				body: { Line: [] },
			}),
	},
	{
		id: 'salesReceipt.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('salesReceipt.delete').input,
		outputSchema: schemasFor('salesReceipt.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'salesReceipt.void',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt',
		expectedQuery: { operation: 'update', include: 'void' },
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: schemasFor('salesReceipt.void').input,
		outputSchema: schemasFor('salesReceipt.void').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['void'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'salesReceipt.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/salesreceipt/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', salesreceiptId: '35' },
		inputSchema: schemasFor('salesReceipt.getPdf').input,
		outputSchema: schemasFor('salesReceipt.getPdf').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['getPdf'](ctx, {
				realmId: '12345678',
				salesreceiptId: '35',
			}),
	},
	{
		id: 'salesReceipt.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM SalesReceipt' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { SalesReceipt: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { SalesReceipt: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('salesReceipt.list').input,
		outputSchema: schemasFor('salesReceipt.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'salesReceipt.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/salesreceipt/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', salesreceiptId: '35' },
		inputSchema: schemasFor('salesReceipt.get').input,
		outputSchema: schemasFor('salesReceipt.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['get'](ctx, {
				realmId: '12345678',
				salesreceiptId: '35',
			}),
	},
	{
		id: 'salesReceipt.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			salesreceiptId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: schemasFor('salesReceipt.send').input,
		outputSchema: schemasFor('salesReceipt.send').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['send'](ctx, {
				realmId: '12345678',
				salesreceiptId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'salesReceipt.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt',
		expectedQuery: {},
		expectedBody: {
			Line: [],
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [],
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('salesReceipt.update').input,
		outputSchema: schemasFor('salesReceipt.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['update'](ctx, {
				realmId: '12345678',
				body: {
					Line: [],
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'salesReceipt.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt',
		expectedQuery: {},
		expectedBody: {
			Line: [],
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [],
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: schemasFor('salesReceipt.sparseUpdate').input,
		outputSchema: schemasFor('salesReceipt.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					Line: [],
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'taxAgency.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/taxagency',
		expectedQuery: {},
		expectedBody: { DisplayName: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				TaxAgency: { DisplayName: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxAgency: { DisplayName: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { DisplayName: 'sample' } },
		inputSchema: schemasFor('taxAgency.create').input,
		outputSchema: schemasFor('taxAgency.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxAgency']['create'](ctx, {
				realmId: '12345678',
				body: { DisplayName: 'sample' },
			}),
	},
	{
		id: 'taxAgency.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM TaxAgency' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { TaxAgency: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { TaxAgency: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('taxAgency.list').input,
		outputSchema: schemasFor('taxAgency.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxAgency']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'taxAgency.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxagency/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TaxAgency: { DisplayName: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxAgency: { DisplayName: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', taxagencyId: '35' },
		inputSchema: schemasFor('taxAgency.get').input,
		outputSchema: schemasFor('taxAgency.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxAgency']['get'](ctx, {
				realmId: '12345678',
				taxagencyId: '35',
			}),
	},
	{
		id: 'taxClassification.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxclassification/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TaxClassification: { ParentRef: { value: 'sample' } },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxClassification: { ParentRef: { value: 'sample' } },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', taxClassificationId: '35' },
		inputSchema: schemasFor('taxClassification.get').input,
		outputSchema: schemasFor('taxClassification.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxClassification']['get'](ctx, {
				realmId: '12345678',
				taxClassificationId: '35',
			}),
	},
	{
		id: 'taxClassification.listChildren',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxclassification/35/children',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: {
					TaxClassification: [{ Id: '35', Name: 'sample', Level: '1' }],
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: {
				TaxClassification: [{ Id: '35', Name: 'sample', Level: '1' }],
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', parentId: '35' },
		inputSchema: schemasFor('taxClassification.listChildren').input,
		outputSchema: schemasFor('taxClassification.listChildren').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxClassification']['listChildren'](ctx, {
				realmId: '12345678',
				parentId: '35',
			}),
	},
	{
		id: 'taxClassification.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxclassification',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: {
					TaxClassification: [{ Id: '35', Name: 'sample', Level: '1' }],
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: {
				TaxClassification: [{ Id: '35', Name: 'sample', Level: '1' }],
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('taxClassification.list').input,
		outputSchema: schemasFor('taxClassification.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxClassification']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'taxClassification.listByLevel',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxclassification',
		expectedQuery: { level: '1' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: {
					TaxClassification: [{ Id: '35', Name: 'sample', Level: '1' }],
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: {
				TaxClassification: [{ Id: '35', Name: 'sample', Level: '1' }],
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', level: 1 },
		inputSchema: schemasFor('taxClassification.listByLevel').input,
		outputSchema: schemasFor('taxClassification.listByLevel').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxClassification']['listByLevel'](ctx, {
				realmId: '12345678',
				level: 1,
			}),
	},
	{
		id: 'taxCode.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM TaxCode' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { TaxCode: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { TaxCode: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('taxCode.list').input,
		outputSchema: schemasFor('taxCode.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxCode']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'taxCode.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxcode/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TaxCode: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxCode: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', taxcodeId: '35' },
		inputSchema: schemasFor('taxCode.get').input,
		outputSchema: schemasFor('taxCode.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxCode']['get'](ctx, {
				realmId: '12345678',
				taxcodeId: '35',
			}),
	},
	{
		id: 'taxPayment.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM TaxPayment' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { TaxPayment: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { TaxPayment: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('taxPayment.list').input,
		outputSchema: schemasFor('taxPayment.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxPayment']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'taxPayment.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxpayment/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { TaxPayment: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { TaxPayment: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', taxPaymentId: '35' },
		inputSchema: schemasFor('taxPayment.get').input,
		outputSchema: schemasFor('taxPayment.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxPayment']['get'](ctx, {
				realmId: '12345678',
				taxPaymentId: '35',
			}),
	},
	{
		id: 'taxRate.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM TaxRate' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { TaxRate: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { TaxRate: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('taxRate.list').input,
		outputSchema: schemasFor('taxRate.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxRate']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'taxRate.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxrate/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { TaxRate: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { TaxRate: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', taxrateId: '35' },
		inputSchema: schemasFor('taxRate.get').input,
		outputSchema: schemasFor('taxRate.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxRate']['get'](ctx, {
				realmId: '12345678',
				taxrateId: '35',
			}),
	},
	{
		id: 'taxService.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/taxservice/taxcode',
		expectedQuery: {},
		expectedBody: { TaxCode: 'sample', TaxRateDetails: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				TaxService: { TaxCode: 'sample', TaxRateDetails: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxService: { TaxCode: 'sample', TaxRateDetails: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { TaxCode: 'sample', TaxRateDetails: [] },
		},
		inputSchema: schemasFor('taxService.create').input,
		outputSchema: schemasFor('taxService.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxService']['create'](ctx, {
				realmId: '12345678',
				body: { TaxCode: 'sample', TaxRateDetails: [] },
			}),
	},
	{
		id: 'taxSummary.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TaxSummary',
		expectedQuery: { agency_id: '1' },
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: { agency_id: '1' } },
		inputSchema: schemasFor('taxSummary.list').input,
		outputSchema: schemasFor('taxSummary.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxSummary']['list'](ctx, {
				realmId: '12345678',
				params: { agency_id: '1' },
			}),
	},
	{
		id: 'term.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/term',
		expectedQuery: {},
		expectedBody: { Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Term: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Term: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Name: 'sample' } },
		inputSchema: schemasFor('term.create').input,
		outputSchema: schemasFor('term.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['term']['create'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample' },
			}),
	},
	{
		id: 'term.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Term' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Term: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Term: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('term.list').input,
		outputSchema: schemasFor('term.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['term']['list'](ctx, { realmId: '12345678' }),
	},
	{
		id: 'term.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/term/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Term: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Term: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', termId: '35' },
		inputSchema: schemasFor('term.get').input,
		outputSchema: schemasFor('term.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['term']['get'](ctx, {
				realmId: '12345678',
				termId: '35',
			}),
	},
	{
		id: 'term.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/term',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Term: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Term: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: schemasFor('term.update').input,
		outputSchema: schemasFor('term.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['term']['update'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'timeActivity.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/timeactivity',
		expectedQuery: {},
		expectedBody: { NameOf: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				TimeActivity: { NameOf: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TimeActivity: { NameOf: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { NameOf: 'sample' } },
		inputSchema: schemasFor('timeActivity.create').input,
		outputSchema: schemasFor('timeActivity.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['timeActivity']['create'](ctx, {
				realmId: '12345678',
				body: { NameOf: 'sample' },
			}),
	},
	{
		id: 'timeActivity.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/timeactivity',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				TimeActivity: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TimeActivity: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('timeActivity.delete').input,
		outputSchema: schemasFor('timeActivity.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['timeActivity']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'timeActivity.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM TimeActivity' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { TimeActivity: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { TimeActivity: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('timeActivity.list').input,
		outputSchema: schemasFor('timeActivity.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['timeActivity']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'timeActivity.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/timeactivity/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TimeActivity: { NameOf: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TimeActivity: { NameOf: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', timeactivityId: '35' },
		inputSchema: schemasFor('timeActivity.get').input,
		outputSchema: schemasFor('timeActivity.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['timeActivity']['get'](ctx, {
				realmId: '12345678',
				timeactivityId: '35',
			}),
	},
	{
		id: 'timeActivity.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/timeactivity',
		expectedQuery: {},
		expectedBody: { NameOf: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				TimeActivity: { NameOf: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TimeActivity: { NameOf: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { NameOf: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: schemasFor('timeActivity.update').input,
		outputSchema: schemasFor('timeActivity.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['timeActivity']['update'](ctx, {
				realmId: '12345678',
				body: { NameOf: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'transactionList.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TransactionList',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('transactionList.list').input,
		outputSchema: schemasFor('transactionList.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transactionList']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'transactionListByCustomer.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TransactionListByCustomer',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('transactionListByCustomer.list').input,
		outputSchema: schemasFor('transactionListByCustomer.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transactionListByCustomer']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'transactionListByVendor.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TransactionListByVendor',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('transactionListByVendor.list').input,
		outputSchema: schemasFor('transactionListByVendor.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transactionListByVendor']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'transactionListWithSplits.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TransactionListWithSplits',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('transactionListWithSplits.list').input,
		outputSchema: schemasFor('transactionListWithSplits.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transactionListWithSplits']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'transfer.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/transfer',
		expectedQuery: {},
		expectedBody: {
			Amount: 1,
			ToAccountRef: { value: 'sample' },
			FromAccountRef: { value: 'sample' },
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Transfer: {
					ToAccountRef: { value: 'sample' },
					Amount: 1,
					Id: '1',
					FromAccountRef: { value: 'sample' },
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Transfer: {
				ToAccountRef: { value: 'sample' },
				Amount: 1,
				Id: '1',
				FromAccountRef: { value: 'sample' },
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Amount: 1,
				ToAccountRef: { value: 'sample' },
				FromAccountRef: { value: 'sample' },
			},
		},
		inputSchema: schemasFor('transfer.create').input,
		outputSchema: schemasFor('transfer.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['create'](ctx, {
				realmId: '12345678',
				body: {
					Amount: 1,
					ToAccountRef: { value: 'sample' },
					FromAccountRef: { value: 'sample' },
				},
			}),
	},
	{
		id: 'transfer.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/transfer',
		expectedQuery: { operation: 'delete' },
		expectedBody: {
			ToAccountRef: { value: 'sample' },
			Amount: 1,
			Id: '35',
			FromAccountRef: { value: 'sample' },
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Transfer: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Transfer: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				ToAccountRef: { value: 'sample' },
				Amount: 1,
				Id: '35',
				FromAccountRef: { value: 'sample' },
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('transfer.delete').input,
		outputSchema: schemasFor('transfer.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['delete'](ctx, {
				realmId: '12345678',
				body: {
					ToAccountRef: { value: 'sample' },
					Amount: 1,
					Id: '35',
					FromAccountRef: { value: 'sample' },
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'transfer.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Transfer' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Transfer: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Transfer: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('transfer.list').input,
		outputSchema: schemasFor('transfer.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'transfer.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/transfer/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Transfer: {
					ToAccountRef: { value: 'sample' },
					Amount: 1,
					Id: '1',
					FromAccountRef: { value: 'sample' },
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Transfer: {
				ToAccountRef: { value: 'sample' },
				Amount: 1,
				Id: '1',
				FromAccountRef: { value: 'sample' },
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', transferId: '35' },
		inputSchema: schemasFor('transfer.get').input,
		outputSchema: schemasFor('transfer.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['get'](ctx, {
				realmId: '12345678',
				transferId: '35',
			}),
	},
	{
		id: 'transfer.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/transfer',
		expectedQuery: {},
		expectedBody: {
			Amount: 1,
			ToAccountRef: { value: 'sample' },
			FromAccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Transfer: {
					ToAccountRef: { value: 'sample' },
					Amount: 1,
					Id: '1',
					FromAccountRef: { value: 'sample' },
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Transfer: {
				ToAccountRef: { value: 'sample' },
				Amount: 1,
				Id: '1',
				FromAccountRef: { value: 'sample' },
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Amount: 1,
				ToAccountRef: { value: 'sample' },
				FromAccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: schemasFor('transfer.sparseUpdate').input,
		outputSchema: schemasFor('transfer.sparseUpdate').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					Amount: 1,
					ToAccountRef: { value: 'sample' },
					FromAccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'transfer.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/transfer',
		expectedQuery: {},
		expectedBody: {
			Amount: 1,
			ToAccountRef: { value: 'sample' },
			FromAccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Transfer: {
					ToAccountRef: { value: 'sample' },
					Amount: 1,
					Id: '1',
					FromAccountRef: { value: 'sample' },
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Transfer: {
				ToAccountRef: { value: 'sample' },
				Amount: 1,
				Id: '1',
				FromAccountRef: { value: 'sample' },
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Amount: 1,
				ToAccountRef: { value: 'sample' },
				FromAccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('transfer.update').input,
		outputSchema: schemasFor('transfer.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['update'](ctx, {
				realmId: '12345678',
				body: {
					Amount: 1,
					ToAccountRef: { value: 'sample' },
					FromAccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'trialBalance.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TrialBalance',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', locale: 'default', params: {} },
		inputSchema: schemasFor('trialBalance.list').input,
		outputSchema: schemasFor('trialBalance.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['trialBalance']['list'](ctx, {
				realmId: '12345678',
				locale: 'default',
				params: {},
			}),
	},
	{
		id: 'vendor.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/vendor',
		expectedQuery: {},
		expectedBody: {},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: {} },
		inputSchema: schemasFor('vendor.create').input,
		outputSchema: schemasFor('vendor.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendor']['create'](ctx, {
				realmId: '12345678',
				body: {},
			}),
	},
	{
		id: 'vendor.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Vendor' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Vendor: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Vendor: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('vendor.list').input,
		outputSchema: schemasFor('vendor.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendor']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'vendor.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/vendor/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', vendorId: '35' },
		inputSchema: schemasFor('vendor.get').input,
		outputSchema: schemasFor('vendor.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendor']['get'](ctx, {
				realmId: '12345678',
				vendorId: '35',
			}),
	},
	{
		id: 'vendor.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/vendor',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('vendor.update').input,
		outputSchema: schemasFor('vendor.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendor']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'vendorBalance.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/VendorBalance',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('vendorBalance.list').input,
		outputSchema: schemasFor('vendorBalance.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorBalance']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'vendorBalanceDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/VendorBalanceDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('vendorBalanceDetail.list').input,
		outputSchema: schemasFor('vendorBalanceDetail.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorBalanceDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'vendorCredit.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/vendorcredit',
		expectedQuery: {},
		expectedBody: { VendorRef: { value: 'sample' }, Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { VendorRef: { value: 'sample' }, Line: [] },
		},
		inputSchema: schemasFor('vendorCredit.create').input,
		outputSchema: schemasFor('vendorCredit.create').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorCredit']['create'](ctx, {
				realmId: '12345678',
				body: { VendorRef: { value: 'sample' }, Line: [] },
			}),
	},
	{
		id: 'vendorCredit.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/vendorcredit',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				VendorCredit: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			VendorCredit: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: schemasFor('vendorCredit.delete').input,
		outputSchema: schemasFor('vendorCredit.delete').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorCredit']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'vendorCredit.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM VendorCredit' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { VendorCredit: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { VendorCredit: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: schemasFor('vendorCredit.list').input,
		outputSchema: schemasFor('vendorCredit.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorCredit']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'vendorCredit.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/vendorcredit/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', vendorcreditId: '35' },
		inputSchema: schemasFor('vendorCredit.get').input,
		outputSchema: schemasFor('vendorCredit.get').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorCredit']['get'](ctx, {
				realmId: '12345678',
				vendorcreditId: '35',
			}),
	},
	{
		id: 'vendorCredit.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/vendorcredit',
		expectedQuery: {},
		expectedBody: {
			VendorRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: schemasFor('vendorCredit.update').input,
		outputSchema: schemasFor('vendorCredit.update').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorCredit']['update'](ctx, {
				realmId: '12345678',
				body: {
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'vendorExpenses.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/VendorExpenses',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: schemasFor('vendorExpenses.list').input,
		outputSchema: schemasFor('vendorExpenses.list').output,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorExpenses']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
];
