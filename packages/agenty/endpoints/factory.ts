import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeAgentyRequest } from '../client';
import type { AgentyContext } from '../index';
import { syncAgentyOperationCache } from './cache-sync';
import type { AgentyRoute } from './routes';
import { agentyRoutes } from './routes';
import type { AgentyEndpointInput } from './types';

const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {
	agent_id: ['agent_id', 'agentId'],
	job_id: ['job_id', 'jobId'],
	list_id: ['list_id', 'listId'],
	key_id: ['key_id', 'keyId'],
	user_id: ['user_id', 'userId'],
	workflow_id: ['workflow_id', 'workflowId', 'id'],
	id: ['id', 'project_id', 'projectId'],
};

const BODY_CONTROL_KEYS = new Set(['body', 'query', 'headers', 'baseUrl']);

// Agenty batch endpoints expect a raw JSON array body, not `{ agent_ids: [...] }`.
// Confirmed live: POST /projects/{id}/add with ["agent_id"] returns 200.
const ARRAY_BODY_FIELD_BY_ROUTE: Record<string, string> = {
	projectsAddAgents: 'agent_ids',
};

// scrapeWebpageData uses top-level `query` as the jQuery selector map in the POST
const BODY_QUERY_FIELD_ROUTES = new Set(['scrapeWebpageData']);

// Agenty response payloads vary by resource; outputs validated via shared Zod schemas.
export type AgentyEndpoint = CorsairEndpoint<
	AgentyContext,
	AgentyEndpointInput,
	unknown
>;

function camelToSnake(value: string): string {
	return value
		.replace(/([A-Z])/g, '_$1')
		.replace(/^_/, '')
		.toLowerCase();
}

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[agenty] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(
	input: AgentyEndpointInput,
	pathKey: string,
): unknown {
	const snake = camelToSnake(pathKey);
	const candidates = [pathKey, snake, ...(PATH_PARAM_ALIASES[pathKey] ?? [])];
	for (const candidate of candidates) {
		if (input[candidate] !== undefined) return input[candidate];
	}
	return undefined;
}

export function resolvePath(
	path: string,
	input: AgentyEndpointInput,
	route?: Pick<AgentyRoute, 'pathParams'>,
): string {
	const pathOnly = path.split('?')[0] ?? path;
	let index = 0;
	return pathOnly.replace(/\{([^}]+)\}/g, (_, placeholder: string) => {
		const mappedKey = route?.pathParams?.[index];
		index += 1;
		if (mappedKey !== undefined) {
			const direct = input[mappedKey] ?? input[camelToSnake(mappedKey)];
			if (direct !== undefined) {
				return encodePathPart(direct);
			}
		}
		return encodePathPart(resolvePathParam(input, placeholder));
	});
}

function buildQuery(route: AgentyRoute, input: AgentyEndpointInput) {
	const query: Record<string, unknown> = BODY_QUERY_FIELD_ROUTES.has(route.name)
		? {}
		: { ...(input.query ?? {}) };
	for (const key of route.queryParams ?? []) {
		const snake = camelToSnake(key);
		const value = input[snake] ?? input[key] ?? resolvePathParam(input, key);
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

function requestBody(route: AgentyRoute, input: AgentyEndpointInput) {
	if ('body' in input && input.body !== undefined) return input.body;

	const arrayField = ARRAY_BODY_FIELD_BY_ROUTE[route.name];
	if (arrayField !== undefined && input[arrayField] !== undefined) {
		return input[arrayField];
	}

	const pathParams = new Set(route.pathParams ?? []);
	const queryParams = new Set(
		(route.queryParams ?? []).flatMap((key) => [key, camelToSnake(key)]),
	);
	const body = Object.fromEntries(
		Object.entries(input).filter(([key, value]) => {
			const isControl =
				BODY_CONTROL_KEYS.has(key) &&
				!(key === 'query' && BODY_QUERY_FIELD_ROUTES.has(route.name));
			return (
				!pathParams.has(key) &&
				!queryParams.has(key) &&
				!isControl &&
				value !== undefined
			);
		}),
	);
	return Object.keys(body).length > 0 ? body : undefined;
}

export function getRoute(name: string): AgentyRoute {
	const route = agentyRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[agenty] missing route: ${name}`);
	}
	return route;
}

export function resolveBaseUrl(
	route: Pick<AgentyRoute, 'hostType'>,
	input: AgentyEndpointInput,
): string {
	// baseUrl is optional on some inputs; AgentyEndpointInput union cannot narrow per-key.
	const explicitBaseUrl = (input as { baseUrl?: string }).baseUrl;
	if (explicitBaseUrl) return explicitBaseUrl;
	return route.hostType === 'browser'
		? 'https://browser.agenty.com/api'
		: 'https://api.agenty.com/v2';
}

export async function logAgentyOperation(
	ctx: AgentyContext,
	input: AgentyEndpointInput,
	route: AgentyRoute,
	status: 'completed' | 'failed',
) {
	try {
		await logEventFromContext(
			ctx,
			`agenty.${route.group}.${route.name}`,
			{ method: route.method, path: route.path, hostType: route.hostType },
			status,
		);
	} catch (error) {
		console.warn('[agenty] Failed to log operation event:', error);
	}
}

export async function requestAgentyOperation(
	ctx: AgentyContext,
	input: AgentyEndpointInput,
	route: AgentyRoute,
) {
	return makeAgentyRequest(resolvePath(route.path, input, route), ctx.key, {
		method: route.method,
		body: requestBody(route, input),
		query: buildQuery(route, input),
		baseUrl: resolveBaseUrl(route, input),
		// input.headers is unknown via the AgentyEndpointInput index signature;
		// callers supply string-valued header maps validated by per-op Zod schemas.
		headers: input.headers as Record<string, string> | undefined,
	});
}

export async function executeAgentyOperation(
	ctx: AgentyContext,
	input: AgentyEndpointInput,
	route: AgentyRoute,
) {
	let status: 'completed' | 'failed' = 'completed';
	try {
		const result = await requestAgentyOperation(ctx, input, route);
		await syncAgentyOperationCache(ctx, route, input, result);
		return result;
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		// Telemetry must not mask the original request result/error.
		await logAgentyOperation(ctx, input, route, status);
	}
}
