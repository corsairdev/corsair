import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const get: SharepointEndpoints['webhookSubscriptionsGet'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['webhookSubscriptionsGet']
	>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_id)}/subscriptions/${encodeURIComponent(input.subscription_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.webhookSubscriptions.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getAll: SharepointEndpoints['webhookSubscriptionsGetAll'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['webhookSubscriptionsGetAll']
	>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_id)}/subscriptions`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.webhookSubscriptions.getAll',
		{ ...input },
		'completed',
	);
	return result;
};
