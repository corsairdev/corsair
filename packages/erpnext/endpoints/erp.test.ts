import { createCorsair } from 'corsair/core';
import { erpnext, erpnextEndpointSchemas, erpnextEndpoints } from '../index';
import type { ErpnextOperationKey } from '../operations';
import { ERPNEXT_OPERATIONS } from '../operations';

const BASE_URL = 'https://test.example.com';
const AUTH_HEADER = 'token test-key:test-secret';

// The erp family under test; the dotted keys look up the shared schema
// registry and the bound public tree.
type ErpOperationKey = Extract<ErpnextOperationKey, `erp.${string}`>;

const ERP_OPERATIONS = ERPNEXT_OPERATIONS.filter(
	(
		operation,
	): operation is (typeof ERPNEXT_OPERATIONS)[number] & {
		key: ErpOperationKey;
	} => operation.key.startsWith('erp.'),
);

const ERP_ACTIONS = [
	'getExchangeRate',
	'getItemDetails',
	'getPartyDetails',
	'getPaymentEntry',
	'getStockBalance',
	'makeSalesInvoice',
	'makeDeliveryNote',
	'makePurchaseOrder',
	'makeStockEntry',
] as const;

type Handler = (
	// unknown: handlers are walked out of the bound public tree at runtime, so
	// their precise per-operation input/output types cannot be recovered here;
	// each call is schema-validated separately before the handler runs.
	input: unknown,
) => Promise<unknown>;

type CapturedRequest = {
	url: URL;
	method: string;
	headers: Headers;
	// unknown: the captured body is whatever the transport serialized for the
	// operation under test (JSON object, array, or none); assertions compare
	// it structurally rather than by a single type.
	body: unknown;
};

function endpointHandlers(tree: object, prefix = ''): Map<string, Handler> {
	return new Map(
		Object.entries(tree).flatMap(([name, value]) => {
			const key = prefix ? `${prefix}.${name}` : name;
			if (typeof value === 'function') {
				return [[key, value as Handler]];
			}
			if (value && typeof value === 'object') {
				return [...endpointHandlers(value, key)];
			}
			return [];
		}),
	);
}

const corsair = createCorsair({
	plugins: [erpnext({ key: 'test-key:test-secret', baseUrl: BASE_URL })],
	// No database in API-only tests; the config type requires a KEK and the
	// runtime only uses it alongside a database for envelope encryption.
	kek: 'test-kek',
});
// Corsair's database/API result is a union; this assertion selects the API
// branch because the test invokes the public HTTP endpoints only.
// unknown: the bound client exposes the plugin namespaces only at runtime.
const publicApi = (corsair.erpnext as unknown as { api: object }).api;
const handlers = endpointHandlers(publicApi);

// Spec-derived input fixtures: the minimal valid request each ERPNext source
// signature shows. Written by hand so a mistaken schema can never bend the
// fixture into passing itself.
const INPUT_FIXTURES: Record<ErpOperationKey, unknown> = {
	'erp.getExchangeRate': {
		from_currency: 'USD',
		to_currency: 'EUR',
		transaction_date: '2026-01-15',
	},
	'erp.getItemDetails': {
		ctx: '{"item_code":"WIDGET"}',
		for_validate: true,
	},
	'erp.getPartyDetails': { party: 'CUST-00001', party_type: 'Customer' },
	'erp.getPaymentEntry': { dt: 'Sales Invoice', dn: 'ACC-SINV-2026-00001' },
	'erp.getStockBalance': {
		item_code: 'WIDGET',
		warehouse: 'Stores - ACME',
		posting_date: '2026-01-15',
	},
	'erp.makeSalesInvoice': {
		body: {
			source_name: 'SO-00001',
			target_doc: 'ACC-SINV-2026-00042',
		},
	},
	'erp.makeDeliveryNote': {
		body: {
			source_name: 'SO-00001',
			target_doc: 'MAT-DN-2026-00042',
		},
	},
	'erp.makePurchaseOrder': {
		body: {
			source_name: 'SO-00001',
			selected_items: ['SO-00001-0001'],
		},
	},
	'erp.makeStockEntry': {
		body: {
			item_code: 'WIDGET',
			qty: 5,
			from_warehouse: 'Stores - ACME',
			to_warehouse: 'Finished Goods - ACME',
		},
	},
};

