import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeBooqableRequest } from '../client';
import type { BooqableContext } from '../index';
import type { BooqableRoute } from './routes';
import { booqableRoutes } from './routes';
import type { BooqableEndpointInput } from './types';

const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {
	id: ['id'],
};

const BODY_CONTROL_KEYS = new Set(['body', 'query', 'headers', 'companySlug']);

/** Booqable tenants use a single DNS label as the company subdomain. */
const BOOQABLE_COMPANY_SLUG = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

function assertBooqableCompanySlug(slug: string): string {
	const trimmed = slug.trim();
	if (!BOOQABLE_COMPANY_SLUG.test(trimmed)) {
		throw new Error('[booqable] company slug is invalid');
	}
	return trimmed;
}

export type BooqableEndpoint = CorsairEndpoint<
	BooqableContext,
	BooqableEndpointInput,
	unknown
>;

function camelToSnake(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
		.toLowerCase();
}

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[booqable] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

function resolvePathParam(
	input: BooqableEndpointInput,
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
	input: BooqableEndpointInput,
	route?: Pick<BooqableRoute, 'pathParams'>,
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

function isRecord(value: unknown): value is Record<string, unknown> {
	// unknown is intentional here: endpoint inputs are runtime data, narrowed via this guard.
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function buildQuery(route: BooqableRoute, input: BooqableEndpointInput) {
	const query: Record<string, unknown> = isRecord(input.query)
		? { ...input.query }
		: {};
	for (const key of route.queryParams ?? []) {
		const snake = camelToSnake(key);
		const value = input[snake] ?? input[key] ?? resolvePathParam(input, key);
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

function requestBody(route: BooqableRoute, input: BooqableEndpointInput) {
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

export function getRoute(name: string): BooqableRoute {
	const route = booqableRoutes.find((candidate) => candidate.key === name);
	if (!route) {
		throw new Error(`[booqable] missing route: ${name}`);
	}
	return route;
}

async function resolveCompanySlug(
	ctx: BooqableContext,
	input: BooqableEndpointInput,
): Promise<string> {
	if ('companySlug' in input) {
		const explicitRaw = input.companySlug;
		if (typeof explicitRaw === 'string' && explicitRaw) {
			return assertBooqableCompanySlug(explicitRaw);
		}
	}

	const fromOptions = ctx.options.companySlug;
	if (fromOptions) return assertBooqableCompanySlug(fromOptions);

	const slug = await ctx.keys.get_tenant_external_id();
	if (!slug) {
		throw new AuthMissingError('booqable', 'api_key');
	}
	return assertBooqableCompanySlug(slug);
}

export async function logBooqableOperation(
	ctx: BooqableContext,
	route: BooqableRoute,
	status: 'completed' | 'failed',
) {
	await logEventFromContext(
		ctx,
		`booqable.${route.group}.${route.name}`,
		{ method: route.method, path: route.path },
		status,
	);
}

export async function requestBooqableOperation(
	ctx: BooqableContext,
	input: BooqableEndpointInput,
	route: BooqableRoute,
) {
	const companySlug = await resolveCompanySlug(ctx, input);
	return makeBooqableRequest(
		resolvePath(route.path, input, route),
		ctx.key,
		companySlug,
		{
			method: route.method,
			body: requestBody(route, input),
			query: buildQuery(route, input),
			headers: input.headers,
		},
	);
}

export async function executeBooqableOperation(
	ctx: BooqableContext,
	input: BooqableEndpointInput,
	route: BooqableRoute,
) {
	let status: 'completed' | 'failed' = 'completed';
	try {
		return await requestBooqableOperation(ctx, input, route);
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		await logBooqableOperation(ctx, route, status);
	}
}
