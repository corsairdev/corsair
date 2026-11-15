import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { LogoDevContext } from './context';
import { fetchLogo } from './endpoints/image';
import { searchBrands } from './endpoints/search';

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

function context(key: string, upsert?: jest.Mock): LogoDevContext {
	return {
		key,
		db: upsert ? { brands: { upsertByEntityId: upsert } } : undefined,
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

describe('logos.fetch', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns a token-free URL and sends the key only as the token query', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue('image/png');
		const result = await fetchLogo(
			{
				key: 'pk_test',
				db: { images: { upsertByEntityId: upsert } },
			} as unknown as LogoDevContext,
			{ domain: 'shopify.com' },
		);
		expect(result).toEqual({
			url: 'https://img.logo.dev/shopify.com',
			contentType: 'image/png',
			status: 200,
		});
		expect(result.url).not.toContain('pk_test');
		expect(upsert).toHaveBeenCalledWith('shopify.com', {
			domain: 'shopify.com',
			contentType: 'image/png',
		});
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://img.logo.dev');
		expect(config?.TOKEN).toBeUndefined();
		expect(options).toMatchObject({
			method: 'GET',
			url: '/shopify.com',
			query: { token: 'pk_test' },
			responseHeader: 'content-type',
		});
	});

	it('rejects a domain that contains a slash before calling the API', async () => {
		await expect(
			fetchLogo(context('pk_test'), { domain: 'shopify.com/admin' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
