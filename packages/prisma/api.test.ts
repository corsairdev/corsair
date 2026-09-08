import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ApiError, request } from 'corsair/http';
import { makePrismaRequest, PRISMA_API_BASE, PrismaAPIError } from './client';
import type { PrismaOperation } from './endpoints';
import { prismaOperations } from './endpoints';
import { PrismaEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { PrismaContext } from './index';
import { prisma, prismaEndpointSchemas } from './index';
import { executePostgresQuery } from './pg-client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

jest.mock('./pg-client', () => ({
	executePostgresQuery: jest.fn(),
	inspectPostgresSchema: jest.fn(),
}));

const mockExecutePostgresQuery = executePostgresQuery as jest.Mock;

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
	key: 'test-token',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as PrismaContext;

describe('Prisma plugin shape', () => {
	it('keeps endpoint domain files explicit', () => {
		const projectsSource = readFileSync(
			join(__dirname, 'endpoints/projects.ts'),
			'utf8',
		);
		const databasesSource = readFileSync(
			join(__dirname, 'endpoints/databases.ts'),
			'utf8',
		);
		const sqlSource = readFileSync(join(__dirname, 'endpoints/sql.ts'), 'utf8');

		expect(projectsSource).toContain('export const createProject');
		expect(projectsSource).toContain('export const transferProject');
		expect(databasesSource).toContain('export const DatabasesEndpoints');
		expect(databasesSource).toContain('inspectSchema: inspectDatabaseSchema');
		expect(sqlSource).toContain('export const queryDatabase');
		expect(sqlSource).toContain('export const executeDatabaseCommand');
	});

	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = prisma();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(22);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(22);
		expect(Object.keys(prismaEndpointSchemas)).toHaveLength(22);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(prismaEndpointSchemas).sort()).toEqual(paths);
		expect(Object.keys(plugin.schema?.entities ?? {})).toEqual([
			'workspaces',
			'projects',
			'databases',
			'connections',
			'backups',
			'regions',
			'integrations',
		]);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
	});

	it('gives every REST operation a concrete output schema (no z.unknown)', () => {
		const restOps = prismaOperations.filter(
			(op: PrismaOperation) => op.kind !== 'sql' && op.kind !== 'schema',
		);
		for (const op of restOps) {
			expect(PrismaEndpointOutputSchemas[op.key]).toBeDefined();
		}
		// resource endpoints require a stable id: empty objects must not validate
		expect(PrismaEndpointOutputSchemas.getProject!.safeParse({}).success).toBe(
			false,
		);
		expect(
			PrismaEndpointOutputSchemas.listWorkspaces!.safeParse([{}]).success,
		).toBe(false);
		expect(PrismaEndpointOutputSchemas.getDatabase!.safeParse({}).success).toBe(
			false,
		);
		// delete/restore endpoints legitimately return no content
		expect(
			PrismaEndpointOutputSchemas.deleteProject!.safeParse(undefined).success,
		).toBe(true);
		expect(
			PrismaEndpointOutputSchemas.deleteConnection!.safeParse(null).success,
		).toBe(true);
		expect(
			PrismaEndpointOutputSchemas.restoreBackup!.safeParse({}).success,
		).toBe(true);
		// ... but a non-empty object is an incompatible payload and must fail
		expect(
			PrismaEndpointOutputSchemas.deleteProject!.safeParse({
				unexpected: 'field',
			}).success,
		).toBe(false);
		expect(
			PrismaEndpointOutputSchemas.deleteDatabase!.safeParse({
				deleted: true,
			}).success,
		).toBe(false);
		expect(
			PrismaEndpointOutputSchemas.deleteConnection!.safeParse({ id: 'c1' })
				.success,
		).toBe(false);
		expect(
			PrismaEndpointOutputSchemas.restoreBackup!.safeParse({
				status: 'restored',
			}).success,
		).toBe(false);
	});

	it('marks destructive operations as irreversible', () => {
		const meta = prisma().endpointMeta as Record<
			string,
			{ riskLevel: string; irreversible?: boolean }
		>;
		for (const key of [
			'projects.delete',
			'databases.delete',
			'connections.delete',
		]) {
			expect(meta[key]!.riskLevel).toBe('destructive');
			expect(meta[key]!.irreversible).toBe(true);
		}
		expect(meta['backups.restore']!.riskLevel).toBe('destructive');
		expect(meta['backups.restore']!.irreversible).toBe(true);
		expect(meta['sql.execute']!.riskLevel).toBe('destructive');
	});

	it('uses api key auth by default and supports oauth', () => {
		const plugin = prisma();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
			oauth_2: { account: ['tenant_external_id'] },
		});
	});
});

