import { logEventFromContext } from 'corsair/core';
import { makeAmplitudeRequest } from '../client';
import type { AmplitudeEndpoints } from '../index';
import type { AmplitudeEndpointOutputs } from './types';

export const list: AmplitudeEndpoints['cohortsList'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['cohortsList']
	>('/api/3/cohorts', ctx.key, { method: 'GET' });

	if (result.cohorts && ctx.db.cohorts) {
		try {
			for (const cohort of result.cohorts) {
				if (cohort.id) {
					await ctx.db.cohorts.upsertByEntityId(cohort.id, {
						...cohort,
						description: cohort.description ?? undefined,
						size: cohort.size ?? undefined,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save cohorts to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'amplitude.cohorts.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: AmplitudeEndpoints['cohortsGet'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['cohortsGet']
	>(`/api/3/cohorts/${input.cohort_id}`, ctx.key, { method: 'GET' });

	if (result.cohort && ctx.db.cohorts) {
		try {
			const { description, ...rest } = result.cohort;
			await ctx.db.cohorts.upsertByEntityId(result.cohort.id, {
				...rest,
				description: description ?? undefined,
			});
		} catch (error) {
			console.warn('Failed to save cohort to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'amplitude.cohorts.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: AmplitudeEndpoints['cohortsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['cohortsCreate']
	>('/api/3/cohorts', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			app_id: input.app_id,
			id_type: input.id_type,
			ids: input.ids,
			owners: input.owners,
			description: input.description,
			published: input.published,
		},
	});

	if (result.cohort && ctx.db.cohorts) {
		try {
			await ctx.db.cohorts.upsertByEntityId(result.cohort.id, {
				...result.cohort,
			});
		} catch (error) {
			console.warn('Failed to save cohort to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'amplitude.cohorts.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMembers: AmplitudeEndpoints['cohortsGetMembers'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['cohortsGetMembers']
	>(`/api/5/cohorts/request/${input.request_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'amplitude.cohorts.getMembers',
		{ ...input },
		'completed',
	);
	return result;
};
