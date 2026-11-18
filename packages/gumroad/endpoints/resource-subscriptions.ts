import type { GumroadEndpoints } from '..';
import { formEntries } from '../client';
import { call } from './call';

// REST management only: Gumroad delivers resource subscription events as
// unauthenticated POSTs with no documented signature scheme, so receiving and
// verifying deliveries stays out of this plugin (see README).
export const subscribe: GumroadEndpoints['resourceSubscriptionsSubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'resourceSubscriptionsSubscribe',
		'resourceSubscriptions.subscribe',
		'/resource_subscriptions',
		input,
		{
			method: 'PUT',
			toForm: (parsed) =>
				formEntries({
					resource_name: parsed.resource_name,
					post_url: parsed.post_url,
				}),
		},
	);

export const list: GumroadEndpoints['resourceSubscriptionsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'resourceSubscriptionsList',
		'resourceSubscriptions.list',
		'/resource_subscriptions',
		input,
		{ toQuery: (parsed) => ({ resource_name: parsed.resource_name }) },
	);

export const testEvent: GumroadEndpoints['resourceSubscriptionsTestEvent'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'resourceSubscriptionsTestEvent',
		'resourceSubscriptions.testEvent',
		`/resource_subscriptions/${encodeURIComponent(input.resource_subscription_id)}/test_event`,
		input,
		{ method: 'POST' },
	);

export const unsubscribe: GumroadEndpoints['resourceSubscriptionsUnsubscribe'] =
	(ctx, input) =>
		call(
			ctx,
			'resourceSubscriptionsUnsubscribe',
			'resourceSubscriptions.unsubscribe',
			`/resource_subscriptions/${encodeURIComponent(input.resource_subscription_id)}`,
			input,
			{ method: 'DELETE' },
		);
