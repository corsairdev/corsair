import * as crypto from 'node:crypto';
import { DatabricksAPIError, makeDatabricksRequest } from './client';
import { endpointContractCases } from './endpoint-contract-cases';
import * as Apps from './endpoints/apps';
import * as Catalog from './endpoints/catalog';
import * as Cleanrooms from './endpoints/cleanrooms';
import * as Compute from './endpoints/compute';
import * as Dashboards from './endpoints/dashboards';
import * as Database from './endpoints/database';
import * as Dataquality from './endpoints/dataquality';
import * as Dbfs from './endpoints/dbfs';
import * as Iam from './endpoints/iam';
import * as Jobs from './endpoints/jobs';
import * as Marketplace from './endpoints/marketplace';
import * as Ml from './endpoints/ml';
import * as Security from './endpoints/security';
import * as Serving from './endpoints/serving';
import * as Sharing from './endpoints/sharing';
import * as Sql from './endpoints/sql';
import { DatabricksEndpointInputSchemas } from './endpoints/types';
import * as Workspace from './endpoints/workspace';
import { errorHandlers } from './error-handlers';
import { matchDatabricksTenantWebhook } from './webhooks/tenant-matcher';
import {
	verifyDatabricksWebhookSignature,
	verifyDatabricksWebhookSignatureFromRaw,
} from './webhooks/types';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeDatabricksRequest: jest.fn().mockResolvedValue({}),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn().mockResolvedValue({ ok: true }),
	};
});

const mockRequest = jest.mocked(makeDatabricksRequest);
const mockHttpRequest = jest.mocked(
	jest.requireMock('corsair/http')
		.request as typeof import('corsair/http').request,
);

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

const endpointModules = {
	Dbfs,
	Compute,
	Iam,
	Catalog,
	Marketplace,
	Jobs,
	Sql,
	Cleanrooms,
	Dataquality,
	Database,
	Apps,
	Dashboards,
	Ml,
	Security,
	Serving,
	Sharing,
	Workspace,
} as const;

function createContext(host = 'https://acme.cloud.databricks.com') {
	return {
		key: 'test_token',
		authType: 'api_key' as const,
		options: { key: 'test_token', host },
		$getAccountId: () => Promise.resolve('acc_test'),
	};
}

describe('Databricks client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('preserves status, retryAfter, and error code on DatabricksAPIError', () => {
		const err = new DatabricksAPIError(
			'Rate limited',
			429,
			30,
			'REQUEST_LIMIT',
		);
		expect(err.status).toBe(429);
		expect(err.retryAfter).toBe(30);
		expect(err.code).toBe('REQUEST_LIMIT');
	});

	it('uses configured workspace host as request base URL', async () => {
		const actual = jest.requireActual('./client');
		await actual.makeDatabricksRequest('clusters/list', {
			key: 'test_token',
			options: { host: 'https://acme.cloud.databricks.com' },
		});

		expect(mockHttpRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://acme.cloud.databricks.com' }),
			expect.objectContaining({ url: '/api/2.0/clusters/list' }),
		);
	});

	it('prefers ctx.options.host over DATABRICKS_HOST env', async () => {
		const prev = process.env.DATABRICKS_HOST;
		process.env.DATABRICKS_HOST = 'https://wrong.cloud.databricks.com';
		try {
			const actual = jest.requireActual('./client');
			await actual.makeDatabricksRequest('jobs/list', {
				key: 'test_token',
				options: { host: 'https://acme.cloud.databricks.com' },
			});
			expect(mockHttpRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://acme.cloud.databricks.com' }),
				expect.anything(),
			);
		} finally {
			if (prev === undefined) {
				// biome-ignore lint/performance/noDelete: remove unset env var entirely
				delete process.env.DATABRICKS_HOST;
			} else process.env.DATABRICKS_HOST = prev;
		}
	});
});

describe('Databricks error handlers', () => {
	it('matches rate limits from DatabricksAPIError status', async () => {
		const error = new DatabricksAPIError('Too Many Requests', 429, 15);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: 15 });
	});

	it('matches rate limits from human-readable message text', () => {
		const error = new DatabricksAPIError('Too Many Requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});
});

describe('Databricks endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const cases = endpointContractCases.map((c) => ({
		...c,
		name: `${c.mod}.${c.fn}`,
		fn: (endpointModules[c.mod] as Record<string, AnyEndpoint>)[c.fn]!,
		schema:
			DatabricksEndpointInputSchemas[
				c.fn as keyof typeof DatabricksEndpointInputSchemas
			],
	}));

	it.each(cases)('$name calls $method $endpoint', async (c) => {
		const ctx = createContext();
		const input = c.schema.parse(c.input);
		await c.fn(ctx, input);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [path, key, options] = mockRequest.mock.calls[0]!;
		expect(path).toBe(c.endpoint);
		expect(key).toBe(ctx);
		expect(options?.method ?? 'GET').toBe(c.method);
		if ('expectedBody' in c) {
			expect(options?.body).toEqual(c.expectedBody);
		} else {
			expect(options?.body).toBeUndefined();
		}
		if ('expectedQuery' in c) {
			expect(options?.query).toEqual(c.expectedQuery);
		} else {
			expect(options?.query).toBeUndefined();
		}
	});
});

