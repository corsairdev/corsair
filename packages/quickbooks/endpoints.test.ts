import {
	AccountsEndpoints,
	CatalogEndpoints,
	CompanyEndpoints,
} from './endpoints';
import { QuickBooksCatalogEndpointSchemas } from './endpoints/catalog';
import { QuickBooksCatalogTestCases } from './endpoints/catalog-cases';
import { QuickBooksSpecialEndpointSchemas } from './endpoints/special';
import { QuickBooksSpecialTestCases } from './endpoints/special-cases';

const quickBooksCatalogTestCases = [
	...QuickBooksCatalogTestCases,
	...QuickBooksSpecialTestCases,
];

const account = {
	Id: '35',
	SyncToken: '0',
	Name: 'Operating Checking',
	AccountType: 'Bank',
	domain: 'QBO',
	sparse: false,
};

const context = {
	key: 'test-access-token',
	options: { environment: 'sandbox' as const },
	endpoints: {},
};

// unknown because mock provider JSON is validated by each endpoint output schema.
function mockJsonResponse(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('QuickBooks verified endpoint requests', () => {
	let fetchMock: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		fetchMock.mockReset();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	it('creates an Account with JSON body on the sandbox host', async () => {
		fetchMock.mockResolvedValue(
			mockJsonResponse({ Account: account, time: '2026-11-18T12:00:00Z' }),
		);
		const result = await AccountsEndpoints.create(context, {
			realmId: '12345678',
			name: 'Operating Checking',
			accountType: 'Bank',
		});

		expect(result.Account.Id).toBe('35');
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the provider request');
		const [url, init] = call;
		expect(url).toBe(
			'https://sandbox-quickbooks.api.intuit.com/v3/company/12345678/account',
		);
		expect(init?.method).toBe('POST');
		expect(new Headers(init?.headers).get('authorization')).toBe(
			'Bearer test-access-token',
		);
		expect(new Headers(init?.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init?.body))).toEqual({
			Name: 'Operating Checking',
			AccountType: 'Bank',
		});
	});

	it('refreshes OAuth once and retries an Account write after a 401', async () => {
		const refreshAuth = jest.fn(async () => 'fresh-access-token');
		const authenticatedContext = { ...context, _refreshAuth: refreshAuth };
		fetchMock
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify({ Fault: { Error: [{ Message: 'expired' }] } }),
					{
						status: 401,
						statusText: 'Unauthorized',
						headers: { 'Content-Type': 'application/json' },
					},
				),
			)
			.mockResolvedValueOnce(
				mockJsonResponse({ Account: account, time: '2026-11-18T12:00:00Z' }),
			);

		await AccountsEndpoints.create(authenticatedContext, {
			realmId: '12345678',
			name: 'Operating Checking',
			accountType: 'Bank',
		});

		expect(refreshAuth).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		const retryCall = fetchMock.mock.calls.at(1);
		expect(retryCall).toBeDefined();
		if (!retryCall) throw new Error('Expected the refreshed provider request');
		expect(new Headers(retryCall[1]?.headers).get('authorization')).toBe(
			'Bearer fresh-access-token',
		);
	});

	it('reads an Account with the account ID in the path', async () => {
		fetchMock.mockResolvedValue(
			mockJsonResponse({ Account: account, time: '2026-11-18T12:00:00Z' }),
		);
		await AccountsEndpoints.get(context, {
			realmId: '12345678',
			accountId: '35',
		});

		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the provider request');
		expect(call[0]).toBe(
			'https://sandbox-quickbooks.api.intuit.com/v3/company/12345678/account/35',
		);
		expect(call[1]?.method).toBe('GET');
	});

	it('lists Accounts using provider pagination in the query statement', async () => {
		fetchMock.mockResolvedValue(
			mockJsonResponse({
				QueryResponse: {
					startPosition: 11,
					maxResults: 10,
					Account: [account],
				},
				time: '2026-11-18T12:00:00Z',
			}),
		);
		const result = await AccountsEndpoints.list(context, {
			realmId: '12345678',
			startPosition: 11,
			maxResults: 10,
		});

		expect(result.QueryResponse.Account?.[0]?.Id).toBe('35');
		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the provider request');
		const url = new URL(String(call[0]));
		expect(url.origin).toBe('https://sandbox-quickbooks.api.intuit.com');
		expect(url.pathname).toBe('/v3/company/12345678/query');
		expect(url.searchParams.get('query')).toBe(
			'SELECT * FROM Account STARTPOSITION 11 MAXRESULTS 10',
		);
	});

	it('reads CompanyInfo using the realm ID in both path positions', async () => {
		fetchMock.mockResolvedValue(
			mockJsonResponse({
				CompanyInfo: {
					Id: '12345678',
					CompanyName: 'Demo Company',
					DefaultTimeZone: 'America/Los_Angeles',
				},
				time: '2026-11-18T12:00:00Z',
			}),
		);
		const result = await CompanyEndpoints.get(context, {
			realmId: '12345678',
		});

		expect(result.CompanyInfo.CompanyName).toBe('Demo Company');
		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the provider request');
		expect(call[0]).toBe(
			'https://sandbox-quickbooks.api.intuit.com/v3/company/12345678/companyinfo/12345678',
		);
	});

	it('queries CompanyInfo using the documented query route', async () => {
		fetchMock.mockResolvedValue(
			mockJsonResponse({
				QueryResponse: {
					CompanyInfo: [{ Id: '12345678', CompanyName: 'Demo Company' }],
				},
				time: '2026-11-18T12:00:00Z',
			}),
		);
		const result = await CompanyEndpoints.list(context, {
			realmId: '12345678',
		});

		expect(result.QueryResponse.CompanyInfo?.[0]?.CompanyName).toBe(
			'Demo Company',
		);
		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the provider request');
		const url = new URL(String(call[0]));
		expect(url.pathname).toBe('/v3/company/12345678/query');
		expect(url.searchParams.get('query')).toBe('SELECT * FROM CompanyInfo');
	});

	it('rejects invalid strict input before network I/O', async () => {
		const input = Object.assign(
			{
				realmId: '12345678',
				name: 'Operating Checking',
				accountType: 'Bank' as const,
			},
			{ undocumented: true },
		);
		await expect(AccountsEndpoints.create(context, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('returns an account that carries a field the model catalog lacks', async () => {
		fetchMock.mockResolvedValue(
			mockJsonResponse({
				Account: { ...account, CurrentBalanceWithSubAccounts: 0 },
				time: '2026-11-18T12:00:00Z',
			}),
		);
		await expect(
			AccountsEndpoints.get(context, {
				realmId: '12345678',
				accountId: '35',
			}),
		).resolves.toMatchObject({
			Account: { Id: '35', CurrentBalanceWithSubAccounts: 0 },
		});
	});

	it('rejects a response without the Account envelope', async () => {
		fetchMock.mockResolvedValue(
			mockJsonResponse({
				QueryResponse: {},
				time: '2026-11-18T12:00:00Z',
			}),
		);
		await expect(
			AccountsEndpoints.get(context, {
				realmId: '12345678',
				accountId: '35',
			}),
		).rejects.toThrow();
	});
});

describe('QuickBooks first-party catalog operation requests', () => {
	let fetchMock: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		fetchMock.mockReset();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	it('keeps catalog endpoint schemas and transport tests in sync', () => {
		expect(Object.keys(QuickBooksCatalogEndpointSchemas)).toHaveLength(229);
		expect(Object.keys(QuickBooksSpecialEndpointSchemas)).toHaveLength(2);
		expect(quickBooksCatalogTestCases).toHaveLength(231);
		expect([
			...Object.keys(QuickBooksCatalogEndpointSchemas),
			...Object.keys(QuickBooksSpecialEndpointSchemas),
		]).toEqual(quickBooksCatalogTestCases.map((testCase) => testCase.id));
		expect(AccountsEndpoints.update).toBeDefined();
		expect(CompanyEndpoints.sparseUpdate).toBeDefined();
	});

	it.each(quickBooksCatalogTestCases)(
		'$id sends its documented route and validates the response',
		async (testCase) => {
			expect(testCase.inputSchema.safeParse(testCase.input).success).toBe(true);
			expect(
				testCase.inputSchema.safeParse({
					...testCase.input,
					undocumented: true,
				}).success,
			).toBe(false);
			expect(fetchMock).not.toHaveBeenCalled();

			if (testCase.response.kind === 'json') {
				fetchMock.mockResolvedValue(mockJsonResponse(testCase.response.body));
			} else if (testCase.response.kind === 'text') {
				fetchMock.mockResolvedValue(
					new Response(testCase.response.body, {
						status: 200,
						headers: { 'Content-Type': 'text/plain' },
					}),
				);
			} else {
				fetchMock.mockResolvedValue(
					new Response(Uint8Array.from(testCase.response.bytes), {
						status: 200,
						headers: { 'Content-Type': 'application/pdf' },
					}),
				);
			}

			const result = await testCase.invoke(context);
			expect(result).toEqual(testCase.expectedResult);
			const invalidOutput =
				testCase.response.kind === 'json'
					? { ...testCase.response.body, undocumented: true }
					: testCase.response.kind === 'text'
						? 'not an absolute URL'
						: {
								kind: 'binary',
								contentType: 'application/pdf',
								base64: 'JVBERg==',
								sizeBytes: 4,
								undocumented: true,
							};
			expect(testCase.outputSchema.safeParse(invalidOutput).success).toBe(
				false,
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const call = fetchMock.mock.calls.at(0);
			expect(call).toBeDefined();
			if (!call) throw new Error('Expected the catalog provider request');
			const [requestUrl, requestInit] = call;
			const url = new URL(String(requestUrl));
			expect(url.pathname).toBe(testCase.expectedPath);
			expect(Object.fromEntries(url.searchParams.entries())).toEqual(
				testCase.expectedQuery,
			);
			expect(requestInit?.method).toBe(testCase.method);

			if (testCase.requestKind === 'json') {
				expect(JSON.parse(String(requestInit?.body))).toEqual(
					testCase.expectedBody,
				);
				expect(new Headers(requestInit?.headers).get('content-type')).toBe(
					'application/json',
				);
			} else if (testCase.requestKind === 'form-data') {
				expect(requestInit?.body).toBeInstanceOf(FormData);
				if (requestInit?.body instanceof FormData) {
					expect(requestInit.body.has('file_metadata_01')).toBe(true);
					expect(requestInit.body.has('file_content_01')).toBe(true);
				}
			} else {
				expect(requestInit?.body).toBeUndefined();
			}
		},
	);

	it('accepts account- and item-based Bill and Purchase lines on create, read, and update', async () => {
		const accountBasedLine = {
			Id: '1',
			Amount: 125,
			DetailType: 'AccountBasedExpenseLineDetail' as const,
			AccountBasedExpenseLineDetail: {
				AccountRef: { value: 'expense-account' },
			},
		};
		const itemBasedLine = {
			Id: '2',
			Amount: 50,
			DetailType: 'ItemBasedExpenseLineDetail' as const,
			ItemBasedExpenseLineDetail: { ItemRef: { value: 'item' } },
		};
		const bill = {
			VendorRef: { value: 'vendor-1' },
			Line: [accountBasedLine, itemBasedLine],
			Id: 'bill-1',
			SyncToken: '0',
		};
		const billCreateBody = {
			VendorRef: { value: 'vendor-1' },
			Line: [accountBasedLine],
		};
		const purchase = {
			PaymentType: 'Check',
			AccountRef: { value: 'bank' },
			Line: [accountBasedLine, itemBasedLine],
			Id: 'purchase-1',
			SyncToken: '0',
		};
		const purchaseCreateBody = {
			PaymentType: 'Check',
			AccountRef: { value: 'bank' },
			Line: [accountBasedLine],
		};
		const time = '2026-11-18T12:00:00Z';

		fetchMock
			.mockResolvedValueOnce(mockJsonResponse({ Bill: bill, time }))
			.mockResolvedValueOnce(mockJsonResponse({ Bill: bill, time }))
			.mockResolvedValueOnce(mockJsonResponse({ Bill: bill, time }))
			.mockResolvedValueOnce(mockJsonResponse({ Purchase: purchase, time }))
			.mockResolvedValueOnce(mockJsonResponse({ Purchase: purchase, time }))
			.mockResolvedValueOnce(mockJsonResponse({ Purchase: purchase, time }));

		const createdBill = await CatalogEndpoints.bill.create(context, {
			realmId: '12345678',
			body: billCreateBody,
		});
		const readBill = await CatalogEndpoints.bill.get(context, {
			realmId: '12345678',
			billId: 'bill-1',
		});
		const updatedBill = await CatalogEndpoints.bill.update(context, {
			realmId: '12345678',
			body: bill,
		});
		const createdPurchase = await CatalogEndpoints.purchase.create(context, {
			realmId: '12345678',
			body: purchaseCreateBody,
		});
		const readPurchase = await CatalogEndpoints.purchase.get(context, {
			realmId: '12345678',
			purchaseId: 'purchase-1',
		});
		const updatedPurchase = await CatalogEndpoints.purchase.update(context, {
			realmId: '12345678',
			body: purchase,
		});

		expect(createdBill.Bill.Line).toEqual([accountBasedLine, itemBasedLine]);
		expect(readBill.Bill.Line).toEqual([accountBasedLine, itemBasedLine]);
		expect(updatedBill.Bill.Line).toEqual([accountBasedLine, itemBasedLine]);
		expect(createdPurchase.Purchase.Line).toEqual([
			accountBasedLine,
			itemBasedLine,
		]);
		expect(readPurchase.Purchase.Line).toEqual([
			accountBasedLine,
			itemBasedLine,
		]);
		expect(updatedPurchase.Purchase.Line).toEqual([
			accountBasedLine,
			itemBasedLine,
		]);

		const calls = fetchMock.mock.calls;
		expect(calls).toHaveLength(6);
		expect(new URL(String(calls[0]?.[0])).pathname).toBe(
			'/v3/company/12345678/bill',
		);
		expect(calls[0]?.[1]?.method).toBe('POST');
		expect(JSON.parse(String(calls[0]?.[1]?.body))).toEqual(billCreateBody);
		expect(new URL(String(calls[1]?.[0])).pathname).toBe(
			'/v3/company/12345678/bill/bill-1',
		);
		expect(calls[1]?.[1]?.method).toBe('GET');
		expect(JSON.parse(String(calls[2]?.[1]?.body))).toEqual(bill);
		expect(JSON.parse(String(calls[3]?.[1]?.body))).toEqual(purchaseCreateBody);
		expect(new URL(String(calls[4]?.[0])).pathname).toBe(
			'/v3/company/12345678/purchase/purchase-1',
		);
		expect(calls[4]?.[1]?.method).toBe('GET');
		expect(JSON.parse(String(calls[5]?.[1]?.body))).toEqual(purchase);
	});

	it('roundtrips linked-payment and DepositLineDetail lines on create, read, and update', async () => {
		const linkedPaymentLine = {
			Amount: 50,
			LinkedTxn: [{ TxnId: 'payment-1', TxnType: 'Payment' }],
		};
		const depositDetailLine = {
			Id: 'deposit-line-1',
			Amount: 75,
			DetailType: 'DepositLineDetail' as const,
			Description: 'Other deposit income',
			CustomField: {
				DefinitionId: '1',
				Name: 'Reference',
				Type: 'StringType' as const,
				StringValue: 'A-7',
			},
			DepositLineDetail: {
				AccountRef: { value: 'income-account' },
				CheckNum: 'A-7',
				Entity: { value: 'customer-1' },
			},
		};
		const deposit = {
			DepositToAccountRef: { value: 'bank' },
			Line: [linkedPaymentLine, depositDetailLine],
			Id: 'deposit-1',
			SyncToken: '0',
		};
		const createBody = {
			DepositToAccountRef: { value: 'bank' },
			Line: [depositDetailLine],
		};
		const time = '2026-11-18T12:00:00Z';
		fetchMock
			.mockResolvedValueOnce(mockJsonResponse({ Deposit: deposit, time }))
			.mockResolvedValueOnce(mockJsonResponse({ Deposit: deposit, time }))
			.mockResolvedValueOnce(mockJsonResponse({ Deposit: deposit, time }));

		const created = await CatalogEndpoints.deposit.create(context, {
			realmId: '12345678',
			body: createBody,
		});
		const read = await CatalogEndpoints.deposit.get(context, {
			realmId: '12345678',
			depositId: 'deposit-1',
		});
		const updated = await CatalogEndpoints.deposit.update(context, {
			realmId: '12345678',
			body: deposit,
		});

		for (const result of [created, read, updated]) {
			expect(result.Deposit.Line).toEqual([
				linkedPaymentLine,
				depositDetailLine,
			]);
			expect(result.Deposit.Line[1]).toEqual(depositDetailLine);
		}
		const calls = fetchMock.mock.calls;
		expect(calls).toHaveLength(3);
		expect(new URL(String(calls[0]?.[0])).pathname).toBe(
			'/v3/company/12345678/deposit',
		);
		expect(calls[0]?.[1]?.method).toBe('POST');
		expect(JSON.parse(String(calls[0]?.[1]?.body))).toEqual(createBody);
		expect(new URL(String(calls[1]?.[0])).pathname).toBe(
			'/v3/company/12345678/deposit/deposit-1',
		);
		expect(calls[1]?.[1]?.method).toBe('GET');
		expect(JSON.parse(String(calls[2]?.[1]?.body))).toEqual(deposit);
	});

	it('creates an invoice-linked Payment with its documented line unchanged', async () => {
		const body = {
			TotalAmt: 125,
			CustomerRef: { value: 'customer-1' },
			Line: [
				{
					Amount: 125,
					LinkedTxn: [{ TxnId: 'invoice-1', TxnType: 'Invoice' }],
				},
			],
		};
		const payment = { ...body, Id: 'payment-1' };
		fetchMock.mockResolvedValue(
			mockJsonResponse({
				Payment: payment,
				time: '2026-11-18T12:00:00Z',
			}),
		);

		const result = await CatalogEndpoints.payment.create(context, {
			realmId: '12345678',
			body,
		});

		expect(result.Payment).toEqual(payment);
		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the payment provider request');
		expect(new URL(String(call[0])).pathname).toBe(
			'/v3/company/12345678/payment',
		);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(String(call[1]?.body))).toEqual(body);
	});
});
