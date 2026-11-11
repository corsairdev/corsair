import type { WebexEndpoints } from '..';
import { segment } from '../client';
import { call, list as listPage } from './call';
import {
	WebexEndpointInputSchemas as Inputs,
	WebexEndpointOutputSchemas as Outputs,
} from './types';

export const list: WebexEndpoints['webhooksList'] = (ctx, input) =>
	listPage(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		({ max }) => ({ method: 'GET', path: '/webhooks', query: { max } }),
		{ log: (_, result) => ({ count: result.items?.length ?? 0 }) },
	);

export const get: WebexEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/webhooks/${segment(id)}` }),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				resource: result.resource ?? undefined,
				event: result.event ?? undefined,
			}),
		},
	);

/**
 * Creates a webhook. The `secret` is the HMAC key Webex signs each delivery
 * with, so it is the value worth capturing at creation — but the plugin never
 * writes it to the event log.
 */
export const create: WebexEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/webhooks', body }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				resource: parsed.resource,
				event: parsed.event,
				// Whether a secret was set, never the secret.
				hasSecret: parsed.secret !== undefined,
			}),
		},
	);

export const update: WebexEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/webhooks/${segment(id)}`,
			body,
		}),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				status: parsed.status,
			}),
		},
	);

export const remove: WebexEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/webhooks/${segment(id)}` }),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);
