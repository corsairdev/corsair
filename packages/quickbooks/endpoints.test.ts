import { AccountsEndpoints, CompanyEndpoints } from './endpoints';

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

	it('rejects an invalid provider response instead of returning it', async () => {
		fetchMock.mockResolvedValue(
			mockJsonResponse({
				Account: { ...account, undocumented: 'unvalidated' },
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
