import { createHmac } from 'node:crypto';
import { ApiError } from 'corsair/http';
import {
	encodeWoocommercePathValue,
	normalizeSiteUrl,
	oauthParamString,
	oauthQuery,
	rfc3986,
} from './client';
import { woocommerceEndpointsNested } from './endpoints/catalog';
import type { WoocommerceContext } from './index';

// Every call goes through the real client and core transport; only fetch is fake.

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string.
	body: unknown;
};

let calls: Captured[] = [];

// `unknown` because each case answers its own body.
function reply(status: number, body: unknown) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		return new Response(JSON.stringify(body), {
			status,
			headers: { 'content-type': 'application/json' },
		});
	});
}

function ctx(siteUrl = 'https://shop.example.com'): WoocommerceContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'cs_secret_value',
		options: { siteUrl, consumerKey: 'ck_public_value' },
		keys: {},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as WoocommerceContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (
	ctx: WoocommerceContext,
	input: unknown,
) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = woocommerceEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const call = (id: string, input: unknown, c = ctx()) =>
	endpointFor(id)(c, input);
const url = (n = 0) => new URL(calls[n]?.url ?? '');

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('requests', () => {
	it('lists orders with Basic auth over HTTPS and pages', async () => {
		reply(200, [{ id: 1 }, { id: 2 }]);
		const page = await call('orders.list', {
			status: ['processing', 'on-hold'],
			per_page: 2,
		});
		expect(url().origin + url().pathname).toBe(
			'https://shop.example.com/wp-json/wc/v3/orders',
		);
		expect(url().searchParams.get('status[1]')).toBe('on-hold');
		expect(calls[0]?.headers.authorization).toBe(
			`Basic ${Buffer.from('ck_public_value:cs_secret_value').toString('base64')}`,
		);
		expect(url().searchParams.get('oauth_signature')).toBeNull();
		expect(page).toEqual({ items: [{ id: 1 }, { id: 2 }], next_page: 2 });
	});

	it('signs with OAuth 1.0a over plain HTTP instead of Basic auth', async () => {
		reply(200, { id: 5 });
		await call('products.get', { id: 5 }, ctx('http://localhost:8093'));
		const q = url().searchParams;
		expect(calls[0]?.headers.authorization).toBeUndefined();
		expect(q.get('oauth_consumer_key')).toBe('ck_public_value');
		expect(q.get('oauth_signature_method')).toBe('HMAC-SHA256');
		// Recompute the signature from what was sent.
		const sent = Object.fromEntries(
			[...q.entries()].filter(([k]) => k !== 'oauth_signature'),
		);
		const base = `GET&${rfc3986('http://localhost:8093/wp-json/wc/v3/products/5')}&${oauthParamString(sent)}`;
		expect(q.get('oauth_signature')).toBe(
			createHmac('sha256', 'cs_secret_value&').update(base).digest('base64'),
		);
	});

	it('refuses an application password over non-local http, signs a key pair there', async () => {
		reply(200, { id: 5 });
		const appPassword = {
			...ctx('http://shop.example.com'),
			options: { siteUrl: 'http://shop.example.com', consumerKey: 'ada' },
		} as WoocommerceContext;
		await expect(call('products.get', { id: 5 }, appPassword)).rejects.toThrow(
			/needs an https store URL/,
		);
		// `.local` and `.test` names can resolve to another machine.
		for (const host of ['shop.local', 'shop.test', 'wp.localhost']) {
			const site = `http://${host}`;
			await expect(
				call('products.get', { id: 5 }, {
					...ctx(site),
					options: { siteUrl: site, consumerKey: 'ada' },
				} as WoocommerceContext),
			).rejects.toThrow(/needs an https store URL/);
		}
		expect(calls).toHaveLength(0);
		await call('products.get', { id: 5 }, ctx('http://shop.example.com'));
		expect(url().searchParams.get('oauth_signature')).toBeTruthy();
	});

	it('pages by offset without a next page and ends past the last page', async () => {
		reply(200, [{ id: 1 }]);
		await expect(
			call('orders.list', { per_page: 1, offset: 3 }),
		).resolves.toEqual({ items: [{ id: 1 }], next_page: null });
		reply(400, {
			code: 'woocommerce_rest_invalid_page_number',
			message:
				'The page number requested is larger than the number of pages available.',
			data: { status: 400 },
		});
		await expect(call('orders.list', { page: 9 })).resolves.toEqual({
			items: [],
			next_page: null,
		});
		// A filter value that is part of the code must not hide it.
		for (const search of ['number', 'page']) {
			reply(400, {
				code: 'woocommerce_rest_invalid_page_number',
				message:
					'The page number requested is larger than the number of pages available.',
				data: { status: 400 },
			});
			await expect(
				call('coupons.list', { search, per_page: 1, page: 2 }),
			).resolves.toEqual({ items: [], next_page: null });
		}
	});

	it('keeps an explicit null in the body', async () => {
		reply(200, { id: 3 });
		await call('coupons.update', { id: 3, date_expires: null });
		expect(JSON.parse(String(calls[0]?.body))).toEqual({ date_expires: null });
	});

	it('creates a refund as JSON with the order id in the path', async () => {
		reply(201, { id: 9, amount: '10.00' });
		await call('orders.refunds.create', {
			order_id: 1001,
			amount: '10.00',
			api_refund: false,
		});
		expect(calls[0]?.method).toBe('POST');
		expect(url().pathname).toBe('/wp-json/wc/v3/orders/1001/refunds');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			amount: '10.00',
			api_refund: false,
		});
	});

	it('sends batch bodies and parses the per-action result', async () => {
		reply(200, { create: [{ id: 3 }], delete: [{ id: 4 }] });
		const out = await call('products.batch', {
			create: [{ name: 'Mug' }],
			delete: [4],
		});
		expect(out).toEqual({ create: [{ id: 3 }], delete: [{ id: 4 }] });
		expect(url().pathname).toBe('/wp-json/wc/v3/products/batch');
	});

	it('deletes with force in the query and no body', async () => {
		reply(200, { id: 4, name: 'Mug' });
		await call('products.delete', { id: 4, force: true });
		expect(calls[0]?.method).toBe('DELETE');
		expect(url().searchParams.get('force')).toBe('true');
		expect(calls[0]?.body).toBeUndefined();
	});

	it('refuses bad input and path values before any call', async () => {
		reply(200, {});
		await expect(call('orders.get', { id: 'x' })).rejects.toThrow(
			/Invalid input for woocommerce orders\.get: id/,
		);
		expect(calls).toHaveLength(0);
		expect(() => encodeWoocommercePathValue('../x')).toThrow();
		expect(encodeWoocommercePathValue('reduced rate')).toBe('reduced%20rate');
	});
});

