import type { NgrokEndpoints } from '..';
import { segment } from '../client';
import { call, deleted } from './call';
import {
	NgrokEndpointInputSchemas as Inputs,
	NgrokEndpointOutputSchemas as Outputs,
} from './types';

/** Lists cloud endpoints, newest first. */
export const list: NgrokEndpoints['endpointsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'endpoints.list',
			input: Inputs.endpointsList,
			output: Outputs.endpointsList,
		},
		input,
		({ before_id, limit, filter }) => ({
			method: 'GET',
			path: '/endpoints',
			query: { before_id, limit, filter },
		}),
		{ log: (_, result) => ({ count: result.endpoints.length }) },
	);

export const get: NgrokEndpoints['endpointsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'endpoints.get',
			input: Inputs.endpointsGet,
			output: Outputs.endpointsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/endpoints/${segment(id)}` }),
		{
			log: ({ id }, result) => ({
				id,
				publicUrl: result.public_url ?? undefined,
			}),
		},
	);

/**
 * Creates a cloud endpoint that forwards to `url`. The endpoint is live as soon
 * as it exists, so its public URL starts forwarding immediately.
 */
export const create: NgrokEndpoints['endpointsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'endpoints.create',
			input: Inputs.endpointsCreate,
			output: Outputs.endpointsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/endpoints', body }),
		{ log: (_, result) => ({ id: result.id ?? undefined }) },
	);

/**
 * Patches a description, metadata, traffic policy or bindings. A field left out
 * keeps its value; an empty string clears one that can be cleared.
 */
export const update: NgrokEndpoints['endpointsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'endpoints.update',
			input: Inputs.endpointsUpdate,
			output: Outputs.endpointsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/endpoints/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

/** Deletes the endpoint and answers 204, so there is no body to read. */
export const remove: NgrokEndpoints['endpointsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'endpoints.delete',
			input: Inputs.endpointsDelete,
			output: Outputs.endpointsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/endpoints/${segment(id)}` }),
		{
			shape: (_, { id }) => deleted(id),
			log: ({ id }) => ({ id }),
		},
	);

/** Lists tunnels that agent sessions have open. */
export const tunnels: NgrokEndpoints['tunnelsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tunnels.list',
			input: Inputs.tunnelsList,
			output: Outputs.tunnelsList,
		},
		input,
		({ before_id, limit }) => ({
			method: 'GET',
			path: '/tunnels',
			query: { before_id, limit },
		}),
		{ log: (_, result) => ({ count: result.tunnels.length }) },
	);

/** Lists reserved domains with their CNAME target and certificate state. */
export const domains: NgrokEndpoints['domainsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.list',
			input: Inputs.domainsList,
			output: Outputs.domainsList,
		},
		input,
		({ before_id, limit }) => ({
			method: 'GET',
			path: '/reserved_domains',
			query: { before_id, limit },
		}),
		{ log: (_, result) => ({ count: result.reserved_domains.length }) },
	);

export const domain: NgrokEndpoints['domainsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.get',
			input: Inputs.domainsGet,
			output: Outputs.domainsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/reserved_domains/${segment(id)}`,
		}),
		{ log: ({ id }, result) => ({ id, domain: result.domain ?? undefined }) },
	);

/**
 * Reserves a hostname. ngrok answers with the CNAME target to point DNS at, and
 * starts certificate issuance once the record resolves.
 */
export const createDomain: NgrokEndpoints['domainsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.create',
			input: Inputs.domainsCreate,
			output: Outputs.domainsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/reserved_domains', body }),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				domain: result.domain ?? undefined,
			}),
		},
	);

export const updateDomain: NgrokEndpoints['domainsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.update',
			input: Inputs.domainsUpdate,
			output: Outputs.domainsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/reserved_domains/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

/** Releases the domain and answers 204. */
export const deleteDomain: NgrokEndpoints['domainsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.delete',
			input: Inputs.domainsDelete,
			output: Outputs.domainsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/reserved_domains/${segment(id)}`,
		}),
		{
			shape: (_, { id }) => deleted(id),
			log: ({ id }) => ({ id }),
		},
	);

/** Lists the account's API keys. The token is not included in a list. */
export const keys: NgrokEndpoints['apiKeysList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apiKeys.list',
			input: Inputs.apiKeysList,
			output: Outputs.apiKeysList,
		},
		input,
		({ before_id, limit }) => ({
			method: 'GET',
			path: '/api_keys',
			query: { before_id, limit },
		}),
		{ log: (_, result) => ({ count: result.keys.length }) },
	);

/**
 * Mints an API key. The `token` is returned once, in this response only: a later
 * read of the same key omits it, so it has to be stored now.
 */
export const createKey: NgrokEndpoints['apiKeysCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apiKeys.create',
			input: Inputs.apiKeysCreate,
			output: Outputs.apiKeysCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/api_keys', body }),
		{
			// The id is safe to log; the token is not.
			log: (_, result) => ({
				id: result.id ?? undefined,
				hasToken: Boolean(result.token),
			}),
		},
	);

/** Revokes the key and answers 204. */
export const deleteKey: NgrokEndpoints['apiKeysDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apiKeys.delete',
			input: Inputs.apiKeysDelete,
			output: Outputs.apiKeysDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/api_keys/${segment(id)}` }),
		{
			shape: (_, { id }) => deleted(id),
			log: ({ id }) => ({ id }),
		},
	);

/** Lists event subscriptions with their sources and destinations. */
export const subscriptions: NgrokEndpoints['eventsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.list',
			input: Inputs.eventsList,
			output: Outputs.eventsList,
		},
		input,
		({ before_id, limit }) => ({
			method: 'GET',
			path: '/event_subscriptions',
			query: { before_id, limit },
		}),
		{ log: (_, result) => ({ count: result.event_subscriptions.length }) },
	);

export const subscription: NgrokEndpoints['eventsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.get',
			input: Inputs.eventsGet,
			output: Outputs.eventsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/event_subscriptions/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ id }) },
	);

/**
 * Subscribes to event types and delivers them to one or more destinations. A
 * destination is created separately through the destinations API, which this
 * plugin does not wrap, so its ids are inputs here.
 */
export const createSubscription: NgrokEndpoints['eventsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.create',
			input: Inputs.eventsCreate,
			output: Outputs.eventsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/event_subscriptions', body }),
		{ log: (_, result) => ({ id: result.id ?? undefined }) },
	);

export const deleteSubscription: NgrokEndpoints['eventsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.delete',
			input: Inputs.eventsDelete,
			output: Outputs.eventsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/event_subscriptions/${segment(id)}`,
		}),
		{
			shape: (_, { id }) => deleted(id),
			log: ({ id }) => ({ id }),
		},
	);
