import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints } from '../index';
import type { InstagramEndpointOutputs } from './types';

export const get: InstagramEndpoints['GetInstagramUser'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetInstagramUser']
	>(`/${input.ig_id}`, ctx, {
		method: 'GET',
		query: {
			fields: input.q,
		},
	});

	if (result && ctx.db.users) {
		try {
			const res = await ctx.db.users.upsertByEntityId(input.ig_id, {
				...result,
			});
		} catch (err) {
			console.warn('error to save instagram account details into database');
		}
	}

	await logEventFromContext(
		ctx,
		'instagram.profile.getInstagramUser',
		{ ...input },
		'completed',
	);

	return result;
};

export const insights: InstagramEndpoints['GetAccountInsights'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetAccountInsights']
	>(`/${input.ig_id}/insights`, ctx, {
		method: 'GET',
		query: {
			metric: input.metric,
			period: input.period,
			timeframe: input.timeframe,
			metric_type: input.metric_type,
			breakdown: input.breakdown,
			since: input.since,
			until: input.until,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.profile.insights',
		{ ...input },
		'completed',
	);

	return result;
};
