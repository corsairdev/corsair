import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeSupabaseRequest } from '../client';
import type { SupabaseContext } from '../index';
import type { SupabaseOperation } from './operations';
import { supabaseOperations } from './operations';
import type { SupabaseEndpointInput } from './types';
import {
	SupabaseEndpointInputSchemas,
	SupabaseEndpointOutputSchemas,
} from './types';

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

const CONTROL_KEYS = new Set([
	...PATH_PARAM_KEYS,
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

type SupabaseEndpoint = CorsairEndpoint<
	SupabaseContext,
	SupabaseEndpointInput,
	unknown
>;

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

function requestBody(input: SupabaseEndpointInput): unknown {
	if ('body' in input) return input.body;

	const body = Object.fromEntries(
		Object.entries(input).filter(([key, value]) => {
			return !CONTROL_KEYS.has(key) && value !== undefined;
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

function projectHeaders(ctx: SupabaseContext, input: SupabaseEndpointInput) {
	const key = projectApiKey(ctx, input);
	if (!key) return input.headers;
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

function listTablesBody(input: SupabaseEndpointInput) {
	const schema = typeof input.schema === 'string' ? input.schema : 'public';
	return {
		query: `
select table_schema, table_name, table_type
from information_schema.tables
where table_schema = '${schema.replace(/'/g, "''")}'
order by table_schema, table_name
`,
	};
}

function getTableSchemasBody(input: SupabaseEndpointInput) {
	const schema = typeof input.schema === 'string' ? input.schema : 'public';
	const tableFilter =
		typeof input.table === 'string'
			? `and table_name = '${input.table.replace(/'/g, "''")}'`
			: '';
	return {
		query: `
select table_schema, table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = '${schema.replace(/'/g, "''")}'
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
		return formEncodeBody(requestBody(input));
	}
	return requestBody(input);
}

function createEndpoint(operation: SupabaseOperation): SupabaseEndpoint {
	return async (ctx, input = {}) => {
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

		const response = await makeSupabaseRequest(
			resolvePath(operation.path, input),
			operation.kind === 'project'
				? (projectApiKey(ctx, input) ?? ctx.key)
				: ctx.key,
			{
				method: operation.method,
				body: bodyForOperation(operation, input),
				query: {
					...operation.defaultQuery,
					...input.query,
				},
				headers:
					operation.kind === 'project'
						? projectHeaders(ctx, input)
						: input.headers,
				mediaType: input.mediaType ?? operation.mediaType,
				baseUrl:
					operation.kind === 'project' ? projectBaseUrl(input) : input.baseUrl,
			},
		);

		await logEventFromContext(
			ctx,
			`supabase.${operation.group}.${operation.name}`,
			safeLogInput(input),
			'completed',
		);
		return response;
	};
}

type EndpointBranch = Record<string, SupabaseEndpoint>;

export const supabaseEndpointsNested = supabaseOperations.reduce(
	(acc, operation) => {
		const branch = (acc[operation.group] ??= {});
		branch[operation.name] = createEndpoint(operation);
		return acc;
	},
	{} as Record<string, EndpointBranch>,
);

export const supabaseEndpointMeta = Object.fromEntries(
	supabaseOperations.map((operation: SupabaseOperation) => [
		`${operation.group}.${operation.name}`,
		{
			riskLevel: operation.riskLevel,
			irreversible: operation.irreversible,
			description: operation.description,
		},
	]),
);

export const supabaseEndpointSchemas = Object.fromEntries(
	supabaseOperations.map((operation: SupabaseOperation) => [
		`${operation.group}.${operation.name}`,
		{
			input: SupabaseEndpointInputSchemas[operation.key],
			output: SupabaseEndpointOutputSchemas[operation.key],
		},
	]),
);

export { SupabaseEndpointInputSchemas, SupabaseEndpointOutputSchemas };

export * from './operations';
export * from './types';
