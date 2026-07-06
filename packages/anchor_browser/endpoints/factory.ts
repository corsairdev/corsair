import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeAnchorBrowserRequest } from '../client';
import type { AnchorBrowserContext } from '../index';
import { anchorBrowserRoutes, type AnchorBrowserRoute } from './routes';
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
	return value.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
}

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[anchor_browser] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(input: AnchorBrowserEndpointInput, pathKey: string): unknown {
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

function buildQuery(route: AnchorBrowserRoute, input: AnchorBrowserEndpointInput) {
	const query: Record<string, unknown> = { ...(input.query ?? {}) };
	for (const key of route.queryParams ?? []) {
		const snake = camelToSnake(key);
		const value =
			input[snake] ?? input[key] ?? resolvePathParam(input, key);
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

function requestBody(route: AnchorBrowserRoute, input: AnchorBrowserEndpointInput) {
	if ('body' in input && input.body !== undefined) return input.body;
	const pathParams = new Set(route.pathParams ?? []);
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
	const route = anchorBrowserRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[anchor_browser] missing route: ${name}`);
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
		`anchor_browser.${route.group}.${route.name}`,
		{ method: route.method, path: route.path },
		status,
	);
}

export async function requestAnchorBrowserOperation(
	ctx: AnchorBrowserContext,
	input: AnchorBrowserEndpointInput,
	route: AnchorBrowserRoute,
) {
	return makeAnchorBrowserRequest(resolvePath(route.path, input, route), ctx.key, {
		method: route.method,
		body: requestBody(route, input),
		query: buildQuery(route, input),
		// input.headers is unknown via the AnchorBrowserEndpointInput index signature;
		// callers supply string-valued header maps validated by per-op Zod schemas.
		headers: input.headers as Record<string, string> | undefined,
	});
}

export async function executeAnchorBrowserOperation(
	ctx: AnchorBrowserContext,
	input: AnchorBrowserEndpointInput,
	route: AnchorBrowserRoute,
) {
	let status: 'completed' | 'failed' = 'completed';
	try {
		return await requestAnchorBrowserOperation(ctx, input, route);
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		await logAnchorBrowserOperation(ctx, input, route, status);
	}
}
