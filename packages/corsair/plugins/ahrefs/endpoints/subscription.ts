import { logEventFromContext } from '../../utils/events';
import type { AhrefsEndpoints } from '..';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpointOutputs } from './types';

export const getLimitsAndUsage: AhrefsEndpoints['subscriptionLimitsAndUsage'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['subscriptionLimitsAndUsage']
	>('/v3/subscription-info/limits-and-usage', ctx.key, { query: { ...input } });

	// Subscription usage is transient and changes with every API call —
	// storing it would always be stale, so no DB write is performed here.

	await logEventFromContext(ctx, 'ahrefs.subscription.getLimitsAndUsage', { ...input }, 'completed');
	return result;
};
