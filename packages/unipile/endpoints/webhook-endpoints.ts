import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

const ENDPOINTS = '/v2/webhooks/endpoints/';

// unknown: one webhook endpoint object from a raw Unipile response.
function redactEndpoint(endpoint: unknown): unknown {
	if (
		endpoint === null ||
		typeof endpoint !== 'object' ||
		Array.isArray(endpoint)
	) {
		return endpoint;
	}
	// Narrowed to a plain object by the checks above.
	const { secret, ...rest } = endpoint as Record<string, unknown>;
	return {
		...rest,
		secret_set: typeof secret === 'string' && secret.length > 0,
	};
}

/**
 * Unipile returns each endpoint's signing secret on every read. Only
 * webhookEndpoints.create passes it on; list, get and update replace it with
 * `secret_set`, so an agent with read access cannot see or log it.
 */
// unknown: the raw list response; only its `data` array is rewritten.
function redactList(raw: unknown): unknown {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
		return raw;
	}
	// Narrowed to a plain object by the checks above.
	const page = raw as Record<string, unknown>;
	return Array.isArray(page.data)
		? { ...page, data: page.data.map(redactEndpoint) }
		: page;
}

export const list: UnipileEndpoints['webhookEndpointsList'] = (ctx, input) =>
	call(
		ctx,
		'webhookEndpointsList',
		'webhookEndpoints.list',
		input,
		(parsed) => ({
			method: 'GET',
			path: ENDPOINTS,
			query: { offset: parsed.offset, limit: parsed.limit },
		}),
		redactList,
	);

export const get: UnipileEndpoints['webhookEndpointsGet'] = (ctx, input) =>
	call(
		ctx,
		'webhookEndpointsGet',
		'webhookEndpoints.get',
		input,
		(parsed) => ({
			method: 'GET',
			path: `${ENDPOINTS}${segment(parsed.id)}`,
		}),
		redactEndpoint,
	);

// The only call that returns the signing secret. It is shown once: store it.
export const create: UnipileEndpoints['webhookEndpointsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'webhookEndpointsCreate',
		'webhookEndpoints.create',
		input,
		(parsed) => ({ method: 'POST', path: ENDPOINTS, body: parsed }),
	);

// Updating cannot rotate the secret; Unipile echoes the existing one, which is
// redacted like a read.
export const update: UnipileEndpoints['webhookEndpointsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'webhookEndpointsUpdate',
		'webhookEndpoints.update',
		input,
		(parsed) => {
			const { id, ...body } = parsed;
			return { method: 'PATCH', path: `${ENDPOINTS}${segment(id)}`, body };
		},
		redactEndpoint,
	);

export const remove: UnipileEndpoints['webhookEndpointsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'webhookEndpointsDelete',
		'webhookEndpoints.delete',
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `${ENDPOINTS}${segment(parsed.id)}`,
		}),
	);
