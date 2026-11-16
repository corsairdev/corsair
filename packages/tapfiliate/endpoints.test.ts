import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	Affiliates,
	Conversions,
	Customers,
	Payments,
	Programs,
} from './endpoints';
import {
	affiliate,
	affiliateBalances,
	affiliates,
	affiliations,
	authErrorResponse,
	balances,
	clickDetail,
	clicks,
	commission,
	commissionConflictResponse,
	commissions,
	conversion,
	conversions,
	createdAffiliate,
	createdClick,
	customer,
	customers,
	customFields,
	payment,
	payments,
	program,
	programAffiliate,
	programAffiliates,
	programs,
	requestErrorResponse,
	validationErrorResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'tap-test-key';

// The fake context only carries what the endpoints read (ctx.key). Typing the
// endpoint generically keeps each call's own output type.
function invoke<E extends (ctx: never, input: never) => Promise<unknown>>(
	endpoint: E,
	// unknown: negative cases pass values no schema accepts.
	input: unknown,
): ReturnType<E> {
	return endpoint({ key: API_KEY } as never, input as never) as ReturnType<E>;
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

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
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
	expect(sent.origin).toBe('https://api.tapfiliate.com');
	// Tapfiliate reads the key from X-Api-Key, never from a bearer header.
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

/**
 * Resolves to the rejection reason, narrowed to the plugin's own error type.
 * A promise can reject with any value, so this is the one place the reason is
 * treated as untyped before it is narrowed.
 */
async function rejection(promise: Promise<unknown>): Promise<ApiError> {
	const caught = await promise.then(
		() => undefined,
		// unknown: a rejection reason has no static type.
		(caught: unknown) => caught,
	);
	expect(caught).toBeInstanceOf(ApiError);
	return caught as ApiError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('affiliates.list', () => {
	it('GETs /1.6/affiliates/ and passes every filter', async () => {
		respond(affiliates);

		const result = await invoke(Affiliates.list, {
			page: 2,
			email: 'jane@example-blog.inc',
			referral_code: 'janejameson',
			parent_id: 'parent-1',
			affiliate_group_id: 'group-1',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/1.6/affiliates/',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			page: '2',
			email: 'jane@example-blog.inc',
			referral_code: 'janejameson',
			parent_id: 'parent-1',
			affiliate_group_id: 'group-1',
		});
		expect(result).toHaveLength(1);
		expect(result[0]?.firstname).toBe('Jane');
	});

	it('sends no query when the caller passes nothing', async () => {
		respond([]);

		await invoke(Affiliates.list, {});

		expect(lastRequest().query).toEqual({});
	});
});

describe('affiliates.get and affiliates.create', () => {
	it('GETs one affiliate by the id in the path', async () => {
		respond(affiliate);

		const result = await invoke(Affiliates.get, {
			affiliateId: 'jane-jameson',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/affiliates/jane-jameson/',
			method: 'GET',
		});
		expect(result.id).toBe('jane-jameson');
	});

	it('POSTs a new affiliate and keeps the generated password', async () => {
		respond(createdAffiliate);

		const result = await invoke(Affiliates.create, {
			email: 'jane@example-blog.inc',
			firstname: 'Jane',
			lastname: 'Jameson',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/affiliates/',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			email: 'jane@example-blog.inc',
			firstname: 'Jane',
			lastname: 'Jameson',
		});
		// The generated password is the only way to reach the new account.
		expect('password' in result ? result.password : undefined).toBe(
			'generated-password-1234',
		);
	});

	it('rejects an address missing country.code before sending', async () => {
		await expect(
			invoke(Affiliates.create, {
				email: 'jane@example-blog.inc',
				// Tapfiliate silently drops an incomplete address, so the schema
				// requires all four parts together.
				address: { address: '1 Market St', postal_code: '94105', city: 'SF' },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a create with no email', async () => {
		await expect(invoke(Affiliates.create, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('affiliates.delete', () => {
	it('DELETEs and reports success for the 204, not an empty body', async () => {
		respondEmpty(204);

		const result = await invoke(Affiliates.remove, {
			affiliateId: 'jane-jameson',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/affiliates/jane-jameson/',
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});
});

describe('affiliate reporting', () => {
	it('reads one affiliate balance per currency', async () => {
		respond(affiliateBalances);

		const result = await invoke(Affiliates.balances, {
			affiliateId: 'jane-jameson',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/affiliates/jane-jameson/balances/',
			method: 'GET',
		});
		expect(result.USD).toBe(123.45);
	});

	it('lists an affiliate payments', async () => {
		respond(payments);

		const result = await invoke(Affiliates.payments, {
			affiliateId: 'jane-jameson',
			page: 2,
		});

		expect(lastRequest().path).toBe('/1.6/affiliates/jane-jameson/payments/');
		expect(lastRequest().query).toEqual({ page: '2' });
		expect(result[0]?.id).toBe('pa_abc123');
	});

	it('lists the programs an affiliate belongs to', async () => {
		respond(affiliations);

		const result = await invoke(Affiliates.programs, {
			affiliateId: 'jane-jameson',
			page: 2,
		});

		expect(lastRequest().path).toBe('/1.6/affiliates/jane-jameson/programs/');
		expect(lastRequest().query).toEqual({ page: '2' });
		expect(result[0]?.approved).toBe(true);
	});

	it('lists the signup custom fields', async () => {
		respond(customFields);

		const result = await invoke(Affiliates.customFields, {});

		expect(lastRequest().path).toBe('/1.6/affiliates/custom-fields/');
		expect(result[0]?.title).toBe('Website');
	});
});

describe('programs', () => {
	it('lists programs and passes asset_id as a filter', async () => {
		respond(programs);

		const result = await invoke(Programs.list, { asset_id: '1-aaaaaa' });

		expect(lastRequest()).toMatchObject({
			path: '/1.6/programs/',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({ asset_id: '1-aaaaaa' });
		expect(result[0]?.status).toBe('active');
	});

	it('gets one program', async () => {
		respond(program);

		const result = await invoke(Programs.get, { programId: '1' });

		expect(lastRequest()).toMatchObject({
			path: '/1.6/programs/1/',
			method: 'GET',
		});
		expect(result.cookie_time).toBe(45);
	});

	it('lists the affiliates in a program', async () => {
		respond(programAffiliates);

		const result = await invoke(Programs.affiliates, {
			programId: '1',
			page: 1,
		});

		expect(lastRequest().path).toBe('/1.6/programs/1/affiliates/');
		expect(lastRequest().query).toEqual({ page: '1' });
		expect(result[0]?.coupon).toBe('JANE10OFF');
	});

	it('adds an affiliate to a program with the approval state', async () => {
		respond(programAffiliate);

		await invoke(Programs.addAffiliate, {
			programId: '1',
			affiliateId: 'jane-jameson',
			// null leaves the affiliate pending.
			approved: null,
			coupon: 'JANE10OFF',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/programs/1/affiliates/',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			affiliate: { id: 'jane-jameson' },
			approved: null,
			coupon: 'JANE10OFF',
		});
	});

	it('gets one affiliate within a program', async () => {
		respond(programAffiliate);

		await invoke(Programs.getAffiliate, {
			programId: '1',
			affiliateId: 'jane-jameson',
		});

		expect(lastRequest().path).toBe('/1.6/programs/1/affiliates/jane-jameson/');
	});

	it('replaces a coupon, and a null removes it', async () => {
		respond(programAffiliate);

		await invoke(Programs.updateAffiliate, {
			programId: '1',
			affiliateId: 'jane-jameson',
			coupon: 'JANE20OFF',
		});
		expect(lastRequest()).toMatchObject({ method: 'PATCH' });
		expect(lastRequest().body).toEqual({ coupon: 'JANE20OFF' });

		respond(programAffiliate);
		await invoke(Programs.updateAffiliate, {
			programId: '1',
			affiliateId: 'jane-jameson',
			coupon: null,
		});
		expect(lastRequest().body).toEqual({ coupon: null });
	});

	it('sends no coupon key at all when the caller omits it', async () => {
		respond(programAffiliate);

		await invoke(Programs.updateAffiliate, {
			programId: '1',
			affiliateId: 'jane-jameson',
		});

		// Omitting the key changes nothing; sending null would remove it.
		expect(lastRequest().body).toEqual({});
	});

	it('approves with PUT and disapproves with DELETE on the same path', async () => {
		respond(programAffiliate);
		await invoke(Programs.approveAffiliate, {
			programId: '1',
			affiliateId: 'jane-jameson',
		});
		expect(lastRequest()).toMatchObject({
			path: '/1.6/programs/1/affiliates/jane-jameson/approved/',
			method: 'PUT',
		});

		respond({ ...programAffiliate, approved: false });
		await invoke(Programs.disapproveAffiliate, {
			programId: '1',
			affiliateId: 'jane-jameson',
		});
		expect(lastRequest()).toMatchObject({
			path: '/1.6/programs/1/affiliates/jane-jameson/approved/',
			method: 'DELETE',
		});
	});
});

describe('conversions', () => {
	it('lists conversions with their commissions', async () => {
		respond(conversions);

		const result = await invoke(Conversions.conversionsList, {
			program_id: '1',
			pending: true,
			date_from: '2024-03-01',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/conversions/',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			program_id: '1',
			pending: 'true',
			date_from: '2024-03-01',
		});
		expect(result[0]?.commissions).toHaveLength(1);
	});

	it('creates a conversion through a click reference', async () => {
		respond(conversion);

		const result = await invoke(Conversions.conversionsCreate, {
			click_id: '1-abc',
			amount: 30.55,
			currency: 'USD',
			external_id: 'order-100',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/conversions/',
			method: 'POST',
		});
		expect(lastRequest().body).toMatchObject({
			click_id: '1-abc',
			amount: 30.55,
			currency: 'USD',
			external_id: 'order-100',
		});
		expect(result.id).toBe(4321);
	});

	it('rejects a conversion with no tracking reference', async () => {
		await expect(
			invoke(Conversions.conversionsCreate, { amount: 10 }),
		).rejects.toThrow(/tracking reference/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects source_id without asset_id', async () => {
		await expect(
			invoke(Conversions.conversionsCreate, {
				source_id: 'src-1',
				amount: 10,
			}),
		).rejects.toThrow(/asset_id/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends recalculate_commissions as a query flag, not a body field', async () => {
		respond(conversion);

		await invoke(Conversions.conversionsUpdate, {
			conversionId: 4321,
			amount: 40,
			recalculate_commissions: true,
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/conversions/4321/',
			method: 'PATCH',
		});
		expect(lastRequest().query).toEqual({ recalculate_commissions: 'true' });
		expect(lastRequest().body).toEqual({ amount: 40 });
	});

	it('rejects recalculate_commissions without an amount', async () => {
		await expect(
			invoke(Conversions.conversionsUpdate, {
				conversionId: 4321,
				recalculate_commissions: true,
			}),
		).rejects.toThrow(/needs an amount/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes a conversion', async () => {
		respondEmpty(204);

		const result = await invoke(Conversions.conversionsRemove, {
			conversionId: 4321,
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/conversions/4321/',
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});
});

describe('commissions', () => {
	it('lists commissions filtered by status and paid', async () => {
		respond(commissions);

		const result = await invoke(Conversions.commissionsList, {
			affiliate_id: 'jane-jameson',
			status: 'approved',
			paid: false,
		});

		expect(lastRequest().path).toBe('/1.6/commissions/');
		expect(lastRequest().query).toEqual({
			affiliate_id: 'jane-jameson',
			status: 'approved',
			// The reference takes 1 or 0 for this filter.
			paid: '0',
		});
		expect(result[0]?.kind).toBe('regular');
	});

	it('approves a commission with PUT on /approved/', async () => {
		respond({ ...commission, approved: true });

		const result = await invoke(Conversions.commissionsApprove, {
			commissionId: 1234,
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/commissions/1234/approved/',
			method: 'PUT',
		});
		expect(result.approved).toBe(true);
	});

	it('disapproves a commission with DELETE on /approved/', async () => {
		respond({ ...commission, approved: false });

		await invoke(Conversions.commissionsDisapprove, { commissionId: 1234 });

		expect(lastRequest()).toMatchObject({
			path: '/1.6/commissions/1234/approved/',
			method: 'DELETE',
		});
	});

	it('changes a commission amount and comment', async () => {
		respond({ ...commission, amount: 5 });

		await invoke(Conversions.commissionsUpdate, {
			commissionId: 1234,
			amount: 5,
			comment: 'Adjusted',
		});

		expect(lastRequest()).toMatchObject({ method: 'PATCH' });
		expect(lastRequest().body).toEqual({ amount: 5, comment: 'Adjusted' });
	});
});

describe('customers', () => {
	it('lists customers filtered by customer_id', async () => {
		respond(customers);

		const result = await invoke(Customers.list, { customer_id: 'cust-1' });

		expect(lastRequest().path).toBe('/1.6/customers/');
		expect(result[0]?.status).toBe('paying');
	});

	it('creates a customer through a referral code', async () => {
		respond(customer);

		await invoke(Customers.create, {
			customer_id: 'cust-1',
			referral_code: 'janejameson',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/customers/',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			customer_id: 'cust-1',
			referral_code: 'janejameson',
		});
	});

	it('creates a trial customer with its status', async () => {
		respond(customer);

		await invoke(Customers.create, {
			customer_id: 'cust-1',
			referral_code: 'janejameson',
			status: 'trial',
		});

		expect(lastRequest().body).toMatchObject({ status: 'trial' });
	});

	it('rejects a customer with no customer_id', async () => {
		await expect(
			invoke(Customers.create, { referral_code: 'janejameson' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('cancels with DELETE and reactivates with PUT on /status/', async () => {
		respond({ ...customer, status: 'canceled' });
		await invoke(Customers.cancel, { customerId: 'cu_123' });
		expect(lastRequest()).toMatchObject({
			path: '/1.6/customers/cu_123/status/',
			method: 'DELETE',
		});

		respond({ ...customer, status: 'paying' });
		await invoke(Customers.uncancel, { customerId: 'cu_123' });
		expect(lastRequest()).toMatchObject({
			path: '/1.6/customers/cu_123/status/',
			method: 'PUT',
		});
	});

	it('deletes a customer', async () => {
		respondEmpty(204);

		const result = await invoke(Customers.remove, { customerId: 'cu_123' });

		expect(lastRequest()).toMatchObject({
			path: '/1.6/customers/cu_123/',
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});
});

describe('payments, balances and clicks', () => {
	it('creates one payment and always gets an array back', async () => {
		respond(payments);

		const result = await invoke(Payments.paymentsCreate, {
			affiliate_id: 'jane-jameson',
			amount: 30.55,
			currency: 'USD',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/payments/',
			method: 'POST',
		});
		expect(result[0]?.amount).toBe(30.55);
	});

	it('creates several payments from an array', async () => {
		respond([payment, { ...payment, id: 'pa_def456' }]);

		const result = await invoke(Payments.paymentsCreate, [
			{ affiliate_id: 'jane-jameson', amount: 10, currency: 'USD' },
			{ affiliate_id: 'jane-jameson', amount: 20, currency: 'USD' },
		]);

		expect(Array.isArray(lastRequest().body)).toBe(true);
		expect(result).toHaveLength(2);
	});

	it('rejects a payment of zero before sending', async () => {
		await expect(
			invoke(Payments.paymentsCreate, {
				affiliate_id: 'jane-jameson',
				amount: 0,
				currency: 'USD',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('cancels a payment', async () => {
		respondEmpty(204);

		const result = await invoke(Payments.paymentsCancel, {
			paymentId: 'pa_abc123',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/payments/pa_abc123/',
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});

	it('lists balances including fraud-held ones', async () => {
		respond(balances);

		const result = await invoke(Payments.balancesList, {
			include_fraud: true,
		});

		expect(lastRequest().path).toBe('/1.6/balances/');
		expect(lastRequest().query).toEqual({ include_fraud: 'true' });
		expect(result[0]?.balances.USD).toBe(123.45);
	});

	it('creates a click and reads its id', async () => {
		respond(createdClick);

		const result = await invoke(Payments.clicksCreate, {
			referral_code: 'janejameson',
			ip: '203.0.113.1',
		});

		expect(lastRequest()).toMatchObject({
			path: '/1.6/clicks/',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			referral_code: 'janejameson',
			ip: '203.0.113.1',
		});
		expect(result.id).toBe('1-abc');
	});

	it('rejects a click with no tracking reference', async () => {
		await expect(invoke(Payments.clicksCreate, {})).rejects.toThrow(
			/referral_code, or asset_id with source_id/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('lists clicks and reads one with its affiliate and program', async () => {
		respond(clicks);
		const listed = await invoke(Payments.clicksList, {
			program_id: '1',
			date_from: '2024-03-01',
		});
		expect(lastRequest().path).toBe('/1.6/clicks/');
		expect(listed[0]?.id).toBe('1-abc');

		respond(clickDetail);
		const detail = await invoke(Payments.clicksGet, { clickId: '1-abc' });
		expect(lastRequest().path).toBe('/1.6/clicks/1-abc/');
		expect(detail.program?.title).toBe('Default program');
	});
});

describe('error handling', () => {
	it('parses the gateway auth envelope', async () => {
		respond(authErrorResponse, 401);

		const error = await rejection(invoke(Affiliates.get, { affiliateId: 'x' }));

		expect(error.status).toBe(401);
		expect(error.message).toContain('Tapfiliate 401');
		expect(error.message).toContain('Authentication Failed.');
	});

	it('parses the request-error envelope and keeps the traceId', async () => {
		respond(requestErrorResponse, 404);

		const error = await rejection(
			invoke(Affiliates.get, { affiliateId: 'missing' }),
		);

		expect(error.status).toBe(404);
		// The traceId stays in the response body for support.
		expect(error.body?.traceId).toBe(requestErrorResponse.traceId);
	});

	it('parses the errors envelope and names the rejected field', async () => {
		respond(validationErrorResponse, 400);

		const error = await rejection(
			invoke(Programs.updateAffiliate, {
				programId: '1',
				affiliateId: 'jane-jameson',
				coupon: 'JANE10OFF',
			}),
		);

		expect(error.status).toBe(400);
		expect(error.body?.errors?.[0]).toMatchObject({
			message: 'This coupon is already in use.',
			property_path: 'coupon',
		});
		expect(error.message).toContain('This coupon is already in use.');
	});

	it('reads the machine code from a 409 errors envelope', async () => {
		respond(commissionConflictResponse, 409);

		const error = await rejection(
			invoke(Conversions.commissionsDisapprove, { commissionId: 1234 }),
		);

		expect(error.status).toBe(409);
		expect(error.message).toContain('commission_approved');
	});

	it('never leaks the key through the error', async () => {
		respond(authErrorResponse, 401);

		const error = await rejection(invoke(Affiliates.get, { affiliateId: 'x' }));

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});

	it('keeps the sent affiliate email and password out of the error', async () => {
		respond(validationErrorResponse, 400);

		const error = await rejection(
			invoke(Affiliates.create, {
				firstname: 'Jane',
				lastname: 'Jameson',
				email: 'jane@example.com',
				password: 'hunter2-secret',
			}),
		);

		expect(error.request.body).toBeUndefined();
		const dumped = JSON.stringify(error);
		expect(dumped).not.toContain('jane@example.com');
		expect(dumped).not.toContain('hunter2-secret');
	});

	it('fails loudly when a list answers a non-array', async () => {
		respond({ affiliates: [] });

		await expect(invoke(Affiliates.list, {})).rejects.toThrow();
	});
});

describe('logging', () => {
	it('logs the operation without the input', async () => {
		respond(affiliate);

		await invoke(Affiliates.get, { affiliateId: 'jane-jameson' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'tapfiliate.affiliates.get',
			{},
			'completed',
		);
	});
});

describe('documented contracts', () => {
	it('encodes a string id in the path', async () => {
		respond(affiliations);
		await invoke(Affiliates.programs, { affiliateId: 'a/b?c' });
		expect(lastRequest().path).toBe('/1.6/affiliates/a%2Fb%3Fc/programs/');
	});

	it('reports a created affiliate when the answer has no body', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
		const result = await invoke(Affiliates.create, {
			email: 'jane@example-blog.inc',
			firstname: 'Jane',
			lastname: 'Jameson',
		});
		expect(result).toEqual({ created: true, email: 'jane@example-blog.inc' });
	});

	it('reports an updated conversion when the PATCH answers no body', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
		const result = await invoke(Conversions.conversionsUpdate, {
			conversionId: 42,
			amount: 30.55,
		});
		expect(result).toEqual({ id: 42, updated: true });
	});

	it('takes a customer_id alone on a conversion and lets Tapfiliate decide', async () => {
		respond(conversion);
		await invoke(Conversions.conversionsCreate, {
			customer_id: 'cust-1',
			amount: 10,
		});
		expect(lastRequest().body).toMatchObject({ customer_id: 'cust-1' });
	});

	it('takes a source_id with a referral_code on a click', async () => {
		respond({ id: '1-abc' });
		await invoke(Payments.clicksCreate, {
			referral_code: 'janejameson',
			source_id: '1-aaaaaa',
		});
		expect(lastRequest().body).toMatchObject({
			referral_code: 'janejameson',
			source_id: '1-aaaaaa',
		});
	});
});
