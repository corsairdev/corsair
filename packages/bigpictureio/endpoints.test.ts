import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeBigpictureioRequest } from './client';
import {
	BigpictureioEndpointInputSchemas,
	BigpictureioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type {
	BigpictureioContext,
	BigpictureioKeyBuilderContext,
} from './index';
import { bigpictureio } from './index';

type PluginEndpoints = {
	company: {
		find: (ctx: BigpictureioContext, input: unknown) => Promise<unknown>;
		stream: (ctx: BigpictureioContext, input: unknown) => Promise<unknown>;
	};
	ip: {
		find: (ctx: BigpictureioContext, input: unknown) => Promise<unknown>;
	};
};

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

function endpoints(): PluginEndpoints {
	return plugin().endpoints as unknown as PluginEndpoints;
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
		expect(instance.authConfig).toEqual({ api_key: { account: [] } });
		expect(instance.webhooks).toEqual({});
		expect(instance.pluginWebhookMatcher).toBeUndefined();
		expect(instance.oauthWebhookTenantLinkResolver).toBeUndefined();
		expect(instance.endpoints?.company.find).toEqual(expect.any(Function));
		expect(endpoints().company.stream).toEqual(expect.any(Function));
		expect(endpoints().ip.find).toEqual(expect.any(Function));
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

	it('parses Retry-After without retrying in the transport', async () => {
		await makeBigpictureioRequest('/v1/companies/find', 'bp_test_key', {
			method: 'GET',
			query: { domain: 'walmart.com' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: true,
					maxRetries: 0,
					headerNames: expect.objectContaining({
						retryAfter: 'Retry-After',
					}),
				}),
			}),
		);
	});

	it('rejects a missing api key', async () => {
		await expect(
			makeBigpictureioRequest('/v1/companies/find', ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a whitespace api key', async () => {
		await expect(
			makeBigpictureioRequest('/v1/companies/find', '   '),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('does not treat 202 as an error when the caller will wait on a webhook', async () => {
		await makeBigpictureioRequest('/v1/companies/find', 'bp_test_key', {
			method: 'GET',
			query: {
				domain: 'walmart.com',
				webhookUrl: 'https://hooks.example.com/bp',
			},
			acceptPending: true,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				errors: expect.not.objectContaining({ 202: expect.any(String) }),
			}),
			expect.anything(),
		);
	});

	it('uses the IP host for IP lookups', async () => {
		await makeBigpictureioRequest('/v2/companies/ip', 'bp_test_key', {
			method: 'GET',
			query: { ip: '204.4.143.118' },
			base: 'https://ip.bigpicture.io',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://ip.bigpicture.io',
				HEADERS: expect.objectContaining({
					Authorization: 'bp_test_key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/companies/ip',
				query: { ip: '204.4.143.118' },
			}),
			expect.anything(),
		);
	});

	it('holds the stream request open for 200 seconds', async () => {
		await makeBigpictureioRequest('/v1/companies/find/stream', 'bp_test_key', {
			method: 'GET',
			query: { domain: 'walmart.com' },
			timeoutMs: 210_000,
			acceptPending: true,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://company.bigpicture.io',
				TIMEOUT: 210_000,
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v1/companies/find/stream',
				query: { domain: 'walmart.com' },
				errors: expect.not.objectContaining({ 202: expect.any(String) }),
			}),
			expect.anything(),
		);
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

	it('forwards webhookUrl and webhookId on company find', async () => {
		await endpoints().company.find(mockCtx, {
			domain: 'walmart.com',
			webhookUrl: 'https://hooks.example.com/bp',
			webhookId: 'job-22',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v1/companies/find',
				query: {
					domain: 'walmart.com',
					webhookUrl: 'https://hooks.example.com/bp',
					webhookId: 'job-22',
				},
			}),
			expect.anything(),
		);
	});

	it('returns pending when a webhook was supplied and the body is empty', async () => {
		mockRequest.mockResolvedValue({});
		await expect(
			endpoints().company.find(mockCtx, {
				domain: 'walmart.com',
				webhookUrl: 'https://hooks.example.com/bp',
				webhookId: 'job-22',
			}),
		).resolves.toEqual({
			pending: true,
			webhookUrl: 'https://hooks.example.com/bp',
			webhookId: 'job-22',
		});
	});

	it('returns pending when a webhook was supplied and the body is missing', async () => {
		mockRequest.mockResolvedValue(undefined);
		await expect(
			endpoints().company.find(mockCtx, {
				domain: 'walmart.com',
				webhookUrl: 'https://hooks.example.com/bp',
			}),
		).resolves.toEqual({
			pending: true,
			webhookUrl: 'https://hooks.example.com/bp',
		});
	});
});

describe('bigpictureio company.stream', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue({
			name: 'Walmart',
			domain: 'walmart.com',
		});
	});

	it('GETs the stream path and waits for a company', async () => {
		const result = await endpoints().company.stream(mockCtx, {
			domain: ' walmart.com ',
		});

		expect(result).toEqual({ name: 'Walmart', domain: 'walmart.com' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				TIMEOUT: 210_000,
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v1/companies/find/stream',
				query: { domain: 'walmart.com' },
			}),
			expect.anything(),
		);
	});

	it('rejects an empty domain before calling the stream API', async () => {
		await expect(
			endpoints().company.stream(mockCtx, { domain: '  ' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('bigpictureio ip.find', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue({
			ip: '204.4.143.118',
			type: 'business',
			company: { name: 'Goldman Sachs Group', domain: 'goldmansachs.com' },
		});
	});

	it('GETs the IP host with the parsed address', async () => {
		const result = await endpoints().ip.find(mockCtx, {
			ip: ' 204.4.143.118 ',
		});

		expect(result).toEqual({
			ip: '204.4.143.118',
			type: 'business',
			company: { name: 'Goldman Sachs Group', domain: 'goldmansachs.com' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://ip.bigpicture.io',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/companies/ip',
				query: { ip: '204.4.143.118' },
			}),
			expect.anything(),
		);
	});

	it('rejects an invalid IP before calling the API', async () => {
		await expect(
			endpoints().ip.find(mockCtx, { ip: 'not-an-ip' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
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

	it('rejects a company body with no identity', () => {
		expect(() =>
			BigpictureioEndpointOutputSchemas.companyFind.parse({}),
		).toThrow();
	});

	it('rejects webhookId without webhookUrl', () => {
		expect(() =>
			BigpictureioEndpointInputSchemas.companyFind.parse({
				domain: 'uber.com',
				webhookId: 'job-22',
			}),
		).toThrow();
	});

	it('requires a real IP on ip.find', () => {
		expect(() =>
			BigpictureioEndpointInputSchemas.ipFind.parse({ ip: 'nope' }),
		).toThrow();
		expect(
			BigpictureioEndpointInputSchemas.ipFind.parse({
				ip: ' 204.4.143.118 ',
			}).ip,
		).toBe('204.4.143.118');
		expect(
			BigpictureioEndpointInputSchemas.ipFind.parse({
				ip: '2001:db8::1',
			}).ip,
		).toBe('2001:db8::1');
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
		expect(classify(httpError(402, 'Over quota'))).toBe('QUOTA_ERROR');
	});

	it('keeps DEFAULT last after option merge', () => {
		const keys = Object.keys(plugin().errorHandlers ?? {});
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});
});
