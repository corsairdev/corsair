import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SIMPLERO_USER_AGENT, segment } from './client';
import {
	Customers,
	Lists,
	Products,
	Purchases,
	Subscriptions,
	Tags,
} from './endpoints';
import type { UnknownJson } from './json';
import {
	actionOk,
	authProblem,
	cursorPagination,
	customer,
	list,
	pagination,
	product,
	purchase,
	subscription,
	tag,
	validationProblem,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'simplero-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: UnknownJson, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body
			? (JSON.parse(String(init.body)) as UnknownJson)
			: undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://simplero.com');
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
	// The spec asks for an identifying User-Agent.
	// The spec's form is `App (contact email)`; Simplero refuses one without
	// an email with 400 "Incorrect User-Agent".
	expect(sent.headers.get('user-agent')).toBe(SIMPLERO_USER_AGENT);
	expect(SIMPLERO_USER_AGENT).toMatch(/^Corsair \([^@\s]+@[^)\s]+\)$/);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('customers', () => {
	it('lists with paging and filters', async () => {
		respond({ data: [customer], pagination });

		const result = await invoke(Customers.list, {
			page: 1,
			per_page: 20,
			status: 'customers',
			email: 'alex@example.com',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v2/customers');
		expect(lastRequest().query).toEqual({
			page: '1',
			per_page: '20',
			status: 'customers',
			email: 'alex@example.com',
		});
		expect(result).toMatchObject({ data: [customer], pagination });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simplero.customers.list',
			{ count: 1 },
			'completed',
		);
	});

	it('accepts the cursor form where total is null', async () => {
		respond({ data: [customer], pagination: cursorPagination });

		const result = await invoke(Customers.list, { after: 41 });

		expect(lastRequest().query).toEqual({ after: '41' });
		expect(result).toMatchObject({
			pagination: { page: null, total: null, next_after: 77 },
		});
	});

	it('rejects a per_page above the documented maximum of 100', async () => {
		await expect(invoke(Customers.list, { per_page: 101 })).rejects.toThrow(
			/per_page/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets one customer', async () => {
		respond({ data: customer });

		const result = await invoke(Customers.get, { id: 12 });

		expect(lastRequest().path).toBe('/api/v2/customers/12');
		expect(result).toEqual({ data: customer });
	});

	it('creates a customer with the required email and lead score', async () => {
		respond({ data: customer });

		await invoke(Customers.create, {
			email: 'alex@example.com',
			lead_score: 7,
			first_names: 'Alex',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			email: 'alex@example.com',
			lead_score: 7,
			first_names: 'Alex',
		});
	});

	it('rejects a create with no lead score, which the spec requires', async () => {
		await expect(
			invoke(Customers.create, { email: 'alex@example.com' }),
		).rejects.toThrow(/lead_score/);
	});

	it('PATCHes only the fields sent, keeping the id in the path', async () => {
		respond({ data: customer });

		await invoke(Customers.update, { id: 12, first_names: 'Alexandra' });

		const sent = lastRequest();
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe('/api/v2/customers/12');
		expect(sent.body).toEqual({ first_names: 'Alexandra' });
	});

	it('adds one tag by tag_id', async () => {
		respond({ data: actionOk });

		const result = await invoke(Customers.addTag, { id: 12, tag_id: 5 });

		const sent = lastRequest();
		expect(sent.path).toBe('/api/v2/customers/12/actions/add_tag');
		expect(sent.body).toEqual({ tag_id: 5 });
		expect(result).toEqual({ data: actionOk });
	});

	it('adds several tags by tag_ids', async () => {
		respond({ data: actionOk });

		await invoke(Customers.addTag, { id: 12, tag_ids: [5, 6] });

		expect(lastRequest().body).toEqual({ tag_ids: [5, 6] });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simplero.customers.addTag',
			{ customerId: 12, tags: 2 },
			'completed',
		);
	});

	it('rejects sending both tag_id and tag_ids', async () => {
		await expect(
			invoke(Customers.addTag, { id: 12, tag_id: 5, tag_ids: [6] }),
		).rejects.toThrow(/exactly one of tag_id or tag_ids/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects sending neither tag_id nor tag_ids', async () => {
		await expect(invoke(Customers.addTag, { id: 12 })).rejects.toThrow(
			/exactly one of tag_id or tag_ids/,
		);
	});

	it('removes a tag', async () => {
		respond({ data: actionOk });

		await invoke(Customers.removeTag, { id: 12, tag_id: 5 });

		expect(lastRequest().path).toBe('/api/v2/customers/12/actions/remove_tag');
	});

	it('adjusts the lead score with the spec body { amount, explanation }', async () => {
		respond({ data: actionOk });

		await invoke(Customers.adjustLeadScore, {
			id: 12,
			amount: -2,
			explanation: 'bounced',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/api/v2/customers/12/actions/adjust_lead_score');
		expect(sent.body).toEqual({ amount: -2, explanation: 'bounced' });
	});
});

describe('lists', () => {
	it('lists, gets, creates and updates', async () => {
		respond({ data: [list], pagination });
		const listed = (await invoke(Lists.list, {})) as { data: { id: number }[] };
		expect(listed).toMatchObject({ data: [list] });
		expect(lastRequest().path).toBe('/api/v2/lists');
		// The typed id is what lists.get takes in its path.
		respond({ data: list });
		await invoke(Lists.get, { id: listed.data[0]?.id });
		expect(lastRequest().path).toBe('/api/v2/lists/31');

		respond({ data: list });
		await invoke(Lists.get, { id: 7 });
		expect(lastRequest().path).toBe('/api/v2/lists/7');

		respond({ data: list });
		await invoke(Lists.create, {
			name: 'Newsletter',
			internal_name: 'newsletter',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/lists',
		});

		respond({ data: list });
		await invoke(Lists.update, { id: 7, name: 'Weekly newsletter' });
		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/lists/7',
			body: { name: 'Weekly newsletter' },
		});
	});

	it('rejects a list with no internal name, which the spec requires', async () => {
		await expect(invoke(Lists.create, { name: 'Newsletter' })).rejects.toThrow(
			/internal_name/,
		);
	});
});

describe('tags', () => {
	it('lists, gets, creates and updates', async () => {
		respond({ data: [tag], pagination });
		await invoke(Tags.list, { owner_id: 3 });
		expect(lastRequest().query).toEqual({ owner_id: '3' });

		respond({ data: tag });
		await invoke(Tags.get, { id: 5 });
		expect(lastRequest().path).toBe('/api/v2/tags/5');

		respond({ data: tag });
		await invoke(Tags.create, { name: 'VIP', color: '#ff0000' });
		expect(lastRequest().body).toEqual({ name: 'VIP', color: '#ff0000' });

		respond({ data: tag });
		await invoke(Tags.update, { id: 5, name: 'Very VIP' });
		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/tags/5',
			body: { name: 'Very VIP' },
		});
	});

	it('rejects a tag with no name', async () => {
		await expect(invoke(Tags.create, {})).rejects.toThrow(/name/);
	});
});

