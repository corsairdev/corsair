import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { WorkdayConnection } from '../client';
import { makeWorkdayRequest, resolveWorkdayConnection } from '../client';
import type { WorkdayContext, WorkdayKeyBuilderContext } from '../index';
import { syncWorkdayOperationCache } from './cache-sync';
import type { WorkdayRoute, WorkdayRouteName } from './routes';
import { getWorkdayRoute } from './routes';
import type { WorkdayEndpointInput, WorkdayEndpointOutputs } from './types';
import {
	WorkdayEndpointInputSchemas,
	WorkdayEndpointOutputSchemas,
} from './types';

export type WorkdayEndpoint = CorsairEndpoint<
	WorkdayContext,
	WorkdayEndpointInput,
	unknown
>;

const BODY_CONTROL_KEYS = new Set([
	'body',
	'query',
	'headers',
	'limit',
	'offset',
]);

const PATH_ALIASES: Record<string, readonly string[]> = {
	ID: ['ID', 'id', 'workerId', 'worker_id'],
	subresourceID: [
		'subresourceID',
		'subresourceId',
		'subResourceID',
		'subResourceId',
	],
};

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[workday] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(
	input: WorkdayEndpointInput,
	pathKey: string,
): unknown {
	const aliases = PATH_ALIASES[pathKey] ?? [pathKey];
	for (const candidate of aliases) {
		if (input[candidate] !== undefined && input[candidate] !== null) {
			return input[candidate];
		}
	}
	return undefined;
}

export function resolvePath(
	path: string,
	input: WorkdayEndpointInput,
	route: Pick<WorkdayRoute, 'pathParams'>,
): string {
	let index = 0;
	return path.replace(/\{([^}]+)\}/g, (_, placeholder: string) => {
		const mappedKey = route.pathParams[index];
		index += 1;
		const key = mappedKey ?? placeholder;
		const value =
			resolvePathParam(input, key) ?? resolvePathParam(input, placeholder);
		return encodePathPart(value);
	});
}

function flattenQueryValue(
	value: unknown,
): string | number | boolean | undefined {
	if (value === undefined || value === null) return undefined;
	if (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return value;
	}
	if (Array.isArray(value)) {
		return value.map(String).join(',');
	}
	return String(value);
}

export function buildQuery(
	route: WorkdayRoute,
	input: WorkdayEndpointInput,
): Record<string, string | number | boolean | undefined> | undefined {
	const query: Record<string, string | number | boolean | undefined> = {
		...(input.query as
			| Record<string, string | number | boolean | undefined>
			| undefined),
	};
	for (const key of route.queryParams) {
		const value = flattenQueryValue(input[key]);
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

export function requestBody(
	route: WorkdayRoute,
	input: WorkdayEndpointInput,
): { [key: string]: unknown } | undefined {
	if (route.method === 'GET' || route.method === 'DELETE') return undefined;
	if ('body' in input && input.body !== undefined) {
		return input.body as { [key: string]: unknown };
	}
	const pathKeys = new Set(
		route.pathParams.flatMap((key) => [key, ...(PATH_ALIASES[key] ?? [])]),
	);
	// Alias fields exist on input schemas; never send them as body content.
	const aliasKeys = new Set(Object.values(PATH_ALIASES).flat());
	const queryKeys = new Set(route.queryParams);
	const body = Object.fromEntries(
		Object.entries(input).filter(([key, value]) => {
			return (
				!pathKeys.has(key) &&
				!aliasKeys.has(key) &&
				!queryKeys.has(key) &&
				!BODY_CONTROL_KEYS.has(key) &&
				value !== undefined
			);
		}),
	);
	return Object.keys(body).length > 0 ? body : undefined;
}

async function resolveConnection(
	ctx: Pick<WorkdayKeyBuilderContext, 'options'> & {
		keys?: Partial<WorkdayKeyBuilderContext['keys']>;
	},
): Promise<WorkdayConnection> {
	const fromKeysHost = (await ctx.keys?.get_host?.()) ?? undefined;
	const fromKeysTenant = (await ctx.keys?.get_tenant?.()) ?? undefined;
	const host = ctx.options?.host?.trim() || fromKeysHost?.trim() || undefined;
	const tenant =
		ctx.options?.tenant?.trim() || fromKeysTenant?.trim() || undefined;
	return resolveWorkdayConnection({ host, tenant });
}

function normalizeInputAliases(
	raw: WorkdayEndpointInput,
): WorkdayEndpointInput {
	const input = { ...raw };
	if (input.ID === undefined) {
		const alias = resolvePathParam(input, 'ID');
		if (alias !== undefined) input.ID = alias;
	}
	if (input.subresourceID === undefined) {
		const alias = resolvePathParam(input, 'subresourceID');
		if (alias !== undefined) input.subresourceID = alias;
	}
	return input;
}

export async function executeWorkdayOperation(
	ctx: WorkdayContext,
	rawInput: WorkdayEndpointInput | undefined,
	route: WorkdayRoute,
) {
	if (!ctx.key) {
		throw new AuthMissingError('workday', 'oauth_2');
	}
	const normalized = normalizeInputAliases(rawInput ?? {});
	const parsed =
		WorkdayEndpointInputSchemas[route.name as WorkdayRouteName].parse(
			normalized,
		);
	const input = parsed as WorkdayEndpointInput;

	const connection = await resolveConnection(ctx);
	const path = resolvePath(route.path, input, route);

	let status: 'completed' | 'failed' = 'completed';
	try {
		const response = await makeWorkdayRequest<unknown>(path, ctx.key, {
			method: route.method,
			body: requestBody(route, input),
			query: buildQuery(route, input),
			connection,
			service: route.service,
			version: route.version,
		});
		const parsed = WorkdayEndpointOutputSchemas[
			route.name as WorkdayRouteName
		].parse(response) as WorkdayEndpointOutputs[WorkdayRouteName];
		await syncWorkdayOperationCache(ctx, route, input, parsed);
		return parsed;
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		try {
			await logEventFromContext(
				ctx,
				`workday.${route.group}.${route.name}`,
				{ method: route.method, service: route.service, path: route.path },
				status,
			);
		} catch (logError) {
			console.warn('[workday] Failed to log operation event:', logError);
		}
	}
}

export function createWorkdayEndpoint(name: WorkdayRouteName): WorkdayEndpoint {
	const route = getWorkdayRoute(name);
	return (async (ctx, input) =>
		executeWorkdayOperation(ctx, input ?? {}, route)) as WorkdayEndpoint;
}
