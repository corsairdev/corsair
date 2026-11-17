import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { LogoDevContext } from './context';
import { getAccount } from './endpoints/account';
import { getBrand, lookupBrand } from './endpoints/brands';
import { fetchLogo, getBrandmark } from './endpoints/logos';
import { searchBrands } from './endpoints/search';
import {
	getSubscription,
	subscribe,
	unsubscribe,
} from './endpoints/subscriptions';
import {
	createWebhookEndpoint,
	deleteWebhookEndpoint,
	getWebhookEndpoint,
	listWebhookEndpoints,
	updateWebhookEndpoint,
} from './endpoints/webhook-endpoints';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

const SEARCH_BODY = {
	data: [
		{
			object: 'search_result',
			name: 'Shopify',
			domain: 'shopify.com',
			logo_url: 'https://img.logo.dev/shopify.com?token=pk_live_secret',
		},
	],
	metadata: { request_id: 'request_1' },
};

function context(
	key: string,
	upsert?: jest.Mock,
	imageUpsert?: jest.Mock,
	saved?: Record<string, unknown>,
): LogoDevContext {
	// A partial mock context: only the fields the endpoints read are set.
	return {
		key,
		db:
			upsert || imageUpsert
				? {
						brands: {
							upsertByEntityId: upsert ?? jest.fn(),
							findByEntityId: jest
								.fn()
								.mockResolvedValue(saved ? { data: saved } : null),
						},
						images: { upsertByEntityId: imageUpsert ?? jest.fn() },
					}
				: undefined,
	} as unknown as LogoDevContext;
}

