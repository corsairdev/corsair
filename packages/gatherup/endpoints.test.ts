import { logEventFromContext } from 'corsair/core';
import { GatherupAPIError } from './client';
import { Businesses, Customers } from './endpoints';
import {
	business,
	businessCreated,
	businesses,
	businessSearch,
	businessTypes,
	customer,
	customers,
	feedbacks,
	invalidClientOn200,
	invalidField,
	lastBusinessPage,
	notFound,
	success,
	unauthorized,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const CLIENT_ID = 'gatherup-client-id';
const API_KEY = 'gatherup-bearer-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context carries what the endpoints read: the option pair, and the
	// stored pair behind it.
	const ctx = {
		key: CLIENT_ID,
		options: { clientId: CLIENT_ID, apiKey: API_KEY },
		keys: {
			get_api_key: jest.fn().mockResolvedValue(CLIENT_ID),
			get_api_secret: jest.fn().mockResolvedValue(API_KEY),
		},
	};
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
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
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://app.gatherup.com');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	// `clientId` is required on every call.
	expect(sent.query.clientId).toBe(CLIENT_ID);
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('businesses.list', () => {
	it('GETs the businesses with the client ID on the query', async () => {
		respond(businesses);

		const result = (await invoke(Businesses.list, {
			page: 1,
			perPage: 2,
		})) as typeof businesses & { next_page: number | null };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/businesses/get',
		});
		expect(lastRequest().query).toEqual({
			clientId: CLIENT_ID,
			page: '1',
			perPage: '2',
		});
		expect(result.data).toHaveLength(2);
		// 2 pages, so another exists.
		expect(result.next_page).toBe(2);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'gatherup.businesses.list',
			{ count: 2, total: 2 },
			'completed',
		);
	});

	it('reports no next page on a single-page answer', async () => {
		respond(lastBusinessPage);

		await expect(invoke(Businesses.list, {})).resolves.toMatchObject({
			next_page: null,
		});
	});
});

describe('businesses.get', () => {
	it('GETs one business by ID', async () => {
		respond(business);

		await expect(
			invoke(Businesses.get, { businessId: 34291 }),
		).resolves.toMatchObject({
			id: 34291,
			name: 'Peach Trees Intl.',
			package: 'pro',
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/business/get',
		});
		expect(lastRequest().query.businessId).toBe('34291');
	});

	it('surfaces a business that is not there', async () => {
		respond(notFound, 404);

		await expect(
			invoke(Businesses.get, { businessId: 9 }),
		).rejects.toMatchObject({
			status: 404,
			errorCode: 7,
			isNotFound: true,
		});
	});
});

describe('businesses.search and types', () => {
	it('searches by name', async () => {
		respond(businessSearch);

		await expect(
			invoke(Businesses.search, { search: 'peach' }),
		).resolves.toMatchObject({ data: [{ id: 34291 }] });
		expect(lastRequest()).toMatchObject({ path: '/api/v2/business/search' });
		expect(lastRequest().query.search).toBe('peach');
	});

	it('lists the business types', async () => {
		respond(businessTypes);

		const result = (await invoke(Businesses.types, {})) as typeof businessTypes;

		expect(result.data).toHaveLength(2);
		expect(result.data[0]?.name).toBe('Insurance Agency');
		expect(lastRequest()).toMatchObject({ path: '/api/v2/business/types' });
	});
});