describe('errors', () => {
	it('keeps the status, drops sent values and the signature', async () => {
		reply(400, {
			code: 'woocommerce_rest_invalid_email',
			message: 'Invalid email address ada@private.example.',
			data: { status: 400 },
		});
		const error = (await call(
			'customers.create',
			{ email: 'ada@private.example', first_name: 'Ada' },
			ctx('http://localhost:8093'),
		).catch((e) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(400);
		expect(error.message).toBe(
			'WooCommerce 400: woocommerce_rest_invalid_email: Invalid email address [REDACTED].',
		);
		const text = JSON.stringify({
			body: error.body,
			request: error.request,
			url: error.url,
		});
		expect(text).not.toContain('ada@private');
		expect(text).not.toContain('ck_public_value');
		expect(text).not.toContain('cs_secret');
	});
});

describe('helpers', () => {
	it('normalizes the store URL', () => {
		expect(normalizeSiteUrl('https://shop.example.com/')).toBe(
			'https://shop.example.com/wp-json',
		);
		expect(() => normalizeSiteUrl('shop.example.com')).toThrow();
	});

	it("builds WooCommerce's OAuth parameter string", () => {
		// The same params through WooCommerce's own PHP (join_with_equals_sign
		// after normalize_parameters), WooCommerce 11.3.
		expect(
			oauthParamString({ b: 'a b', a: { 0: '5', 1: '6' }, c: 'x*(y)' }),
		).toBe(
			'a%255B0%255D%3D5%26a%255B1%255D%3D6%26b%3Da%2520b%26c%3Dx%252A%2528y%2529',
		);
		const signed = oauthQuery(
			'get',
			'http://shop.test/wp-json/wc/v3/orders',
			{ per_page: 5 },
			'ck_1',
			'cs_1',
			1_700_000_000_000,
			'nonce',
		);
		expect(signed).toMatchObject({
			oauth_consumer_key: 'ck_1',
			oauth_nonce: 'nonce',
			oauth_timestamp: '1700000000',
		});
		expect(signed.oauth_signature).toMatch(/^[A-Za-z0-9+/]+=*$/);
		expect(rfc3986("a b!'()*")).toBe('a%20b%21%27%28%29%2A');
	});
});
