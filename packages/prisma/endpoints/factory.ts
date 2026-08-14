import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makePrismaRequest } from '../client';
import type { PrismaContext } from '../index';
import type { PrismaOperation } from './operations';
import type { PrismaEndpointInput } from './types';

const PATH_PARAM_KEYS = [
	'workspaceId',
	'projectId',
	'databaseId',
	'connectionId',
	'targetDatabaseId',
	'backupId',
	'regionId',
] as const;

const INPUT_CONTROL_KEYS = new Set(['body', 'query', 'headers', 'baseUrl']);

export type PrismaEndpoint = CorsairEndpoint<
	PrismaContext,
	PrismaEndpointInput,
	unknown
>;

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
	itemKeys?: string[];
	deleteInputKeys?: string[];
	omitKeys?: string[];
};

const CACHE_RULES: Record<string, CacheRule> = {
	listWorkspaces: {
		entity: 'workspaces',
		idKeys: ['id'],
		listKeys: ['data', 'items'],
	},
	createProject: {
		entity: 'projects',
		idKeys: ['id'],
		itemKeys: ['data', 'project'],
	},
	getProject: {
		entity: 'projects',
		idKeys: ['id'],
		itemKeys: ['data', 'project'],
	},
	listProjects: {
		entity: 'projects',
		idKeys: ['id'],
		listKeys: ['data', 'items'],
	},
	deleteProject: {
		entity: 'projects',
		idKeys: ['id'],
		deleteInputKeys: ['projectId'],
	},
	transferProject: { entity: 'projects', idKeys: ['id'], itemKeys: ['data'] },
	createDatabase: {
		entity: 'databases',
		idKeys: ['id'],
		itemKeys: ['data', 'database'],
	},
	getDatabase: {
		entity: 'databases',
		idKeys: ['id'],
		itemKeys: ['data', 'database'],
	},
	listDatabases: {
		entity: 'databases',
		idKeys: ['id'],
		listKeys: ['data', 'items'],
	},
	deleteDatabase: {
		entity: 'databases',
		idKeys: ['id'],
		deleteInputKeys: ['databaseId'],
	},
	createConnection: {
		entity: 'connections',
		idKeys: ['id'],
		itemKeys: ['data', 'connection'],
		omitKeys: ['connectionString', 'pass', 'directConnection', 'endpoints'],
	},
	listConnections: {
		entity: 'connections',
		idKeys: ['id'],
		listKeys: ['data', 'items'],
		omitKeys: ['connectionString', 'pass', 'directConnection', 'endpoints'],
	},
	deleteConnection: {
		entity: 'connections',
		idKeys: ['id'],
		deleteInputKeys: ['connectionId'],
	},
	listBackups: {
		entity: 'backups',
		idKeys: ['id'],
		listKeys: ['data', 'items'],
	},
	listRegions: {
		entity: 'regions',
		idKeys: ['id', 'region'],
		listKeys: ['data', 'items'],
	},
	listPostgresRegions: {
		entity: 'regions',
		idKeys: ['id', 'region'],
		listKeys: ['data', 'items'],
	},
	listWorkspaceIntegrations: {
		entity: 'integrations',
		idKeys: ['id'],
		listKeys: ['data', 'items'],
	},
};

function encodePathPart(value: unknown, key: string): string {
	if (typeof value === 'number') {
		return encodeURIComponent(String(value));
	}
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`[prisma] missing required path parameter: ${key}`);
	}
	return encodeURIComponent(value);
}

export function resolvePath(path: string, input: PrismaEndpointInput): string {
	return path.replace(/\{([^}]+)\}/g, (_, key: string) =>
		encodePathPart(input[key], key),
	);
}

/**
 * Shared operation lookup used by every endpoint module — throws a clear error
 * naming the missing operation when the route is absent.
 */
export function findOperation<TOperations extends readonly PrismaOperation[]>(
	operations: TOperations,
	name: TOperations[number]['name'],
): TOperations[number] {
	const operation = operations.find((candidate) => candidate.name === name);
	if (!operation) {
		throw new Error(`[prisma] missing operation: ${name}`);
	}
	return operation;
}

function extraInputEntries(
	operation: PrismaOperation,
	input: PrismaEndpointInput,
) {
	const pathParams = new Set(operation.pathParams ?? []);
	const controlKeys = new Set([
		...INPUT_CONTROL_KEYS,
		'cursor',
		'limit',
		'startDate',
		'endDate',
	]);
	return Object.entries(input).filter(([key, value]) => {
		return !pathParams.has(key) && !controlKeys.has(key) && value !== undefined;
	});
}