describe('Databricks catalog.checkTableExists', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns exists: false only for confirmed not-found errors', async () => {
		mockRequest.mockRejectedValueOnce(
			new DatabricksAPIError(
				'Not found',
				404,
				undefined,
				'RESOURCE_DOES_NOT_EXIST',
			),
		);
		const result = await Catalog.checkTableExists(createContext() as any, {
			catalog_name: 'main',
			schema_name: 'default',
			table_name: 'events',
		});
		expect(result).toEqual({ exists: false });
	});

	it('propagates auth and operational failures', async () => {
		mockRequest.mockRejectedValueOnce(
			new DatabricksAPIError('Unauthorized', 401),
		);
		await expect(
			Catalog.checkTableExists(createContext() as any, {
				catalog_name: 'main',
				schema_name: 'default',
				table_name: 'events',
			}),
		).rejects.toMatchObject({ status: 401 });
	});
});

describe('Databricks webhooks', () => {
	it('verifies signature when rawBody string is present', () => {
		const req = {
			headers: { 'x-databricks-signature': 'invalid_sig' },
			rawBody: '{"event_type":"job.completed","source":"webhook"}',
			payload: { event_type: 'job.completed' },
		};
		const res = verifyDatabricksWebhookSignature(req as any, 'secret');
		expect(res.valid).toBe(false);
		expect(res.error).toBe('Invalid webhook signature');
	});

	it('returns error when rawBody is missing', () => {
		const req = {
			headers: { 'x-databricks-signature': 'sig' },
			payload: { event_type: 'job.completed' },
		};
		const res = verifyDatabricksWebhookSignature(req as any, 'secret');
		expect(res.valid).toBe(false);
		expect(res.error).toBe('Missing raw body for signature verification');
	});

	it('accepts valid compact rawBody that equals JSON.stringify(payload)', () => {
		const secret = 'test-secret';
		const payload = { event_type: 'job.completed' };
		const rawBody = JSON.stringify(payload);
		const signature = crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex');
		const res = verifyDatabricksWebhookSignature(
			{
				headers: { 'x-databricks-signature': signature },
				rawBody,
				payload,
			} as any,
			secret,
		);
		expect(res.valid).toBe(true);
	});

	it('verifies signature from raw inbound request body', () => {
		const body = '{"event_type":"job.completed"}';
		const res = verifyDatabricksWebhookSignatureFromRaw(
			{
				body,
				headers: { 'x-databricks-signature': 'invalid_sig' },
			},
			'secret',
		);
		expect(res.valid).toBe(false);
		expect(res.error).toBe('Invalid webhook signature');
	});

	it('accepts valid webhook signature from raw inbound request body', () => {
		const secret = 'test-secret';
		const body = '{"event_type":"job.completed","source":"webhook"}';
		const signature = crypto
			.createHmac('sha256', secret)
			.update(body)
			.digest('hex');
		const res = verifyDatabricksWebhookSignatureFromRaw(
			{
				body,
				headers: { 'x-databricks-signature': signature },
			},
			secret,
		);
		expect(res.valid).toBe(true);
	});

	it('accepts valid webhook signature when rawBody differs from payload', () => {
		const secret = 'test-secret';
		const rawBody = '{"event_type":"job.completed","source":"webhook"}';
		const signature = crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex');
		const res = verifyDatabricksWebhookSignature(
			{
				headers: { 'x-databricks-signature': signature },
				rawBody,
				payload: { event_type: 'job.completed' },
			} as any,
			secret,
		);
		expect(res.valid).toBe(true);
	});

	it('requires string body for raw inbound verification', () => {
		const res = verifyDatabricksWebhookSignatureFromRaw(
			{
				body: { event_type: 'job.completed' },
				headers: { 'x-databricks-signature': 'sig' },
			},
			'secret',
		);
		expect(res.valid).toBe(false);
		expect(res.error).toBe(
			'Missing original raw body for signature verification',
		);
	});

	it('matches tenant webhook', () => {
		const match = matchDatabricksTenantWebhook({
			body: { workspace_id: 'ws-123' },
			headers: {},
		} as any);
		expect(match).toEqual({
			linkType: 'tenant_external_id',
			externalId: 'ws-123',
		});
	});
});
