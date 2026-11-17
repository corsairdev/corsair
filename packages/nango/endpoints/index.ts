import type { CorsairEndpoint } from 'corsair/core';
import type { z } from 'zod';
import type { NangoContext } from '..';
import type { NangoRequest } from '../client';
import { nangoRequest, proxyPath, segment } from '../client';
import {
	EndpointInputSchemas as input,
	EndpointOutputSchemas as output,
} from './types';

type Key = keyof typeof input & keyof typeof output;

/**
 * Builds one endpoint: validate the input, send the request with the stored
 * key (`ctx.key`), validate the response. `shape` may drop fields from the
 * parsed response before it is returned (credentials, see connections.get).
 */
function operation<K extends Key>(
	key: K,
	build: (args: z.output<(typeof input)[K]>) => NangoRequest,
	shape?: (
		result: z.output<(typeof output)[K]>,
		args: z.output<(typeof input)[K]>,
	) => z.output<(typeof output)[K]>,
): CorsairEndpoint<
	NangoContext,
	z.input<(typeof input)[K]>,
	z.output<(typeof output)[K]>
> {
	return async (ctx, raw) => {
		const args = input[key].parse(raw) as z.output<(typeof input)[K]>;
		const response = await nangoRequest(ctx.key, build(args));
		const result = output[key].parse(response) as z.output<(typeof output)[K]>;
		return shape ? shape(result, args) : result;
	};
}

/** Removes the `credentials` block unless the caller asked for it. */
// unknown: the credentials block is dropped whatever its shape.
function withoutCredentials<T extends { credentials?: unknown }>(
	connection: T,
): T {
	const { credentials: _credentials, ...rest } = connection;
	// The output schema marks credentials optional, so T without them is a T.
	return rest as T;
}

function connectionHeaders(args: {
	connection_id: string;
	provider_config_key: string;
}): Record<string, string> {
	return {
		'Connection-Id': args.connection_id,
		'Provider-Config-Key': args.provider_config_key,
	};
}

function proxy(
	method: NangoRequest['method'],
	args: {
		connection_id: string;
		provider_config_key: string;
		path: string;
		query?: Record<string, string | number | boolean>;
		headers?: Record<string, string>;
		retries?: number;
		body?: unknown;
	},
): NangoRequest {
	const forwarded = Object.fromEntries(
		Object.entries(args.headers ?? {}).map(([name, value]) => [
			`Nango-Proxy-${name}`,
			value,
		]),
	);
	return {
		method,
		path: proxyPath(args.path),
		query: args.query,
		headers: {
			...forwarded,
			...connectionHeaders(args),
			// Nango replays on 5xx and network errors, so only a GET may ask for it.
			Retries:
				method === 'GET' && args.retries !== undefined
					? String(args.retries)
					: undefined,
		},
		body: args.body,
	};
}

