import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeDigitalOceanRequest } from '../client';
import type { DigitalOceanContext } from '../index';
import { syncDigitalOceanOperationCache } from './cache-sync';
import type { DigitalOceanRoute } from './routes';
import { digitalOceanRoutes } from './routes';
import type { DigitalOceanEndpointInput } from './types';

const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {
	domain_name: ['domain_name', 'name'],
	name: ['name', 'domain_name'],
	vpc_uuid: ['vpc_uuid', 'vpc_id'],
	vpc_id: ['vpc_id', 'vpc_uuid'],
	tag_name: ['tag_name', 'name'],
};

const BODY_CONTROL_KEYS = new Set(['body', 'query', 'headers']);

// DigitalOcean response payloads vary by resource; outputs validated via shared Zod schemas.
export type DigitalOceanEndpoint = CorsairEndpoint<
	DigitalOceanContext,
	DigitalOceanEndpointInput,
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
		throw new Error('[digitalocean] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(
	input: DigitalOceanEndpointInput,
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
	input: DigitalOceanEndpointInput,
	route?: Pick<DigitalOceanRoute, 'pathParams'>,
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

function buildQuery(
	route: DigitalOceanRoute,
	input: DigitalOceanEndpointInput,
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
	route: DigitalOceanRoute,
	input: DigitalOceanEndpointInput,
) {
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

export function getRoute(name: string): DigitalOceanRoute {
	const route = digitalOceanRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[digitalocean] missing route: ${name}`);
	}
	return route;
}

export async function logDigitalOceanOperation(
	ctx: DigitalOceanContext,
	input: DigitalOceanEndpointInput,
	route: DigitalOceanRoute,
	status: 'completed' | 'failed' = 'completed',
) {
	await logEventFromContext(
		ctx,
		`digitalocean.${route.group}.${route.name}`,
		{ method: route.method, path: route.path },
		status,
	);
}

export async function requestDigitalOceanOperation(
	ctx: DigitalOceanContext,
	input: DigitalOceanEndpointInput,
	route: DigitalOceanRoute,
) {
	return makeDigitalOceanRequest(
		resolvePath(route.path, input, route),
		ctx.key,
		{
			method: route.method,
			body: requestBody(route, input),
			query: buildQuery(route, input),
			// headers is optional unknown on DigitalOceanEndpointInput; callers pass string header maps.
			headers: input.headers as Record<string, string> | undefined,
		},
	);
}

export async function executeDigitalOceanOperation(
	ctx: DigitalOceanContext,
	input: DigitalOceanEndpointInput,
	route: DigitalOceanRoute,
) {
	let status: 'completed' | 'failed' = 'completed';
	try {
		const result = await requestDigitalOceanOperation(ctx, input, route);
		await syncDigitalOceanOperationCache(ctx, route, input, result);
		return result;
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		await logDigitalOceanOperation(ctx, input, route, status);
	}
}
