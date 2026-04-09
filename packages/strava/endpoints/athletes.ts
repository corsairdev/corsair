import { logEventFromContext } from 'corsair/core';
import type { StravaEndpoints } from '..';
import { makeStravaRequest } from '../client';
import type { StravaEndpointOutputs } from './types';

export const getAthlete: StravaEndpoints['athleteGet'] = async (
	ctx,
	_input,
) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['athleteGet']>(
		'athlete',
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.id && ctx.db.athletes) {
		try {
			await ctx.db.athletes.upsertByEntityId(String(result.id), { ...result });
		} catch (error) {
			console.warn('Failed to save athlete to database:', error);
		}
	}

	return result;
};

export const updateAthlete: StravaEndpoints['athleteUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['athleteUpdate']
	>('athlete', ctx.key, {
		method: 'PUT',
		body: {
			weight: input.weight,
		},
	});

	if (result.id && ctx.db.athletes) {
		try {
			await ctx.db.athletes.upsertByEntityId(String(result.id), { ...result });
		} catch (error) {
			console.warn('Failed to save athlete to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'strava.athletes.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const getStats: StravaEndpoints['athleteGetStats'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['athleteGetStats']
	>(`athletes/${input.id}/stats`, ctx.key, {
		method: 'GET',
	});

	return result;
};

export const getZones: StravaEndpoints['athleteGetZones'] = async (
	ctx,
	_input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['athleteGetZones']
	>('athlete/zones', ctx.key, {
		method: 'GET',
	});

	return result;
};