function requestBody(
	operation: PrismaOperation,
	input: PrismaEndpointInput,
): unknown {
	if ('body' in input) return input.body;

	const body = Object.fromEntries(extraInputEntries(operation, input));
	return Object.keys(body).length > 0 ? body : undefined;
}

function requestQuery(
	operation: PrismaOperation,
	input: PrismaEndpointInput,
): Record<string, unknown> | undefined {
	if (operation.method !== 'GET') {
		return input.query;
	}

	const query = {
		...Object.fromEntries(extraInputEntries(operation, input)),
		...input.query,
		cursor: input.cursor,
		limit: input.limit,
		startDate: input.startDate,
		endDate: input.endDate,
	};
	const cleanQuery = Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	);
	return Object.keys(cleanQuery).length > 0 ? cleanQuery : undefined;
}

function safeLogInput(input: PrismaEndpointInput) {
	const logInput: Record<string, unknown> = {};
	for (const key of PATH_PARAM_KEYS) {
		if (input[key] !== undefined) logInput[key] = input[key];
	}
	if (input.query) logInput.query = input.query;
	if (input.body !== undefined) logInput.hasBody = true;
	return logInput;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cacheItems(response: unknown, rule: CacheRule) {
	if (Array.isArray(response)) return response.filter(isRecord);
	if (!isRecord(response)) return [];

	for (const key of rule.listKeys ?? []) {
		const value = response[key];
		if (Array.isArray(value)) return value.filter(isRecord);
	}

	for (const key of rule.itemKeys ?? []) {
		const value = response[key];
		if (isRecord(value)) return [value];
	}

	return [response];
}

const CACHE_SECRET_KEYS = new Set([
	'connectionString',
	'pass',
	'password',
	'directConnection',
	'endpoints',
]);

function stripCacheSecrets(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(stripCacheSecrets);
	if (!isRecord(value)) return value;
	const data: Record<string, unknown> = {};
	for (const [key, nested] of Object.entries(value)) {
		if (CACHE_SECRET_KEYS.has(key)) continue;
		data[key] = stripCacheSecrets(nested);
	}
	return data;
}

function cacheData(item: Record<string, unknown>, rule: CacheRule) {
	const stripped = stripCacheSecrets(item);
	if (!isRecord(stripped)) return item;
	if (!rule.omitKeys?.length) return stripped;
	const data = { ...stripped };
	for (const key of rule.omitKeys) {
		delete data[key];
	}
	return data;
}

function cacheEntityId(item: Record<string, unknown>, rule: CacheRule) {
	for (const key of rule.idKeys) {
		const value = item[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

function cacheDeleteEntityId(input: PrismaEndpointInput, rule: CacheRule) {
	for (const key of rule.deleteInputKeys ?? []) {
		const value = input[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

export async function syncPrismaOperationResult(
	ctx: PrismaContext,
	operation: PrismaOperation,
	input: PrismaEndpointInput,
	response: unknown,
) {
	const rule = CACHE_RULES[operation.key];
	if (!rule) return;

	const db = ctx.db as
		| Record<
				string,
				| {
						upsertByEntityId?: (
							entityId: string,
							data: Record<string, unknown>,
						) => Promise<unknown>;
						deleteByEntityId?: (entityId: string) => Promise<boolean>;
				  }
				| undefined
		  >
		| undefined;
	const client = db?.[rule.entity];

	try {
		if (operation.method === 'DELETE' && rule.deleteInputKeys) {
			const entityId = cacheDeleteEntityId(input, rule);
			if (entityId && client?.deleteByEntityId) {
				await client.deleteByEntityId(entityId);
			}
			return;
		}

		if (!client?.upsertByEntityId) return;

		for (const item of cacheItems(response, rule)) {
			const entityId = cacheEntityId(item, rule);
			if (!entityId) continue;
			await client.upsertByEntityId(entityId, cacheData(item, rule));
		}
	} catch (error) {
		console.warn(`[prisma] failed to sync ${rule.entity} cache:`, error);
	}
}

export async function logPrismaOperation(
	ctx: PrismaContext,
	input: PrismaEndpointInput,
	operation: PrismaOperation,
) {
	try {
		await logEventFromContext(
			ctx,
			`prisma.${operation.group}.${operation.name}`,
			safeLogInput(input),
			'completed',
		);
	} catch (error) {
		console.warn(
			`[prisma] failed to log ${operation.group}.${operation.name}:`,
			error,
		);
	}
}

export async function requestPrismaOperation(
	ctx: PrismaContext,
	input: PrismaEndpointInput,
	operation: PrismaOperation,
) {
	return makePrismaRequest(resolvePath(operation.path, input), ctx.key, {
		method: operation.method,
		body: requestBody(operation, input),
		query: requestQuery(operation, input),
		headers: input.headers,
	});
}
