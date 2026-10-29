import { ApiError } from 'corsair/http';
import { makeTwentyOneRiskRequest } from './client';
import { Organizations } from './endpoints';
import {
	TwentyOneRiskEndpointInputSchemas,
	TwentyOneRiskEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { TwentyOneRiskContext } from './index';
import { twentyonerisk } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeTwentyOneRiskRequest: jest.fn(),
	};
});

const mockRequest = makeTwentyOneRiskRequest as jest.MockedFunction<
	typeof makeTwentyOneRiskRequest
>;

/** Minimal plugin context; `$getAccountId` is what event logging reads. */
function testCtx(key: string): TwentyOneRiskContext {
	return {
		key,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as TwentyOneRiskContext;
}

/** A standard OData collection payload. */
const sampleResponse = {
	'@odata.context': 'https://21risk.com/odata/v5/$metadata#organizations',
	'@odata.count': 2,
	value: [
		{ Id: 1, Name: 'Acme' },
		{ Id: 2, Name: 'Globex' },
	],
};

beforeEach(() => {
	mockRequest.mockClear();
});

describe('TwentyOneRisk OData query schema', () => {
	const schema = TwentyOneRiskEndpointInputSchemas.organizationsGet;

	it('accepts the documented system query options', () => {
		const parsed = schema.safeParse({
			$filter: "Name eq 'Acme'",
			$top: 50,
			$skip: 10,
			$select: 'Id,Name',
			$orderby: 'Name desc',
			$count: true,
		});
		expect(parsed.success).toBe(true);
	});

	it('reads the OData literal "false" as false, not as a truthy string', () => {
		// z.coerce.boolean() would apply Boolean("false") here and send
		// $count=true, silently inverting the caller's intent.
		expect(schema.parse({ $count: 'false' }).$count).toBe(false);
		expect(schema.parse({ $count: 'true' }).$count).toBe(true);
	});

	it('accepts the paging and expansion options 21RISK documents', () => {
		const parsed = schema.safeParse({
			$expand: 'Site',
			$skiptoken: 'abc123',
			maxPageSizeInMb: 4,
		});
		expect(parsed.success).toBe(true);
	});

	it('treats maxPageSizeInMb as an unprefixed 21RISK extension', () => {
		// It is not an OData system query option, so it carries no `$`.
		const parsed = schema.parse({ maxPageSizeInMb: '8' });
		expect(parsed.maxPageSizeInMb).toBe(8);
	});

	it('coerces numeric paging options', () => {
		const parsed = schema.parse({ $top: '25', $skip: '5' });
		expect(parsed.$top).toBe(25);
		expect(parsed.$skip).toBe(5);
	});

	it('rejects a non-positive $top', () => {
		expect(schema.safeParse({ $top: 0 }).success).toBe(false);
	});

	it('rejects a negative $skip', () => {
		expect(schema.safeParse({ $skip: -1 }).success).toBe(false);
	});
});

describe('TwentyOneRisk OData response schema', () => {
	const schema = TwentyOneRiskEndpointOutputSchemas.organizationsGet;

	it('parses a standard OData collection', () => {
		expect(schema.safeParse(sampleResponse).success).toBe(true);
	});

	it('accepts an empty collection', () => {
		expect(schema.safeParse({ value: [] }).success).toBe(true);
	});

	it('keeps OData annotations rather than dropping them', () => {
		const parsed = schema.parse({
			value: [],
			'@odata.nextLink': 'https://21risk.com/odata/v5/organizations?$skip=50',
		});
		expect(parsed['@odata.nextLink']).toContain('$skip=50');
	});

	it('rejects a payload with no value collection', () => {
		expect(schema.safeParse({ '@odata.count': 1 }).success).toBe(false);
	});
});

describe('TwentyOneRisk organizations.get', () => {
	it('requests the organizations entity set and validates the response', async () => {
		mockRequest.mockResolvedValue(sampleResponse);

		await Organizations.get(testCtx('test_key'), { $top: 50 });

		expect(mockRequest).toHaveBeenCalledWith(
			'organizations',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				query: { $top: 50 },
				schema: TwentyOneRiskEndpointOutputSchemas.organizationsGet,
			}),
		);
	});

	it('returns the collection unchanged', async () => {
		mockRequest.mockResolvedValue(sampleResponse);
		const result = await Organizations.get(testCtx('test_key'), {});
		expect(result.value).toHaveLength(2);
		expect(result['@odata.count']).toBe(2);
	});
});

