import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { AeroleadsAPIError, makeAeroleadsRequest } from './client';
import { GetLinkedinDetailsInputSchema } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { AeroleadsContext, AeroleadsKeyBuilderContext } from './index';
import { aeroleads, aeroleadsEndpointSchemas } from './index';

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

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'test-api-key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => 'test-api-key',
} as unknown as AeroleadsContext;

const profile = {
	full_name: 'Ayushi Mathur',
	linkedin_url: 'https://www.linkedin.com/in/ayushi-mathur-061b9010b/',
	job_title: 'Software Engineer',
	emails: 'test@example.com',
};

type LinkedinDetailsGet = (
	ctx: AeroleadsContext,
	input: { linkedin_url: string },
) => Promise<unknown>;

function getLinkedinDetails(): LinkedinDetailsGet {
	const plugin = aeroleads({ key: 'test-api-key' });
	const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints> & {
		linkedinDetails: { get: LinkedinDetailsGet };
	};
	return endpoints.linkedinDetails.get;
}

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://aeroleads.com/api/get_linkedin_details' },
		{
			url: 'https://aeroleads.com/api/get_linkedin_details',
			ok: false,
			status,
			statusText: 'Error',
			body: { message },
		},
		message,
	);
}

describe('Aeroleads plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = aeroleads();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(1);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(1);
		expect(Object.keys(aeroleadsEndpointSchemas)).toHaveLength(1);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(aeroleadsEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(typeof plugin.pluginWebhookMatcher).toBe('function');
	});

	it('supports api key auth configuration', () => {
		const plugin = aeroleads();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
	});
});

describe('Aeroleads request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(profile);
	});

	it('adds API key to config TOKEN and request query', async () => {
		await makeAeroleadsRequest('/api/get_linkedin_details', 'test-api-key', {
			method: 'GET',
			query: { linkedin_url: 'https://linkedin.com/in/test' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://aeroleads.com',
				TOKEN: 'test-api-key',
				HEADERS: expect.objectContaining({
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/get_linkedin_details',
				query: {
					api_key: 'test-api-key',
					linkedin_url: 'https://linkedin.com/in/test',
				},
			}),
		);
	});

	it('throws on a 200 body with an error status', async () => {
		mockRequest.mockResolvedValue({
			message: 'User not Found, Please Pass Valid Api Key',
			status: 400,
		});

		await expect(
			makeAeroleadsRequest('/api/get_linkedin_details', 'test-api-key', {
				query: { linkedin_url: 'https://linkedin.com/in/test' },
			}),
		).rejects.toBeInstanceOf(AeroleadsAPIError);
	});

	it('throws on a 200 body that only asks for an API key', async () => {
		mockRequest.mockResolvedValue({
			message: 'Pass your Api Key also as params',
			status: 400,
		});

		await expect(
			makeAeroleadsRequest('/api/get_linkedin_details', 'test-api-key'),
		).rejects.toThrow(/api key/i);
	});

	it('throws on an empty 200 body', async () => {
		mockRequest.mockResolvedValue({});

		await expect(
			makeAeroleadsRequest('/api/get_linkedin_details', 'test-api-key', {
				query: { linkedin_url: 'https://linkedin.com/in/test' },
			}),
		).rejects.toBeInstanceOf(AeroleadsAPIError);
	});

	it('returns a profile payload unchanged', async () => {
		await expect(
			makeAeroleadsRequest('/api/get_linkedin_details', 'test-api-key', {
				query: { linkedin_url: 'https://linkedin.com/in/test' },
			}),
		).resolves.toEqual(profile);
	});

	it('accepts a profile that only has documented job fields', async () => {
		const sparse = { job_title_role: 'Engineer', city: 'Bengaluru' };
		mockRequest.mockResolvedValue(sparse);

		await expect(
			makeAeroleadsRequest('/api/get_linkedin_details', 'test-api-key', {
				query: { linkedin_url: 'https://linkedin.com/in/test' },
			}),
		).resolves.toEqual(sparse);
	});
});

