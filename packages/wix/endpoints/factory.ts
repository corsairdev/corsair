import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeWixRequest } from '../client';
import type { WixContext } from '../index';
import type { WixRoute } from './routes';
import { wixRoutes } from './routes';

export type WixEndpointInput = Record<string, unknown>;

export type WixEndpoint = CorsairEndpoint<
	WixContext,
	WixEndpointInput,
	unknown
>;

const BODY_CONTROL_KEYS = new Set([
	'body',
	'query',
	'headers',
	'baseUrl',
	'siteId',
	'accountId',
]);

const QUERY_BODY_KEYS = new Set([
	'filter',
	'sort',
	'paging',
	'limit',
	'offset',
	'fields',
	'fieldsets',
	'search',
]);

function camelToSnake(value: string): string {
	return value
		.replace(/([A-Z])/g, '_$1')
		.replace(/^_/, '')
		.toLowerCase();
}

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[wix] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(input: WixEndpointInput, pathKey: string): unknown {
	const snake = camelToSnake(pathKey);
	const candidates = [pathKey, snake];
	for (const candidate of candidates) {
		if (input[candidate] !== undefined) return input[candidate];
	}
	return undefined;
}

export function resolvePath(
	path: string,
	input: WixEndpointInput,
	route?: Pick<WixRoute, 'pathParams'>,
): string {
	const pathOnly = path.split('?')[0] ?? path;
	let index = 0;
	return pathOnly.replace(/\{([^}]+)\}/g, (_match, placeholder: string) => {
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

function buildQuery(route: WixRoute, input: WixEndpointInput) {
	const queryBag = (input.query ?? {}) as Record<string, unknown>;
	const query: Record<string, unknown> = { ...queryBag };
	for (const key of route.queryParams ?? []) {
		const value = input[key] ?? input[camelToSnake(key)];
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

function buildQueryBody(input: WixEndpointInput): Record<string, unknown> {
	const query: Record<string, unknown> = {};
	if (input.filter !== undefined) query.filter = input.filter;
	if (input.sort !== undefined) query.sort = input.sort;
	const paging = input.paging;
	if (paging !== undefined) {
		query.paging = paging;
	} else if (input.limit !== undefined || input.offset !== undefined) {
		query.paging = {
			...(input.limit !== undefined ? { limit: input.limit } : {}),
			...(input.offset !== undefined ? { offset: input.offset } : {}),
		};
	}
	if (input.fields !== undefined) query.fields = input.fields;
	if (input.fieldsets !== undefined) query.fieldsets = input.fieldsets;
	const body: Record<string, unknown> = { query };
	if (input.search !== undefined) body.search = input.search;
	return body;
}

function requestBody(route: WixRoute, input: WixEndpointInput): unknown {
	if ('body' in input && input.body !== undefined) return input.body;

	const pathParams = new Set(route.pathParams ?? []);
	const queryParams = new Set(
		(route.queryParams ?? []).flatMap((key) => [key, camelToSnake(key)]),
	);

	if (route.queryBody) {
		const body = buildQueryBody(input);
		const extras = Object.fromEntries(
			Object.entries(input).filter(
				([key, value]) =>
					!pathParams.has(key) &&
					!queryParams.has(key) &&
					!BODY_CONTROL_KEYS.has(key) &&
					!QUERY_BODY_KEYS.has(camelToSnake(key)) &&
					!QUERY_BODY_KEYS.has(key) &&
					value !== undefined,
			),
		);
		return { ...body, ...extras };
	}

	const body = Object.fromEntries(
		Object.entries(input).filter(
			([key, value]) =>
				!pathParams.has(key) &&
				!queryParams.has(key) &&
				!BODY_CONTROL_KEYS.has(key) &&
				value !== undefined,
		),
	);
	return Object.keys(body).length > 0 ? body : undefined;
}

export function getRoute(key: string): WixRoute {
	const route = wixRoutes.find((candidate) => candidate.key === key);
	if (!route) {
		throw new Error(`[wix] missing route: ${key}`);
	}
	return route;
}

export function defineOp(key: string): WixEndpoint {
	const route = getRoute(key);
	return async (ctx, input = {}) => executeWixOperation(ctx, input, route);
}

export async function requestWixOperation(
	ctx: WixContext,
	input: WixEndpointInput,
	route: WixRoute,
) {
	const headers =
		(input.headers as Record<string, string> | undefined) ?? undefined;
	return makeWixRequest(resolvePath(route.path, input, route), ctx.key, {
		method: route.method,
		body: requestBody(route, input),
		query: buildQuery(route, input),
		headers,
		siteId: input.siteId as string | undefined,
		accountId: input.accountId as string | undefined,
	});
}

export async function executeWixOperation(
	ctx: WixContext,
	input: WixEndpointInput,
	route: WixRoute,
) {
	let status: 'completed' | 'failed' = 'completed';
	try {
		return await requestWixOperation(ctx, input, route);
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		try {
			await logEventFromContext(
				ctx,
				`wix.${route.group}.${route.name}`,
				{ method: route.method, path: route.path },
				status,
			);
		} catch (error) {
			console.warn('[wix] Failed to log operation event:', error);
		}
	}
}