export const endpoints = {
	connections: {
		import: operation(
			'connections.import',
			(body) => ({ method: 'POST', path: '/connections', body }),
			// The response echoes the credentials that were just sent.
			(result) => withoutCredentials(result),
		),
		list: operation('connections.list', (args) => ({
			method: 'GET',
			path: '/connections',
			query: { ...args },
		})),
		get: operation(
			'connections.get',
			({ connectionId, include_credentials: _include, ...query }) => ({
				method: 'GET',
				path: `/connections/${segment(connectionId)}`,
				query,
			}),
			(result, args) =>
				args.include_credentials ? result : withoutCredentials(result),
		),
		patch: operation('connections.patch', (args) => ({
			method: 'PATCH',
			path: `/connections/${segment(args.connectionId)}`,
			query: { provider_config_key: args.provider_config_key },
			body: args.body,
		})),
		setMetadata: operation('connections.setMetadata', (body) => ({
			method: 'POST',
			path: '/connections/metadata',
			body,
		})),
		updateMetadata: operation('connections.updateMetadata', (body) => ({
			method: 'PATCH',
			path: '/connections/metadata',
			body,
		})),
		delete: operation('connections.delete', (args) => ({
			method: 'DELETE',
			path: `/connections/${segment(args.connectionId)}`,
			query: { provider_config_key: args.provider_config_key },
		})),
	},
	sessions: {
		create: operation('sessions.create', (body) => ({
			method: 'POST',
			path: '/connect/sessions',
			body,
		})),
		reconnect: operation('sessions.reconnect', (body) => ({
			method: 'POST',
			path: '/connect/sessions/reconnect',
			body,
		})),
	},
	integrations: {
		list: operation('integrations.list', () => ({
			method: 'GET',
			path: '/integrations',
		})),
		get: operation('integrations.get', ({ uniqueKey, include }) => ({
			method: 'GET',
			path: `/integrations/${segment(uniqueKey)}`,
			query: { include },
		})),
		create: operation('integrations.create', (body) => ({
			method: 'POST',
			path: '/integrations',
			body,
		})),
		update: operation('integrations.update', ({ uniqueKey, ...body }) => ({
			method: 'PATCH',
			path: `/integrations/${segment(uniqueKey)}`,
			body,
		})),
		delete: operation('integrations.delete', ({ uniqueKey }) => ({
			method: 'DELETE',
			path: `/integrations/${segment(uniqueKey)}`,
		})),
	},
	functions: {
		list: operation('functions.list', ({ uniqueKey, ...query }) => ({
			method: 'GET',
			path: `/integrations/${segment(uniqueKey)}/functions`,
			query,
		})),
		get: operation('functions.get', ({ uniqueKey, name, type }) => ({
			method: 'GET',
			path: `/integrations/${segment(uniqueKey)}/functions/${segment(name)}`,
			query: { type },
		})),
		getCode: operation('functions.getCode', ({ uniqueKey, name, type }) => ({
			method: 'GET',
			path: `/integrations/${segment(uniqueKey)}/functions/${segment(name)}/code`,
			query: { type },
		})),
		delete: operation('functions.delete', ({ uniqueKey, name, type }) => ({
			method: 'DELETE',
			path: `/integrations/${segment(uniqueKey)}/functions/${segment(name)}`,
			query: { type },
		})),
	},
	scripts: {
		getConfig: operation('scripts.getConfig', (query) => ({
			method: 'GET',
			path: '/scripts/config',
			query,
		})),
	},
	providers: {
		list: operation('providers.list', (query) => ({
			method: 'GET',
			path: '/providers',
			query,
		})),
		get: operation('providers.get', ({ provider }) => ({
			method: 'GET',
			path: `/providers/${segment(provider)}`,
		})),
	},
	syncs: {
		trigger: operation('syncs.trigger', (body) => ({
			method: 'POST',
			path: '/sync/trigger',
			body,
		})),
		start: operation('syncs.start', (body) => ({
			method: 'POST',
			path: '/sync/start',
			body,
		})),
		pause: operation('syncs.pause', (body) => ({
			method: 'POST',
			path: '/sync/pause',
			body,
		})),
		status: operation('syncs.status', (query) => ({
			method: 'GET',
			path: '/sync/status',
			query,
		})),
		updateFrequency: operation('syncs.updateFrequency', (body) => ({
			method: 'PUT',
			path: '/sync/update-connection-frequency',
			body,
		})),
	},
	records: {
		list: operation(
			'records.list',
			({ connection_id, provider_config_key, ...query }) => ({
				method: 'GET',
				path: '/records',
				query,
				headers: connectionHeaders({ connection_id, provider_config_key }),
			}),
		),
	},
	tools: {
		call: operation(
			'tools.call',
			({ connectionId, name, provider_config_key, input: toolInput }) => ({
				method: 'POST',
				path: `/connections/${segment(connectionId)}/tools/${segment(name)}/calls`,
				headers: { 'Provider-Config-Key': provider_config_key },
				body: toolInput === undefined ? {} : { input: toolInput },
			}),
		),
	},
	actions: {
		trigger: operation(
			'actions.trigger',
			({ connection_id, provider_config_key, ...body }) => ({
				method: 'POST',
				path: '/action/trigger',
				headers: connectionHeaders({ connection_id, provider_config_key }),
				body,
			}),
		),
	},
	environment: {
		getVariables: operation('environment.getVariables', () => ({
			method: 'GET',
			path: '/environment-variables',
		})),
	},
	proxy: {
		get: operation('proxy.get', (args) => proxy('GET', args)),
		post: operation('proxy.post', (args) => proxy('POST', args)),
		put: operation('proxy.put', (args) => proxy('PUT', args)),
		patch: operation('proxy.patch', (args) => proxy('PATCH', args)),
		delete: operation('proxy.delete', (args) => proxy('DELETE', args)),
	},
} as const;