describe('products', () => {
	it('lists with the filters, gets, creates and updates', async () => {
		respond({ data: [product], pagination });
		await invoke(Products.list, { recurring: false, listing_type: 'public' });
		expect(lastRequest().query).toEqual({
			recurring: 'false',
			listing_type: 'public',
		});

		respond({ data: product });
		await invoke(Products.get, { id: 34 });
		expect(lastRequest().path).toBe('/api/v2/products/34');

		respond({ data: product });
		await invoke(Products.create, { name: 'Course', internal_name: 'course' });
		expect(lastRequest()).toMatchObject({ method: 'POST' });

		respond({ data: product });
		await invoke(Products.update, { id: 34, summary: 'Updated' });
		expect(lastRequest().body).toEqual({ summary: 'Updated' });
	});
});

describe('purchases', () => {
	it('lists with the documented filters', async () => {
		respond({ data: [purchase], pagination });

		await invoke(Purchases.list, {
			state: 'complete',
			customer_id: 12,
			subscription: false,
		});

		expect(lastRequest().path).toBe('/api/v2/purchases');
		expect(lastRequest().query).toEqual({
			state: 'complete',
			customer_id: '12',
			subscription: 'false',
		});
	});

	it('gets one purchase', async () => {
		respond({ data: purchase });

		expect(await invoke(Purchases.get, { id: 99 })).toEqual({ data: purchase });
		expect(lastRequest().path).toBe('/api/v2/purchases/99');
	});

	it('PATCHes buyer details only', async () => {
		respond({ data: purchase });

		await invoke(Purchases.update, {
			id: 99,
			first_names: 'Alexandra',
			city: 'Berlin',
		});

		expect(lastRequest().body).toEqual({
			first_names: 'Alexandra',
			city: 'Berlin',
		});
	});
});

