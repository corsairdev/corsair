import { logEventFromContext } from 'corsair/core';
import {
	Company,
	Customers,
	Payments,
	Plans,
	Refunds,
	Subscriptions,
	User,
} from './endpoints';
import {
	company,
	companyStats,
	customer,
	customerDetail,
	payment,
	plan,
	subscription,
	user,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'ph-test-key';

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
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated(path: string, method = 'GET') {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.payhere.co');
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

describe('user and company', () => {
	it('get reads the authenticated user', async () => {
		respond({ data: user });
		const result = (await invoke(User.get, {})) as { data: { id: number } };
		expect(result.data.id).toBe(2);
		expectAuthenticated('/api/v1/user');
	});

	it('company.get reads the company', async () => {
		respond({ data: company });
		const result = (await invoke(Company.get, {})) as {
			data: { slug?: string };
		};
		expect(result.data.slug).toBe('altlabs');
		expectAuthenticated('/api/v1/current_company');
	});

	it('company.stats reads the 30-day stats', async () => {
		respond(companyStats);
		const result = (await invoke(Company.stats, {})) as {
			payments_last_30: number;
		};
		expect(result.payments_last_30).toBe(329.4);
		expectAuthenticated('/api/v1/current_company/stats');
	});
});

describe('customers', () => {
	it('list GETs customers with paging', async () => {
		respond({ data: [customer], meta: { current_page: 1, next_page: null } });
		await invoke(Customers.list, { page: 1, per_page: 50 });
		const sent = lastRequest();
		expectAuthenticated('/api/v1/customers');
		expect(sent.query['page']).toBe('1');
		expect(sent.query['per_page']).toBe('50');
	});

	it('get reads one customer with history', async () => {
		respond({ data: customerDetail });
		const result = (await invoke(Customers.get, { customerId: 989899294 })) as {
			data: { id: number };
		};
		expect(result.data.id).toBe(989899294);
		expectAuthenticated('/api/v1/customers/989899294');
	});
});

describe('payments, plans and subscriptions', () => {
	it('payments.list GETs payments', async () => {
		respond({ data: [payment], meta: { current_page: 1, next_page: 2 } });
		const page = (await invoke(Payments.list, {})) as {
			data: Array<{ id: number }>;
			meta: { next_page?: number | null };
		};
		expect(page.data[0]?.id).toBe(845088515);
		expect(page.meta.next_page).toBe(2);
		expectAuthenticated('/api/v1/payments');
	});

	it('plans.list GETs plans', async () => {
		respond({ data: [plan], meta: { current_page: 1 } });
		await invoke(Plans.list, {});
		expectAuthenticated('/api/v1/plans');
	});

	it('subscriptions.list GETs subscriptions', async () => {
		respond({ data: [subscription], meta: { current_page: 1 } });
		await invoke(Subscriptions.list, {});
		expectAuthenticated('/api/v1/subscriptions');
	});
});

describe('refunds', () => {
	it('create POSTs the refund body', async () => {
		respond(undefined, 204);
		const result = (await invoke(Refunds.create, {
			payment_id: 373,
			amount: 0.5,
			reason: 'requested_by_customer',
		})) as { paymentId: number; amount: number; success: boolean };
		expect(result).toEqual({
			paymentId: 373,
			amount: 0.5,
			success: true,
		});
		const sent = lastRequest();
		expectAuthenticated('/api/v1/refunds', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			payment_id: 373,
			amount: 0.5,
			reason: 'requested_by_customer',
		});
	});
});
