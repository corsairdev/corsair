import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleBigqueryRequest } from '../client';
import type { GoogleBigqueryEndpoints } from '../index';
import type { GoogleBigqueryEndpointOutputs } from './types';

/**
 * Cache key for a routine. Prefer projectId from the API reference; fall back to
 * the request projectId when BigQuery omits it (common on insert/list responses)
 * so upsert and delete use the same key.
 */
function routineEntityId(
	routineReference?: {
		projectId?: string;
		datasetId?: string;
		routineId?: string;
	},
	fallbackProjectId?: string,
): string | undefined {
	if (!routineReference?.datasetId || !routineReference.routineId)
		return undefined;
	const projectId =
		routineReference.projectId || fallbackProjectId || undefined;
	if (!projectId) return undefined;
	return `${projectId}.${routineReference.datasetId}.${routineReference.routineId}`;
}

export const list: GoogleBigqueryEndpoints['routinesList'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, ...query } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['routinesList']
	>(`/projects/${projectId}/datasets/${datasetId}/routines`, ctx, {
		method: 'GET',
		query,
	});

	if (result.routines && ctx.db.routines) {
		try {
			for (const routine of result.routines) {
				const id = routineEntityId(routine.routineReference, projectId);
				if (id) {
					await ctx.db.routines.upsertByEntityId(id, {
						...routine,
						id,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save routines to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.routines.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleBigqueryEndpoints['routinesGet'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, routineId, ...query } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['routinesGet']
	>(`/projects/${projectId}/datasets/${datasetId}/routines/${routineId}`, ctx, {
		method: 'GET',
		query,
	});

	const id = routineEntityId(result.routineReference, projectId);
	if (id && ctx.db.routines) {
		try {
			await ctx.db.routines.upsertByEntityId(id, {
				...result,
				id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save routine to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.routines.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GoogleBigqueryEndpoints['routinesCreate'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, ...body } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['routinesCreate']
	>(`/projects/${projectId}/datasets/${datasetId}/routines`, ctx, {
		method: 'POST',
		body,
	});

	const id = routineEntityId(result.routineReference, projectId);
	if (id && ctx.db.routines) {
		try {
			await ctx.db.routines.upsertByEntityId(id, {
				...result,
				id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save routine to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.routines.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GoogleBigqueryEndpoints['routinesUpdate'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, routineId, routine } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['routinesUpdate']
	>(`/projects/${projectId}/datasets/${datasetId}/routines/${routineId}`, ctx, {
		method: 'PUT',
		body: routine,
	});

	const id = routineEntityId(result.routineReference, projectId);
	if (id && ctx.db.routines) {
		try {
			await ctx.db.routines.upsertByEntityId(id, {
				...result,
				id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save routine to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.routines.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteRoutine: GoogleBigqueryEndpoints['routinesDelete'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, routineId } = input;
	await makeAuthenticatedGoogleBigqueryRequest<void>(
		`/projects/${projectId}/datasets/${datasetId}/routines/${routineId}`,
		ctx,
		{ method: 'DELETE' },
	);

	const id = routineEntityId({ projectId, datasetId, routineId });
	if (id && ctx.db.routines) {
		try {
			await ctx.db.routines.deleteByEntityId(id);
		} catch (error) {
			console.warn('Failed to delete routine from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.routines.delete',
		{ ...input },
		'completed',
	);
};
