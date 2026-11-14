import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GatherupAPIError, gatherupErrorInfo } from './client';
import { Businesses, Customers } from './endpoints';
import {
	business,
	businessCreated,
	businesses,
	businessRow,
	businessSearch,
	businessTypes,
	customer,
	customerCreated,
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
		// GatherUp names the page size `limit` on this route.
		expect(lastRequest().query).toEqual({
			clientId: CLIENT_ID,
			page: '1',
			limit: '2',
		});
		expect(result.data).toHaveLength(2);
		// A list row uses `business…` names, not the single read's `id`.
		expect(result.data[0]).toMatchObject({
			businessId: 33733,
			businessName: 'ApiTest',
		});
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

	it('counts a full page of 100 as more to come when pages is missing', async () => {
		const rows = Array.from({ length: 100 }, (_, i) => ({
			...businessRow,
			businessId: i + 1,
		}));
		respond({ data: rows, errorCode: 0, errorMessage: 'Success' });

		await expect(invoke(Businesses.list, {})).resolves.toMatchObject({
			next_page: 2,
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

		const error = await caught(invoke(Businesses.get, { businessId: 9 }));

		expect(error).toBeInstanceOf(ApiError);
		expect(gatherupErrorInfo(error)).toMatchObject({
			status: 404,
			errorCode: 7,
			isNotFound: true,
		});
	});
});

describe('businesses.search and types', () => {
	it('searches by the required `by` field and reads the one ID back', async () => {
		respond(businessSearch);

		await expect(
			invoke(Businesses.search, { by: 'extraField', search: 'my-custom-123' }),
		).resolves.toMatchObject({ businessId: 34292 });
		expect(lastRequest()).toMatchObject({ path: '/api/v2/business/search' });
		expect(lastRequest().query).toMatchObject({
			by: 'extraField',
			search: 'my-custom-123',
		});
	});

	it('refuses a search without `by`, which GatherUp requires', async () => {
		await expect(
			invoke(Businesses.search, { search: 'peach' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	// R8: a malformed reply fails instead of shrinking to an empty list.
	it.each([[{ '0': 42, errorCode: 0 }], ['not an object'], [[]]])(
		'refuses a malformed types answer %j',
		async (body) => {
			respond(body);

			await expect(
				invoke(Businesses.types, { search: 'Medicine' }),
			).rejects.toThrow();
			expect(mockLog).not.toHaveBeenCalled();
		},
	);

	it('gathers the numbered keys of the types answer into data', async () => {
		respond(businessTypes);

		const result = (await invoke(Businesses.types, {
			search: 'Medicine',
		})) as { data: string[] };

		expect(result.data).toEqual([
			'Alternative Medicine Practitioner',
			'Chinese Medicine Clinic',
			'Sports Medicine Clinic',
		]);
		expect(lastRequest()).toMatchObject({ path: '/api/v2/business/types' });
		expect(lastRequest().query.search).toBe('Medicine');
	});
});

const ADDRESS = {
	businessType: 'Insurance Agency',
	city: 'Haiku',
	country: 'US',
	streetAddress: '4150 Hana Hwy',
	state: 'HI',
	zip: '96708',
	phone: '808-333-3334',
};

describe('businesses.create', () => {
	it('POSTs the prefixed body names the route binds', async () => {
		respond(businessCreated);

		await expect(
			invoke(Businesses.create, {
				...ADDRESS,
				businessName: 'Peach Trees Intl.',
			}),
		).resolves.toMatchObject({ businessId: 34298 });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/business/create',
			body: {
				businessName: 'Peach Trees Intl.',
				businessType: 'Insurance Agency',
				city: 'Haiku',
				country: 'US',
				// GatherUp reads the client ID from the body on a write.
				clientId: CLIENT_ID,
			},
		});
	});

	it('spells the website with a lower-case rl, as the write route does', async () => {
		respond(businessCreated);

		await invoke(Businesses.create, {
			...ADDRESS,
			businessName: 'Peach Trees',
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
		[{ ...ADDRESS, businessName: '' }],
		[{ ...ADDRESS, businessName: 'x', websiteUrl: 'not-a-url' }],
		// GatherUp lists the street, state, zip and phone as required.
		[
			{
				businessName: 'x',
				businessType: 'Restaurant',
				city: 'Haiku',
				country: 'US',
			},
		],
		[{ ...ADDRESS, businessName: 'x', zip: undefined }],
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
			businessType: 'Insurance Agency',
			businessName: 'Peach Trees II',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/api/v2/business/update',
			body: {
				businessId: 34291,
				businessType: 'Insurance Agency',
				businessName: 'Peach Trees II',
			},
		});
	});

	// GatherUp's reference marks businessType required on update.
	it('refuses an update without businessType before calling GatherUp', async () => {
		await expect(
			invoke(Businesses.update, {
				businessId: 34291,
				businessName: 'Peach Trees II',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
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
			body: { businessId: 34291, clientId: CLIENT_ID },
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
		respond(customerCreated);

		const result = await invoke(Customers.create, {
			businessId: 34291,
			customerFirstName: 'John',
			customerLastName: 'Smith',
			customerEmail: 'john.smith@app.gatherup.com',
			customerTags: 'brakes,tires',
		});

		// Create answers the new ID, not the record.
		expect(result).toMatchObject({ customerId: 80717046 });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'gatherup.customers.create',
			{ customerId: '80717046' },
			'completed',
		);

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/customer/create',
			body: {
				businessId: 34291,
				customerFirstName: 'John',
				customerLastName: 'Smith',
				customerEmail: 'john.smith@app.gatherup.com',
				customerTags: 'brakes,tires',
				// Sent as 0 unless asked for, so a create never messages anyone.
				sendFeedbackRequest: 0,
				clientId: CLIENT_ID,
			},
		});
	});

	it('sends sendFeedbackRequest as 1 only when asked', async () => {
		respond(customerCreated);

		await invoke(Customers.create, {
			businessId: 34291,
			customerFirstName: 'John',
			customerLastName: 'Smith',
			customerEmail: 'john.smith@app.gatherup.com',
			sendFeedbackRequest: true,
		});

		expect(lastRequest().body).toMatchObject({ sendFeedbackRequest: 1 });
	});

	it('logs the customer ID and never the address', async () => {
		respond(customerCreated);

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
		respond(customerCreated);

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

		// GatherUp's default is a rating revision, so a new request asks for 0.
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/customer/feedback/send',
			body: { customerId: 80717046, ratingRevision: 0, clientId: CLIENT_ID },
		});
	});

	it('asks for a rating revision only when told to', async () => {
		respond(success);

		await invoke(Customers.requestFeedback, {
			businessId: 34291,
			customerId: 80717046,
			ratingRevision: true,
		});

		expect(lastRequest().body).toMatchObject({ ratingRevision: 1 });
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

describe('credentials', () => {
	// unknown: each case swaps in its own context.
	function invokeWith(ctx: unknown) {
		return Businesses.get(ctx as never, { businessId: 1 } as never);
	}

	it('uses the stored token and never the client ID as the bearer', async () => {
		respond(business);

		await invokeWith({
			key: CLIENT_ID,
			options: {},
			keys: { get_api_secret: jest.fn().mockResolvedValue(API_KEY) },
		});

		expectAuthenticated();
	});

	it('uses the apiKey option even when only the key option names the client', async () => {
		respond(business);

		await invokeWith({
			key: CLIENT_ID,
			options: { key: CLIENT_ID, apiKey: API_KEY },
			keys: { get_api_secret: jest.fn().mockResolvedValue(null) },
		});

		expectAuthenticated();
	});

	// R8: the key the binder and any before hook resolved names the account,
	// not the options.
	it('uses the hook-resolved ctx.key as the client ID over the options', async () => {
		respond(business);

		await invokeWith({
			key: 'client-from-hook',
			options: { clientId: CLIENT_ID, key: CLIENT_ID, apiKey: API_KEY },
			keys: { get_api_secret: jest.fn().mockResolvedValue(null) },
		});

		expect(lastRequest().query.clientId).toBe('client-from-hook');
		expect(lastRequest().headers.get('authorization')).toBe(
			`Bearer ${API_KEY}`,
		);
	});

	it('raises AuthMissingError instead of sending the client ID as the token', async () => {
		await expect(
			invokeWith({
				key: CLIENT_ID,
				options: {},
				keys: { get_api_secret: jest.fn().mockResolvedValue(null) },
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('keeps the client ID on the query of a GET and adds no body', async () => {
		respond(business);

		await invoke(Businesses.get, { businessId: 1 });

		expect(lastRequest().body).toBeUndefined();
		expect(lastRequest().query.clientId).toBe(CLIENT_ID);
	});
});

describe('error envelopes', () => {
	it('throws on the 200 that carries an errorCode, which a live probe returned', async () => {
		respond(invalidClientOn200);

		const error = await caught(invoke(Businesses.list, {}));

		expect(error).toBeInstanceOf(GatherupAPIError);
		expect(error).toMatchObject({ errorCode: 2, bodyError: true });
		expect(gatherupErrorInfo(error)).toMatchObject({ isAuthError: true });
		expect((error as Error).message).toContain('Invalid clientId');
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('accepts a success body whose errorCode is 0', async () => {
		respond(businesses);

		await expect(invoke(Businesses.list, {})).resolves.toMatchObject({
			errorCode: 0,
		});
	});

	it('reads a real 401 and keeps it core ApiError', async () => {
		respond(unauthorized, 401);

		const error = await caught(invoke(Businesses.list, {}));

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 401, request: { method: 'GET' } });
		expect(gatherupErrorInfo(error)).toMatchObject({
			status: 401,
			errorCode: 2,
			isAuthError: true,
		});
	});

	it('reads a refused field', async () => {
		respond(invalidField, 400);

		const error = await caught(
			invoke(Businesses.create, { ...ADDRESS, businessName: 'x' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(gatherupErrorInfo(error)).toMatchObject({
			status: 400,
			errorCode: 11,
			isValidationError: true,
		});
	});

	it('keeps an address or phone GatherUp quotes back out of the error', async () => {
		respond(
			{
				errorCode: 11,
				errorMessage:
					'Invalid email: jane.doe@example.com, phone +1 (808) 333-3334',
			},
			400,
		);

		const error = await caught(
			invoke(Customers.create, {
				businessId: 34291,
				customerFirstName: 'Jane',
				customerLastName: 'Doe',
				customerEmail: 'jane.doe@example.com',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		const text = `${String(error)} ${JSON.stringify(error)}`;
		expect(text).not.toContain('jane.doe@example.com');
		expect(text).not.toContain('333-3334');
		expect(text).not.toContain('Jane');
		expect((error as Error).message).toContain('[email]');
		expect((error as ApiError).request.body).toBeUndefined();
		expect((error as ApiError).request.query).toBeUndefined();
	});

	it('keeps an address quoted in a 200 error body out of the error', async () => {
		respond({ errorCode: 11, errorMessage: 'Duplicate: jane.doe@example.com' });

		const error = await caught(invoke(Businesses.list, {}));

		expect(error).toBeInstanceOf(GatherupAPIError);
		expect(String(error)).not.toContain('jane.doe@example.com');
	});

	it('keeps an unformatted phone, a name and the token GatherUp quotes back out of an HTTP error', async () => {
		respond(
			{
				errorCode: 11,
				errorMessage: `Customer Zelphine Quarrington, phone 8083333334, token ${API_KEY} rejected`,
			},
			400,
		);

		const error = await caught(
			invoke(Customers.create, {
				businessId: 34291,
				customerFirstName: 'Zelphine',
				customerLastName: 'Quarrington',
				customerEmail: 'z.q@example.com',
				customerPhone: '+1 (808) 333-3334',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		const text = `${String(error)} ${JSON.stringify(error)}`;
		expect(text).not.toContain('Zelphine');
		expect(text).not.toContain('Quarrington');
		expect(text).not.toContain('8083333334');
		expect(text).not.toContain(API_KEY);
		expect((error as Error).message).toContain('rejected');
	});

	it('keeps an unformatted phone, a name and the token GatherUp quotes back out of a 200 error', async () => {
		respond({
			errorCode: 11,
			errorMessage: `Duplicate customer Zelphine Quarrington 8083333334 ${API_KEY}`,
		});

		const error = await caught(
			invoke(Customers.create, {
				businessId: 34291,
				customerFirstName: 'Zelphine',
				customerLastName: 'Quarrington',
				customerEmail: 'z.q@example.com',
			}),
		);

		expect(error).toBeInstanceOf(GatherupAPIError);
		const text = `${String(error)} ${JSON.stringify(error)}`;
		expect(text).not.toContain('Zelphine');
		expect(text).not.toContain('Quarrington');
		expect(text).not.toContain('8083333334');
		expect(text).not.toContain(API_KEY);
		expect((error as Error).message).toContain('Duplicate customer');
	});

	it('keeps a two-letter name GatherUp quotes back out of both error paths', async () => {
		const input = {
			businessId: 34291,
			customerFirstName: 'Li',
			customerLastName: 'Ng',
			customerEmail: 'li.ng@example.com',
		};
		respond({ errorCode: 11, errorMessage: 'Invalid customer: Li Ng' }, 400);
		const httpError = await caught(invoke(Customers.create, input));
		respond({ errorCode: 11, errorMessage: 'Invalid customer: Li Ng' });
		const bodyError = await caught(invoke(Customers.create, input));

		for (const error of [httpError, bodyError]) {
			const text = `${String(error)} ${JSON.stringify(error)}`;
			expect(text).not.toMatch(/\bLi\b/);
			expect(text).not.toMatch(/\bNg\b/);
			expect((error as Error).message).toContain('Invalid customer');
		}
	});

	it('keeps the token and client ID out of the error', async () => {
		respond(unauthorized, 401);

		const error = await caught(invoke(Businesses.list, {}));

		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(CLIENT_ID);
	});

	it('keeps only the GatherUp error envelope on the body, so a customer payload cannot follow it into a log', async () => {
		respond({ ...invalidField, customer: { email: 'x@y.example' } }, 400);

		const error = await caught(invoke(Businesses.list, {}));

		expect((error as ApiError).body).toEqual({
			errorCode: 11,
			errorMessage: 'Business name is required',
		});
	});

	it('marks a transport failure and keeps the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await caught(invoke(Businesses.list, {}));

		expect(error).toBeInstanceOf(GatherupAPIError);
		expect(error).toMatchObject({
			transport: true,
			method: 'GET',
			message: 'fetch failed',
		});
	});
});
