import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeActiveTrailRequest } from '../client';
import type { ActiveTrailContext } from '../index';
import type { ActiveTrailRoute } from './routes';
import type { ActiveTrailEndpointInput } from './types';

const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {
	id: ['id', 'group_id', 'contact_id', 'campaign_id', 'mailinglist_id', 'webhook_id', 'template_id', 'automation_id', 'category_id', 'parameter_id', 'order_id', 'site_id', 'segmentation_id'],
	ids: ['ids', 'id'],
	group_id: ['group_id', 'id'],
	contact_id: ['contact_id', 'id'],
	mailinglist_id: ['mailinglist_id', 'id'],
	campaign_id: ['campaign_id', 'id'],
	webhook_id: ['webhook_id', 'id'],
	stepId: ['step_id', 'stepId'],
	FieldsType: ['fields_type', 'FieldsType'],
	FromDate: ['from_date', 'FromDate'],
	ToDate: ['to_date', 'ToDate'],
};

const BODY_CONTROL_KEYS = new Set(['body', 'query', 'headers']);

// Response shapes vary across 159 ActiveTrail endpoints; outputs are validated at runtime via Zod.
export type ActiveTrailEndpoint = CorsairEndpoint<
	ActiveTrailContext,
	ActiveTrailEndpointInput,
	unknown
>;

function camelToSnake(value: string): string {
	return value.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
}

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[active_trail] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(input: ActiveTrailEndpointInput, pathKey: string): unknown {
	const snake = camelToSnake(pathKey);
	const candidates = [pathKey, snake, ...(PATH_PARAM_ALIASES[pathKey] ?? [])];
	for (const candidate of candidates) {
		if (input[candidate] !== undefined) return input[candidate];
	}
	return undefined;
}

export function resolvePath(
	path: string,
	input: ActiveTrailEndpointInput,
	route?: Pick<ActiveTrailRoute, 'pathParams'>,
): string {
	const pathOnly = path.split('?')[0] ?? path;
	let index = 0;
	return pathOnly.replace(/\{([^}]+)\}/g, (_, placeholder: string) => {
		const mappedKey = route?.pathParams?.[index];
		index += 1;
		if (mappedKey !== undefined) {
			const direct =
				input[mappedKey] ?? input[camelToSnake(mappedKey)];
			if (direct !== undefined) {
				return encodePathPart(direct);
			}
		}
		return encodePathPart(resolvePathParam(input, placeholder));
	});
}

function buildQuery(route: ActiveTrailRoute, input: ActiveTrailEndpointInput) {
	const query: Record<string, unknown> = { ...(input.query ?? {}) };
	for (const key of route.queryParams ?? []) {
		const snake = camelToSnake(key);
		const value =
			input[snake] ?? input[key] ?? resolvePathParam(input, key);
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

function requestBody(route: ActiveTrailRoute, input: ActiveTrailEndpointInput) {
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

export async function logActiveTrailOperation(
	ctx: ActiveTrailContext,
	input: ActiveTrailEndpointInput,
	route: ActiveTrailRoute,
) {
	await logEventFromContext(
		ctx,
		`active_trail.${route.group}.${route.name}`,
		{ method: route.method, path: route.path },
		'completed',
	);
}

export async function requestActiveTrailOperation(
	ctx: ActiveTrailContext,
	input: ActiveTrailEndpointInput,
	route: ActiveTrailRoute,
) {
	return makeActiveTrailRequest(resolvePath(route.path, input, route), ctx.key, {
		method: route.method,
		body: requestBody(route, input),
		query: buildQuery(route, input),
		// headers is optional unknown on ActiveTrailEndpointInput; callers pass string header maps.
		headers: input.headers as Record<string, string> | undefined,
	});
}
