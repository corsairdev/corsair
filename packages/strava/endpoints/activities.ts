import { logEventFromContext } from 'corsair/core';
import type { StravaEndpoints } from '..';
import { makeStravaRequest } from '../client';
import type { StravaEndpointOutputs } from './types';

export const create: StravaEndpoints['activitiesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['activitiesCreate']
	>('activities', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			sport_type: input.sport_type,
			start_date_local: input.start_date_local,
			elapsed_time: input.elapsed_time,
			type: input.type,
			commute: input.commute,
			trainer: input.trainer,
			distance: input.distance,
			description: input.description,
		},
	});

	if (result.id && ctx.db.activities) {
		try {
			await ctx.db.activities.upsertByEntityId(String(result.id), {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save activity to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'strava.activities.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: StravaEndpoints['activitiesGet'] = async (ctx, input) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['activitiesGet']
	>(`activities/${input.id}`, ctx.key, {
		method: 'GET',
		query: {
			include_all_efforts: input.include_all_efforts,
		},
	});

	if (result.id && ctx.db.activities) {
		try {
			await ctx.db.activities.upsertByEntityId(String(result.id), {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save activity to database:', error);
		}
	}

	return result;
};

export const list: StravaEndpoints['activitiesList'] = async (ctx, input) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['activitiesList']
	>('athlete/activities', ctx.key, {
		method: 'GET',
		query: {
			before: input.before,
			after: input.after,
			page: input.page,
			per_page: input.per_page,
		},
	});

	if (Array.isArray(result) && ctx.db.activities) {
		try {
			for (const activity of result) {
				if (activity.id) {
					await ctx.db.activities.upsertByEntityId(String(activity.id), {
						...activity,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save activities to database:', error);
		}
	}

	return result;
};

export const getStreams: StravaEndpoints['activitiesGetStreams'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['activitiesGetStreams']
	>(`activities/${input.id}/streams`, ctx.key, {
		method: 'GET',
		query: {
			keys: input.keys.join(','),
			key_by_type: input.key_by_type,
		},
	});

	return result;
};

export const getZones: StravaEndpoints['activitiesGetZones'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['activitiesGetZones']
	>(`activities/${input.id}/zones`, ctx.key, {
		method: 'GET',
	});

	return result;
};

export const listComments: StravaEndpoints['activitiesListComments'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['activitiesListComments']
	>(`activities/${input.id}/comments`, ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			per_page: input.per_page,
		},
	});

	return result;
};

export const listKudoers: StravaEndpoints['activitiesListKudoers'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['activitiesListKudoers']
	>(`activities/${input.id}/kudos`, ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			per_page: input.per_page,
		},
	});

	if (Array.isArray(result) && ctx.db.athletes) {
		try {
			for (const kudoer of result) {
				if (kudoer.id) {
					const id = kudoer.id;
					await ctx.db.athletes.upsertByEntityId(String(id), { ...kudoer, id });
				}
			}
		} catch (error) {
			console.warn('Failed to save kudoers to database:', error);
		}
	}

	return result;
};

export const listLaps: StravaEndpoints['activitiesListLaps'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['activitiesListLaps']
	>(`activities/${input.id}/laps`, ctx.key, {
		method: 'GET',
	});

	if (Array.isArray(result) && ctx.db.laps) {
		try {
			for (const lap of result) {
				if (lap.id) {
					await ctx.db.laps.upsertByEntityId(String(lap.id), { ...lap });
				}
			}
		} catch (error) {
			console.warn('Failed to save laps to database:', error);
		}
	}

	return result;
};
