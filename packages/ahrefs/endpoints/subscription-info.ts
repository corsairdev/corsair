import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import type { LimitsAndUsageResponse } from './types';

export const limitsAndUsage: AhrefsEndpoints['limitsAndUsage'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<LimitsAndUsageResponse>(
		'/subscription-info/limits-and-usage',
		ctx.key,
		{ query: input },
	);

	try {
		await ctx.db.subscriptionUsage.upsertByEntityId('current', {
			...response.limits_and_usage,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('[ahrefs] Failed to save subscription usage:', error);
	}

	await logEventFromContext(
		ctx,
		'ahrefs.subscriptionInfo.limitsAndUsage',
		{
			subscription: response.limits_and_usage.subscription,
			units_usage_api_key: response.limits_and_usage.units_usage_api_key,
		},
		'completed',
	);

	return response;
};