describe('Prisma request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends bearer auth and JSON bodies to the Prisma Management API', async () => {
		await makePrismaRequest('/projects', 'test-token', {
			method: 'POST',
			body: { name: 'demo', region: 'aws-us-east-1' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, requestOptions] = mockRequest.mock.calls[0];
		expect(config!.BASE).toBe(PRISMA_API_BASE);
		expect(config!.TOKEN).toBe('test-token');
		expect((requestOptions as { body: unknown } | undefined)?.body).toEqual({
			name: 'demo',
			region: 'aws-us-east-1',
		});
	});

	it('retries Management API 429s from PrismaAPIError', async () => {
		const error = new PrismaAPIError('Too Many Requests', 429, undefined, 1500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('still matches corsair ApiError 429s', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/projects' },
			{
				url: 'https://api.prisma.io/v1/projects',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});
});

describe('Prisma REST endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ data: [] });
	});

	it('resolves project path params and issues correct methods', async () => {
		const plugin = prisma();
		const e = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
		await e.projects.get(mockCtx, { projectId: 'clx-project' });
		await e.projects.delete(mockCtx, { projectId: 'clx-project' });
		await e.projects.transfer(mockCtx, {
			projectId: 'clx-project',
			body: { recipientAccessToken: 'oauth-token' },
		});

		expect(mockRequest.mock.calls[0][1].url).toBe('/projects/clx-project');
		expect(mockRequest.mock.calls[0][1].method).toBe('GET');
		expect(mockRequest.mock.calls[1][1].url).toBe('/projects/clx-project');
		expect(mockRequest.mock.calls[1][1].method).toBe('DELETE');
		expect(mockRequest.mock.calls[2][1].url).toBe(
			'/projects/clx-project/transfer',
		);
		expect((mockRequest.mock.calls[2][1] as { body: unknown }).body).toEqual({
			recipientAccessToken: 'oauth-token',
		});
	});

	it('does not send the bearer token to a caller-supplied origin', async () => {
		const plugin = prisma();
		const e = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
		await e.projects.list(mockCtx, {
			baseUrl: 'https://evil.example',
		} as never);

		expect(mockRequest.mock.calls[0][0].BASE).toBe(PRISMA_API_BASE);
		expect(mockRequest.mock.calls[0][0].TOKEN).toBe('test-token');
	});

	it('builds database sub-resource paths from path params', async () => {
		const plugin = prisma();
		const e = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
		await e.databases.list(mockCtx, { projectId: 'p1' });
		await e.databases.get(mockCtx, { databaseId: 'db1' });
		await e.backups.list(mockCtx, { databaseId: 'db1' });
		await e.backups.restore(mockCtx, {
			targetDatabaseId: 'db2',
			body: { backupId: 'b1' },
		});
		await e.integrations.list(mockCtx, { workspaceId: 'ws1' });

		expect(mockRequest.mock.calls[0][1].url).toBe('/projects/p1/databases');
		expect(mockRequest.mock.calls[1][1].url).toBe('/databases/db1');
		expect(mockRequest.mock.calls[2][1].url).toBe('/databases/db1/backups');
		expect(mockRequest.mock.calls[3][1].url).toBe('/databases/db2/restore');
		expect(mockRequest.mock.calls[4][1].url).toBe(
			'/workspaces/ws1/integrations',
		);
	});

	it('passes cursor/limit pagination and usage period as query params', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		const plugin = prisma();
		const e = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
		await e.projects.list(mockCtx, { cursor: 'c1', limit: 20 });
		await e.databases.getUsage(mockCtx, {
			databaseId: 'db1',
			startDate: '2025-01-01',
			endDate: '2025-01-31',
		});

		expect(
			(mockRequest.mock.calls[0][1] as { query: unknown }).query,
		).toMatchObject({ cursor: 'c1', limit: 20 });
		expect(
			(mockRequest.mock.calls[1][1] as { query: unknown }).query,
		).toMatchObject({ startDate: '2025-01-01', endDate: '2025-01-31' });
	});

	it('writes caches for create responses and returns the pristine payload', async () => {
		const plugin = prisma({ key: 'test-token' });
		const ctxWithDb = {
			...mockCtx,
			db: {
				connections: { upsertByEntityId: jest.fn() },
			},
		} as unknown as PrismaContext;
		mockRequest.mockResolvedValueOnce({
			data: {
				id: 'conn1',
				name: 'demo',
				connectionString: 'postgres://secret',
			},
		});

		const result = await (
			plugin.endpoints as {
				connections: {
					create: (
						ctx: PrismaContext,
						input: Record<string, unknown>,
					) => Promise<unknown>;
				};
			}
		).connections.create(ctxWithDb, {
			body: { name: 'demo', databaseId: 'db1' },
		});

		expect(
			ctxWithDb.db.connections.upsertByEntityId as jest.Mock,
		).toHaveBeenCalledWith(
			'conn1',
			expect.objectContaining({ id: 'conn1', name: 'demo' }),
		);
		expect(
			(ctxWithDb.db.connections.upsertByEntityId as jest.Mock).mock.calls[0][1],
		).not.toHaveProperty('connectionString');
		expect(result).toMatchObject({
			data: {
				id: 'conn1',
				name: 'demo',
				connectionString: 'postgres://secret',
			},
		});
	});
});

describe('Prisma direct-postgres endpoints', () => {
	beforeEach(() => {
		mockExecutePostgresQuery.mockReset();
		mockExecutePostgresQuery.mockResolvedValue({
			rows: [],
			rowCount: 0,
			command: 'SELECT',
		});
	});

	it('routes read-only queries and write commands through the pg client', async () => {
		const plugin = prisma();
		const e = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
		const input = {
			host: 'db.prisma.io',
			user: 'u',
			password: 'p',
			database: 'd',
			sql: 'SELECT * FROM users',
			params: [],
		};

		await e.sql.query(mockCtx, input);
		expect(mockExecutePostgresQuery).toHaveBeenCalledWith(
			expect.objectContaining({ host: 'db.prisma.io' }),
			'SELECT * FROM users',
			[],
			'read',
		);

		mockExecutePostgresQuery.mockResolvedValue({
			rows: [],
			rowCount: 1,
			command: 'INSERT',
		});
		await e.sql.execute(mockCtx, {
			...input,
			sql: 'INSERT INTO users (name) VALUES ($1)',
			params: ['alice'],
		});
		expect(mockExecutePostgresQuery).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.stringContaining('INSERT'),
			['alice'],
			'write',
		);
	});

	it('enumerates every listed operation a matching schema entry', () => {
		for (const op of prismaOperations) {
			expect(prismaEndpointSchemas[`${op.group}.${op.name}`]).toBeDefined();
		}
	});
});
