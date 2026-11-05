import { ApiError } from 'corsair/http';
import { makeAccredibleCertificatesRequest } from './client';
import { GetCredential } from './endpoints';
import {
	AccredibleCertificatesEndpointInputSchemas,
	AccredibleCertificatesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { AccredibleCertificatesContext } from './index';
import { accrediblecertificates } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeAccredibleCertificatesRequest: jest.fn(),
	};
});

const mockRequest = makeAccredibleCertificatesRequest as jest.MockedFunction<
	typeof makeAccredibleCertificatesRequest
>;

/**
 * Minimal plugin context for endpoint handler tests.
 *
 * `$getAccountId` and `database` are what `logEventFromContext` reads; without
 * them every endpoint call logs a warning and the real event path goes
 * untested.
 */
function testCtx(
	key: string,
	db?: Record<string, unknown>,
): AccredibleCertificatesContext {
	return {
		key,
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as AccredibleCertificatesContext;
}

/** A credential shaped like the official spec's example response. */
const sampleCredential = {
	id: '10000005',
	name: 'Advanced Widgetry',
	description: 'Completed the course',
	group_name: 'Widgetry 101',
	group_id: 42,
	issued_on: '2016-03-15',
	complete: true,
	private: false,
	url: 'https://www.credential.net/10000005',
	encoded_id: 'abc123',
	recipient: { id: '7', name: 'Ada Lovelace', email: 'ada@example.com' },
	issuer: { id: 3, name: 'Widget Corp', url: 'https://example.com' },
};

beforeEach(() => {
	mockRequest.mockClear();
});

describe('AccredibleCertificates credential schema', () => {
	it('parses the documented response shape', () => {
		const parsed =
			AccredibleCertificatesEndpointOutputSchemas.getCredential.safeParse({
				credential: sampleCredential,
			});
		expect(parsed.success).toBe(true);
	});

	it('keeps undeclared fields rather than rejecting them', () => {
		const parsed =
			AccredibleCertificatesEndpointOutputSchemas.getCredential.parse({
				credential: { ...sampleCredential, a_new_field: 'x' },
			});
		expect((parsed.credential as Record<string, unknown>).a_new_field).toBe(
			'x',
		);
	});

	it('rejects a response with no credential object', () => {
		const parsed =
			AccredibleCertificatesEndpointOutputSchemas.getCredential.safeParse({});
		expect(parsed.success).toBe(false);
	});

	it('rejects a blank credential id at the input schema', () => {
		expect(
			AccredibleCertificatesEndpointInputSchemas.getCredential.safeParse({
				id: '   ',
			}).success,
		).toBe(false);
	});

	it('accepts a numeric credential id', () => {
		expect(
			AccredibleCertificatesEndpointInputSchemas.getCredential.safeParse({
				id: 10000005,
			}).success,
		).toBe(true);
	});
});

describe('AccredibleCertificates getCredential', () => {
	it('requests the documented path and validates the response', async () => {
		mockRequest.mockResolvedValue({ credential: sampleCredential });

		await GetCredential.get(testCtx('test_key'), { id: '10000005' });

		expect(mockRequest).toHaveBeenCalledWith(
			'credentials/10000005',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				schema: AccredibleCertificatesEndpointOutputSchemas.getCredential,
			}),
		);
	});

	it('encodes an id that would otherwise escape the resource', async () => {
		mockRequest.mockResolvedValue({ credential: sampleCredential });

		await GetCredential.get(testCtx('test_key'), {
			id: '../issuer/details',
		});

		const path = mockRequest.mock.calls[0]?.[0];
		expect(path).toBe('credentials/..%2Fissuer%2Fdetails');
		expect(path).not.toContain('/issuer/details');
	});

	it('encodes an id that would otherwise inject a query string', async () => {
		mockRequest.mockResolvedValue({ credential: sampleCredential });

		await GetCredential.get(testCtx('test_key'), { id: 'a?x=1' });

		expect(mockRequest.mock.calls[0]?.[0]).toBe('credentials/a%3Fx%3D1');
	});

	it('rejects a blank id without calling the API', async () => {
		await expect(
			GetCredential.get(testCtx('test_key'), { id: '   ' }),
		).rejects.toThrow(/credential id is required/i);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('accepts a numeric id', async () => {
		mockRequest.mockResolvedValue({ credential: sampleCredential });

		await GetCredential.get(testCtx('test_key'), { id: 10000005 });

		expect(mockRequest.mock.calls[0]?.[0]).toBe('credentials/10000005');
	});

	it('mirrors the credential into the cache', async () => {
		const rows = new Map<string, unknown>();
		const ctx = testCtx('test_key', {
			credentials: {
				upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
					rows.set(id, data);
				}),
			},
		});
		mockRequest.mockResolvedValue({ credential: sampleCredential });

		await GetCredential.get(ctx, { id: '10000005' });

		expect(rows.get('10000005')).toMatchObject({
			id: '10000005',
			group_name: 'Widgetry 101',
			// Nested identity is flattened into the cache row.
			recipient_email: 'ada@example.com',
			issuer_name: 'Widget Corp',
		});
	});

	it('never fails the call when the cache write throws', async () => {
		const ctx = testCtx('test_key', {
			credentials: {
				upsertByEntityId: jest.fn(async () => {
					throw new Error('store unavailable');
				}),
			},
		});
		mockRequest.mockResolvedValue({ credential: sampleCredential });
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		await expect(
			GetCredential.get(ctx, { id: '10000005' }),
		).resolves.toBeDefined();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('works with no entity store configured', async () => {
		mockRequest.mockResolvedValue({ credential: sampleCredential });
		await expect(
			GetCredential.get(testCtx('test_key'), { id: '10000005' }),
		).resolves.toBeDefined();
	});
});

describe('AccredibleCertificates error handlers', () => {
	/** Builds an ApiError the way the transport does. */
	function apiError(status: number, message: string) {
		return new ApiError(
			{} as never,
			{ url: '', status, statusText: '', body: {} } as never,
			message,
		);
	}

	it.each([
		[429, 'RATE_LIMIT_ERROR'],
		[401, 'AUTH_ERROR'],
		[403, 'FORBIDDEN_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
		[400, 'VALIDATION_ERROR'],
		[422, 'VALIDATION_ERROR'],
		[503, 'SERVER_ERROR'],
	])('routes %i to %s', (status, name) => {
		const key = name as keyof typeof errorHandlers;
		expect(errorHandlers[key].match(apiError(status, 'x'))).toBe(true);
	});

	it('matches the transport 429 whose message says only "Too Many Requests"', () => {
		// The message contains neither "429" nor "rate_limited", so this only
		// works because the client rethrows ApiError with its status intact.
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(429, 'Too Many Requests')),
		).toBe(true);
	});

	it('surfaces Retry-After without re-driving the request', async () => {
		const error = apiError(429, 'Too Many Requests');
		(error as { retryAfter?: number }).retryAfter = 1500;
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.headersRetryAfterMs).toBe(1500);
		// corsair/http already retried this internally; a second budget here
		// would multiply the two.
		expect(result.maxRetries).toBe(0);
	});

	it('DEFAULT matches anything', () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

describe('accrediblecertificates plugin factory', () => {
	it('creates a plugin with the expected id and auth type', () => {
		const plugin = accrediblecertificates({});
		expect(plugin.id).toBe('accrediblecertificates');
		const options = plugin.options as { authType?: string } | undefined;
		expect(options?.authType).toBe('api_key');
	});

	it('declares only the API key auth scheme the provider documents', () => {
		const plugin = accrediblecertificates({});
		expect(Object.keys(plugin.authConfig ?? {})).toEqual(['api_key']);
	});

	it('registers no webhooks, because the API documents none', () => {
		const plugin = accrediblecertificates({});
		expect(plugin.webhooks).toEqual({});
	});

	it('exposes the credentials.get endpoint', () => {
		const plugin = accrediblecertificates({});
		const endpoints = plugin.endpoints as
			| { credentials: { get: unknown } }
			| undefined;
		expect(endpoints?.credentials.get).toBeDefined();
	});

	it('declares a schema and metadata entry for every endpoint', () => {
		const plugin = accrediblecertificates({});
		expect(Object.keys(plugin.endpointSchemas ?? {})).toEqual([
			'credentials.get',
		]);
		const meta = plugin.endpointMeta as
			| Record<string, { riskLevel?: string }>
			| undefined;
		expect(Object.keys(meta ?? {})).toEqual(['credentials.get']);
		expect(meta?.['credentials.get']?.riskLevel).toBe('read');
	});
});
