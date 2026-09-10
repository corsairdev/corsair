import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeSapsuccessfactorsRequest } from '../client';
import type {
	SapsuccessfactorsContext,
	SapsuccessfactorsKeyBuilderContext,
} from '../index';
import type { SapRoute, SapRouteName } from './routes';
import { getSapRoute } from './routes';
import type {
	SapsuccessfactorsEndpointInput,
	SapsuccessfactorsEndpointOutputs,
} from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

export type SapEndpoint = CorsairEndpoint<
	SapsuccessfactorsContext,
	SapsuccessfactorsEndpointInput,
	unknown
>;

const QUERY_KEYS = new Set([
	'filter',
	'select',
	'expand',
	'top',
	'skip',
	'orderby',
]);

function odataLiteral(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[sapsuccessfactors] missing required path parameter');
	}
	return `'${String(value).replace(/'/g, "''")}'`;
}

function resolveHost(
	ctx: Pick<SapsuccessfactorsKeyBuilderContext, 'options'> & {
		keys?: Partial<SapsuccessfactorsKeyBuilderContext['keys']>;
	},
): string | undefined {
	return ctx.options?.host ?? ctx.options?.apiBaseUrl;
}

function escapeODataString(value: string): string {
	return value.replace(/'/g, "''");
}

function resolvePath(route: SapRoute, input: Record<string, unknown>): string {
	if (route.special === 'customMdf') {
		const name = String(input.custom_object ?? '');
		if (!/^cust_[A-Za-z0-9_]+$/.test(name)) {
			throw new Error(
				'[sapsuccessfactors] custom_object must be a cust_* MDF entity',
			);
		}
		return `odata/v2/${name}`;
	}
	if (route.special === 'goalPlan') {
		const raw = String(input.goal_plan_id ?? '');
		const id = raw.replace(/^Goal_/i, '').replace(/[^0-9]/g, '');
		if (!id) {
			throw new Error(
				'[sapsuccessfactors] goal_plan_id must include the numeric plan id',
			);
		}
		return `odata/v2/Goal_${id}`;
	}
	return route.path.replace(/\{([^}]+)\}/g, (_, key: string) =>
		odataLiteral(input[key]),
	);
}

function buildQuery(
	route: SapRoute,
	input: Record<string, unknown>,
): Record<string, string | number | boolean | undefined> {
	const query: Record<string, string | number | boolean | undefined> = {};
	for (const key of QUERY_KEYS) {
		const value = input[key];
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			query[key] = value;
		}
	}
	if (route.special === 'currentUser' && !query.filter) {
		query.filter = "userId eq '$loggedInUser'";
	}
	if (route.special === 'applicationInterview') {
		const applicationId = input.applicationId;
		if (typeof applicationId === 'string' && applicationId && !query.filter) {
			query.filter = `applicationId eq '${escapeODataString(applicationId)}'`;
		}
	}
	if (route.special === 'nominationDelete') {
		const userId = input.userId;
		if (typeof userId === 'string') query.userId = userId;
		if (input.isPoolNomination === true) query.isPoolNomination = true;
	}
	if (
		route.name === 'getCalibrationSubjectRatings' &&
		typeof input.session_id === 'string' &&
		!query.filter
	) {
		query.filter = `sessionId eq '${escapeODataString(input.session_id)}'`;
	}
	return query;
}

const PATH_AND_CONTROL = new Set([
	'body',
	'filter',
	'select',
	'expand',
	'top',
	'skip',
	'orderby',
	'session_id',
	'subject_id',
	'person_id_external',
	'goal_plan_id',
	'custom_object',
	'nominationTargetId',
	'applicationId',
	'code',
]);

function requestBody(
	route: SapRoute,
	input: Record<string, unknown>,
): Record<string, unknown> | undefined {
	if (route.method === 'GET' || route.method === 'DELETE') return undefined;
	if (input.body && typeof input.body === 'object') {
		return input.body as Record<string, unknown>;
	}
	const body = Object.fromEntries(
		Object.entries(input).filter(
			([key, value]) => !PATH_AND_CONTROL.has(key) && value !== undefined,
		),
	);
	return Object.keys(body).length > 0 ? body : undefined;
}

export async function executeSapOperation(
	ctx: SapsuccessfactorsContext,
	rawInput: SapsuccessfactorsEndpointInput | undefined,
	route: SapRoute,
) {
	if (!ctx.key) {
		throw new AuthMissingError('sapsuccessfactors', 'oauth_2');
	}
	const parsed = SapsuccessfactorsEndpointInputSchemas[
		route.name as SapRouteName
	].parse(rawInput ?? {});
	const input = parsed as Record<string, unknown>;
	const path = resolvePath(route, input);
	const host = resolveHost(ctx);

	let status: 'completed' | 'failed' = 'completed';
	try {
		const response = await makeSapsuccessfactorsRequest<unknown>(
			path,
			ctx.key,
			{
				method: route.method,
				body: requestBody(route, input),
				query: buildQuery(route, input),
				host,
			},
		);
		return SapsuccessfactorsEndpointOutputSchemas[
			route.name as SapRouteName
		].parse(response) as SapsuccessfactorsEndpointOutputs[SapRouteName];
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		try {
			await logEventFromContext(
				ctx,
				`sapsuccessfactors.${route.group}.${route.name}`,
				{ method: route.method, path },
				status,
			);
		} catch (logError) {
			console.warn(
				'[sapsuccessfactors] Failed to log operation event:',
				logError,
			);
		}
	}
}

export function createSapEndpoint(name: SapRouteName): SapEndpoint {
	const route = getSapRoute(name);
	return (async (ctx, input) =>
		executeSapOperation(ctx, input ?? {}, route)) as SapEndpoint;
}
