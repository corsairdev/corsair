import { logEventFromContext } from 'corsair/core';
import {
	Customers,
	Plans,
	Refunds,
	Subscriptions,
	Transactions,
} from './endpoints';
import {
	customer,
	initializedTransaction,
	plan,
	refund,
	subscription,
	successEnvelope,
	transaction,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'sk_test_paystack';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: decodeURIComponent(parsed.pathname),
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated(path: string, method = 'GET') {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.paystack.co');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('transactions', () => {
	it('initialize POSTs the checkout body', async () => {
		respond(initializedTransaction);
		await invoke(Transactions.initialize, {
			amount: '10000',
			email: 'john.doe@example.com',
			callback_url: 'https://example.com/callback',
		});
		const sent = lastRequest();
		expectAuthenticated('/transaction/initialize', 'POST');
		// unknown: the request body is parsed JSON whose keys are
		// provider-defined, so the test narrows per assertion.
		const body = JSON.parse(sent.body as string) as Record<string, unknown>;
		expect(body['amount']).toBe('10000');
		expect(body['email']).toBe('john.doe@example.com');
		expect(body['callback_url']).toBe('https://example.com/callback');
	});

	it('verify GETs the transaction by reference', async () => {
		respond({
			status: true,
			message: 'Verification successful',
			data: transaction,
		});
		await invoke(Transactions.verify, { reference: '7PVGX8MEk85tgeEpVDtD' });
		expectAuthenticated('/transaction/verify/7PVGX8MEk85tgeEpVDtD');
	});

	it('list GETs transactions with its filters', async () => {
		respond({
			status: true,
			message: 'Transactions retrieved',
			data: [transaction],
			meta: LIST_META_ANY,
		});
		await invoke(Transactions.list, {
			perPage: 25,
			page: 2,
			status: 'success',
			customer: 8456302,
		});
		const sent = lastRequest();
		expectAuthenticated('/transaction');
		expect(sent.query['perPage']).toBe('25');
		expect(sent.query['page']).toBe('2');
		expect(sent.query['status']).toBe('success');
		expect(sent.query['customer']).toBe('8456302');
	});

	it('get reads one transaction by id', async () => {
		respond({
			status: true,
			message: 'Transaction retrieved',
			data: transaction,
		});
		await invoke(Transactions.get, { transactionId: 30920911 });
		expectAuthenticated('/transaction/30920911');
	});
});

// The meta block differs per list fixture; any object passes the schema.
const LIST_META_ANY = { total: 1, page: 1, perPage: 50, pageCount: 1 };

describe('customers', () => {
	it('create POSTs the customer body', async () => {
		respond({ status: true, message: 'Customer created', data: customer });
		await invoke(Customers.create, {
			email: 'john.doe@example.com',
			first_name: 'John',
			last_name: 'Doe',
		});
		const sent = lastRequest();
		expectAuthenticated('/customer', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			email: 'john.doe@example.com',
			first_name: 'John',
			last_name: 'Doe',
		});
	});

	it('list GETs customers', async () => {
		respond({
			status: true,
			message: 'Customers retrieved',
			data: [customer],
			meta: LIST_META_ANY,
		});
		await invoke(Customers.list, { page: 1 });
		expectAuthenticated('/customer');
	});

	it('get reads one customer by email', async () => {
		respond({ status: true, message: 'Customer retrieved', data: customer });
		await invoke(Customers.get, { emailOrCode: 'john.doe@example.com' });
		expectAuthenticated('/customer/john.doe@example.com');
	});

	it('update PUTs the customer body', async () => {
		respond({ status: true, message: 'Customer updated', data: customer });
		await invoke(Customers.update, {
			code: 'CUS_1idh4psjybv',
			first_name: 'Jane',
			last_name: 'Doe',
		});
		const sent = lastRequest();
		expectAuthenticated('/customer/CUS_1idh4psjybv', 'PUT');
		expect(JSON.parse(sent.body as string)).toEqual({
			first_name: 'Jane',
			last_name: 'Doe',
		});
	});

	it('setRiskAction POSTs the risk action', async () => {
		respond({ status: true, message: 'Customer updated', data: customer });
		await invoke(Customers.setRiskAction, {
			customer: 'CUS_1idh4psjybv',
			risk_action: 'allow',
		});
		const sent = lastRequest();
		expectAuthenticated('/customer/set_risk_action', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			customer: 'CUS_1idh4psjybv',
			risk_action: 'allow',
		});
	});
});

