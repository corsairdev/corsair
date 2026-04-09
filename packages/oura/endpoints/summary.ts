import { logEventFromContext } from 'corsair/core';
import type { OuraEndpoints } from '..';
import { makeOuraRequest } from '../client';
import type { OuraEndpointOutputs } from './types';

export const getActivity: OuraEndpoints['summaryGetActivity'] = async (
	ctx,
	input,
) => {
	const result = await makeOuraRequest<
		OuraEndpointOutputs['summaryGetActivity']
	>('usercollection/daily_activity', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (result.data && ctx.db.dailyActivity) {
		try {
			for (const activity of result.data) {
				await ctx.db.dailyActivity.upsertByEntityId(activity.id, {
					...activity,
				});
			}
		} catch (error) {
			console.warn('Failed to save daily activity to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'oura.summary.getActivity',
		{ ...input },
		'completed',
	);
	return result;
};

export const getReadiness: OuraEndpoints['summaryGetReadiness'] = async (
	ctx,
	input,
) => {
	const result = await makeOuraRequest<
		OuraEndpointOutputs['summaryGetReadiness']
	>('usercollection/daily_readiness', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (result.data && ctx.db.dailyReadiness) {
		try {
			for (const readiness of result.data) {
				await ctx.db.dailyReadiness.upsertByEntityId(readiness.id, {
					...readiness,
				});
			}
		} catch (error) {
			console.warn('Failed to save daily readiness to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'oura.summary.getReadiness',
		{ ...input },
		'completed',
	);
	return result;
};

export const getSleep: OuraEndpoints['summaryGetSleep'] = async (
	ctx,
	input,
) => {
	const result = await makeOuraRequest<OuraEndpointOutputs['summaryGetSleep']>(
		'usercollection/daily_sleep',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.data && ctx.db.dailySleep) {
		try {
			for (const sleep of result.data) {
				await ctx.db.dailySleep.upsertByEntityId(sleep.id, {
					...sleep,
				});
			}
		} catch (error) {
			console.warn('Failed to save daily sleep to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'oura.summary.getSleep',
		{ ...input },
		'completed',
	);
	return result;
};