// Spec-derived response fixtures: the envelope the Frappe sources return.
// Every /api/method answer nests the result under `message`
// (frappe/handler.py): numbers for the rate and stock balance lookups, one
// document-shaped object for the pricing, party, payment and mapper helpers,
// and a list of drafts for make_purchase_order, whose mapper returns
// purchase_orders ("Returns a list of doc objects." — mapper.py).
const RESPONSE_FIXTURES: Record<ErpOperationKey, unknown> = {
	'erp.getExchangeRate': { message: 1.0825 },
	'erp.getItemDetails': {
		message: {
			item_code: 'WIDGET',
			item_name: 'Widget',
			price_list_rate: 10,
			stock_uom: 'Nos',
		},
	},
	'erp.getPartyDetails': {
		message: {
			party: 'CUST-00001',
			party_type: 'Customer',
			customer_name: 'Acme GmbH',
			customer_group: 'Commercial',
			currency: 'EUR',
		},
	},
	'erp.getPaymentEntry': {
		message: {
			doctype: 'Payment Entry',
			payment_type: 'Receive',
			party_type: 'Customer',
			party: 'CUST-00001',
			paid_amount: 100,
			references: [
				{
					reference_doctype: 'Sales Invoice',
					reference_name: 'ACC-SINV-2026-00001',
					allocated_amount: 100,
				},
			],
		},
	},
	'erp.getStockBalance': { message: 42.5 },
	// get_mapped_doc answers the unsaved target draft (mapper.py).
	'erp.makeSalesInvoice': {
		message: {
			doctype: 'Sales Invoice',
			name: 'new-sales-invoice-hxk2rm',
			customer: 'CUST-00001',
			items: [{ item_code: 'WIDGET', qty: 2 }],
		},
	},
	'erp.makeDeliveryNote': {
		message: {
			doctype: 'Delivery Note',
			name: 'new-delivery-note-hxk2rm',
			customer: 'CUST-00001',
			items: [{ item_code: 'WIDGET', qty: 2 }],
		},
	},
	// make_purchase_order answers one draft per supplier, as a list.
	'erp.makePurchaseOrder': {
		message: [
			{
				doctype: 'Purchase Order',
				name: 'new-purchase-order-hxk2rm',
				supplier: 'SUP-00001',
			},
		],
	},
	// stock_entry_utils.py make_stock_entry returns the built StockEntry doc.
	'erp.makeStockEntry': {
		message: {
			doctype: 'Stock Entry',
			name: 'new-stock-entry-hxk2rm',
			purpose: 'Material Transfer',
			from_warehouse: 'Stores - ACME',
			to_warehouse: 'Finished Goods - ACME',
		},
	},
};

// Independently written expected requests, transcribed by hand from the
// ERPNext whitelisted-method wire contract (the erpnext.setup.utils,
// erpnext.stock, erpnext.accounts and erpnext.selling method paths, and the
// POST bodies their Python signatures accept) and paired with the hand-written
// INPUT_FIXTURES above. They are deliberately NOT derived from
// ERPNEXT_OPERATIONS: a wrong catalog entry must change the wire request
// without also rewriting the expectation, or the test could never catch it.
type ExpectedRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	url: string;
	query?: Record<string, string>;
	// unknown: the expected JSON body is an open record for provider payloads;
	// assertions compare it structurally against the captured body.
	body?: unknown;
	authHeader: string;
};

