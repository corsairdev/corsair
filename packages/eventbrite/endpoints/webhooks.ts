import type { EventbriteEndpoints } from '..';
import { segment } from '../client';
import { call, commaList } from './call';
import {
	EventbriteEndpointInputSchemas as Inputs,
	EventbriteEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The org-scoped routes are the current ones; `POST /webhooks/` and
 * `GET /webhooks/` were retired in 2020 and are not wrapped.
 */
export const list: EventbriteEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		({ organization_id, page_size, continuation, page }) => ({
			method: 'GET',
			path: `/organizations/${segment(organization_id)}/webhooks/`,
			query: { page_size, continuation, page },
		}),
		{
			log: ({ organization_id }, result) => ({
				organizationId: organization_id,
				count: result.webhooks.length,
			}),
		},
	);

export const create: EventbriteEndpoints['webhookCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhookCreate,
			output: Outputs.webhookCreate,
		},
		input,
		({ organization_id, endpoint_url, actions, event_id }) => ({
			method: 'POST',
			path: `/organizations/${segment(organization_id)}/webhooks/`,
			// The body is bare: `{ webhook: … }` is rejected as an unknown
			// parameter, and `actions` must be one comma-separated string rather
			// than an array.
			body: {
				endpoint_url,
				actions: commaList(actions),
				event_id,
			},
		}),
		{
			log: ({ organization_id }, result) => ({
				organizationId: organization_id,
				webhookId: result.id ?? undefined,
				actionCount: result.actions?.length ?? 0,
			}),
		},
	);

export const remove: EventbriteEndpoints['webhookDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhookDelete,
			output: Outputs.webhookDelete,
		},
		input,
		({ webhook_id }) => ({
			method: 'DELETE',
			path: `/webhooks/${segment(webhook_id)}/`,
		}),
		{
			// Eventbrite answers this route with an empty object rather than a
			// `{ deleted }` flag.
			shape: (raw) => ({ deleted: raw !== undefined && raw !== null }),
			log: ({ webhook_id }) => ({ webhookId: webhook_id }),
		},
	);