describe('TwentyOneRisk auth fails closed', () => {
	/** Drives the plugin's own keyBuilder the way the binder does. */
	function keyBuilderOf(opts: Parameters<typeof twentyonerisk>[0] = {}) {
		const plugin = twentyonerisk(opts);
		return plugin.keyBuilder as (
			ctx: unknown,
			source: string,
		) => Promise<string>;
	}

	const ctxWithNoStoredKey = {
		authType: 'api_key',
		keys: { get_api_key: async () => undefined },
	};

	it('throws instead of returning an empty Bearer credential', async () => {
		await expect(
			keyBuilderOf()(ctxWithNoStoredKey, 'endpoint'),
		).rejects.toThrow(/twentyonerisk/i);
	});

	it('returns the configured key when one is supplied', async () => {
		await expect(
			keyBuilderOf({ key: '21RISK.ND.configured' })(
				ctxWithNoStoredKey,
				'endpoint',
			),
		).resolves.toBe('21RISK.ND.configured');
	});

	it('returns the stored key when the account has one', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => '21RISK.ND.stored' },
		};
		await expect(keyBuilderOf()(ctx, 'endpoint')).resolves.toBe(
			'21RISK.ND.stored',
		);
	});

	it('throws for a non-endpoint source, since the API has no webhooks', async () => {
		await expect(
			keyBuilderOf({ key: 'k' })(ctxWithNoStoredKey, 'webhook'),
		).rejects.toThrow(/twentyonerisk/i);
	});
});

describe('TwentyOneRisk input validation at the endpoint', () => {
	it('rejects a non-positive $top before calling the API', async () => {
		await expect(
			Organizations.get(testCtx('k'), { $top: 0 } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a negative $skip before calling the API', async () => {
		await expect(
			Organizations.get(testCtx('k'), { $skip: -1 } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('applies declared coercions to the outgoing query', async () => {
		mockRequest.mockResolvedValue(sampleResponse);
		await Organizations.get(testCtx('k'), {
			$top: '25',
			$count: 'false',
		} as never);
		// Strings in, parsed values out: $count=false must not become true.
		expect(mockRequest.mock.calls[0]?.[2]?.query).toEqual({
			$top: 25,
			$count: false,
		});
	});
});

describe('TwentyOneRisk error handlers', () => {
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
		[500, 'SERVER_ERROR'],
	])('routes %i to %s', (status, name) => {
		const key = name as keyof typeof errorHandlers;
		expect(errorHandlers[key].match(apiError(status, 'x'))).toBe(true);
	});

	it('matches the transport 429 whose message says only "Too Many Requests"', () => {
		// Works only because the client rethrows ApiError with its status intact.
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(429, 'Too Many Requests')),
		).toBe(true);
	});

	it("matches the API's own invalid-key message", () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				new Error('API key did not have a valid secret'),
			),
		).toBe(true);
	});

	it('surfaces Retry-After without re-driving the request', async () => {
		const error = apiError(429, 'Too Many Requests');
		(error as { retryAfter?: number }).retryAfter = 2000;
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.headersRetryAfterMs).toBe(2000);
		expect(result.maxRetries).toBe(0);
	});

	it('DEFAULT matches anything', () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

describe('twentyonerisk plugin factory', () => {
	it('creates a plugin with the expected id and auth type', () => {
		const plugin = twentyonerisk({});
		expect(plugin.id).toBe('twentyonerisk');
		const options = plugin.options as { authType?: string } | undefined;
		expect(options?.authType).toBe('api_key');
	});

	it('declares only the API key auth scheme the service documents', () => {
		expect(Object.keys(twentyonerisk({}).authConfig ?? {})).toEqual([
			'api_key',
		]);
	});

	it('registers no webhooks, because the OData service publishes none', () => {
		expect(twentyonerisk({}).webhooks).toEqual({});
	});

	it('declares a schema and metadata entry for every endpoint', () => {
		const plugin = twentyonerisk({});
		expect(Object.keys(plugin.endpointSchemas ?? {})).toEqual([
			'organizations.get',
		]);
		const meta = plugin.endpointMeta as
			| Record<string, { riskLevel?: string }>
			| undefined;
		expect(Object.keys(meta ?? {})).toEqual(['organizations.get']);
		// The OData service is read-only.
		expect(meta?.['organizations.get']?.riskLevel).toBe('read');
	});
});
