import type { InstantlyEndpoints } from '..';
import { call } from './call';

export const getPlanDetails: InstantlyEndpoints['billingGetPlanDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'billingGetPlanDetails',
		'billing.getPlanDetails',
		input,
		() => ({ method: 'GET', path: '/workspace-billing/plan-details' }),
		{},
	);

export const getSubscriptionDetails: InstantlyEndpoints['billingGetSubscriptionDetails'] =
	(ctx, input) =>
		call(
			ctx,
			'billingGetSubscriptionDetails',
			'billing.getSubscriptionDetails',
			input,
			() => ({
				method: 'GET',
				path: '/workspace-billing/subscription-details',
			}),
			{},
		);
