import { ApiError } from 'corsair/http';
import {
	makeShopifyGraphqlRequest,
	normaliseShopDomain,
	SHOPIFY_API_VERSION,
	ShopifyAPIError,
	throttleDelayMs,
} from './client';
import { authFailureBody, throttledBody } from './test-fixtures';
import { ACCESS_TOKEN, createHarness, SHOP_DOMAIN } from './test-helpers';

const harness = createHarness();

beforeEach(() => {
	harness.mockFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('normaliseShopDomain', () => {
	it('expands a bare handle to a myshopify host', () => {
		expect(normaliseShopDomain('my-store')).toBe('my-store.myshopify.com');
	});

	it('strips a scheme and any path from a pasted admin URL', () => {
		expect(
			normaliseShopDomain('https://My-Store.myshopify.com/admin/api/2026-10'),
		).toBe('my-store.myshopify.com');
	});

	it('rejects an empty domain', () => {
		expect(() => normaliseShopDomain('  ')).toThrow(ShopifyAPIError);
	});
});

describe('makeShopifyGraphqlRequest', () => {
	it('posts to the versioned admin endpoint on the shop host', async () => {
		harness.respond({ data: { shop: { name: 'Test' } } });

		await makeShopifyGraphqlRequest({
			shopDomain: SHOP_DOMAIN,
			accessToken: ACCESS_TOKEN,
			query: '{ shop { name } }',
			replaySafe: true,
		});

		const sent = harness.lastRequest();
		expect(sent.origin).toBe(`https://${SHOP_DOMAIN}`);
		expect(sent.path).toBe(`/admin/api/${SHOPIFY_API_VERSION}/graphql.json`);
		expect(sent.method).toBe('POST');
	});

	it('sends the token as X-Shopify-Access-Token and never as Bearer', async () => {
		harness.respond({ data: { shop: { name: 'Test' } } });

		await makeShopifyGraphqlRequest({
			shopDomain: SHOP_DOMAIN,
			accessToken: ACCESS_TOKEN,
			query: '{ shop { name } }',
		});

		harness.expectAuthenticated();
		expect(harness.lastRequest().headers.get('authorization')).toBeNull();
	});

	it('sends the query and variables as the JSON body', async () => {
		harness.respond({ data: { ok: true } });

		await makeShopifyGraphqlRequest({
			shopDomain: SHOP_DOMAIN,
			accessToken: ACCESS_TOKEN,
			query: 'query Get($id: ID!) { node(id: $id) { id } }',
			variables: { id: 'gid://shopify/Product/1' },
		});

		expect(harness.lastRequest().body).toEqual({
			query: 'query Get($id: ID!) { node(id: $id) { id } }',
			variables: { id: 'gid://shopify/Product/1' },
		});
	});

	it('omits the variables key when there are none', async () => {
		harness.respond({ data: { ok: true } });

		await makeShopifyGraphqlRequest({
			shopDomain: SHOP_DOMAIN,
			accessToken: ACCESS_TOKEN,
			query: '{ shop { name } }',
		});

		expect(harness.lastRequest().body).toEqual({ query: '{ shop { name } }' });
	});

	it('returns the cost points left after the call', async () => {
		harness.respond({
			data: { shop: { name: 'Test' } },
			extensions: {
				cost: { throttleStatus: { currentlyAvailable: 997 } },
			},
		});

		const result = await makeShopifyGraphqlRequest<{ shop: { name: string } }>({
			shopDomain: SHOP_DOMAIN,
			accessToken: ACCESS_TOKEN,
			query: '{ shop { name } }',
		});

		expect(result.data.shop.name).toBe('Test');
		expect(result.currentlyAvailable).toBe(997);
	});

	// The failure that matters most: an auth error is a bare string, not the
	// array every other error uses, so a handler that only reads arrays would
	// treat it as success and hand back undefined data.
	it('turns a string `errors` body into an auth error', async () => {
		harness.respond(authFailureBody);

		const error = await harness.expectRejection<ShopifyAPIError>(
			makeShopifyGraphqlRequest({
				shopDomain: SHOP_DOMAIN,
				accessToken: ACCESS_TOKEN,
				query: '{ shop { name } }',
			}),
		);

		expect(error).toBeInstanceOf(ShopifyAPIError);
		expect(error.message).toContain('Invalid API key');
	});

	// Throttling arrives as HTTP 200, so `status` is set to 429 by the client.
	// Without that the handler would never match and the call would fail.
	it('reports a THROTTLED body as a rate-limit error with the wait', async () => {
		harness.respond(throttledBody);

		const error = await harness.expectRejection<ShopifyAPIError>(
			makeShopifyGraphqlRequest({
				shopDomain: SHOP_DOMAIN,
				accessToken: ACCESS_TOKEN,
				query: '{ shop { name } }',
			}),
		);

		expect(error.code).toBe('THROTTLED');
		expect(error.status).toBe(429);
		// 100 requested, 50 still in the bucket, at 50/s: one second.
		expect(error.retryAfter).toBe(1000);
		// A throttled request never ran, so replaying it cannot double a write.
		expect(error.replaySafe).toBe(true);
	});

	it('reports an HTTP error status as a typed error', async () => {
		harness.respond({ error: 'nope' }, 500);

		const error = await harness.expectRejection<ShopifyAPIError>(
			makeShopifyGraphqlRequest({
				shopDomain: SHOP_DOMAIN,
				accessToken: ACCESS_TOKEN,
				query: '{ shop { name } }',
			}),
		);

		// Wrapped, not raw: the cause is dropped so a request body echoed by
		// Shopify cannot print the token through console.error.
		expect(error).toBeInstanceOf(ShopifyAPIError);
		expect(error).not.toBeInstanceOf(ApiError);
		expect(error.status).toBe(500);
	});

	it('marks a 5xx on a write as unsafe to replay', async () => {
		harness.respond({ error: 'boom' }, 502);

		const error = await harness.expectRejection<ShopifyAPIError>(
			makeShopifyGraphqlRequest({
				shopDomain: SHOP_DOMAIN,
				accessToken: ACCESS_TOKEN,
				query: 'mutation { x }',
				replaySafe: false,
			}),
		);

		expect(error.replaySafe).toBe(false);
	});

	it('treats a transport failure as replay-safe, because nothing was sent', async () => {
		harness.fetchMock.mockRejectedValueOnce(new Error('socket hang up'));

		const error = await harness.expectRejection<ShopifyAPIError>(
			makeShopifyGraphqlRequest({
				shopDomain: SHOP_DOMAIN,
				accessToken: ACCESS_TOKEN,
				query: 'mutation { x }',
			}),
		);

		expect(error.transportFailure).toBe(true);
		expect(error.replaySafe).toBe(true);
	});

	it('fails loudly when a response carries neither data nor errors', async () => {
		harness.respond({ data: null });

		const error = await harness.expectRejection<ShopifyAPIError>(
			makeShopifyGraphqlRequest({
				shopDomain: SHOP_DOMAIN,
				accessToken: ACCESS_TOKEN,
				query: '{ shop { name } }',
			}),
		);

		expect(error.message).toContain('no data and no errors');
	});

	it('does not leak the token into the error message', async () => {
		harness.respond(authFailureBody);

		const error = await harness.expectRejection<ShopifyAPIError>(
			makeShopifyGraphqlRequest({
				shopDomain: SHOP_DOMAIN,
				accessToken: ACCESS_TOKEN,
				query: '{ shop { name } }',
			}),
		);

		expect(error.message).not.toContain(ACCESS_TOKEN);
		expect(require('node:util').inspect(error)).not.toContain(ACCESS_TOKEN);
	});
});

describe('throttleDelayMs', () => {
	it('waits long enough to refill just the requested cost', () => {
		// 100 points needed, nothing left, at 50/s: two seconds.
		expect(
			throttleDelayMs(
				{ maximumAvailable: 1000, currentlyAvailable: 0, restoreRate: 50 },
				100,
			),
		).toBe(2000);
	});

	it('subtracts the points still in the bucket', () => {
		// 100 needed, 50 left, at 50/s: one second, not a full refill.
		expect(
			throttleDelayMs(
				{ maximumAvailable: 1000, currentlyAvailable: 50, restoreRate: 50 },
				100,
			),
		).toBe(1000);
	});

	it('returns undefined without a restore rate, so the handler falls back', () => {
		expect(throttleDelayMs({ currentlyAvailable: 0 }, 100)).toBeUndefined();
	});
});