describe('subscriptions', () => {
	it('lists and gets', async () => {
		respond({ data: [subscription], pagination });
		await invoke(Subscriptions.list, { list_id: 7, state: 'active' });
		expect(lastRequest().query).toEqual({ list_id: '7', state: 'active' });

		respond({ data: subscription });
		await invoke(Subscriptions.get, { id: 55 });
		expect(lastRequest().path).toBe('/api/v2/subscriptions/55');
	});

	it('PATCHes tracking data', async () => {
		respond({ data: subscription });

		await invoke(Subscriptions.update, { id: 55, utm_source: 'newsletter' });

		expect(lastRequest().body).toEqual({ utm_source: 'newsletter' });
	});

	it('unsubscribes and resubscribes through the action routes', async () => {
		respond({ data: actionOk });
		await invoke(Subscriptions.unsubscribe, { id: 55 });
		expect(lastRequest().path).toBe(
			'/api/v2/subscriptions/55/actions/unsubscribe',
		);

		respond({ data: actionOk });
		await invoke(Subscriptions.resubscribe, { id: 55 });
		expect(lastRequest().path).toBe(
			'/api/v2/subscriptions/55/actions/resubscribe',
		);
	});
});

describe('client error handling', () => {
	it('reads a 401 body and keeps the key out of util.inspect', async () => {
		respond(authProblem, 401);
		const util = await import('node:util');

		const error = await invoke(Lists.list, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		const failure = error as ApiError;
		expect(failure.status).toBe(401);
		expect(failure.body).toEqual(authProblem);
		// No personal data was sent, so this is core's error unchanged.
		expect(failure.message).toBe('Unauthorized');
		expect(util.inspect(error)).not.toContain(API_KEY);
		expect(failure.message).not.toContain(API_KEY);
	});

	it('joins the 422 error list into one message', async () => {
		respond(validationProblem, 422);

		const error = await invoke(Customers.create, {
			email: 'not-an-email',
			lead_score: 1,
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		const failure = error as ApiError;
		expect(failure).toBeInstanceOf(ApiError);
		expect(failure.body).toEqual(validationProblem);
		expect(failure.status).toBe(422);
		// The sent contact (email, names) stays off the error.
		expect(failure.request.body).toBeUndefined();
		expect(JSON.stringify(failure)).not.toContain('not-an-email');
	});

	it('masks personal list filters on a failed read', async () => {
		respond(authProblem, 500);
		respond(authProblem, 500);
		respond(authProblem, 500);

		const error = (await invoke(Customers.list, {
			email: 'alex@example.com',
			q: 'Alex Doe',
			tag_id: 5,
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		const text = `${JSON.stringify(error)} ${error.url} ${error.request.url}`;
		expect(text).not.toContain('alex');
		expect(text).not.toContain('Alex');
		expect(error.request.query).toMatchObject({ tag_id: 5 });
	});

	it('encodes a path segment', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});
});
