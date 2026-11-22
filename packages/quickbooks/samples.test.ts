import { CatalogEndpoints } from './endpoints';
import { intuitSamples } from './intuit-samples.fixtures';

// Each case runs one operation with Intuit's documented request body and answers
// with Intuit's documented response, as the closest thing to a live call.
const realmId = '12345678';
const context = {
	key: 'test-access-token',
	options: { environment: 'sandbox' as const },
	endpoints: {},
};

function sample(name: string): { request?: unknown; response?: unknown } {
	const found = intuitSamples[name];
	if (!found) throw new Error(`Missing Intuit sample ${name}`);
	return found;
}

// any because samples are plain JSON handed to typed inputs; each endpoint validates its own body.
function body(name: string): any {
	return sample(name).request;
}

describe('QuickBooks operations against Intuit catalog samples', () => {
	let fetchMock: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	function answer(name: string): void {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(sample(name).response), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
	}

	function sent(): { url: URL; body: unknown } {
		const call = fetchMock.mock.calls.at(-1);
		if (!call) throw new Error('Expected a provider request');
		const [url, init] = call;
		return {
			url: new URL(String(url)),
			body: init?.body ? JSON.parse(String(init.body)) : undefined,
		};
	}

	it('creates an invoice whose line has no Id yet', async () => {
		answer('Invoice.Create0');
		const result = await CatalogEndpoints.invoice.create(context, {
			realmId,
			body: body('Invoice.Create0'),
		});
		expect(sent().body).toEqual(body('Invoice.Create0'));
		expect(result.Invoice.Id).toBeDefined();
	});

	it('updates an invoice with subtotal lines, custom fields and other documented fields', async () => {
		answer('Invoice.Update0');
		const result = await CatalogEndpoints.invoice.update(context, {
			realmId,
			body: body('Invoice.Update0'),
		});
		expect(sent().body).toMatchObject({ DueDate: expect.any(String) });
		expect(Array.isArray(result.Invoice.CustomField)).toBe(true);
	});

	it('voids an invoice with Id and SyncToken only', async () => {
		answer('Invoice.Void0');
		await CatalogEndpoints.invoice.void(context, {
			realmId,
			body: body('Invoice.Void0'),
		});
		expect(sent().url.searchParams.get('operation')).toBe('void');
	});

	it('reads a credit card payment under CreditCardPaymentTxn', async () => {
		answer('Creditcardpayment.Read0');
		const result = await CatalogEndpoints.creditCardPayment.get(context, {
			realmId,
			creditcardpaymentId: '31',
		});
		expect(result.CreditCardPaymentTxn.Id).toBeDefined();
	});

	it('lists exchange rates under QueryResponse.ExchangeRate', async () => {
		answer('Exchangerate.Query0');
		const result = await CatalogEndpoints.exchangerate.list(context, {
			realmId,
		});
		expect(result.QueryResponse.ExchangeRate?.length).toBeGreaterThan(0);
	});

	it('updates an exchange rate without an Id', async () => {
		answer('Exchangerate.Update0');
		const result = await CatalogEndpoints.exchangerate.update(context, {
			realmId,
			body: body('Exchangerate.Update0'),
		});
		expect(result.ExchangeRate.SourceCurrencyCode).toBe('INR');
	});

	it('returns the AttachableResponse list after an upload', async () => {
		answer('Attachable.Upload0');
		const result = await CatalogEndpoints.attachable.upload(context, {
			realmId,
			fileName: 'receipt.pdf',
			contentType: 'application/pdf',
			base64Content: 'JVBERg==',
		});
		expect(result.AttachableResponse[0]?.Attachable?.Id).toBeDefined();
	});

	it('parses report Header.Option as Name/Value pairs', async () => {
		answer('Profitandloss.Query0');
		const result = await CatalogEndpoints.profitAndLoss.list(context, {
			realmId,
			params: { start_date: '2015-06-01', end_date: '2015-06-30' },
		});
		expect(result.Header?.Option?.[0]).toEqual({
			Name: 'AccountingStandard',
			Value: 'GAAP',
		});
	});

	it('creates a direct deposit and a balanced journal entry without line Ids', async () => {
		answer('Deposit.Create0');
		await CatalogEndpoints.deposit.create(context, {
			realmId,
			body: body('Deposit.Create0'),
		});
		answer('Journalentry.Create0');
		await CatalogEndpoints.journalEntry.create(context, {
			realmId,
			body: body('Journalentry.Create0'),
		});
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('creates a vendor credit with an account-based line', async () => {
		answer('Vendorcredit.Create0');
		await CatalogEndpoints.vendorCredit.create(context, {
			realmId,
			body: body('Vendorcredit.Create0'),
		});
		expect(sent().body).toEqual(body('Vendorcredit.Create0'));
	});

	it('wraps recurring templates in their transaction type', async () => {
		answer('Recurringtransaction.Create0');
		await CatalogEndpoints.recurringTransaction.create(context, {
			realmId,
			body: body('Recurringtransaction.Create0'),
		});
		expect(Object.keys(sent().body as object)).toEqual(['Invoice']);

		answer('Recurringtransaction.Read0');
		await CatalogEndpoints.recurringTransaction.get(context, {
			realmId,
			recurringtransactionId: '1483',
		});

		answer('Recurringtransaction.Delete0');
		await CatalogEndpoints.recurringTransaction.delete(context, {
			realmId,
			body: body('Recurringtransaction.Delete0'),
		});
		expect(sent().body).toEqual({ Invoice: { SyncToken: '0', Id: '1483' } });
	});

	it('runs a batch with a sparse update and returns per-item faults', async () => {
		answer('Batch.BatchRequest0');
		const request = body('Batch.BatchRequest0');
		const result = await CatalogEndpoints.batch.execute(context, {
			realmId,
			items: request.BatchItemRequest,
		});
		expect(result.BatchItemResponse[0]?.bId).toBe('bid1');
		await expect(
			CatalogEndpoints.batch.execute(context, {
				realmId,
				items: [
					{ bId: 'same', Query: 'select * from Customer' },
					{ bId: 'same', Query: 'select * from Vendor' },
				],
			}),
		).rejects.toThrow('Duplicate bId');
	});

	it('updates a time activity with Minutes, a change order and a payment from their samples', async () => {
		answer('Timeactivity.Update0');
		await CatalogEndpoints.timeActivity.update(context, {
			realmId,
			body: body('Timeactivity.Update0'),
		});
		answer('Changeorder.Update0');
		await CatalogEndpoints.changeOrder.update(context, {
			realmId,
			body: body('Changeorder.Update0'),
		});
		answer('Payment.Update0');
		await CatalogEndpoints.payment.update(context, {
			realmId,
			body: body('Payment.Update0'),
		});
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});

	it('creates a customer with the documented contact fields', async () => {
		answer('Customer.Create0');
		await CatalogEndpoints.customer.create(context, {
			realmId,
			body: body('Customer.Create0'),
		});
		expect(sent().body).toMatchObject({ CompanyName: expect.any(String) });
	});
});
