import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeBigpictureioRequest } from './client';
import { BigpictureioEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type {
	BigpictureioContext,
	BigpictureioKeyBuilderContext,
} from './index';
import { bigpictureio } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

const mockCtx = {
	key: 'bp_test_key',
	$getAccountId: () => 'test-account-id',
	options: { key: 'bp_test_key' },
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => 'bp_test_key',
} as unknown as BigpictureioContext;

function plugin() {
	return bigpictureio({ key: 'bp_test_key' });
}

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://company.bigpicture.io/v1/companies/find' },
		{
			url: 'https://company.bigpicture.io/v1/companies/find',
			ok: false,
			status,
			statusText: 'Error',
			body: { error: message },
		},
		message,
	);
}

describe('bigpictureio plugin shape', () => {
	it('registers api key auth and no leftover oauth or example webhook', () => {
		const instance = plugin();
		expect(instance.id).toBe('bigpictureio');
		expect(instance.authConfig).toEqual({ api_key: {} });
		expect(instance.webhooks).toEqual({});
		expect(instance.pluginWebhookMatcher).toBeUndefined();
		expect(instance.oauthWebhookTenantLinkResolver).toBeUndefined();
		expect(instance.endpoints?.company.find).toEqual(expect.any(Function));
	});
});

describe('bigpictureio keyBuilder', () => {
	it('returns the configured api key for endpoint calls', async () => {
		await expect(
			(
				plugin().keyBuilder as (ctx: unknown, source: string) => Promise<string>
			)({ authType: 'api_key' }, 'endpoint'),
		).resolves.toBe('bp_test_key');
	});

	it('throws AuthMissingError when the api key is absent', async () => {
		const instance = bigpictureio();
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => null,
			},
		} as unknown as BigpictureioKeyBuilderContext;

		await expect(
			(
				instance.keyBuilder as (ctx: unknown, source: string) => Promise<string>
			)(ctx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('bigpictureio request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ name: 'Walmart', domain: 'walmart.com' });
	});

	it('sends Authorization and the domain query to company find', async () => {
		await makeBigpictureioRequest('/v1/companies/find', 'bp_test_key', {
			method: 'GET',
			query: { domain: 'walmart.com' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://company.bigpicture.io',
				HEADERS: expect.objectContaining({
					Authorization: 'bp_test_key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v1/companies/find',
				query: { domain: 'walmart.com' },
				errors: expect.objectContaining({ 202: expect.any(String) }),
			}),
			expect.anything(),
		);
	});

	it('rejects a missing api key', async () => {
		await expect(
			makeBigpictureioRequest('/v1/companies/find', ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows ApiError', async () => {
		const err = httpError(401, 'Unauthorized');
		mockRequest.mockRejectedValue(err);
		await expect(
			makeBigpictureioRequest('/v1/companies/find', 'bp_test_key'),
		).rejects.toBe(err);
	});
});

describe('bigpictureio company.find', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue({
			name: 'Walmart',
			domain: 'walmart.com',
		});
	});

	it('GETs company find with the parsed domain', async () => {
		const result = await plugin().endpoints?.company.find(mockCtx, {
			domain: ' walmart.com ',
		});

		expect(result).toEqual({ name: 'Walmart', domain: 'walmart.com' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v1/companies/find',
				query: { domain: 'walmart.com' },
			}),
			expect.anything(),
		);
	});

	it('rejects an empty domain before calling the API', async () => {
		await expect(
			plugin().endpoints?.company.find(mockCtx, { domain: '  ' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws when the lookup is still processing', async () => {
		mockRequest.mockRejectedValue(
			httpError(202, 'Company lookup is still processing'),
		);
		await expect(
			plugin().endpoints?.company.find(mockCtx, { domain: 'walmart.com' }),
		).rejects.toBeInstanceOf(ApiError);
	});
});

describe('bigpictureio schemas', () => {
	it('requires a non-empty domain', () => {
		expect(() =>
			BigpictureioEndpointInputSchemas.companyFind.parse({}),
		).toThrow();
		expect(
			BigpictureioEndpointInputSchemas.companyFind.parse({
				domain: ' uber.com ',
			}).domain,
		).toBe('uber.com');
	});
});

describe('bigpictureio error classification', () => {
	it('classifies documented status codes', () => {
		expect(classify(httpError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(classify(httpError(403, 'Forbidden'))).toBe('PERMISSION_ERROR');
		expect(classify(httpError(404, 'Not Found'))).toBe('NOT_FOUND_ERROR');
		expect(classify(httpError(400, 'Bad Request'))).toBe('VALIDATION_ERROR');
		expect(classify(httpError(429, 'Too Many Requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(httpError(500, 'Server Error'))).toBe('SERVER_ERROR');
		expect(classify(httpError(202, 'Accepted'))).toBe('LOOKUP_PENDING');
	});

	it('keeps DEFAULT last after option merge', () => {
		const keys = Object.keys(plugin().errorHandlers ?? {});
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});
});