describe('plans', () => {
	it('create POSTs the plan body', async () => {
		respond({ status: true, message: 'Plan created', data: plan });
		await invoke(Plans.create, {
			name: 'Monthly Retainer',
			amount: 50000,
			interval: 'monthly',
		});
		const sent = lastRequest();
		expectAuthenticated('/plan', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'Monthly Retainer',
			amount: 50000,
			interval: 'monthly',
		});
	});

	it('list GETs plans', async () => {
		respond({
			status: true,
			message: 'Plans retrieved',
			data: [plan],
			meta: LIST_META_ANY,
		});
		await invoke(Plans.list, { interval: 'monthly' });
		const sent = lastRequest();
		expectAuthenticated('/plan');
		expect(sent.query['interval']).toBe('monthly');
	});

	it('get reads one plan', async () => {
		respond({ status: true, message: 'Plan retrieved', data: plan });
		await invoke(Plans.get, { idOrCode: 'PLN_0peioxfhpn' });
		expectAuthenticated('/plan/PLN_0peioxfhpn');
	});

	it('update PUTs the plan body', async () => {
		respond({ status: true, message: 'Plan updated', data: plan });
		await invoke(Plans.update, {
			idOrCode: 'PLN_0peioxfhpn',
			name: 'Monthly Retainer',
			amount: 60000,
			interval: 'monthly',
		});
		const sent = lastRequest();
		expectAuthenticated('/plan/PLN_0peioxfhpn', 'PUT');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'Monthly Retainer',
			amount: 60000,
			interval: 'monthly',
		});
	});
});

describe('subscriptions', () => {
	it('create POSTs the subscription body', async () => {
		respond({
			status: true,
			message: 'Subscription successful',
			data: {
				email_token: 'uhslf0re31yqu1w2x21d',
				subscription_code: 'SUB_vsy260vl9vvrcv9',
			},
		});
		await invoke(Subscriptions.create, {
			customer: 'john.doe@example.com',
			plan: 'PLN_0peioxfhpn',
		});
		const sent = lastRequest();
		expectAuthenticated('/subscription', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			customer: 'john.doe@example.com',
			plan: 'PLN_0peioxfhpn',
		});
	});

	it('list GETs subscriptions', async () => {
		respond({
			status: true,
			message: 'Subscriptions retrieved',
			data: [subscription],
			meta: LIST_META_ANY,
		});
		await invoke(Subscriptions.list, {});
		expectAuthenticated('/subscription');
	});

	it('get reads one subscription', async () => {
		respond({
			status: true,
			message: 'Subscription retrieved',
			data: subscription,
		});
		await invoke(Subscriptions.get, { idOrCode: 'SUB_vsy260vl9vvrcv9' });
		expectAuthenticated('/subscription/SUB_vsy260vl9vvrcv9');
	});

	it('enable and disable POST the code and token', async () => {
		respond(successEnvelope);
		await invoke(Subscriptions.enable, {
			code: 'SUB_vsy260vl9vvrcv9',
			token: 'uhslf0re31yqu1w2x21d',
		});
		let sent = lastRequest();
		expectAuthenticated('/subscription/enable', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			code: 'SUB_vsy260vl9vvrcv9',
			token: 'uhslf0re31yqu1w2x21d',
		});

		respond(successEnvelope);
		await invoke(Subscriptions.disable, {
			code: 'SUB_vsy260vl9vvrcv9',
			token: 'uhslf0re31yqu1w2x21d',
		});
		sent = lastRequest();
		expectAuthenticated('/subscription/disable', 'POST');
	});
});

describe('refunds', () => {
	it('create POSTs the refund body', async () => {
		respond({ status: true, message: 'Refund initiated', data: refund });
		await invoke(Refunds.create, {
			transaction: '7PVGX8MEk85tgeEpVDtD',
			amount: 5000,
			merchant_note: 'damaged goods',
		});
		const sent = lastRequest();
		expectAuthenticated('/refund', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			transaction: '7PVGX8MEk85tgeEpVDtD',
			amount: 5000,
			merchant_note: 'damaged goods',
		});
	});

	it('list GETs refunds', async () => {
		respond({
			status: true,
			message: 'Refunds retrieved',
			data: [refund],
			meta: LIST_META_ANY,
		});
		await invoke(Refunds.list, {});
		expectAuthenticated('/refund');
	});

	it('get reads one refund', async () => {
		respond({ status: true, message: 'Refund retrieved', data: refund });
		await invoke(Refunds.get, { refundId: 1088 });
		expectAuthenticated('/refund/1088');
	});
});
