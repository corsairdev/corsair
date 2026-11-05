import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeAgencyZoomRequest } from '../client';
import type { AgencyZoomContext } from '../index';
import { syncAgencyZoomOperationCache } from './cache-sync';
import type { AgencyZoomRoute } from './routes';
import { agencyZoomRoutes } from './routes';
import type { AgencyZoomEndpointInput } from './types';

const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {
	customerId: ['customerId', 'customer_id'],
	leadId: ['leadId', 'lead_id'],
	opportunityId: ['opportunityId', 'opportunity_id'],
	driverId: ['driverId', 'driver_id'],
	vehicleId: ['vehicleId', 'vehicle_id'],
	taskId: ['taskId', 'task_id'],
	policyId: ['policyId', 'policy_id'],
	fileId: ['fileId', 'file_id'],
	quoteId: ['quoteId', 'quote_id'],
	threadId: ['threadId', 'thread_id'],
	messageId: ['messageId', 'message_id'],
	id: ['id', 'serviceTicketId'],
};

const BODY_CONTROL_KEYS = new Set(['body', 'query', 'headers']);

// AgencyZoom response payloads vary by resource; outputs validated via shared Zod schemas.
export type AgencyZoomEndpoint = CorsairEndpoint<
	AgencyZoomContext,
	AgencyZoomEndpointInput,
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
		throw new Error('[agencyzoom] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(
	input: AgencyZoomEndpointInput,
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
	input: AgencyZoomEndpointInput,
	route?: Pick<AgencyZoomRoute, 'pathParams'>,
): string {
	const pathOnly = path.split('?')[0] ?? path;
	let index = 0;
	return pathOnly.replace(/\{([^}]+)\}/g, (_, placeholder: string) => {
		const mappedKey = route?.pathParams?.[index];
		index += 1;
		if (mappedKey !== undefined) {
			const direct =
				input[mappedKey] ??
				input[camelToSnake(mappedKey)] ??
				resolvePathParam(input, mappedKey);
			if (direct !== undefined) {
				return encodePathPart(direct);
			}
		}
		return encodePathPart(resolvePathParam(input, placeholder));
	});
}

function buildQuery(route: AgencyZoomRoute, input: AgencyZoomEndpointInput) {
	const query: Record<string, unknown> = { ...(input.query ?? {}) };
	for (const key of route.queryParams ?? []) {
		const snake = camelToSnake(key);
		const value = input[snake] ?? input[key] ?? resolvePathParam(input, key);
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

export function requestBody(
	route: AgencyZoomRoute,
	input: AgencyZoomEndpointInput,
) {
	if ('body' in input && input.body !== undefined) return input.body;
	const pathParams = new Set(
		(route.pathParams ?? []).flatMap((key) => [
			key,
			camelToSnake(key),
			...(PATH_PARAM_ALIASES[key] ?? []),
		]),
	);
	// Some AgencyZoom writes require the path id in the JSON body as well (e.g. updateTask).
	const bodyPathParams = new Set(
		(route.bodyPathParams ?? []).flatMap((key) => [
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
			const isExcludedPathParam =
				pathParams.has(key) && !bodyPathParams.has(key);
			return (
				!isExcludedPathParam &&
				!queryParams.has(key) &&
				!BODY_CONTROL_KEYS.has(key) &&
				value !== undefined
			);
		}),
	);
	return Object.keys(body).length > 0 ? body : undefined;
}

export function getRoute(name: string): AgencyZoomRoute {
	const route = agencyZoomRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[agencyzoom] missing route: ${name}`);
	}
	return route;
}

export async function logAgencyZoomOperation(
	ctx: AgencyZoomContext,
	input: AgencyZoomEndpointInput,
	route: AgencyZoomRoute,
	status: 'completed' | 'failed',
) {
	try {
		await logEventFromContext(
			ctx,
			`agencyzoom.${route.group}.${route.name}`,
			{ method: route.method, path: route.path },
			status,
		);
	} catch (error) {
		console.warn('[agencyzoom] Failed to log operation event:', error);
	}
}

export async function requestAgencyZoomOperation(
	ctx: AgencyZoomContext,
	input: AgencyZoomEndpointInput,
	route: AgencyZoomRoute,
) {
	if (route.requiresAuth !== false && !ctx.key) {
		console.error(
			'[AGENCYZOOM] JWT token missing — connect AgencyZoom or pass key in plugin options.',
		);
		throw new AuthMissingError('agencyzoom', 'api_key');
	}

	return makeAgencyZoomRequest(
		resolvePath(route.path, input, route),
		ctx.key ?? '',
		{
			method: route.method,
			body: requestBody(route, input),
			query: buildQuery(route, input),
			// input.headers is unknown via the AgencyZoomEndpointInput index signature;
			// callers supply string-valued header maps validated by per-op Zod schemas.
			headers: input.headers as Record<string, string> | undefined,
		},
	);
}

export async function executeAgencyZoomOperation(
	ctx: AgencyZoomContext,
	input: AgencyZoomEndpointInput,
	route: AgencyZoomRoute,
) {
	let status: 'completed' | 'failed' = 'completed';
	try {
		const result = await requestAgencyZoomOperation(ctx, input, route);
		await syncAgencyZoomOperationCache(ctx, route, input, result);
		return result;
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		await logAgencyZoomOperation(ctx, input, route, status);
	}
}
