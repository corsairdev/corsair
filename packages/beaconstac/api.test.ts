import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import {
	BeaconstacAPIError,
	BeaconstacRateLimitError,
	makeBeaconstacRequest,
} from './client';
import {
	analyticsPeriodOverview,
	analyticsProductOverview,
	bulkQrcodesList,
	organizationsList,
	placesCreate,
	placesList,
	placesUpdate,
	qrcodesDelete,
	qrcodesGet,
	qrcodesUpdate,
	qrTemplatesCreate,
	qrTemplatesDelete,
	qrTemplatesList,
	tagsCreate,
	tagsDelete,
	tagsList,
	tagsUpdate,
	usersCreate,
	usersGet,
	usersList,
	usersUpdate,
} from './endpoints/handlers';
import { BeaconstacEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { beaconstac } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

beforeEach(() => {
	mockRequest.mockReset();
	jest.mocked(logEventFromContext).mockReset();
	mockRequest.mockResolvedValue({ id: 1 } as never);
});

const ctx = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account',
} as never;

describe('Beaconstac plugin', () => {
	it('registers api_key auth and 21 endpoints', () => {
		const plugin = beaconstac();
		expect(plugin.id).toBe('beaconstac');
		expect(plugin.authConfig?.api_key?.account).toEqual(['organization_id']);
		expect(plugin.authConfig).not.toHaveProperty('oauth_2');
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(21);
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = beaconstac({ key: 'explicit-key' });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('explicit-key');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const plugin = beaconstac();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('client auth and errors', () => {
	it('sends Authorization Token and the Uniqode host', async () => {
		await makeBeaconstacRequest('/api/2.0/organizations/', 'tok');
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config?.BASE).toBe('https://api.uniqode.com');
		expect(config?.HEADERS).toMatchObject({
			Authorization: 'Token tok',
		});
		expect(config?.TOKEN).toBeUndefined();
		expect(options?.url).toBe('/api/2.0/organizations/');
	});

	it('preserves 429 retry metadata', async () => {
		const { ApiError } = jest.requireActual(
			'corsair/http',
		) as typeof import('corsair/http');
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/x' },
				{
					url: '/x',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: undefined,
				},
				'Too Many Requests',
				{ retryAfter: 1500 },
			),
		);
		const err = await makeBeaconstacRequest('/x', 'tok').catch((e) => e);
		expect(err).toBeInstanceOf(BeaconstacRateLimitError);
		expect((err as BeaconstacRateLimitError).retryAfterMs).toBe(1500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as Error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(err as Error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 1500 });
	});

	it('wraps other API failures without dropping status', async () => {
		const { ApiError } = jest.requireActual(
			'corsair/http',
		) as typeof import('corsair/http');
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/x' },
				{
					url: '/x',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: undefined,
				},
				'Unauthorized',
			),
		);
		const err = await makeBeaconstacRequest('/x', 'tok').catch((e) => e);
		expect(err).toBeInstanceOf(BeaconstacAPIError);
		expect((err as BeaconstacAPIError).status).toBe(401);
	});

	it('does not invent a deleted result for an empty GET', async () => {
		mockRequest.mockResolvedValueOnce(undefined as never);
		await expect(
			makeBeaconstacRequest('/api/2.0/qrcodes/1/', 'tok'),
		).resolves.toBeUndefined();
	});

	it('does not invent a deleted result for an empty PUT', async () => {
		mockRequest.mockResolvedValueOnce(undefined as never);
		await expect(
			makeBeaconstacRequest('/api/2.0/places/1/', 'tok', {
				method: 'PUT',
				body: { name: 'HQ' },
			}),
		).resolves.toBeUndefined();
	});

	it('synthesizes deleted:true only for an empty DELETE', async () => {
		mockRequest.mockResolvedValueOnce(undefined as never);
		await expect(
			makeBeaconstacRequest('/api/2.0/qrcodes/1/', 'tok', {
				method: 'DELETE',
			}),
		).resolves.toEqual({ deleted: true });
	});

	it('rejects an empty GET at the retrieve endpoint', async () => {
		mockRequest.mockResolvedValueOnce(undefined as never);
		await expect(qrcodesGet(ctx, { id: 11 })).rejects.toThrow(
			BeaconstacAPIError,
		);
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
});

describe('official Uniqode request mapping', () => {
	it.each([
		[
			'places.create',
			'POST',
			'/api/2.0/places/',
			() =>
				placesCreate(ctx, {
					name: 'HQ',
					address: '1 Main',
					latitude: 1,
					longitude: 2,
					organization: 9,
				}),
			{ body: expect.objectContaining({ name: 'HQ', organization: 9 }) },
		],
		[
			'places.list',
			'GET',
			'/api/2.0/places/',
			() => placesList(ctx, { page: 1, page_size: 10, search: 'hq' }),
			{ query: expect.objectContaining({ page: 1, search: 'hq' }) },
		],
		[
			'places.update',
			'PUT',
			'/api/2.0/places/3/',
			() => placesUpdate(ctx, { place_id: 3, name: 'HQ', organization: 9 }),
			{ body: { name: 'HQ', organization: 9 } },
		],
		[
			'qrTemplates.create',
			'POST',
			'/api/2.0/qrtemplates/',
			() => qrTemplatesCreate(ctx, { name: 'Brand', organization: 9 }),
			{ body: expect.objectContaining({ name: 'Brand' }) },
		],
		[
			'qrTemplates.list',
			'GET',
			'/api/2.0/qrtemplates/',
			() => qrTemplatesList(ctx, { organization: 9, page: 1 }),
			{ query: expect.objectContaining({ organization: 9 }) },
		],
		[
			'qrTemplates.delete',
			'DELETE',
			'/api/2.0/qrtemplates/4/',
			() => qrTemplatesDelete(ctx, { id: 4 }),
			{},
		],
		[
			'tags.create',
			'POST',
			'/api/2.0/tags/',
			() => tagsCreate(ctx, { name: 'campaign', organization: 9 }),
			{ body: expect.objectContaining({ name: 'campaign' }) },
		],
		[
			'tags.list',
			'GET',
			'/api/2.0/tags/',
			() => tagsList(ctx, { page: 2, name__icontains: 'c' }),
			{ query: expect.objectContaining({ page: 2 }) },
		],
		[
			'tags.update',
			'PUT',
			'/api/2.0/tags/5/',
			() => tagsUpdate(ctx, { tag_id: 5, color: '#ff0000' }),
			{ body: { color: '#ff0000' } },
		],
		[
			'tags.delete',
			'DELETE',
			'/api/2.0/tags/5/',
			() => tagsDelete(ctx, { tag_id: 5 }),
			{},
		],
		[
			'users.create',
			'POST',
			'/api/2.0/users/add/',
			() => usersCreate(ctx, { username: 'ada', organization: 9 }),
			{ body: expect.objectContaining({ username: 'ada' }) },
		],
		[
			'users.list',
			'GET',
			'/api/2.0/users/',
			() => usersList(ctx, { organization: 9, page_size: 20 }),
			{ query: expect.objectContaining({ organization: 9 }) },
		],
		[
			'users.get',
			'GET',
			'/api/2.0/users/8/',
			() => usersGet(ctx, { id: 8 }),
			{},
		],
		[
			'users.update',
			'PUT',
			'/api/2.0/users/8/',
			() => usersUpdate(ctx, { user_id: 8, first_name: 'Ada' }),
			{ body: { first_name: 'Ada' } },
		],
		[
			'qrcodes.get',
			'GET',
			'/api/2.0/qrcodes/11/',
			() => qrcodesGet(ctx, { id: 11 }),
			{},
		],
		[
			'qrcodes.update',
			'PUT',
			'/api/2.0/qrcodes/11/',
			() => qrcodesUpdate(ctx, { qrcode_id: 11, name: 'Updated' }),
			{ body: { name: 'Updated' } },
		],
		[
			'qrcodes.delete',
			'DELETE',
			'/api/2.0/qrcodes/11/',
			() => qrcodesDelete(ctx, { id: 11 }),
			{},
		],
		[
			'bulkQrcodes.list',
			'GET',
			'/api/2.0/bulkqrcodes/',
			() => bulkQrcodesList(ctx, { page: 1, ordering: '-created' }),
			{ query: expect.objectContaining({ ordering: '-created' }) },
		],
		[
			'organizations.list',
			'GET',
			'/api/2.0/organizations/',
			() => organizationsList(ctx, { page: 1, page_size: 50 }),
			{ query: expect.objectContaining({ page_size: 50 }) },
		],
		[
			'analytics.periodOverview',
			'POST',
			'/reporting/2.0/',
			() =>
				analyticsPeriodOverview(ctx, {
					organization: 9,
					product_type: 'qr',
					from_timestamp: 1,
					to_timestamp: 2,
				}),
			{
				query: {
					organization: 9,
					method: 'Products.getPeriodOverview',
				},
				body: { product_type: 'qr', from: '1', to: '2' },
			},
		],
		[
			'analytics.productOverview',
			'POST',
			'/reporting/2.0/',
			() =>
				analyticsProductOverview(ctx, {
					organization: 9,
					product_type: 'nfc',
					from_timestamp: 1,
					to_timestamp: 2,
				}),
			{
				query: {
					organization: 9,
					method: 'Products.getOverview',
				},
				body: { product_type: 'nfc', from: '1', to: '2' },
			},
		],
	] as const)('%s maps to %s %s', async (_name, method, url, invoke, extra) => {
		await invoke();
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).toMatchObject({
			Authorization: 'Token test-api-key',
		});
		expect(options?.method).toBe(method);
		expect(options?.url).toBe(url);
		if ('body' in extra) {
			expect(options?.body).toEqual(extra.body);
		}
		if ('query' in extra) {
			expect(options?.query).toEqual(extra.query);
		}
		expect(logEventFromContext).toHaveBeenCalled();
	});

	it('validates list pagination inputs', () => {
		expect(() =>
			BeaconstacEndpointInputSchemas.placesList.parse({
				page: 1,
				page_size: 10,
			}),
		).not.toThrow();
		expect(() =>
			BeaconstacEndpointInputSchemas.placesList.parse({ page_size: 0 }),
		).toThrow();
	});
});
