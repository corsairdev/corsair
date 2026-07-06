import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeAffindaRequest } from '../client';
import type { AffindaContext } from '../index';
import { syncAffindaOperationCache } from './cache-sync';
import { affindaRoutes, type AffindaRoute } from './routes';
import type { AffindaEndpointInput } from './types';

const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {
	identifier: ['identifier', 'collection_id', 'collectionId', 'document_id', 'documentId'],
	id: ['id'],
	name: ['name', 'index_name', 'indexName'],
	datapoint_identifier: ['datapoint_identifier', 'datapointIdentifier', 'data_point_id'],
	value: ['value'],
	token: ['token'],
};

const BODY_CONTROL_KEYS = new Set(['body', 'query', 'headers']);

export type AffindaEndpoint = CorsairEndpoint<
	AffindaContext,
	AffindaEndpointInput,
	unknown
>;

function camelToSnake(value: string): string {
	return value.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
}

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[affinda] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(input: AffindaEndpointInput, pathKey: string): unknown {
	const snake = camelToSnake(pathKey);
	const candidates = [pathKey, snake, ...(PATH_PARAM_ALIASES[pathKey] ?? [])];
	for (const candidate of candidates) {
		if (input[candidate] !== undefined) return input[candidate];
	}
	return undefined;
}

export function resolvePath(
	path: string,
	input: AffindaEndpointInput,
	route?: Pick<AffindaRoute, 'pathParams'>,
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

function buildQuery(route: AffindaRoute, input: AffindaEndpointInput) {
	const query: Record<string, unknown> = { ...(input.query ?? {}) };
	for (const key of route.queryParams ?? []) {
		const snake = camelToSnake(key);
		const value =
			input[snake] ?? input[key] ?? resolvePathParam(input, key);
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

function requestBody(route: AffindaRoute, input: AffindaEndpointInput) {
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

export function getRoute(name: string): AffindaRoute {
	const route = affindaRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[affinda] missing route: ${name}`);
	}
	return route;
}

export async function logAffindaOperation(
	ctx: AffindaContext,
	input: AffindaEndpointInput,
	route: AffindaRoute,
	status: 'completed' | 'failed',
) {
	await logEventFromContext(
		ctx,
		`affinda.${route.group}.${route.name}`,
		{ method: route.method, path: route.path },
		status,
	);
}

export async function requestAffindaOperation(
	ctx: AffindaContext,
	input: AffindaEndpointInput,
	route: AffindaRoute,
) {
	return makeAffindaRequest(resolvePath(route.path, input, route), ctx.key, {
		method: route.method,
		body: requestBody(route, input),
		query: buildQuery(route, input),
		headers: input.headers as Record<string, string> | undefined,
	});
}

export async function executeAffindaOperation(
	ctx: AffindaContext,
	input: AffindaEndpointInput,
	route: AffindaRoute,
) {
	let status: 'completed' | 'failed' = 'completed';
	try {
		const result = await requestAffindaOperation(ctx, input, route);
		await syncAffindaOperationCache(ctx, route, input, result);
		return result;
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		await logAffindaOperation(ctx, input, route, status);
	}
}