describe('Aeroleads endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(profile);
	});

	it('maps representative operations to API routes', async () => {
		await getLinkedinDetails()(mockCtx, {
			linkedin_url: 'https://linkedin.com/in/test',
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'GET',
					url: '/api/get_linkedin_details',
					query: {
						api_key: 'test-api-key',
						linkedin_url: 'https://linkedin.com/in/test',
					},
				}),
			]),
		);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'aeroleads.linkedinDetails.get',
			{ linkedin_url: 'https://linkedin.com/in/test' },
			'completed',
		);
	});

	it('does not log completed when Aeroleads returns an error envelope', async () => {
		mockRequest.mockResolvedValue({
			message: 'User not Found, Please Pass Valid Api Key',
			status: 400,
		});

		await expect(
			getLinkedinDetails()(mockCtx, {
				linkedin_url: 'https://linkedin.com/in/test',
			}),
		).rejects.toBeInstanceOf(AeroleadsAPIError);
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('caches linkedin details by profile URL', async () => {
		const linkedinDetails = {
			upsertByEntityId: jest.fn().mockResolvedValue(undefined),
		};
		const ctx = {
			...mockCtx,
			db: { linkedinDetails },
		} as unknown as AeroleadsContext;

		await getLinkedinDetails()(ctx, {
			linkedin_url: 'https://linkedin.com/in/test',
		});

		expect(linkedinDetails.upsertByEntityId).toHaveBeenCalledWith(
			'https://linkedin.com/in/test',
			expect.objectContaining({
				full_name: 'Ayushi Mathur',
				linkedin_url: profile.linkedin_url,
			}),
		);
	});

	it('cache write failures do not fail the API call', async () => {
		const linkedinDetails = {
			upsertByEntityId: jest.fn().mockRejectedValue(new Error('db down')),
		};
		const ctx = {
			...mockCtx,
			db: { linkedinDetails },
		} as unknown as AeroleadsContext;

		await expect(
			getLinkedinDetails()(ctx, {
				linkedin_url: 'https://linkedin.com/in/test',
			}),
		).resolves.toMatchObject({ full_name: 'Ayushi Mathur' });
	});

	it('rejects a company page URL before calling Aeroleads', async () => {
		await expect(
			getLinkedinDetails()(mockCtx, {
				linkedin_url: 'https://www.linkedin.com/company/microsoft',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('linkedin_url input', () => {
	it('accepts public profile URLs', () => {
		expect(() =>
			GetLinkedinDetailsInputSchema.parse({
				linkedin_url: 'https://www.linkedin.com/in/satyanadella',
			}),
		).not.toThrow();
		expect(() =>
			GetLinkedinDetailsInputSchema.parse({
				linkedin_url: 'https://uk.linkedin.com/in/example/',
			}),
		).not.toThrow();
	});

	it('rejects company pages and lookalike hosts', () => {
		expect(() =>
			GetLinkedinDetailsInputSchema.parse({
				linkedin_url: 'https://www.linkedin.com/company/microsoft',
			}),
		).toThrow();
		expect(() =>
			GetLinkedinDetailsInputSchema.parse({
				linkedin_url: 'https://evil.com/linkedin.com/in/test',
			}),
		).toThrow();
		expect(() =>
			GetLinkedinDetailsInputSchema.parse({
				linkedin_url: 'https://linkedin.com.evil.com/in/test',
			}),
		).toThrow();
	});
});

describe('error handler classification', () => {
	it('treats a 200 invalid-key envelope as auth, not success', () => {
		expect(
			classify(
				new AeroleadsAPIError('User not Found, Please Pass Valid Api Key'),
			),
		).toBe('AUTH_ERROR');
		expect(
			classify(new AeroleadsAPIError('Pass your Api Key also as params')),
		).toBe('AUTH_ERROR');
	});

	it('treats a missing LinkedIn URL envelope as a bad request', () => {
		expect(
			classify(new AeroleadsAPIError('Pass Linkedin Url also as params')),
		).toBe('BAD_REQUEST_ERROR');
	});

	it('does not retry auth, credit, or empty-profile failures', async () => {
		const auth = await errorHandlers.AUTH_ERROR.handler();
		const credit = await errorHandlers.CREDIT_LIMIT_ERROR.handler();

		expect(classify(httpError(401, 'Wrong API key'))).toBe('AUTH_ERROR');
		expect(classify(httpError(402, 'Credit Limit Reached'))).toBe(
			'CREDIT_LIMIT_ERROR',
		);
		expect(
			classify(new AeroleadsAPIError('Aeroleads returned no profile details')),
		).toBe('NOT_FOUND_ERROR');
		expect(auth.maxRetries).toBe(0);
		expect(credit.maxRetries).toBe(0);
	});

	it('does not stack handler retries on transport 429 retries', async () => {
		const rateLimit = await errorHandlers.RATE_LIMIT_ERROR.handler();
		expect(classify(httpError(429, 'too many requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(rateLimit.maxRetries).toBe(0);
	});
});

describe('aeroleads keyBuilder authentication', () => {
	const plugin = aeroleads();

	it('returns options.key for endpoint source', async () => {
		const withOptionsKey = aeroleads({ key: 'test-api-key' });
		const out = await (withOptionsKey.keyBuilder as any)(
			{ authType: 'api_key' } as unknown as AeroleadsKeyBuilderContext,
			'endpoint',
		);
		expect(out).toBe('test-api-key');
	});

	it('throws AuthMissingError when api key is absent', async () => {
		const noKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as AeroleadsKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as any)(noKeyCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('reads api key from key manager', async () => {
		const withKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => 'test-api-key' },
		} as unknown as AeroleadsKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as any)(withKeyCtx, 'endpoint'),
		).resolves.toBe('test-api-key');
	});
});
