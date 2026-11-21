import type { JsonObject } from './client';
import { HOTSPOTSYSTEM_API_BASE, HOTSPOTSYSTEM_API_KEY_HEADER } from './client';
import type { HotspotSystemContext } from './index';
import { hotspotsystem } from './index';

const KEY = 'sn-test-key';

let fetchMock: jest.SpyInstance;

/** A response as HotspotSystem sends it, with an optional `Link` header. */
// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(
	body: JsonObject,
	{ status = 200, link }: { status?: number; link?: string } = {},
) {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	if (link) headers.Link = link;
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), { status, headers }),
	);
}

function makeContext() {
	const ctx = {
		key: KEY,
		$getAccountId: jest.fn(async () => 'account-1'),
	};
	// unknown: a fixture supplies only the members the endpoints read; the real
	// context carries the whole key manager, so a stand-in needs a cast.
	return ctx as unknown as HotspotSystemContext;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		parsed: new URL(String(url)),
		init,
		headers: new Headers(init.headers),
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

const plugin = hotspotsystem({ key: KEY });
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

const LOCATION = '42';

/** A page as the API returns one. */
const person = {
	id: '123456',
	user_name: 'EuropeHQ',
	name: 'Europe HQ',
	email: 'help@example.com',
	company_name: 'Example Ltd',
	address: 'Liszt Ferenc ter 10',
	city: 'Budapest',
	state: null,
	zip: 'H-1061',
	country_code: 'HU',
	phone: '+3613010817',
	social_network: null,
	social_id: null,
	social_username: null,
	social_link: null,
	social_gender: null,
	social_age_range: null,
	social_followers_count: null,
	registered_at: '2016-01-15 08:00:00',
};

const voucher = {
	serial: '1229604629-75349',
	voucher_code: '1h-296823',
	limit_tl: 0,
	simultaneous_use: 1,
	limit_dl: 0,
	limit_ul: 0,
	usage_exp: null,
	validity: 60,
	price_enduser: 600,
	currency: 'HUF',
};

const transaction = {
	id: 890,
	operator: 'jgonda',
	location_id: 1,
	user_name: 'mmitchell92',
	customer: 'Mark mitchell',
	action_date_gmt: '2016-05-28T15:35:56.000Z',
	amount: 7.5,
	currency: 'EUR',
	user_agent: 'Mozilla/5.0',
	newsletter: 0,
	company_name: null,
	email: 'mark@example.com',
	address: null,
	city: null,
	state: null,
	zip: null,
	country_code: null,
	phone: '447850477290',
	language: 'en',
	smscountry: null,
};

function page(item: JsonObject) {
	return { metadata: { total_count: 1 }, items: [item] };
}

describe('request shape', () => {
	const cases: Array<{
		name: string;
		run: (ctx: HotspotSystemContext) => Promise<object>;
		path: string;
		query?: Record<string, string>;
		body: JsonObject;
	}> = [
		{
			name: 'ping.check',
			run: (ctx) => endpoints.ping.check(ctx, {}),
			path: '/v2.0/ping',
			body: { ping: 'pong' },
		},
		{
			name: 'me.get',
			run: (ctx) => endpoints.me.get(ctx, {}),
			path: '/v2.0/me',
			body: { userId: 1, operator: 'John Doe' },
		},
		{
			name: 'locations.list',
			run: (ctx) =>
				endpoints.locations.list(ctx, {
					fields: ['id', 'name'],
					sort: '-name',
					limit: 10,
					offset: 20,
				}),
			path: '/v2.0/locations',
			query: { fields: 'id,name', sort: '-name', limit: '10', offset: '20' },
			body: page({ id: '1', name: 'Location 1' }),
		},
		{
			name: 'locations.options',
			run: (ctx) => endpoints.locations.options(ctx, {}),
			path: '/v2.0/locations/options',
			body: { items: [{ id: '1', name: 'Location 1' }] },
		},
		{
			name: 'locations.customers',
			run: (ctx) =>
				endpoints.locations.customers(ctx, { location_id: LOCATION }),
			path: `/v2.0/locations/${LOCATION}/customers`,
			body: page(person),
		},
		{
			name: 'locations.subscribers',
			run: (ctx) =>
				endpoints.locations.subscribers(ctx, { location_id: LOCATION }),
			path: `/v2.0/locations/${LOCATION}/subscribers`,
			body: page(person),
		},
		{
			name: 'locations.vouchers',
			run: (ctx) =>
				endpoints.locations.vouchers(ctx, { location_id: LOCATION }),
			path: `/v2.0/locations/${LOCATION}/vouchers`,
			body: page(voucher),
		},
		{
			name: 'locations.paidTransactions',
			run: (ctx) =>
				endpoints.locations.paidTransactions(ctx, { location_id: LOCATION }),
			path: `/v2.0/locations/${LOCATION}/transactions/paid`,
			body: page(transaction),
		},
		{
			name: 'locations.voucherTransactions',
			run: (ctx) =>
				endpoints.locations.voucherTransactions(ctx, { location_id: LOCATION }),
			path: `/v2.0/locations/${LOCATION}/transactions/voucher`,
			body: page(transaction),
		},
		{
			name: 'locations.socialTransactions',
			run: (ctx) =>
				endpoints.locations.socialTransactions(ctx, { location_id: LOCATION }),
			path: `/v2.0/locations/${LOCATION}/transactions/social`,
			body: page({ ...transaction, social_id: '1020', package_id: 'd3' }),
		},
		{
			name: 'locations.macTransactions',
			run: (ctx) =>
				endpoints.locations.macTransactions(ctx, { location_id: LOCATION }),
			path: `/v2.0/locations/${LOCATION}/transactions/mac`,
			body: page({ ...transaction, package_id: 'd2', a1: '4107' }),
		},
		{
			name: 'customers.list',
			run: (ctx) => endpoints.customers.list(ctx, { limit: 5 }),
			path: '/v2.0/customers',
			query: { limit: '5' },
			body: page(person),
		},
		{
			name: 'subscribers.list',
			run: (ctx) => endpoints.subscribers.list(ctx, { sort: 'registered_at' }),
			path: '/v2.0/subscribers',
			query: { sort: 'registered_at' },
			body: page(person),
		},
		{
			name: 'vouchers.list',
			run: (ctx) => endpoints.vouchers.list(ctx, {}),
			path: '/v2.0/vouchers',
			body: page(voucher),
		},
		{
			name: 'transactions.paid',
			run: (ctx) => endpoints.transactions.paid(ctx, { limit: 100 }),
			path: '/v2.0/transactions/paid',
			query: { limit: '100' },
			body: page(transaction),
		},
		{
			name: 'transactions.voucher',
			run: (ctx) => endpoints.transactions.voucher(ctx, {}),
			path: '/v2.0/transactions/voucher',
			body: page(transaction),
		},
		{
			name: 'transactions.social',
			run: (ctx) => endpoints.transactions.social(ctx, {}),
			path: '/v2.0/transactions/social',
			body: page(transaction),
		},
		{
			name: 'transactions.mac',
			run: (ctx) => endpoints.transactions.mac(ctx, {}),
			path: '/v2.0/transactions/mac',
			body: page(transaction),
		},
	];

	it.each(cases)('$name calls GET $path', async (testCase) => {
		respond(testCase.body);

		await testCase.run(makeContext());

		const { parsed, init, headers } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.origin + parsed.pathname).toBe(
			`${HOTSPOTSYSTEM_API_BASE}${testCase.path.replace('/v2.0', '')}`,
		);
		// The key travels in the documented header, never in the URL.
		expect(headers.get(HOTSPOTSYSTEM_API_KEY_HEADER)).toBe(KEY);
		expect(parsed.search).not.toContain(KEY);

		for (const [key, value] of Object.entries(testCase.query ?? {})) {
			expect([key, parsed.searchParams.get(key)]).toEqual([key, value]);
		}
		// Nothing beyond the documented query fields is sent.
		expect([...parsed.searchParams.keys()].sort()).toEqual(
			Object.keys(testCase.query ?? {}).sort(),
		);
	});

	it('covers every registered operation', () => {
		const registered: string[] = [];
		for (const [group, members] of Object.entries(endpoints)) {
			for (const name of Object.keys(members as object)) {
				registered.push(`${group}.${name}`);
			}
		}
		expect(registered.sort()).toEqual(cases.map((c) => c.name).sort());
	});

	it('returns next_offset from the Link header, and omits it on the last page', async () => {
		respond(page({ id: '1', name: 'Location 1' }), {
			link: `<https://api.hotspotsystem.com/v2.0/locations?limit=1&offset=1>; rel="next"`,
		});

		const first = await endpoints.locations.list(makeContext(), { limit: 1 });
		expect(first.next_offset).toBe(1);
		expect(first.items).toHaveLength(1);

		// The last page carries no next relation, so the field is absent rather
		// than a made-up value.
		respond(page({ id: '2', name: 'Location 2' }), {
			link: `<https://api.hotspotsystem.com/v2.0/locations?limit=1&offset=0>; rel="prev"`,
		});
		const last = await endpoints.locations.list(makeContext(), { limit: 1 });
		expect(last.next_offset).toBeUndefined();
	});

	it('follows the offset the previous page returned', async () => {
		respond(
			{ metadata: { total_count: 2 }, items: [{ id: '1', name: 'One' }] },
			{
				link: `<https://api.hotspotsystem.com/v2.0/locations?limit=1&offset=1>; rel="next"`,
			},
		);
		const first = await endpoints.locations.list(makeContext(), { limit: 1 });

		respond({
			metadata: { total_count: 2 },
			items: [{ id: '2', name: 'Two' }],
		});
		await endpoints.locations.list(makeContext(), {
			limit: 1,
			offset: first.next_offset,
		});

		expect(lastCall().parsed.searchParams.get('offset')).toBe('1');
	});

	// Every transaction record returns `location_id` as a number, so a caller
	// usually has one; the path has to accept it.
	it('accepts a numeric location ID', async () => {
		respond(page(person));

		await endpoints.locations.customers(makeContext(), { location_id: 42 });

		expect(lastCall().parsed.pathname).toBe('/v2.0/locations/42/customers');
	});

	it('encodes a location ID, so an odd value cannot change the route', async () => {
		respond(page(person));

		await endpoints.locations.customers(makeContext(), {
			location_id: 'a/../b c',
		});

		expect(lastCall().parsed.pathname).toBe(
			'/v2.0/locations/a%2F..%2Fb%20c/customers',
		);
	});

	// `..` survives encodeURIComponent and the URL parser resolves it, which
	// would send a per-location read to the account-wide route.
	it('refuses a dot-segment location ID before any request', async () => {
		for (const location_id of ['.', '..']) {
			await expect(
				endpoints.locations.customers(makeContext(), { location_id }),
			).rejects.toThrow('location_id cannot be');
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('error translation', () => {
	it('keeps the status and the provider message', async () => {
		respond({ error: 'Invalid authentication!' }, { status: 401 });

		const error = (await endpoints.me
			.get(makeContext(), {})
			.catch((caught) => caught)) as Error & { status?: number };

		expect(error.status).toBe(401);
		expect(error.message).toBe('HotspotSystem 401: Invalid authentication!');
	});

	it('does not put the key in the error', async () => {
		respond({ error: 'Internal Server Error' }, { status: 500 });

		const error = (await endpoints.customers
			.list(makeContext(), {})
			.catch((caught) => caught)) as Error;

		const inspect = require('node:util').inspect(error) as string;
		expect(error.message).not.toContain(KEY);
		expect(inspect).not.toContain(KEY);
		expect(JSON.stringify(error)).not.toContain(KEY);
	});

	it('reports a bodyless success as a parse failure, not an empty page', async () => {
		// A 200 with no body is not the documented answer, so it must not be
		// reported as an empty page of data.
		fetchMock.mockResolvedValueOnce(
			new Response(null, {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			}),
		);

		const error = (await endpoints.vouchers
			.list(makeContext(), {})
			.catch((caught) => caught)) as Error;

		expect(error.name).toBe('ZodError');
	});
});
