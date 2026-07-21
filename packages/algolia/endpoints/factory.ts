import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeAlgoliaRequest } from '../client';
import type { AlgoliaContext } from '../index';
import { syncAlgoliaOperationCache } from './cache-sync';
import type { AlgoliaRoute } from './routes';
import { algoliaRoutes } from './routes';
import type { AlgoliaEndpointInput } from './types';

const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {
	indexName: ['indexName', 'index_name', 'index'],
	objectID: ['objectID', 'object_id'],
	facetName: ['facetName', 'facet_name'],
	dictionaryName: ['dictionaryName', 'dictionary_name'],
	authenticationID: ['authenticationID', 'authentication_id'],
	destinationID: ['destinationID', 'destination_id'],
	sourceID: ['sourceID', 'source_id'],
	transformationID: ['transformationID', 'transformation_id'],
	taskID: ['taskID', 'task_id'],
	userToken: ['userToken', 'user_token'],
	model: ['model'],
	attribute: ['attribute'],
	key: ['key'],
	id: ['id'],
};

const BODY_CONTROL_KEYS = new Set([
	'body',
	'query',
	'headers',
	'region',
	'baseUrl',
]);

// Output is `unknown` because Algolia's responses vary wildly across 133
// operations (search hits, task acknowledgements, paginated lists, etc.)
// and each call site narrows with the matching Zod output schema from
// `algoliaEndpointSchemas`. Modeling a single union here would force
// callers to re-narrow anyway.
export type AlgoliaEndpoint = CorsairEndpoint<
	AlgoliaContext,
	AlgoliaEndpointInput,
	unknown
>;

function camelToSnake(value: string): string {
	return (
		value
			// Insert underscore at lowercase/digit → uppercase boundary (indexName → index_Name).
			.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
			// Insert underscore at consecutive-caps → Cap+lowercase boundary (HTTPSConn → HTTPS_Conn).
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			.toLowerCase()
	);
}

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[algolia] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(
	input: AlgoliaEndpointInput,
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
	input: AlgoliaEndpointInput,
	route?: Pick<AlgoliaRoute, 'pathParams'>,
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

function buildQuery(route: AlgoliaRoute, input: AlgoliaEndpointInput) {
	// AlgoliaEndpointInput is a union of 133 input schemas; query is narrowed here for merging.
	const query: Record<string, unknown> =
		input.query &&
		typeof input.query === 'object' &&
		!Array.isArray(input.query)
			? { ...(input.query as Record<string, unknown>) }
			: {};
	for (const key of route.queryParams ?? []) {
		const snake = camelToSnake(key);
		const value = input[snake] ?? input[key] ?? resolvePathParam(input, key);
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

function isControlField(key: string, value: unknown): boolean {
	if (!BODY_CONTROL_KEYS.has(key)) return false;
	if (key === 'query' && typeof value !== 'object') return false;
	return true;
}

function requestBody(route: AlgoliaRoute, input: AlgoliaEndpointInput) {
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
				!isControlField(key, value) &&
				value !== undefined
			);
		}),
	);
	return Object.keys(body).length > 0 ? body : undefined;
}

export function getRoute(name: string): AlgoliaRoute {
	const route = algoliaRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[algolia] missing route: ${name}`);
	}
	return route;
}

export async function resolveBaseUrl(
	ctx: AlgoliaContext,
	input: AlgoliaEndpointInput,
	route: Pick<AlgoliaRoute, 'hostType'>,
): Promise<string> {
	// Optional per-request baseUrl override; not present on every input schema in the union.
	const explicitBaseUrl = (input as { baseUrl?: string }).baseUrl;
	if (explicitBaseUrl) return explicitBaseUrl;

	// applicationId is normally validated by ensureApplicationId in the
	// keyBuilder before this function can run. Resolve it again here and
	// throw defensively so a future caller that bypasses keyBuilder (or a
	// bug that skips it) gets a clear AuthMissingError instead of an opaque
	// DNS failure on `https://-dsn.algolia.net`.
	const applicationId =
		ctx.options.applicationId ?? (await ctx.keys.get_applicationId());
	if (!applicationId) {
		throw new AuthMissingError('algolia', 'api_key');
	}
	// region is optional on analytics/ingestion inputs; fall back to plugin default.
	const region =
		(input as { region?: string }).region ?? ctx.options.region ?? 'us';

	switch (route.hostType) {
		case 'search':
			return `https://${applicationId}-dsn.algolia.net`;
		case 'analytics':
			return region === 'de'
				? 'https://analytics.de.algolia.com'
				: 'https://analytics.algolia.com';
		case 'ingestion':
			return `https://data.${region}.algolia.com`;
		case 'insights':
			return region === 'de' || region === 'eu'
				? 'https://insights.eu.algolia.io'
				: 'https://insights.algolia.io';
		case 'querySuggestions':
			return `https://query-suggestions.${region}.algolia.com`;
		case 'usage':
			return 'https://usage.algolia.com';
		case 'personalization':
			return `https://ai-personalization.${region}.algolia.com`;
		default:
			return `https://${applicationId}-dsn.algolia.net`;
	}
}

export async function logAlgoliaOperation(
	ctx: AlgoliaContext,
	input: AlgoliaEndpointInput,
	route: AlgoliaRoute,
	status: 'completed' | 'failed',
) {
	await logEventFromContext(
		ctx,
		`algolia.${route.group}.${route.name}`,
		{ method: route.method, path: route.path, hostType: route.hostType },
		status,
	);
}

export async function requestAlgoliaOperation(
	ctx: AlgoliaContext,
	input: AlgoliaEndpointInput,
	route: AlgoliaRoute,
) {
	const applicationId =
		ctx.options.applicationId ?? (await ctx.keys.get_applicationId()) ?? '';
	const apiKey = ctx.key;
	const baseUrl = await resolveBaseUrl(ctx, input, route);

	return makeAlgoliaRequest(
		resolvePath(route.path, input, route),
		applicationId,
		apiKey,
		{
			method: route.method,
			body: requestBody(route, input),
			query: buildQuery(route, input),
			// headers is optional unknown on AlgoliaEndpointInput; callers pass string header maps.
			headers: input.headers as Record<string, string> | undefined,
			baseUrl,
		},
	);
}

export async function executeAlgoliaOperation(
	ctx: AlgoliaContext,
	input: AlgoliaEndpointInput,
	route: AlgoliaRoute,
) {
	let status: 'completed' | 'failed' = 'completed';
	try {
		const result = await requestAlgoliaOperation(ctx, input, route);
		await syncAlgoliaOperationCache(ctx, route, input, result);
		return result;
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		await logAlgoliaOperation(ctx, input, route, status);
	}
}
