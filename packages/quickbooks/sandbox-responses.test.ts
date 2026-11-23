import { z } from 'zod';
import { CatalogEndpoints } from './endpoints';
import { QuickBooksCatalogEndpointSchemas } from './endpoints/catalog';
import { responseSchema } from './endpoints/schema-mode';
import { quickBooksSandboxResponses as sandbox } from './sandbox-responses';

// Each case answers with a response a QuickBooks sandbox company sent on 2026-11-23.
const realmId = '12345678';
const context = {
	key: 'test-access-token',
	options: { environment: 'sandbox' as const },
	endpoints: {},
};

describe('QuickBooks operations against sandbox responses', () => {
	let fetchMock: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		// Only the responses each test queues may be used; anything else would reach the network.
		fetchMock.mockRejectedValue(new Error('Unexpected fetch in sandbox test'));
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	function answer(body: unknown): void {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(body), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
	}

	// unknown because the sent body is whatever JSON the endpoint serialized; tests compare it with fixtures.
	function sent(): { url: URL; method?: string; body: unknown } {
		const call = fetchMock.mock.calls.at(-1);
		if (!call) throw new Error('Expected a provider request');
		const [url, init] = call;
		return {
			url: new URL(String(url)),
			method: init?.method,
			body: init?.body ? JSON.parse(String(init.body)) : undefined,
		};
	}

	it('reads a bill whose lines carry an empty CustomExtensions list', async () => {
		answer(sandbox.billGet);
		const result = await CatalogEndpoints.bill.get(context, {
			realmId,
			billId: '126',
		});
		expect(result.Bill.Line).toHaveLength(2);
		expect(result.Bill.Line[0]?.CustomExtensions).toEqual([]);
	});

	it('lists journal entries whose lines carry CustomExtensions lists', async () => {
		answer(sandbox.journalEntryList);
		const result = await CatalogEndpoints.journalEntry.list(context, {
			realmId,
			maxResults: 1,
		});
		const entry = result.QueryResponse.JournalEntry?.[0];
		expect(entry?.Line.length).toBeGreaterThan(0);
		expect(entry?.Line[0]?.CustomExtensions).toEqual([]);
	});

	it('reads a purchase order with item lines', async () => {
		answer(sandbox.purchaseOrderGet);
		const result = await CatalogEndpoints.purchaseOrder.get(context, {
			realmId,
			purchaseorderId: '125',
		});
		expect(result.PurchaseOrder.Line[0]?.DetailType).toBe(
			'ItemBasedExpenseLineDetail',
		);
	});

	it('creates a purchase order with an account-based expense line', async () => {
		answer(sandbox.purchaseOrderCreateAccountLine);
		const body = {
			VendorRef: { value: '56' },
			APAccountRef: { value: '33' },
			Line: [
				{
					DetailType: 'AccountBasedExpenseLineDetail' as const,
					Amount: 30,
					AccountBasedExpenseLineDetail: { AccountRef: { value: '7' } },
				},
			],
		};
		const result = await CatalogEndpoints.purchaseOrder.create(context, {
			realmId,
			body,
		});
		expect(sent().body).toEqual(body);
		expect(result.PurchaseOrder.Line[0]?.DetailType).toBe(
			'AccountBasedExpenseLineDetail',
		);
		// The documented request and response contracts accept the account line too.
		const schemas = QuickBooksCatalogEndpointSchemas['purchaseOrder.create'];
		expect(schemas?.input.safeParse({ realmId, body }).success).toBe(true);
	});

	it('reads one tax classification, whose ApplicableTo is a list', async () => {
		answer(sandbox.taxClassificationGet);
		const result = await CatalogEndpoints.taxClassification.get(context, {
			realmId,
			taxClassificationId: 'EUC-09021125-V1-00120000',
		});
		expect(result.TaxClassification.ApplicableTo).toEqual([
			'Inventory',
			'NonInventory',
		]);
		const documented =
			QuickBooksCatalogEndpointSchemas['taxClassification.get']?.output;
		expect(documented?.safeParse(sandbox.taxClassificationGet).success).toBe(
			true,
		);
	});

	it('lists tax classifications under QueryResponse', async () => {
		answer(sandbox.taxClassificationListByLevel);
		const result = await CatalogEndpoints.taxClassification.listByLevel(
			context,
			{ realmId, level: 1 },
		);
		expect(sent().url.searchParams.get('level')).toBe('1');
		expect(result.QueryResponse.TaxClassification).toHaveLength(2);
		expect(result.QueryResponse.TaxClassification?.[0]?.ParentRef).toBe(
			undefined,
		);
		const documented =
			QuickBooksCatalogEndpointSchemas['taxClassification.listByLevel']?.output;
		expect(
			documented?.safeParse(sandbox.taxClassificationListByLevel).success,
		).toBe(true);
	});

	it('deletes a category item with operation=delete', async () => {
		answer({
			Item: { domain: 'QBO', status: 'Deleted', Id: '22' },
			time: '2026-11-23T00:13:01.362-08:00',
		});
		const result = await CatalogEndpoints.item.deleteCategory(context, {
			realmId,
			body: { Id: '22', SyncToken: '1' },
		});
		const request = sent();
		expect(request.method).toBe('POST');
		expect(request.url.pathname).toBe(`/v3/company/${realmId}/item`);
		expect(request.url.searchParams.get('operation')).toBe('delete');
		expect(request.body).toEqual({ Id: '22', SyncToken: '1' });
		expect(result.Item.status).toBe('Deleted');
	});
});

describe('lenient response parsing', () => {
	it('keeps a nested object that QuickBooks sends as a list', () => {
		const documented = z
			.object({
				Thing: z
					.object({ Extra: z.object({ Key: z.string() }).optional() })
					.strict(),
			})
			.strict();
		const parsed = responseSchema(documented).parse({
			Thing: { Extra: [{ Key: 'a' }] },
		}) as { Thing: { Extra: unknown } };
		expect(parsed.Thing.Extra).toEqual([{ Key: 'a' }]);
	});
});