const EXPECTED_REQUESTS: Record<ErpOperationKey, ExpectedRequest> = {
	'erp.getExchangeRate': {
		method: 'GET',
		url: 'https://test.example.com/api/method/erpnext.setup.utils.get_exchange_rate',
		query: {
			from_currency: 'USD',
			to_currency: 'EUR',
			transaction_date: '2026-01-15',
		},
		authHeader: AUTH_HEADER,
	},
	'erp.getItemDetails': {
		method: 'GET',
		url: 'https://test.example.com/api/method/erpnext.stock.get_item_details.get_item_details',
		query: {
			ctx: '{"item_code":"WIDGET"}',
			for_validate: 'true',
		},
		authHeader: AUTH_HEADER,
	},
	'erp.getPartyDetails': {
		method: 'GET',
		url: 'https://test.example.com/api/method/erpnext.accounts.party.get_party_details',
		query: { party: 'CUST-00001', party_type: 'Customer' },
		authHeader: AUTH_HEADER,
	},
	'erp.getPaymentEntry': {
		method: 'GET',
		url: 'https://test.example.com/api/method/erpnext.accounts.doctype.payment_entry.payment_entry.get_payment_entry',
		query: { dt: 'Sales Invoice', dn: 'ACC-SINV-2026-00001' },
		authHeader: AUTH_HEADER,
	},
	'erp.getStockBalance': {
		method: 'GET',
		url: 'https://test.example.com/api/method/erpnext.stock.utils.get_stock_balance',
		query: {
			item_code: 'WIDGET',
			warehouse: 'Stores - ACME',
			posting_date: '2026-01-15',
		},
		authHeader: AUTH_HEADER,
	},
	'erp.makeSalesInvoice': {
		method: 'POST',
		url: 'https://test.example.com/api/method/erpnext.selling.doctype.sales_order.mapper.make_sales_invoice',
		body: {
			source_name: 'SO-00001',
			target_doc: 'ACC-SINV-2026-00042',
		},
		authHeader: AUTH_HEADER,
	},
	'erp.makeDeliveryNote': {
		method: 'POST',
		url: 'https://test.example.com/api/method/erpnext.selling.doctype.sales_order.mapper.make_delivery_note',
		body: {
			source_name: 'SO-00001',
			target_doc: 'MAT-DN-2026-00042',
		},
		authHeader: AUTH_HEADER,
	},
	'erp.makePurchaseOrder': {
		method: 'POST',
		url: 'https://test.example.com/api/method/erpnext.selling.doctype.sales_order.mapper.make_purchase_order',
		body: {
			source_name: 'SO-00001',
			selected_items: ['SO-00001-0001'],
		},
		authHeader: AUTH_HEADER,
	},
	'erp.makeStockEntry': {
		method: 'POST',
		url: 'https://test.example.com/api/method/erpnext.stock.doctype.stock_entry.stock_entry_utils.make_stock_entry',
		body: {
			item_code: 'WIDGET',
			qty: 5,
			from_warehouse: 'Stores - ACME',
			to_warehouse: 'Finished Goods - ACME',
		},
		authHeader: AUTH_HEADER,
	},
};

