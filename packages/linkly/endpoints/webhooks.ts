import type { LinklyContext, LinklyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	LinklyEndpointInputSchemas as Inputs,
	LinklyEndpointOutputSchemas as Outputs,
} from './types';

export const list: LinklyEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		({ workspace_id }) => ({
			method: 'GET',
			path: `/api/v1/workspace/${segment(workspace_id)}/webhooks`,
			replaySafe: true,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				count: result.length,
			}),
		},
	);

export const subscribe: LinklyEndpoints['webhooksSubscribe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.subscribe',
			input: Inputs.webhooksSubscribe,
			output: Outputs.webhooksSubscribe,
		},
		input,
		({ workspace_id, url }) => ({
			method: 'POST',
			path: `/api/v1/workspace/${segment(workspace_id)}/webhooks`,
			body: { url },
			// A repeat subscription is not documented as a no-op, so an unknown
			// outcome is not replayed.
			replaySafe: false,
		}),
		{
			// The webhook id is its URL, so the log records the registration,
			// never the address.
			log: ({ workspace_id }) => ({
				workspaceId: workspace_id,
				subscribed: 1,
			}),
		},
	);

export const unsubscribe: LinklyEndpoints['webhooksUnsubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.unsubscribe',
			input: Inputs.webhooksUnsubscribe,
			output: Outputs.webhooksUnsubscribe,
		},
		input,
		({ workspace_id, hook_id }) => ({
			method: 'DELETE',
			// The hook id is the webhook URL itself, so it needs path encoding.
			path: `/api/v1/workspace/${segment(workspace_id)}/webhooks/${segment(hook_id)}`,
			// Unsubscribing an already-removed id is a no-op.
			replaySafe: true,
		}),
		{
			log: ({ workspace_id }) => ({ workspaceId: workspace_id, unsubscribed: 1 }),
		},
	);
