import type { WatiEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	WatiEndpointInputSchemas as Inputs,
	WatiEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Webhook subscriptions on the V3 API. Creating one still has to go through
 * WATI's V2 route, which this plugin does not wrap — the V3 routes here read
 * and delete the subscriptions that route creates.
 */
export const list: WatiEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		() => ({ method: 'GET', path: '/webhooks' }),
		{
			// V3 answers a bare array; it is wrapped so the output stays an object.
			shape: (raw) => (Array.isArray(raw) ? { webhooks: raw } : raw),
			log: (_, result) => ({ count: result.webhooks?.length ?? 0 }),
		},
	);

export const get: WatiEndpoints['webhooksGet'] = (ctx, input) =>
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
				events: result.eventTypes?.length ?? 0,
			}),
		},
	);

/** Deleting stops delivery to that URL. */
export const remove: WatiEndpoints['webhooksDelete'] = (ctx, input) =>
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
			shape: (raw) => ({
				...(typeof raw === 'object' && raw !== null ? raw : {}),
				success: true,
			}),
			log: ({ id }) => ({ id }),
		},
	);