describe('ERPNext erp endpoint contract', () => {
	it('binds exactly the 9 documented erp handlers', () => {
		expect(ERP_OPERATIONS).toHaveLength(9);
		// The family tree exposes exactly the documented action keys; these
		// define the dotted operation ids with the `erp` prefix.
		expect(Object.keys(erpnextEndpoints.erp).sort()).toEqual(
			[...ERP_ACTIONS].sort(),
		);
		expect(ERP_OPERATIONS.map(({ key }) => key).sort()).toEqual(
			ERP_ACTIONS.map((action) => `erp.${action}`).sort(),
		);
		// And the bound public tree carries one handler per action.
		// unknown: the bound tree is walked by group name at runtime; the
		// erp group must exist once the family is registered.
		const erpApi = (publicApi as Record<string, unknown>).erp;
		expect(erpApi).toBeDefined();
		expect([...endpointHandlers(erpApi as object).keys()].sort()).toEqual(
			[...ERP_ACTIONS].sort(),
		);
	});

	it.each(Object.entries(INPUT_FIXTURES))(
		'%s sends its documented request',
		async (key) => {
			const operationKey = key as ErpOperationKey;
			const expected = EXPECTED_REQUESTS[operationKey];
			const schema = erpnextEndpointSchemas[operationKey];
			const input = INPUT_FIXTURES[operationKey];
			const response = RESPONSE_FIXTURES[operationKey];

			const captures: CapturedRequest[] = [];
			const mockFetch = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async (url, init) => {
					captures.push({
						url: new URL(String(url)),
						method: init?.method ?? 'GET',
						headers: new Headers(init?.headers),
						body: init?.body,
					});
					return new Response(JSON.stringify(response), {
						status: 200,
						headers: { 'content-type': 'application/json' },
					});
				});

			try {
				const expectedUrl = new URL(expected.url);
				// The registry schema must accept the fixture at the boundary.
				const parsedInput = schema.input.parse(input);
				const handler = handlers.get(operationKey);
				expect(handler).toBeDefined();
				const result = await handler?.(parsedInput);
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(captures).toHaveLength(1);
				const request = captures[0];
				if (!request) {
					throw new Error(`No request captured for ${operationKey}`);
				}
				expect(request.method).toBe(expected.method);
				expect(request.url.origin).toBe(expectedUrl.origin);
				expect(request.url.pathname).toBe(expectedUrl.pathname);
				expect(request.headers.get('authorization')).toBe(expected.authHeader);
				expect(Object.fromEntries(request.url.searchParams)).toEqual(
					expected.query ?? {},
				);

				if (expected.body !== undefined) {
					expect(request.body).toBeDefined();
					expect(JSON.parse(String(request.body))).toEqual(expected.body);
					expect(request.headers.get('content-type')).toContain(
						'application/json',
					);
				} else {
					expect(request.body).toBeUndefined();
				}

				expect(schema.output.safeParse(result).success).toBe(true);
			} finally {
				mockFetch.mockRestore();
			}
		},
	);

	// Every erp operation has a required wire field — a query key the Python
	// signature needs (from_currency, ctx, party, party_type, dt, dn,
	// item_code, warehouse) or the body itself. The strict schemas must reject
	// their absence at the public boundary before the handler touches fetch.
	it.each([
		{
			key: 'erp.getExchangeRate' as ErpOperationKey,
			name: 'a query without from_currency',
			input: { to_currency: 'EUR', transaction_date: '2026-01-15' },
		},
		{
			key: 'erp.getExchangeRate' as ErpOperationKey,
			name: 'a query without to_currency',
			input: { from_currency: 'USD', transaction_date: '2026-01-15' },
		},
		{
			key: 'erp.getItemDetails' as ErpOperationKey,
			name: 'a query without its ctx JSON string',
			input: { for_validate: true },
		},
		{
			key: 'erp.getPartyDetails' as ErpOperationKey,
			name: 'a query without party',
			input: { party_type: 'Customer' },
		},
		{
			key: 'erp.getPartyDetails' as ErpOperationKey,
			name: 'a query without party_type',
			input: { party: 'CUST-00001' },
		},
		{
			key: 'erp.getPaymentEntry' as ErpOperationKey,
			name: 'a query without dt',
			input: { dn: 'ACC-SINV-2026-00001' },
		},
		{
			key: 'erp.getPaymentEntry' as ErpOperationKey,
			name: 'a query without dn',
			input: { dt: 'Sales Invoice' },
		},
		{
			key: 'erp.getStockBalance' as ErpOperationKey,
			name: 'a query without item_code',
			input: { warehouse: 'Stores - ACME' },
		},
		{
			key: 'erp.getStockBalance' as ErpOperationKey,
			name: 'a query without warehouse',
			input: { item_code: 'WIDGET', posting_date: '2026-01-15' },
		},
		{
			key: 'erp.makeSalesInvoice' as ErpOperationKey,
			name: 'a body without source_name',
			input: { body: { target_doc: 'ACC-SINV-2026-00042' } },
		},
		{
			key: 'erp.makeSalesInvoice' as ErpOperationKey,
			name: 'no body at all',
			input: {},
		},
		{
			key: 'erp.makeDeliveryNote' as ErpOperationKey,
			name: 'a body without source_name',
			input: { body: { target_doc: 'MAT-DN-2026-00042' } },
		},
		{
			key: 'erp.makeDeliveryNote' as ErpOperationKey,
			name: 'no body at all',
			input: {},
		},
		{
			key: 'erp.makePurchaseOrder' as ErpOperationKey,
			name: 'a body without source_name',
			input: { body: { selected_items: ['SO-00001-0001'] } },
		},
		{
			key: 'erp.makeStockEntry' as ErpOperationKey,
			name: 'an empty kwargs record',
			input: { body: {} },
		},
		{
			key: 'erp.makeStockEntry' as ErpOperationKey,
			name: 'no body at all',
			input: {},
		},
	])(
		'rejects $key with $name before sending a request',
		async ({ key, input }) => {
			const fetchSpy = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async () => {
					throw new Error(`fetch must not be called for invalid ${key} input`);
				});
			try {
				const schema = erpnextEndpointSchemas[key];
				expect(schema.input.safeParse(input).success).toBe(false);
				// Prove the rejection happens at the public boundary: the bound
				// handler must throw before any HTTP request is attempted.
				const handler = handlers.get(key);
				expect(handler).toBeDefined();
				await expect(handler?.(input)).rejects.toThrow();
				expect(fetchSpy).not.toHaveBeenCalled();
			} finally {
				fetchSpy.mockRestore();
			}
		},
	);
});
