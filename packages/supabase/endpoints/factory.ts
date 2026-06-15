import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeSupabaseRequest } from '../client';
import type { SupabaseContext } from '../index';
import type { SupabaseOperation } from './operations';
import type { SupabaseEndpointInput } from './types';

const PATH_PARAM_KEYS = [
	'ref',
	'id',
	'slug',
	'name',
	'version',
	'runId',
	'tpaId',
	'providerId',
	'branchId',
	'functionSlug',
	'uploadId',
] as const;

const BODY_CONTROL_KEYS = new Set([
	'body',
	'query',
	'headers',
	'mediaType',
	'baseUrl',
	'projectApiKey',
	'schema',
	'table',
	'columns',
	'limit',
	'offset',
]);

export type SupabaseEndpoint = CorsairEndpoint<
	SupabaseContext,
	SupabaseEndpointInput,
	unknown
>;

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
};

const CACHE_RULES: Record<string, CacheRule> = {
	listAllProjects: {
		entity: 'projects',
		idKeys: ['ref', 'id'],
		listKeys: ['projects'],
	},
	getProject: { entity: 'projects', idKeys: ['ref', 'id'] },
	createProject: { entity: 'projects', idKeys: ['ref', 'id'] },
	updateProject: { entity: 'projects', idKeys: ['ref', 'id'] },
	listAllOrganizations: {
		entity: 'organizations',
		idKeys: ['slug', 'id', 'name'],
		listKeys: ['organizations'],
	},
	getOrganization: { entity: 'organizations', idKeys: ['slug', 'id', 'name'] },
	createOrganization: {
		entity: 'organizations',
		idKeys: ['slug', 'id', 'name'],
	},
	listFunctions: {
		entity: 'functions',
		idKeys: ['slug', 'id', 'name'],
		listKeys: ['functions'],
	},
	getFunction: { entity: 'functions', idKeys: ['slug', 'id', 'name'] },
	createFunction: { entity: 'functions', idKeys: ['slug', 'id', 'name'] },
	updateFunction: { entity: 'functions', idKeys: ['slug', 'id', 'name'] },
	listDatabaseBranches: {
		entity: 'branches',
		idKeys: ['id', 'branch_id', 'ref', 'name'],
		listKeys: ['branches'],
	},
	getBranch: { entity: 'branches', idKeys: ['id', 'branch_id', 'ref', 'name'] },
	getDatabaseBranchConfig: {
		entity: 'branches',
		idKeys: ['id', 'branch_id', 'ref', 'name'],
	},
	createDatabaseBranch: {
		entity: 'branches',
		idKeys: ['id', 'branch_id', 'ref', 'name'],
	},
	updateDatabaseBranchConfig: {
		entity: 'branches',
		idKeys: ['id', 'branch_id', 'ref', 'name'],
	},
	listBuckets: {
		entity: 'buckets',
		idKeys: ['id', 'name'],
		listKeys: ['buckets'],
	},
	getProjectApiKeys: {
		entity: 'apiKeys',
		idKeys: ['id', 'name'],
		listKeys: ['apiKeys', 'api_keys', 'keys'],
	},
	getProjectApiKey: { entity: 'apiKeys', idKeys: ['id', 'name'] },
	createApiKey: { entity: 'apiKeys', idKeys: ['id', 'name'] },
	updateApiKey: { entity: 'apiKeys', idKeys: ['id', 'name'] },
	listMigrationHistory: {
		entity: 'migrations',
		idKeys: ['version', 'name'],
		listKeys: ['migrations'],
	},
	getMigration: { entity: 'migrations', idKeys: ['version', 'name'] },
	applyMigration: { entity: 'migrations', idKeys: ['version', 'name'] },
	upsertMigration: { entity: 'migrations', idKeys: ['version', 'name'] },
	patchMigration: { entity: 'migrations', idKeys: ['version', 'name'] },
};

function encodePathPart(value: unknown): string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error('[supabase] missing required path parameter');
	}
	return encodeURIComponent(value);
}

function resolvePath(path: string, input: SupabaseEndpointInput): string {
	return path.replace(/\{([^}]+)\}/g, (_, key: string) =>
		encodePathPart(input[key]),
	);
}

function requestBody(
	operation: SupabaseOperation,
	input: SupabaseEndpointInput,
): unknown {
	if ('body' in input) return input.body;

	const pathParams = new Set(operation.pathParams ?? []);
	const body = Object.fromEntries(
		Object.entries(input).filter(([key, value]) => {
			return (
				!pathParams.has(key) &&
				!BODY_CONTROL_KEYS.has(key) &&
				value !== undefined
			);
		}),
	);
	return Object.keys(body).length > 0 ? body : undefined;
}

function safeLogInput(input: SupabaseEndpointInput) {
	const logInput: Record<string, unknown> = {};
	for (const key of PATH_PARAM_KEYS) {
		if (input[key] !== undefined) logInput[key] = input[key];
	}
	if (input.query) logInput.query = input.query;
	if (input.body !== undefined) logInput.hasBody = true;
	return logInput;
}

function projectBaseUrl(input: SupabaseEndpointInput): string {
	if (input.baseUrl) return input.baseUrl;
	if (!input.ref)
		throw new Error('[supabase] ref is required for project URLs');
	return `https://${input.ref}.supabase.co`;
}

