import { logEventFromContext } from 'corsair/core';
import type { StravaEndpoints } from '..';
import { makeStravaRequest } from '../client';
import type { StravaEndpointOutputs } from './types';

export const explore: StravaEndpoints['segmentsExplore'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['segmentsExplore']
	>('segments/explore', ctx.key, {
		method: 'GET',
		query: {
			bounds: input.bounds,
			activity_type: input.activity_type,
			min_cat: input.min_cat,
			max_cat: input.max_cat,
		},
	});

	if (result.segments && ctx.db.segments) {
		try {
			for (const segment of result.segments) {
				if (segment.id) {
					const id = segment.id;
					await ctx.db.segments.upsertByEntityId(String(id), {
						...segment,
						id,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save explored segments to database:', error);
		}
	}

	return result;
};

export const get: StravaEndpoints['segmentsGet'] = async (ctx, input) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['segmentsGet']>(
		`segments/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.id && ctx.db.segments) {
		try {
			await ctx.db.segments.upsertByEntityId(String(result.id), { ...result });
		} catch (error) {
			console.warn('Failed to save segment to database:', error);
		}
	}

	return result;
};

export const getStreams: StravaEndpoints['segmentsGetStreams'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['segmentsGetStreams']
	>(`segments/${input.id}/streams`, ctx.key, {
		method: 'GET',
		query: {
			keys: input.keys.join(','),
			key_by_type: input.key_by_type,
		},
	});

	return result;
};

export const list: StravaEndpoints['segmentsList'] = async (ctx, input) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['segmentsList']>(
		'segments/starred',
		ctx.key,
		{
			method: 'GET',
			query: {
				page: input.page,
				per_page: input.per_page,
			},
		},
	);

	if (Array.isArray(result) && ctx.db.segments) {
		try {
			for (const segment of result) {
				if (segment.id) {
					await ctx.db.segments.upsertByEntityId(String(segment.id), {
						...segment,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save segments to database:', error);
		}
	}

	return result;
};

export const star: StravaEndpoints['segmentsStar'] = async (ctx, input) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['segmentsStar']>(
		`segments/${input.id}/starred`,
		ctx.key,
		{
			method: 'PUT',
			body: {
				starred: input.starred,
			},
		},
	);

	if (result.id && ctx.db.segments) {
		try {
			await ctx.db.segments.upsertByEntityId(String(result.id), { ...result });
		} catch (error) {
			console.warn('Failed to save segment to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'strava.segments.star',
		{ ...input },
		'completed',
	);
	return result;
};

export const effortsGet: StravaEndpoints['segmentEffortsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['segmentEffortsGet']
	>(`segment_efforts/${input.id}`, ctx.key, {
		method: 'GET',
	});

	if (result.id && ctx.db.segmentEfforts) {
		try {
			await ctx.db.segmentEfforts.upsertByEntityId(String(result.id), {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save segment effort to database:', error);
		}
	}

	return result;
};

export const effortsGetStreams: StravaEndpoints['segmentEffortsGetStreams'] =
	async (ctx, input) => {
		const result = await makeStravaRequest<
			StravaEndpointOutputs['segmentEffortsGetStreams']
		>(`segment_efforts/${input.id}/streams`, ctx.key, {
			method: 'GET',
			query: {
				keys: input.keys.join(','),
				key_by_type: input.key_by_type,
			},
		});

		return result;
	};
