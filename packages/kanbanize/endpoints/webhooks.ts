import type { KanbanizeEndpoints } from '..';
import { segment } from '../client';
import { call, deletedResult, withId } from './call';
import {
	KanbanizeEndpointInputSchemas as Inputs,
	KanbanizeEndpointOutputSchemas as Outputs,
} from './types';

// These routes register a delivery URL. The plugin does not handle the
// deliveries themselves: Businessmap posts to whatever URL is given, and
// `pluginWebhookMatcher` stays false so nothing is routed here.
export const list: KanbanizeEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		() => ({ method: 'GET', path: '/webhooks' }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const create: KanbanizeEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/webhooks',
			body: Object.fromEntries(
				Object.entries(parsed).filter(([, value]) => value !== undefined),
			),
		}),
		{
			log: (_, result) => ({
				webhookId: result.data.webhook_id,
				boardId: result.data.board_id ?? undefined,
			}),
		},
	);

export const update: KanbanizeEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ webhook_id, ...changes }) => ({
			method: 'PATCH',
			path: `/webhooks/${segment(webhook_id)}`,
			body: Object.fromEntries(
				Object.entries(changes).filter(([, value]) => value !== undefined),
			),
		}),
		{
			shape: (raw, { webhook_id }) => withId(raw, 'webhook_id', webhook_id),
			log: ({ webhook_id }) => ({ webhookId: webhook_id }),
		},
	);

export const remove: KanbanizeEndpoints['webhooksRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksRemove,
			output: Outputs.webhooksRemove,
		},
		input,
		({ webhook_id }) => ({
			method: 'DELETE',
			path: `/webhooks/${segment(webhook_id)}`,
		}),
		{
			shape: () => deletedResult(),
			log: ({ webhook_id }) => ({ webhookId: webhook_id }),
		},
	);
