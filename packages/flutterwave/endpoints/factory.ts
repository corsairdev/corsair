import type { EventLoggingContext } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { makeFlutterwaveRequest } from '../client';
import type { FlutterwaveRoute } from './routes';
import { flutterwaveRoutes } from './routes';
import type {
	FlutterwaveEndpointInput,
	FlutterwaveEndpointOutputs,
} from './types';
import { FlutterwaveEndpointOutputSchemas } from './types';

const CONTROL_KEYS = new Set(['body', 'query', 'headers']);

export type FlutterwaveHandlerContext = EventLoggingContext & {
	key: string;
};

export type FlutterwaveEndpoint = (
	ctx: FlutterwaveHandlerContext,
	input?: FlutterwaveEndpointInput,
) => Promise<FlutterwaveEndpointOutputs[keyof FlutterwaveEndpointOutputs]>;

function encodePathPart(
	// unknown is necessary because path params arrive from a shared input bag; a closed union is infeasible because each route substitutes different param types
	value: unknown,
): string {
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

function asInputBag(
	input: FlutterwaveEndpointInput,
	// unknown is necessary because handlers read dynamic path/query/body keys; a closed bag type is infeasible because the 53 operations do not share one field set
): Record<string, unknown> {
	return input as Record<string, unknown>;
}

function resolvePathParam(
	input: FlutterwaveEndpointInput,
	key: string,
	// unknown is necessary because path values are read from a shared bag; a closed union is infeasible because routes mix string and numeric ids
): unknown {
	const bag = asInputBag(input);
	if (bag[key] !== undefined) return bag[key];
	const snake = camelToSnake(key);
	if (bag[snake] !== undefined) return bag[snake];
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
	const bag = asInputBag(input);
	const query: Record<string, string | number | boolean | undefined> = {
		...(typeof bag.query === 'object' && bag.query && !Array.isArray(bag.query)
			? (bag.query as Record<string, string | number | boolean | undefined>)
			: {}),
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

function isPlainObject(
	// unknown is necessary because body may be any JSON value; a closed object type is infeasible because callers pass both maps and primitives
	value: unknown,
	// unknown is necessary because a validated plain object still has dynamic keys; a closed field union is infeasible at the bag layer
): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function buildBody(
	route: FlutterwaveRoute,
	input: FlutterwaveEndpointInput,
	// unknown is necessary because write JSON is assembled from leftover input keys; a closed body union is infeasible because each POST/PUT shape differs
): Record<string, unknown> | undefined {
	const bag = asInputBag(input);
	const pathParams = new Set(route.pathParams ?? []);
	const queryParams = new Set(route.queryParams ?? []);

	const fromFlat = Object.fromEntries(
		Object.entries(bag).filter(([key, value]) => {
			if (value === undefined) return false;
			if (CONTROL_KEYS.has(key)) return false;
			if (pathParams.has(key)) return false;
			if (queryParams.has(key)) return false;
			if (pathParams.has(camelToSnake(key))) return false;
			if (queryParams.has(camelToSnake(key))) return false;
			return true;
		}),
	);

	const fromBody =
		isPlainObject(bag.body) && Object.keys(bag.body).length > 0 ? bag.body : {};

	const body = { ...fromFlat, ...fromBody };
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
	ctx: FlutterwaveHandlerContext,
	input: FlutterwaveEndpointInput,
	route: FlutterwaveRoute,
): Promise<FlutterwaveEndpointOutputs[keyof FlutterwaveEndpointOutputs]> {
	const response = await makeFlutterwaveRequest(
		resolvePath(route, input),
		ctx.key,
		{
			method: route.method,
			body: buildBody(route, input),
			query: buildQuery(route, input),
			outputSchema: (
				FlutterwaveEndpointOutputSchemas as Record<string, z.ZodTypeAny>
			)[route.key],
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
