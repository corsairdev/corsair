import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeFlutterwaveRequest } from '../client';
import type { FlutterwaveContext } from '../index';
import type { FlutterwaveRoute } from './routes';
import { flutterwaveRoutes } from './routes';
import type { FlutterwaveEndpointInput } from './types';

const CONTROL_KEYS = new Set(['body', 'query', 'headers']);

export type FlutterwaveEndpoint = CorsairEndpoint<
	FlutterwaveContext,
	FlutterwaveEndpointInput,
	unknown
>;

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[flutterwave] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function camelToSnake(value: string): string {
	return value
		.replace(/([A-Z])/g, '_$1')
		.replace(/^_/, '')
		.toLowerCase();
}

function resolvePathParam(
	input: FlutterwaveEndpointInput,
	key: string,
): unknown {
	if (input[key] !== undefined) return input[key];
	const snake = camelToSnake(key);
	if (input[snake] !== undefined) return input[snake];
	return undefined;
}

export function resolvePath(
	route: FlutterwaveRoute,
	input: FlutterwaveEndpointInput,
): string {
	let i = 0;
	return route.path.replace(/\{([^}]+)\}/g, (_, placeholder: string) => {
		const mappedKey = route.pathParams?.[i] ?? placeholder;
		i += 1;
		return encodePathPart(resolvePathParam(input, mappedKey));
	});
}

function buildQuery(
	route: FlutterwaveRoute,
	input: FlutterwaveEndpointInput,
): Record<string, string | number | boolean | undefined> | undefined {
	const query: Record<string, string | number | boolean | undefined> = {
		...(input.query ?? {}),
	};

	for (const key of route.queryParams ?? []) {
		const value = resolvePathParam(input, key);
		if (
			value !== undefined &&
			(typeof value === 'string' ||
				typeof value === 'number' ||
				typeof value === 'boolean')
		) {
			query[key] = value;
		}
	}

	return Object.keys(query).length > 0 ? query : undefined;
}

function buildBody(
	route: FlutterwaveRoute,
	input: FlutterwaveEndpointInput,
): Record<string, unknown> | undefined {
	if (
		input.body &&
		typeof input.body === 'object' &&
		!Array.isArray(input.body)
	) {
		return input.body;
	}

	const pathParams = new Set(route.pathParams ?? []);
	const queryParams = new Set(route.queryParams ?? []);

	const body = Object.fromEntries(
		Object.entries(input).filter(([key, value]) => {
			if (value === undefined) return false;
			if (CONTROL_KEYS.has(key)) return false;
			if (pathParams.has(key)) return false;
			if (queryParams.has(key)) return false;
			if (pathParams.has(camelToSnake(key))) return false;
			if (queryParams.has(camelToSnake(key))) return false;
			return true;
		}),
	);

	return Object.keys(body).length > 0 ? body : undefined;
}

export function getRoute(name: string): FlutterwaveRoute {
	const route = flutterwaveRoutes.find((candidate) => candidate.key === name);
	if (!route) {
		throw new Error(`[flutterwave] missing route: ${name}`);
	}
	return route;
}

export async function executeFlutterwaveOperation(
	ctx: FlutterwaveContext,
	input: FlutterwaveEndpointInput,
	route: FlutterwaveRoute,
): Promise<unknown> {
	const response = await makeFlutterwaveRequest(
		resolvePath(route, input),
		ctx.key,
		{
			method: route.method,
			body: buildBody(route, input),
			query: buildQuery(route, input),
			headers: input.headers,
		},
	);

	await logEventFromContext(
		ctx,
		`flutterwave.${route.group}.${route.name}`,
		{ method: route.method, path: route.path },
		'completed',
	);

	return response;
}
