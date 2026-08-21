import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeAnchorBrowserRequest } from '../client';
import type { AnchorBrowserContext } from '../index';
import { syncAnchorBrowserOperationCache } from './cache-sync';
import type { AnchorBrowserRoute } from './routes';
import { anchorBrowserRoutes } from './routes';
import type { AnchorBrowserEndpointInput } from './types';

const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {
	sessionId: ['sessionId', 'session_id'],
	session_id: ['session_id', 'sessionId'],
	taskId: ['taskId', 'task_id'],
	task_id: ['task_id', 'taskId'],
	taskVersion: ['taskVersion', 'version'],
	version: ['version', 'taskVersion'],
	integrationId: ['integrationId', 'integration_id'],
	integration_id: ['integration_id', 'integrationId'],
	batch_id: ['batch_id', 'batchId'],
	event_name: ['event_name', 'eventName'],
	taskName: ['taskName', 'task_name'],
	executionId: ['executionId', 'execution_id'],
	execution_id: ['execution_id', 'executionId'],
	name: ['name'],
	id: ['id'],
};

const BODY_CONTROL_KEYS = new Set(['body', 'query', 'headers']);

// Anchor Browser response payloads vary by resource; outputs validated via shared Zod schemas.
export type AnchorBrowserEndpoint = CorsairEndpoint<
	AnchorBrowserContext,
	AnchorBrowserEndpointInput,
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
		throw new Error('[anchorbrowser] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(
	input: AnchorBrowserEndpointInput,
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
	input: AnchorBrowserEndpointInput,
	route?: Pick<AnchorBrowserRoute, 'pathParams'>,
): string {
	const pathOnly = path.split('?')[0] ?? path;
	// Every `{placeholder}` is named after the input field that fills it and is
	// listed in `route.pathParams`, so resolution is by name — reordering a path
	// segment cannot silently substitute the wrong value. The arity check keeps
	// the two definitions from drifting apart unnoticed.
	if (route?.pathParams) {
		const placeholders = pathOnly.match(/\{[^}]+\}/g) ?? [];
		if (placeholders.length !== route.pathParams.length) {
			throw new Error(
				`[anchorbrowser] route ${pathOnly} declares ${route.pathParams.length} path params but has ${placeholders.length} placeholders`,
			);
		}
	}

	return pathOnly.replace(/\{([^}]+)\}/g, (_, placeholder: string) => {
		if (route?.pathParams && !route.pathParams.includes(placeholder)) {
			throw new Error(
				`[anchorbrowser] route ${pathOnly} has placeholder {${placeholder}} that is not a declared path param`,
			);
		}
		return encodePathPart(resolvePathParam(input, placeholder));
	});
}

function buildQuery(
	route: AnchorBrowserRoute,
	input: AnchorBrowserEndpointInput,
) {
	const query: Record<string, unknown> = { ...(input.query ?? {}) };
	for (const key of route.queryParams ?? []) {
		const snake = camelToSnake(key);
		const value = input[snake] ?? input[key] ?? resolvePathParam(input, key);
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

function requestBody(
	route: AnchorBrowserRoute,
	input: AnchorBrowserEndpointInput,
) {
	if ('body' in input && input.body !== undefined) return input.body;
	// Strip every accepted spelling of a path param (declared name, snake_case
	// form and registered aliases) so an identifier consumed by the URL can
	// never also be posted in the request body.
	const pathParams = new Set(
		(route.pathParams ?? []).flatMap((key) => [
			key,
			camelToSnake(key),
			...(PATH_PARAM_ALIASES[key] ?? []),
		]),
	);
	const queryParams = new Set(
		(route.queryParams ?? []).flatMap((key) => [key, camelToSnake(key)]),
	);
	const body = Object.fromEntries(
		Object.entries(input).filter(([key, value]) => {
			return (
				!pathParams.has(key) &&
				!queryParams.has(key) &&
				!BODY_CONTROL_KEYS.has(key) &&
				value !== undefined
			);
		}),
	);
	return Object.keys(body).length > 0 ? body : undefined;
}

export function getRoute(name: string): AnchorBrowserRoute {
	const route = anchorBrowserRoutes.find(
		(candidate) => candidate.name === name,
	);
	if (!route) {
		throw new Error(`[anchorbrowser] missing route: ${name}`);
	}
	return route;
}

export async function logAnchorBrowserOperation(
	ctx: AnchorBrowserContext,
	input: AnchorBrowserEndpointInput,
	route: AnchorBrowserRoute,
	status: 'completed' | 'failed',
) {
	await logEventFromContext(
		ctx,
		`anchorbrowser.${route.group}.${route.name}`,
		{ method: route.method, path: route.path },
		status,
	);
}

export async function requestAnchorBrowserOperation(
	ctx: AnchorBrowserContext,
	input: AnchorBrowserEndpointInput,
	route: AnchorBrowserRoute,
) {
	return makeAnchorBrowserRequest(
		resolvePath(route.path, input, route),
		ctx.key,
		{
			method: route.method,
			body: requestBody(route, input),
			query: buildQuery(route, input),
			// input.headers is unknown via the AnchorBrowserEndpointInput index signature;
			// callers supply string-valued header maps validated by per-op Zod schemas.
			headers: input.headers as Record<string, string> | undefined,
		},
	);
}

export async function executeAnchorBrowserOperation(
	ctx: AnchorBrowserContext,
	input: AnchorBrowserEndpointInput,
	route: AnchorBrowserRoute,
) {
	let status: 'completed' | 'failed' = 'completed';
	try {
		const result = await requestAnchorBrowserOperation(ctx, input, route);
		await syncAnchorBrowserOperationCache(ctx, route, input, result);
		return result;
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		await logAnchorBrowserOperation(ctx, input, route, status);
	}
}
