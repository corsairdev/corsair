import type { UserflowEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UserflowEndpointInputSchemas as Inputs,
	UserflowEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Subscriptions are how Userflow delivers `user.created`, `group.updated` and
 * `event.tracked.*`. The `secret` needed to verify the signature is returned
 * on create and on update only, so it is worth capturing at that point.
 */
export const create: UserflowEndpoints['webhookSubscriptionsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhookSubscriptions.create',
			input: Inputs.webhookSubscriptionsCreate,
			output: Outputs.webhookSubscriptionsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/webhook_subscriptions', body }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				url: parsed.url,
				topics: parsed.topics.length,
				// Whether a secret came back, never the secret itself.
				hasSecret: result.secret != null,
			}),
		},
	);

export const get: UserflowEndpoints['webhookSubscriptionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhookSubscriptions.get',
			input: Inputs.webhookSubscriptionsGet,
			output: Outputs.webhookSubscriptionsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/webhook_subscriptions/${segment(id)}`,
		}),
		{ log: (_, result) => ({ id: result.id ?? undefined }) },
	);

/** PATCH is the other place the `secret` is returned. */
export const update: UserflowEndpoints['webhookSubscriptionsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhookSubscriptions.update',
			input: Inputs.webhookSubscriptionsUpdate,
			output: Outputs.webhookSubscriptionsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/webhook_subscriptions/${segment(id)}`,
			body,
		}),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				disabled: result.disabled ?? false,
				hasSecret: result.secret != null,
			}),
		},
	);

/** Prefer `update` with `disabled: true` to delete, which cannot be undone. */
export const remove: UserflowEndpoints['webhookSubscriptionsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhookSubscriptions.delete',
			input: Inputs.webhookSubscriptionsDelete,
			output: Outputs.webhookSubscriptionsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/webhook_subscriptions/${segment(id)}`,
		}),
		{
			shape: (raw, parsed) => ({
				...(typeof raw === 'object' && raw !== null ? raw : {}),
				id: parsed.id,
				deleted: true,
			}),
			log: ({ id }) => ({ id }),
		},
	);

export const list: UserflowEndpoints['webhookSubscriptionsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhookSubscriptions.list',
			input: Inputs.webhookSubscriptionsList,
			output: Outputs.webhookSubscriptionsList,
		},
		input,
		({ limit, starting_after }) => ({
			method: 'GET',
			path: '/webhook_subscriptions',
			query: { limit, starting_after },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.has_more ?? false,
			}),
		},
	);