function projectApiKey(ctx: SupabaseContext, input: SupabaseEndpointInput) {
	return (
		input.projectApiKey ??
		(ctx.options as { projectApiKey?: string } | undefined)?.projectApiKey
	);
}

function requireProjectApiKey(
	ctx: SupabaseContext,
	input: SupabaseEndpointInput,
) {
	const key = projectApiKey(ctx, input);
	if (!key) {
		throw new Error(
			'[supabase] projectApiKey is required for project-hosted endpoints',
		);
	}
	return key;
}

function projectHeaders(key: string, input: SupabaseEndpointInput) {
	return {
		apikey: key,
		...input.headers,
	};
}

function formEncodeBody(body: unknown): string | undefined {
	if (body === undefined) return undefined;
	if (body instanceof URLSearchParams) return body.toString();
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		throw new Error('[supabase] form body must be an object');
	}
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined && value !== null) {
			params.set(key, String(value));
		}
	}
	return params.toString();
}

function quoteIdentifier(identifier: string): string {
	if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(identifier)) {
		throw new Error(`[supabase] invalid SQL identifier: ${identifier}`);
	}
	return `"${identifier.replace(/"/g, '""')}"`;
}

function sqlIdentifierName(identifier: string): string {
	if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(identifier)) {
		throw new Error(`[supabase] invalid SQL identifier: ${identifier}`);
	}
	return identifier;
}

function listTablesBody(input: SupabaseEndpointInput) {
	const schema = sqlIdentifierName(
		typeof input.schema === 'string' ? input.schema : 'public',
	);
	return {
		query: `
select table_schema, table_name, table_type
from information_schema.tables
where table_schema = '${schema}'
order by table_schema, table_name
`,
	};
}

function getTableSchemasBody(input: SupabaseEndpointInput) {
	const schema = sqlIdentifierName(
		typeof input.schema === 'string' ? input.schema : 'public',
	);
	const tableFilter =
		typeof input.table === 'string'
			? `and table_name = '${sqlIdentifierName(input.table)}'`
			: '';
	return {
		query: `
select table_schema, table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = '${schema}'
${tableFilter}
order by table_schema, table_name, ordinal_position
`,
	};
}

function selectFromTableBody(input: SupabaseEndpointInput) {
	if (!input.table) throw new Error('[supabase] table is required');
	const schema = quoteIdentifier(input.schema ?? 'public');
	const table = quoteIdentifier(input.table);
	const columns =
		input.columns && input.columns.length > 0
			? input.columns.map(quoteIdentifier).join(', ')
			: '*';
	const limit = input.limit ?? 100;
	const offset = input.offset ?? 0;
	return {
		query: `select ${columns} from ${schema}.${table} limit ${limit} offset ${offset}`,
	};
}

function oauthAuthorizeUrl(input: SupabaseEndpointInput) {
	const query = input.query ?? {};
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null) params.set(key, String(value));
	}
	return {
		url: `https://api.supabase.com/v1/oauth/authorize${
			params.size > 0 ? `?${params.toString()}` : ''
		}`,
	};
}

function bodyForOperation(
	operation: SupabaseOperation,
	input: SupabaseEndpointInput,
) {
	if (operation.kind === 'listTables') return listTablesBody(input);
	if (operation.kind === 'getTableSchemas') return getTableSchemasBody(input);
	if (operation.kind === 'selectFromTable') return selectFromTableBody(input);
	if (operation.mediaType === 'application/x-www-form-urlencoded') {
		return formEncodeBody(requestBody(operation, input));
	}
	return requestBody(operation, input);
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

	return [response];
}

function cacheEntityId(item: Record<string, unknown>, rule: CacheRule) {
	for (const key of rule.idKeys) {
		const value = item[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

async function cacheOperationResult(
	ctx: SupabaseContext,
	operation: SupabaseOperation,
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
				  }
				| undefined
		  >
		| undefined;
	const client = db?.[rule.entity];
	if (!client?.upsertByEntityId) return;

	for (const item of cacheItems(response, rule)) {
		const entityId = cacheEntityId(item, rule);
		if (!entityId) continue;
		await client.upsertByEntityId(entityId, item);
	}
}

export async function runSupabaseOperation(
	ctx: SupabaseContext,
	input: SupabaseEndpointInput,
	operation: SupabaseOperation,
) {
	if (operation.kind === 'oauthAuthorizeUrl') {
		const result = oauthAuthorizeUrl(input);
		await logEventFromContext(
			ctx,
			`supabase.${operation.group}.${operation.name}`,
			safeLogInput(input),
			'completed',
		);
		return result;
	}

	const projectKey =
		operation.kind === 'project' ? requireProjectApiKey(ctx, input) : undefined;
	const response = await makeSupabaseRequest(
		resolvePath(operation.path, input),
		projectKey ?? ctx.key,
		{
			method: operation.method,
			body: bodyForOperation(operation, input),
			query: {
				...operation.defaultQuery,
				...input.query,
			},
			headers:
				operation.kind === 'project' && projectKey
					? projectHeaders(projectKey, input)
					: input.headers,
			mediaType: input.mediaType ?? operation.mediaType,
			baseUrl:
				operation.kind === 'project' ? projectBaseUrl(input) : input.baseUrl,
		},
	);

	await cacheOperationResult(ctx, operation, response);

	await logEventFromContext(
		ctx,
		`supabase.${operation.group}.${operation.name}`,
		safeLogInput(input),
		'completed',
	);
	return response;
}