describe('brands.search', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns brands, sends a bearer secret, and strips the publishable token', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue(SEARCH_BODY);
		const result = await searchBrands(context('sk_test', upsert), {
			q: 'shopify',
			limit: 5,
			method: 'match',
		});
		expect(result.data[0]?.logo_url).toBe('https://img.logo.dev/shopify.com');
		expect(result.data[0]?.logo_url).not.toContain('token');
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://api.logo.dev');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({
			Authorization: 'Bearer sk_test',
		});
		expect(options).toMatchObject({
			method: 'GET',
			url: '/v2/search',
			query: { q: 'shopify', limit: 5, method: 'match' },
		});
		expect(upsert).toHaveBeenCalledWith('shopify.com', {
			domain: 'shopify.com',
			name: 'Shopify',
			object: 'search_result',
			logoUrl: 'https://img.logo.dev/shopify.com',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'logodev.brands.search',
			{ limit: 5 },
			'completed',
		);
		const payload = mockLog.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload).toEqual({ limit: 5 });
		expect(JSON.stringify(payload)).not.toContain('sk_test');
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('pk_live_secret');
	});

	it('rejects a limit outside 1 to 25 before calling the API', async () => {
		await expect(
			searchBrands(context('sk_test'), { q: 'shopify', limit: 0 }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a response that has no data array', async () => {
		mockRequest.mockResolvedValue({ metadata: {} });
		await expect(
			searchBrands(context('sk_test'), { q: 'shopify' }),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(
			searchBrands(context(''), { q: 'shopify' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v2/search' },
			{
				url: 'https://api.logo.dev/v2/search',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { msg: 'invalid api token. make sure to use your secret key' },
			},
			'invalid api token. make sure to use your secret key',
		);
		mockRequest.mockRejectedValue(error);
		await expect(
			searchBrands(context('sk_test'), { q: 'shopify' }),
		).rejects.toBe(error);
	});
});

const META = { request_id: 'request_1' };

const IMAGE = {
	object: 'image',
	kind: 'logo',
	brand_id: 'brand_4x0',
	status: 'ready',
	url: 'https://img.logo.dev/assets/SEALED_TOKEN',
	etag: '9f2c1e7a4b8d3f60',
	blurhash: 'LKO2?U%2Tw=w',
	source: {
		width: 512,
		height: 512,
		format: 'svg',
		has_transparency: true,
		is_vector: true,
	},
	last_updated_at: '2026-08-01T09:00:00Z',
	expires_at: '2026-09-28T13:00:00Z',
};

const BRAND = {
	object: 'brand',
	id: 'brand_4x0',
	slug: 'stripe',
	domain: 'stripe.com',
	status: 'ready',
	name: 'Stripe',
	description: 'Payments infrastructure for the internet.',
	indexed_at: '2026-09-01T12:00:00Z',
	is_profane: false,
	socials: { twitter: 'https://x.com/stripe' },
	colors: [{ r: 99, g: 91, b: 255, hex: '#635bff' }],
	logo: IMAGE,
	brandmark: null,
	social_banners: [],
};

const STILL_INDEXING = {
	data: { object: 'brand', status: 'not_indexed' },
	metadata: {
		request_id: 'request_2',
		pending: { reason: 'indexing', retry_after_seconds: 30 },
	},
};

const ENDPOINT = {
	object: 'webhook_endpoint',
	id: 'ep_2mX9',
	url: 'https://hooks.example.com/logo-dev',
	description: 'Production',
	disabled: false,
	filter_types: ['brand.updated'],
	created_at: '2026-09-21T12:00:00Z',
	updated_at: '2026-09-21T12:00:00Z',
};

function lastCall() {
	const config = mockRequest.mock.calls.at(-1)?.[0];
	const options = mockRequest.mock.calls.at(-1)?.[1];
	return { config, options };
}

describe('brands.lookup and brands.get', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('looks a brand up by domain with the secret key and saves it', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ data: BRAND, metadata: META });
		const result = await lookupBrand(context('sk_test', upsert), {
			domain: 'stripe.com',
		});
		expect(result.data.name).toBe('Stripe');
		const { config, options } = lastCall();
		expect(config?.BASE).toBe('https://api.logo.dev');
		expect(config?.HEADERS).toMatchObject({ Authorization: 'Bearer sk_test' });
		expect(options).toMatchObject({ method: 'GET', url: '/v2/brands' });
		expect(options?.query).toMatchObject({ domain: 'stripe.com' });
		expect(options?.query?.nosubscribe).toBeUndefined();
		expect(upsert).toHaveBeenCalledWith('stripe.com', {
			domain: 'stripe.com',
			name: 'Stripe',
			object: 'brand',
			brandId: 'brand_4x0',
		});
	});

	it('keeps the logo URL a search saved when a lookup saves the brand id', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ data: BRAND, metadata: META });
		await lookupBrand(
			context('sk_test', upsert, undefined, {
				domain: 'stripe.com',
				name: 'Stripe',
				object: 'search_result',
				logoUrl: 'https://img.logo.dev/stripe.com',
			}),
			{ domain: 'stripe.com' },
		);
		expect(upsert).toHaveBeenCalledWith('stripe.com', {
			domain: 'stripe.com',
			name: 'Stripe',
			object: 'brand',
			logoUrl: 'https://img.logo.dev/stripe.com',
			brandId: 'brand_4x0',
		});
	});

	it('keeps the brand id a lookup saved when a search saves the logo URL', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue(SEARCH_BODY);
		await searchBrands(
			context('sk_test', upsert, undefined, {
				domain: 'shopify.com',
				name: 'Shopify',
				brandId: 'brand_shop',
			}),
			{ q: 'shopify' },
		);
		expect(upsert).toHaveBeenCalledWith(
			'shopify.com',
			expect.objectContaining({
				brandId: 'brand_shop',
				logoUrl: 'https://img.logo.dev/shopify.com',
			}),
		);
	});

	it('sends nosubscribe=true and a ticker when asked', async () => {
		mockRequest.mockResolvedValue({ data: BRAND, metadata: META });
		await lookupBrand(context('sk_test'), {
			ticker: 'AAPL',
			noSubscribe: true,
		});
		expect(lastCall().options?.query).toMatchObject({
			ticker: 'AAPL',
			nosubscribe: 'true',
		});
	});

	it('returns the 202 still-indexing body and saves nothing', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValue(STILL_INDEXING);
		const result = await lookupBrand(context('sk_test', upsert), {
			domain: 'new-brand.example',
		});
		expect(result.data.status).toBe('not_indexed');
		expect(result.metadata.pending?.retry_after_seconds).toBe(30);
		expect(upsert).not.toHaveBeenCalled();
	});

	it('refuses zero or two identifiers before any request', async () => {
		await expect(lookupBrand(context('sk_test'), {})).rejects.toThrow(
			/exactly one/,
		);
		await expect(
			lookupBrand(context('sk_test'), { domain: 'stripe.com', name: 'Stripe' }),
		).rejects.toThrow(/exactly one/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('gets a brand by id with the id encoded in the path', async () => {
		mockRequest.mockResolvedValue({ data: BRAND, metadata: META });
		await getBrand(context('sk_test'), { id: 'brand/4x0' });
		expect(lastCall().options).toMatchObject({
			method: 'GET',
			url: '/v2/brands/brand%2F4x0',
		});
	});
});

describe('logos.fetch and logos.getBrandmark', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('gets the logo from the API and saves its metadata, not the URL', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ data: IMAGE, metadata: META });
		const result = await fetchLogo(context('sk_test', undefined, upsert), {
			domain: 'stripe.com',
		});
		expect(result.data.url).toBe('https://img.logo.dev/assets/SEALED_TOKEN');
		const { config, options } = lastCall();
		expect(config?.BASE).toBe('https://api.logo.dev');
		expect(config?.HEADERS).toMatchObject({ Authorization: 'Bearer sk_test' });
		expect(options).toMatchObject({ method: 'GET', url: '/v2/brands/logo' });
		expect(options?.query).toMatchObject({ domain: 'stripe.com' });
		expect(upsert).toHaveBeenCalledWith('stripe.com', {
			domain: 'stripe.com',
			brandId: 'brand_4x0',
			format: 'svg',
			width: 512,
			height: 512,
			etag: '9f2c1e7a4b8d3f60',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'logodev.logos.fetch',
			{},
			'completed',
		);
	});

	it('returns the logo when the image row fails to save', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('db down'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		mockRequest.mockResolvedValue({ data: IMAGE, metadata: META });
		const result = await fetchLogo(context('sk_test', undefined, upsert), {
			domain: 'stripe.com',
		});
		expect(result.data.brand_id).toBe('brand_4x0');
		expect(warn).toHaveBeenCalledWith('Failed to save Logo.dev image');
		warn.mockRestore();
	});

	it('gets the brandmark by name and does not save an image row', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValue({
			data: { ...IMAGE, kind: 'brandmark' },
			metadata: META,
		});
		const result = await getBrandmark(context('sk_test', undefined, upsert), {
			name: 'Stripe',
		});
		expect(result.data.kind).toBe('brandmark');
		expect(lastCall().options).toMatchObject({
			url: '/v2/brands/brandmark',
			query: { name: 'Stripe' },
		});
		expect(upsert).not.toHaveBeenCalled();
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(
			fetchLogo(context(''), { domain: 'stripe.com' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('account.get', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('reads the plan and credit balance', async () => {
		mockRequest.mockResolvedValue({
			data: {
				object: 'account',
				plan: 'community',
				credits: { remaining: 500, monthly_allowance: 500, purchased: 0 },
			},
			metadata: META,
		});
		const result = await getAccount(context('sk_test'), {});
		expect(result.data.credits?.remaining).toBe(500);
		expect(lastCall().options).toMatchObject({
			method: 'GET',
			url: '/v2/account',
		});
	});
});

describe('subscriptions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const SUB = {
		data: {
			object: 'subscription',
			id: 'sub_7m2',
			brand_id: 'brand_4x0',
			created_at: '2026-09-21T12:00:00Z',
		},
		metadata: META,
	};

	it('gets, subscribes with PUT and unsubscribes with DELETE', async () => {
		mockRequest.mockResolvedValue(SUB);
		await getSubscription(context('sk_test'), { brandId: 'brand_4x0' });
		expect(lastCall().options).toMatchObject({
			method: 'GET',
			url: '/v2/brands/brand_4x0/subscription',
		});
		const created = await subscribe(context('sk_test'), {
			brandId: 'brand_4x0',
		});
		expect(created.data.id).toBe('sub_7m2');
		expect(lastCall().options).toMatchObject({
			method: 'PUT',
			url: '/v2/brands/brand_4x0/subscription',
		});
		mockRequest.mockResolvedValue(undefined);
		await expect(
			unsubscribe(context('sk_test'), { brandId: 'brand_4x0' }),
		).resolves.toEqual({ brandId: 'brand_4x0', unsubscribed: true });
		expect(lastCall().options).toMatchObject({
			method: 'DELETE',
			url: '/v2/brands/brand_4x0/subscription',
		});
	});
});

describe('webhookEndpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists and gets endpoints', async () => {
		mockRequest.mockResolvedValue({ data: [ENDPOINT], metadata: META });
		const list = await listWebhookEndpoints(context('sk_test'), {});
		expect(list.data[0]?.id).toBe('ep_2mX9');
		expect(lastCall().options).toMatchObject({
			method: 'GET',
			url: '/v2/webhook_endpoints',
		});
		mockRequest.mockResolvedValue({ data: ENDPOINT, metadata: META });
		await getWebhookEndpoint(context('sk_test'), { id: 'ep_2mX9' });
		expect(lastCall().options).toMatchObject({
			url: '/v2/webhook_endpoints/ep_2mX9',
		});
	});

	it('creates an endpoint with a JSON body', async () => {
		mockRequest.mockResolvedValue({ data: ENDPOINT, metadata: META });
		await createWebhookEndpoint(context('sk_test'), {
			url: 'https://hooks.example.com/logo-dev',
			description: 'Production',
			filter_types: ['brand.updated'],
		});
		expect(lastCall().options).toMatchObject({
			method: 'POST',
			url: '/v2/webhook_endpoints',
			mediaType: 'application/json',
			body: {
				url: 'https://hooks.example.com/logo-dev',
				description: 'Production',
				filter_types: ['brand.updated'],
			},
		});
	});

	it('patches only the changed fields and keeps the id out of the body', async () => {
		mockRequest.mockResolvedValue({
			data: { ...ENDPOINT, disabled: true },
			metadata: META,
		});
		const result = await updateWebhookEndpoint(context('sk_test'), {
			id: 'ep_2mX9',
			disabled: true,
		});
		expect(result.data.disabled).toBe(true);
		expect(lastCall().options).toMatchObject({
			method: 'PATCH',
			url: '/v2/webhook_endpoints/ep_2mX9',
			body: { disabled: true },
		});
		expect(lastCall().options?.body).not.toHaveProperty('id');
	});

	it('deletes an endpoint and reports it after the 204', async () => {
		mockRequest.mockResolvedValue(undefined);
		await expect(
			deleteWebhookEndpoint(context('sk_test'), { id: 'ep_2mX9' }),
		).resolves.toEqual({ id: 'ep_2mX9', deleted: true });
		expect(lastCall().options).toMatchObject({
			method: 'DELETE',
			url: '/v2/webhook_endpoints/ep_2mX9',
		});
	});

	it('does not report a delete the API refused', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'DELETE', url: '/v2/webhook_endpoints/ep_x' },
				{
					url: 'https://api.logo.dev/v2/webhook_endpoints/ep_x',
					ok: false,
					status: 404,
					statusText: 'Not Found',
					body: { error: { code: 'resource_missing' } },
				},
				'Not Found',
			),
		);
		await expect(
			deleteWebhookEndpoint(context('sk_test'), { id: 'ep_x' }),
		).rejects.toBeInstanceOf(ApiError);
		expect(mockLog).not.toHaveBeenCalled();
	});
});
