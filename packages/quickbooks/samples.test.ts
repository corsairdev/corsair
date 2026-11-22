import { CatalogEndpoints } from './endpoints';
import { intuitSamples } from './intuit-samples';

// Each case runs one operation with Intuit's documented request body and answers
// with Intuit's documented response, as the closest thing to a live call.
const realmId = '12345678';
const context = {
	key: 'test-access-token',
	options: { environment: 'sandbox' as const },
	endpoints: {},
};

// unknown because samples are Intuit's raw JSON; each test hands them to a typed endpoint that validates them.
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
		// Only the responses each test queues may be used; anything else would reach the network.
		fetchMock.mockRejectedValue(new Error('Unexpected fetch in sample test'));
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

	// unknown because the sent body is whatever JSON the endpoint serialized; tests compare it with fixtures.
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
		const expected = sample('Batch.BatchRequest0').response as {
			// unknown[] because the items are Intuit's raw sample JSON, compared as-is with the result.
			BatchItemResponse: unknown[];
		};
		expect(result.BatchItemResponse).toEqual(expected.BatchItemResponse);
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

	it('keeps sparse: true required on a sparse update', async () => {
		await expect(
			CatalogEndpoints.customer.sparseUpdate(context, {
				realmId,
				// Without sparse QuickBooks would run a full update and clear omitted fields.
				body: { Id: '1', SyncToken: '0', DisplayName: 'Renamed' } as never,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();

		answer('Customer.Create0');
		await CatalogEndpoints.customer.sparseUpdate(context, {
			realmId,
			body: { Id: '1', SyncToken: '0', sparse: true, DisplayName: 'Renamed' },
		});
		expect(sent().body).toMatchObject({ sparse: true });
	});

	it('uploads an attachment linked to an invoice', async () => {
		answer('Attachable.Upload0');
		await CatalogEndpoints.attachable.upload(context, {
			realmId,
			fileName: 'receipt.pdf',
			contentType: 'application/pdf',
			base64Content: 'JVBERg==',
			metadata: {
				AttachableRef: [
					{ EntityRef: { type: 'Invoice', value: '95' }, IncludeOnSend: false },
				],
			},
		});
		const call = fetchMock.mock.calls.at(-1);
		const form = call?.[1]?.body;
		expect(form).toBeInstanceOf(FormData);
		const metadata =
			form instanceof FormData ? form.get('file_metadata_01') : null;
		expect(metadata).toBeInstanceOf(Blob);
		expect(
			metadata instanceof Blob ? JSON.parse(await metadata.text()) : null,
		).toMatchObject({
			AttachableRef: [{ EntityRef: { type: 'Invoice', value: '95' } }],
			FileName: 'receipt.pdf',
		});
	});

	it('wraps a single listed item in an array and keeps QueryResponse an object', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					QueryResponse: { Class: { Id: '5', Name: 'France' } },
					time: '2026-11-18T12:00:00Z',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);
		const result = await CatalogEndpoints.class.list(context, { realmId });
		expect(result.QueryResponse.Class).toEqual([{ Id: '5', Name: 'France' }]);
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ QueryResponse: [], time: 't' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(
			CatalogEndpoints.class.list(context, { realmId }),
		).rejects.toThrow();
	});

	it('treats a 200 answer with a top-level Fault as a failed request', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					Fault: {
						Error: [
							{
								Message: 'Invalid email',
								Detail: 'Email pat@example.com is not valid',
								code: '2210',
							},
						],
						type: 'ValidationFault',
					},
					time: 't',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);
		const failure = await CatalogEndpoints.customer
			.create(context, { realmId, body: { DisplayName: 'Pat' } })
			// unknown because a rejection can carry any value; the expectations below inspect it.
			.catch((caught: unknown) => caught);
		expect(failure).toBeInstanceOf(Error);
		expect(JSON.stringify(failure)).toContain('2210');
		expect(JSON.stringify(failure)).not.toContain('pat@example.com');
	});

	it('sends sparse: true on payment voids and needs one recurring type', async () => {
		answer('Invoice.Void0');
		await CatalogEndpoints.payment.void(context, {
			realmId,
			body: { Id: '69', SyncToken: '2' },
		});
		expect(sent().body).toEqual({ Id: '69', SyncToken: '2', sparse: true });
		await expect(
			CatalogEndpoints.recurringTransaction.delete(context, {
				realmId,
				body: {},
			}),
		).rejects.toThrow('exactly one transaction type');
		await expect(
			CatalogEndpoints.recurringTransaction.delete(context, {
				realmId,
				body: { Invoice: { SyncToken: '0' } } as never,
			}),
		).rejects.toThrow();
	});

	it('reports a batch answer without per-item results as unconfirmed', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ time: 't' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(
			CatalogEndpoints.batch.execute(context, {
				realmId,
				items: [{ bId: 'q1', Query: 'select * from Customer' }],
			}),
		).rejects.toThrow('check them before retrying');
	});

	it('keeps CDC rows tied to their entity and checks a download URL', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					CDCResponse: [{ QueryResponse: [{ Customer: { Id: '5' } }, {}] }],
					time: 't',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);
		const changes = await CatalogEndpoints.changeDataCapture.changes(context, {
			realmId,
			entities: ['Customer'],
			changedSince: new Date(Date.now() - 60_000).toISOString(),
		});
		expect(changes.CDCResponse[0]?.QueryResponse[0]).toEqual({
			Customer: [{ Id: '5' }],
		});

		fetchMock.mockResolvedValueOnce(
			new Response('not an absolute URL', {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			}),
		);
		await expect(
			CatalogEndpoints.attachable.download(context, {
				realmId,
				attachableId: '1',
			}),
		).rejects.toThrow();
	});

	it('masks dotless email addresses in fault text', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					Fault: {
						Error: [
							{ Message: 'Invalid', Detail: 'pat@localhost', code: '2210' },
						],
					},
				}),
				{ status: 400, headers: { 'Content-Type': 'application/json' } },
			),
		);
		// unknown because a rejection can carry any value; the expectations below inspect it.
		const failure = await CatalogEndpoints.customer
			.create(context, { realmId, body: { DisplayName: 'Pat' } })
			.catch((caught: unknown) => caught);
		expect(JSON.stringify(failure)).not.toContain('pat@localhost');
		expect(JSON.stringify(failure)).toContain('2210');
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
