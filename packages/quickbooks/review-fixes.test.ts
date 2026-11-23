import { CatalogEndpoints } from './endpoints';
import { QuickBooksCatalogEndpointSchemas } from './endpoints/catalog';
import { requestSchema } from './endpoints/schema-mode';
import { QuickBooksSpecialEndpoints } from './endpoints/special';

// Cases from the 11-23 review of the live-run head.
const realmId = '12345678';
const context = {
	key: 'test-access-token',
	options: { environment: 'sandbox' as const },
	endpoints: {},
};

function schemasFor(id: string) {
	const entry = QuickBooksCatalogEndpointSchemas[id];
	if (!entry) throw new Error(`No schemas for ${id}`);
	return entry;
}

describe('QuickBooks review fixes', () => {
	let fetchMock: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		// Only the responses each test queues may be used; anything else would reach the network.
		fetchMock.mockRejectedValue(new Error('Unexpected fetch in review test'));
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	function answer(body: string | Uint8Array, contentType: string): void {
		fetchMock.mockResolvedValueOnce(
			new Response(body, {
				status: 200,
				headers: { 'Content-Type': contentType },
			}),
		);
	}

	it('turns a JSON Fault on a PDF route into an error', async () => {
		answer(
			JSON.stringify({
				Fault: {
					Error: [{ Message: 'Object Not Found', code: '610' }],
					type: 'ValidationFault',
				},
			}),
			'application/json',
		);
		await expect(
			CatalogEndpoints.invoice.getPdf(context, { realmId, invoiceId: '35' }),
		).rejects.toMatchObject({ name: 'ApiError', status: 200 });
	});

	it('does not return an empty body as a PDF', async () => {
		answer(new Uint8Array(0), 'application/pdf');
		await expect(
			CatalogEndpoints.estimate.getPdf(context, { realmId, estimateId: '35' }),
		).rejects.toThrow(/empty body/);
	});

	it('does not take a text body named like a PDF for a PDF', async () => {
		answer('not a pdf', 'text/plain; name=invoice.pdf');
		await expect(
			CatalogEndpoints.invoice.getPdf(context, { realmId, invoiceId: '35' }),
		).rejects.toThrow(/instead of a PDF/);
	});

	it('still returns PDF bytes', async () => {
		answer(
			new TextEncoder().encode('%PDF-1.4'),
			'application/pdf;charset=UTF-8',
		);
		const result = await CatalogEndpoints.invoice.getPdf(context, {
			realmId,
			invoiceId: '35',
		});
		expect(result.sizeBytes).toBe(8);
	});

	it('checks large base64 uploads without overflowing the stack', () => {
		const schema = requestSchema(schemasFor('attachable.upload').input);
		const base = {
			realmId,
			fileName: 'big.bin',
			contentType: 'application/octet-stream',
		};
		const large = 'QUJD'.repeat(4_000_000);
		expect(schema.safeParse({ ...base, base64Content: large }).success).toBe(
			true,
		);
		expect(
			schema.safeParse({ ...base, base64Content: `${large}Q` }).success,
		).toBe(false);
		expect(schema.safeParse({ ...base, base64Content: 'QU*D' }).success).toBe(
			false,
		);
	});

	it('counts only defined recurring transaction types', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					RecurringTransaction: {
						status: 'Deleted',
						Invoice: { Id: '35' },
					},
					time: '2026-11-23T00:00:00Z',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);
		await CatalogEndpoints.recurringTransaction.delete(context, {
			realmId,
			body: { Invoice: { Id: '35', SyncToken: '0' }, Bill: undefined },
		});
		const published = schemasFor('recurringTransaction.create').input;
		expect(
			published.safeParse({
				realmId,
				body: {
					Invoice: { RecurringInfo: { Name: 'a' } },
					Bill: { RecurringInfo: { Name: 'b' } },
				},
			}).success,
		).toBe(false);
	});

	it('requires agency_id for TaxSummary and Type Category for category updates', () => {
		expect(
			schemasFor('taxSummary.list').input.safeParse({
				realmId,
				params: { start_date: '2026-01-01' },
			}).success,
		).toBe(false);
		expect(
			schemasFor('taxSummary.list').input.safeParse({
				realmId,
				params: { agency_id: '1' },
			}).success,
		).toBe(true);
		const category = requestSchema(schemasFor('item.updateCategory').input);
		expect(
			category.safeParse({
				realmId,
				body: { Id: '35', SyncToken: '0', Name: 'a', Type: 'Service' },
			}).success,
		).toBe(false);
	});

	it('accepts the parent-estimate link on a change-order line', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					ChangeOrder: { Id: '5', Line: [] },
					time: '2026-11-23T00:00:00Z',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);
		await CatalogEndpoints.changeOrder.create(context, {
			realmId,
			body: {
				CustomerRef: { value: '1' },
				ProjectRef: { value: '2' },
				Line: [
					{
						DetailType: 'SalesItemLineDetail',
						Amount: 5,
						SalesItemLineDetail: { ItemRef: { value: '19' } },
						LinkedTxn: [{ TxnId: '100', TxnType: 'Estimate' }],
					},
				],
			},
		});
	});

	it('masks email addresses in per-item batch faults', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					BatchItemResponse: [
						{
							bId: 'c1',
							Fault: {
								Error: [
									{
										Message: 'Invalid Email Address format',
										Detail: 'Invalid email: someone@example.com',
										code: '2210',
									},
								],
								type: 'ValidationFault',
							},
						},
						{ bId: 'q1', QueryResponse: { Term: [] } },
					],
					time: '2026-11-23T00:00:00Z',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);
		const result = await QuickBooksSpecialEndpoints.batch.execute(context, {
			realmId,
			items: [
				{ bId: 'c1', operation: 'create', Customer: { DisplayName: 'A' } },
				{ bId: 'q1', Query: 'SELECT * FROM Term' },
			],
		});
		const text = JSON.stringify(result);
		expect(text).not.toContain('someone@example.com');
		expect(text).toContain('2210');
		expect(text).toContain('"bId":"q1"');
	});

	it('rejects a void batch item that is not a sparse update with Id and SyncToken', async () => {
		await expect(
			QuickBooksSpecialEndpoints.batch.execute(context, {
				realmId,
				items: [
					{
						bId: 'v1',
						operation: 'create',
						optionsData: 'void',
						Invoice: { sparse: true },
					} as never,
				],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
