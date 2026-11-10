import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call, readObjectId } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const list: ShippoEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		({ page, results, shippo_account_id }) => ({
			method: 'GET',
			path: '/webhooks',
			query: { page, results },
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const get: ShippoEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		({ webhook_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/webhooks/${segment(webhook_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ webhook_id }, result) => ({
				webhookId: webhook_id,
				event: result.event ?? undefined,
				active: result.active ?? undefined,
			}),
		},
	);

export const create: ShippoEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/webhooks',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				webhookId: result.object_id ?? undefined,
				event: parsed.event,
			}),
		},
	);

export const update: ShippoEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ webhook_id, shippo_account_id, ...body }) => ({
			method: 'PUT',
			path: `/webhooks/${segment(webhook_id)}`,
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ webhook_id }, result) => ({
				webhookId: webhook_id,
				event: result.event ?? undefined,
				active: result.active ?? undefined,
			}),
		},
	);

export const remove: ShippoEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ webhook_id, shippo_account_id }) => ({
			method: 'DELETE',
			path: `/webhooks/${segment(webhook_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			// 204, no body; the success is the status, not a payload.
			shape: (raw) => ({
				deleted: true as const,
				object_id: readObjectId(raw),
			}),
			log: ({ webhook_id }) => ({ webhookId: webhook_id }),
		},
	);
