import type { SimpleroEndpoints } from '..';
import { segment } from '../client';
import type { UnknownJson } from '../json';
import { call, compact, without } from './shared';
import {
	SimpleroEndpointInputSchemas as Inputs,
	SimpleroEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimpleroEndpoints['subscriptionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.list',
			input: Inputs.subscriptionsList,
			output: Outputs.subscriptionsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/api/v2/subscriptions', query }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: SimpleroEndpoints['subscriptionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.get',
			input: Inputs.subscriptionsGet,
			output: Outputs.subscriptionsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/api/v2/subscriptions/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ subscriptionId: id }) },
	);

/**
 * PATCH carries tracking data only. Whether a contact is subscribed is changed
 * through the unsubscribe and resubscribe actions, not through this body.
 */
export const update: SimpleroEndpoints['subscriptionsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.update',
			input: Inputs.subscriptionsUpdate,
			output: Outputs.subscriptionsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/api/v2/subscriptions/${segment(parsed.id)}`,
			body: compact(without(parsed)),
		}),
		{ log: ({ id }) => ({ subscriptionId: id }) },
	);

/** Unsubscribe and resubscribe share a route shape and an action body. */
function action(
	ctx: Parameters<SimpleroEndpoints['subscriptionsUnsubscribe']>[0],
	name: 'unsubscribe' | 'resubscribe',
	input: UnknownJson, // unknown: raw caller input, parsed by call()
) {
	return call(
		ctx,
		{
			event: `subscriptions.${name === 'unsubscribe' ? 'unsubscribe' : 'resubscribe'}`,
			input: Inputs.subscriptionsUnsubscribe,
			output: Outputs.subscriptionsUnsubscribe,
		},
		input,
		({ id }) => ({
			method: 'POST',
			path: `/api/v2/subscriptions/${segment(id)}/actions/${name}`,
		}),
		{ log: ({ id }) => ({ subscriptionId: id }) },
	);
}

/**
 * Unsubscribing is reversible: `subscriptions.resubscribe` puts the contact
 * back on the list, so the risk is a write rather than destructive.
 */
export const unsubscribe: SimpleroEndpoints['subscriptionsUnsubscribe'] = (
	ctx,
	input,
) => action(ctx, 'unsubscribe', input);

export const resubscribe: SimpleroEndpoints['subscriptionsResubscribe'] = (
	ctx,
	input,
) => action(ctx, 'resubscribe', input);
