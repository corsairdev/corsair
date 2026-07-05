import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeDigitalOceanRequest } from '../client';
import type { DigitalOceanContext } from '../index';
import type { DigitalOceanRoute } from './routes';
import type { DigitalOceanEndpointInput } from './types';

const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {
	domain_name: ['domain_name', 'name'],
	name: ['name', 'domain_name'],
	vpc_uuid: ['vpc_uuid', 'vpc_id'],
	vpc_id: ['vpc_id', 'vpc_uuid'],
	tag_name: ['tag_name', 'name'],
};

const BODY_CONTROL_KEYS = new Set(['body', 'query', 'headers']);

export type DigitalOceanEndpoint = CorsairEndpoint<
	DigitalOceanContext,
	DigitalOceanEndpointInput,
	unknown
>;

function camelToSnake(value: string): string {
	return value.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
}

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[digital_ocean] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(input: DigitalOceanEndpointInput, pathKey: string): unknown {
	const snake = camelToSnake(pathKey);
	const candidates = [pathKey, snake, ...(PATH_PARAM_ALIASES[pathKey] ?? [])];
	for (const candidate of candidates) {
		if (input[candidate] !== undefined) return input[candidate];
	}
	return undefined;
}

export function resolvePath(path: string, input: DigitalOceanEndpointInput): string {
	const pathOnly = path.split('?')[0] ?? path;
	return pathOnly.replace(/\{([^}]+)\}/g, (_, key: string) =>
		encodePathPart(resolvePathParam(input, key)),
	);
}

function buildQuery(route: DigitalOceanRoute, input: DigitalOceanEndpointInput) {
	const query: Record<string, unknown> = { ...(input.query ?? {}) };
	for (const key of route.queryParams ?? []) {
		const snake = camelToSnake(key);
		const value =
			input[snake] ?? input[key] ?? resolvePathParam(input, key);
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

function requestBody(route: DigitalOceanRoute, input: DigitalOceanEndpointInput) {
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

export async function logDigitalOceanOperation(
	ctx: DigitalOceanContext,
	input: DigitalOceanEndpointInput,
	route: DigitalOceanRoute,
) {
	await logEventFromContext(
		ctx,
		`digital_ocean.${route.group}.${route.name}`,
		{ method: route.method, path: route.path },
		'completed',
	);
}

export async function requestDigitalOceanOperation(
	ctx: DigitalOceanContext,
	input: DigitalOceanEndpointInput,
	route: DigitalOceanRoute,
) {
	return makeDigitalOceanRequest(resolvePath(route.path, input), ctx.key, {
		method: route.method,
		body: requestBody(route, input),
		query: buildQuery(route, input),
		headers: input.headers as Record<string, string> | undefined,
	});
}
