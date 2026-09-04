import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeWixRequest } from '../client';
import type { WixContext } from '../index';
import type { WixRoute } from './routes';
import { wixRoutes } from './routes';
import { WixEndpointInputSchemas, WixEndpointOutputSchemas } from './types';

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
	// For queryBody and graphql routes the query options belong in the POST
	// body (`{ query: {...} }` or the GraphQL document), not in the URL
	// query string. For graphql routes `input.query` is the GraphQL document
	// itself and must never leak into URL parameters.
	const queryBag =
		route.queryBody || route.graphql
			? {}
			: ((input.query ?? {}) as Record<string, unknown>);
	const query: Record<string, unknown> = { ...queryBag };
	for (const key of route.queryParams ?? []) {
		const value = input[key] ?? input[camelToSnake(key)];
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

function buildQueryBody(input: WixEndpointInput): Record<string, unknown> {
	// Callers may pass Wix query options either as the `{ query: {...} }`
	// object or as top-level fields; both forms must reach the body query.
	const query: Record<string, unknown> = {
		...((input.query ?? {}) as Record<string, unknown>),
	};
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
	if (input.search !== undefined) query.search = input.search;
	return { query };
}

/**
 * GraphQL endpoints speak `{ query: <document string>, variables: {...} }`.
 * The caller supplies the GraphQL document; any legacy `filter` input is
 * forwarded as a variable so existing call sites keep working.
 */
function buildGraphqlBody(input: WixEndpointInput): Record<string, unknown> {
	const body: Record<string, unknown> = {};
	if (input.query !== undefined) body.query = input.query;
	const variables: Record<string, unknown> = {
		...((input.variables ?? {}) as Record<string, unknown>),
	};
	if (input.filter !== undefined) variables.filter = input.filter;
	if (Object.keys(variables).length > 0) body.variables = variables;
	return body;
}

function requestBody(route: WixRoute, input: WixEndpointInput): unknown {
	if ('body' in input && input.body !== undefined) return input.body;

	// resolvePath accepts both camelCase and snake_case path parameters, so
	// both forms must be excluded from the request body.
	const pathParams = new Set(
		(route.pathParams ?? []).flatMap((key) => [key, camelToSnake(key)]),
	);
	const queryParams = new Set(
		(route.queryParams ?? []).flatMap((key) => [key, camelToSnake(key)]),
	);

	if (route.graphql) {
		return buildGraphqlBody(input);
	}

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
	// Resolve the path first so a missing path parameter surfaces the
	// caller-friendly "[wix] missing required path parameter" error before
	// schema validation reports a less specific message.
	const path = resolvePath(route.path, input, route);
	// The shared binder registers `endpointSchemas` as introspection metadata
	// only, so parsing here is what actually enforces the declared contract:
	// malformed input never reaches the Wix API.
	const inputSchema =
		WixEndpointInputSchemas[route.key as keyof typeof WixEndpointInputSchemas];
	const validated = (
		inputSchema ? inputSchema.parse(input ?? {}) : input
	) as WixEndpointInput;
	const headers =
		(validated.headers as Record<string, string> | undefined) ?? undefined;
	// Site-level scoping: an explicit per-call siteId always wins. When the
	// caller explicitly scopes the request to an account, the plugin-level
	// siteId default is suppressed so account-level calls are never polluted
	// with a site header (the client rejects any combination of both).
	const accountId = validated.accountId as string | undefined;
	const siteId =
		(validated.siteId as string | undefined) ??
		(accountId ? undefined : ctx.options?.siteId);
	return makeWixRequest(path, ctx.key, {
		method: route.method,
		body: requestBody(route, validated),
		query: buildQuery(route, validated),
		headers,
		siteId,
		accountId,
		authType: ctx.options?.authType,
	});
}

export async function executeWixOperation(
	ctx: WixContext,
	input: WixEndpointInput,
	route: WixRoute,
) {
	let status: 'completed' | 'failed' = 'completed';
	try {
		const response = await requestWixOperation(ctx, input, route);
		// Responses are validated against the registered output schema so a
		// payload that breaks the declared contract fails loudly instead of
		// reaching consumers malformed.
		const outputSchema =
			WixEndpointOutputSchemas[
				route.key as keyof typeof WixEndpointOutputSchemas
			];
		return outputSchema ? outputSchema.parse(response) : response;
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