describe('businesses.create', () => {
	it('POSTs the prefixed body names the route binds', async () => {
		respond(businessCreated);

		await expect(
			invoke(Businesses.create, {
				businessName: 'Peach Trees Intl.',
				businessType: 'Insurance Agency',
				city: 'Haiku',
				country: 'US',
			}),
		).resolves.toMatchObject({ data: { id: 34300 } });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/business/create',
			body: {
				businessName: 'Peach Trees Intl.',
				businessType: 'Insurance Agency',
				city: 'Haiku',
				country: 'US',
			},
		});
	});

	it('spells the website with a lower-case rl, as the write route does', async () => {
		respond(businessCreated);

		await invoke(Businesses.create, {
			businessName: 'Peach Trees',
			businessType: 'Restaurant',
			city: 'Haiku',
			country: 'US',
			websiteUrl: 'https://peachtree.example',
		});

		expect(lastRequest().body).toMatchObject({
			websiteUrl: 'https://peachtree.example',
		});
	});

	it.each([
		[{}],
		[{ businessName: 'x' }],
		[{ businessName: 'x', businessType: 'Restaurant' }],
		[{ businessName: 'x', businessType: 'Restaurant', city: 'Haiku' }],
		[
			{
				businessName: '',
				businessType: 'Restaurant',
				city: 'Haiku',
				country: 'US',
			},
		],
		[
			{
				businessName: 'x',
				businessType: 'Restaurant',
				city: 'Haiku',
				country: 'US',
				websiteUrl: 'not-a-url',
			},
		],
	])('rejects %j before calling GatherUp', async (input) => {
		await expect(invoke(Businesses.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('businesses.update and the active switch', () => {
	it('PUTs the ID beside the changes', async () => {
		respond(success);

		await invoke(Businesses.update, {
			businessId: 34291,
			businessName: 'Peach Trees II',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/api/v2/business/update',
			body: { businessId: 34291, businessName: 'Peach Trees II' },
		});
	});

	it('deactivates and reactivates with the ID in the body', async () => {
		respond(success);
		await invoke(Businesses.deactivate, { businessId: 34291 });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/api/v2/business/deactivate',
			body: { businessId: 34291 },
		});

		respond(success);
		await invoke(Businesses.reactivate, { businessId: 34291 });
		expect(lastRequest()).toMatchObject({
			path: '/api/v2/business/reactivate',
		});
	});
});

describe('businesses.delete', () => {
	it('DELETEs with the ID still in the body', async () => {
		respond(success);

		await invoke(Businesses.remove, { businessId: 34291 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v2/business/delete',
			body: { businessId: 34291 },
		});
	});
});

describe('customers', () => {
	it('GETs the customers of a business', async () => {
		respond(customers);

		const result = (await invoke(Customers.list, {
			businessId: 34291,
		})) as typeof customers;

		expect(result.data).toHaveLength(2);
		expect(lastRequest()).toMatchObject({ path: '/api/v2/customers/get' });
		expect(lastRequest().query.businessId).toBe('34291');
	});

	it('GETs one customer with its string rating', async () => {
		respond(customer);

		const result = (await invoke(Customers.get, {
			businessId: 34291,
			customerId: 80717046,
		})) as typeof customer;

		// A rating is a decimal string, which is what the schema says.
		expect(result.rating).toBe('5.00');
		expect(lastRequest().query.customerId).toBe('80717046');
	});

	it('POSTs a customer with the `customer…` names the route binds', async () => {
		respond(customer);

		await invoke(Customers.create, {
			businessId: 34291,
			customerFirstName: 'John',
			customerLastName: 'Smith',
			customerEmail: 'john.smith@app.gatherup.com',
			customerTags: 'brakes,tires',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/customer/create',
			body: {
				businessId: 34291,
				customerFirstName: 'John',
				customerLastName: 'Smith',
				customerEmail: 'john.smith@app.gatherup.com',
				customerTags: 'brakes,tires',
			},
		});
	});

	it('logs the customer ID and never the address', async () => {
		respond(customer);

		await invoke(Customers.create, {
			businessId: 34291,
			customerFirstName: 'John',
			customerLastName: 'Smith',
			customerEmail: 'john.smith@app.gatherup.com',
		});

		const payloads = mockLog.mock.calls.map((call) => JSON.stringify(call[2]));
		for (const payload of payloads) {
			expect(payload).not.toContain('@');
		}
	});

	it('uses customerPhoneNumber on update, where create uses customerPhone', async () => {
		respond(customer);

		await invoke(Customers.update, {
			businessId: 34291,
			customerId: 80717046,
			customerPhoneNumber: '+12025550199',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/api/v2/customer/update',
			body: {
				businessId: 34291,
				customerId: 80717046,
				customerPhoneNumber: '+12025550199',
			},
		});
	});

	it('DELETEs a customer', async () => {
		respond(success);

		await invoke(Customers.remove, {
			businessId: 34291,
			customerId: 80717046,
		});

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v2/customer/delete',
			body: { businessId: 34291, customerId: 80717046 },
		});
	});

	it.each([
		[
			{
				businessId: 34291,
				customerFirstName: 'John',
				customerLastName: 'Smith',
			},
		],
		[
			{
				businessId: 34291,
				customerLastName: 'Smith',
				customerEmail: 'a@b.example',
			},
		],
		[
			{
				businessId: 34291,
				customerFirstName: 'John',
				customerEmail: 'a@b.example',
			},
		],
	])('rejects %j before calling GatherUp', async (input) => {
		await expect(invoke(Customers.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a customer with a phone and no email, which a higher plan allows', async () => {
		respond(customer);

		await invoke(Customers.create, {
			businessId: 34291,
			customerFirstName: 'John',
			customerLastName: 'Smith',
			customerPhone: '+12025550167',
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('customers.requestFeedback', () => {
	it('POSTs the request for a customer', async () => {
		respond(success);

		await invoke(Customers.requestFeedback, {
			businessId: 34291,
			customerId: 80717046,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/customer/feedback/send',
			body: { customerId: 80717046 },
		});
	});
});

describe('feedbacks.list', () => {
	it('GETs the feedback with its comma-separated tags', async () => {
		respond(feedbacks);

		const result = (await invoke(Customers.feedbacks, {
			businessId: 34291,
		})) as typeof feedbacks;

		expect(result.data[0]?.rating).toBe(5);
		// Tags arrive as one string, which is how the schema types them.
		expect(result.data[0]?.tags).toBe('Auto,Towing,Roadside Service');
		expect(lastRequest()).toMatchObject({ path: '/api/v2/feedbacks/get' });
	});

	it('never logs a reviewer’s words', async () => {
		respond(feedbacks);

		await invoke(Customers.feedbacks, { businessId: 34291 });

		const payloads = mockLog.mock.calls.map((call) => JSON.stringify(call[2]));
		for (const payload of payloads) {
			expect(payload).not.toContain('amazing');
		}
	});
});

describe('error envelopes', () => {
	it('throws on the 200 that carries an errorCode, which a live probe returned', async () => {
		respond(invalidClientOn200);

		const error = await caught(invoke(Businesses.list, {}));

		expect(error).toBeInstanceOf(GatherupAPIError);
		expect(error).toMatchObject({
			errorCode: 2,
			bodyError: true,
			isAuthError: true,
		});
		expect((error as Error).message).toContain('Invalid clientId');
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('accepts a success body whose errorCode is 0', async () => {
		respond(businesses);

		await expect(invoke(Businesses.list, {})).resolves.toMatchObject({
			errorCode: 0,
		});
	});

	it('reads a real 401', async () => {
		respond(unauthorized, 401);

		await expect(invoke(Businesses.list, {})).rejects.toMatchObject({
			status: 401,
			errorCode: 2,
			isAuthError: true,
		});
	});

	it('reads a refused field', async () => {
		respond(invalidField, 400);

		await expect(
			invoke(Businesses.create, {
				businessName: 'x',
				businessType: 'Restaurant',
				city: 'Haiku',
				country: 'US',
			}),
		).rejects.toMatchObject({
			status: 400,
			errorCode: 11,
			isValidationError: true,
		});
	});

	it('keeps the token and client ID out of the error', async () => {
		respond(unauthorized, 401);

		const error = await caught(invoke(Businesses.list, {}));

		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(CLIENT_ID);
	});

	it('keeps no body on the error, so a customer payload cannot follow it into a log', async () => {
		respond(invalidField, 400);

		const error = await caught(invoke(Businesses.list, {}));

		expect(error).not.toHaveProperty('body');
	});

	it('marks a transport failure and keeps the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(invoke(Businesses.list, {})).rejects.toMatchObject({
			transport: true,
			method: 'GET',
			message: 'fetch failed',
		});
	});
});
