import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleBigqueryRequest } from '../client';
import type { GoogleBigqueryEndpoints } from '../index';
import type { GoogleBigqueryEndpointOutputs } from './types';

/**
 * Cache key for a model. Prefer projectId from the API reference; fall back to
 * the request projectId when BigQuery omits it so upsert and delete match.
 */
function modelEntityId(
	modelReference?: {
		projectId?: string;
		datasetId?: string;
		modelId?: string;
	},
	fallbackProjectId?: string,
): string | undefined {
	if (!modelReference?.datasetId || !modelReference.modelId) return undefined;
	const projectId = modelReference.projectId || fallbackProjectId || undefined;
	if (!projectId) return undefined;
	return `${projectId}.${modelReference.datasetId}.${modelReference.modelId}`;
}

export const listModels: GoogleBigqueryEndpoints['mlListModels'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, ...query } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['mlListModels']
	>(`/projects/${projectId}/datasets/${datasetId}/models`, ctx, {
		method: 'GET',
		query,
	});

	if (result.models && ctx.db.models) {
		try {
			for (const model of result.models) {
				const id = modelEntityId(model.modelReference, projectId);
				if (id) {
					await ctx.db.models.upsertByEntityId(id, {
						...model,
						id,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save models to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.ml.listModels',
		{ ...input },
		'completed',
	);
	return result;
};

export const getModel: GoogleBigqueryEndpoints['mlGetBigqueryModel'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, modelId } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['mlGetBigqueryModel']
	>(`/projects/${projectId}/datasets/${datasetId}/models/${modelId}`, ctx, {
		method: 'GET',
	});

	const id = modelEntityId(result.modelReference, projectId);
	if (id && ctx.db.models) {
		try {
			await ctx.db.models.upsertByEntityId(id, {
				...result,
				id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save model to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.ml.getBigqueryModel',
		{ ...input },
		'completed',
	);
	return result;
};

export const patchModel: GoogleBigqueryEndpoints['mlPatchModel'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, modelId, ...body } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['mlPatchModel']
	>(`/projects/${projectId}/datasets/${datasetId}/models/${modelId}`, ctx, {
		method: 'PATCH',
		body,
	});

	const id = modelEntityId(result.modelReference, projectId);
	if (id && ctx.db.models) {
		try {
			await ctx.db.models.upsertByEntityId(id, {
				...result,
				id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save model to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.ml.patchModel',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteModel: GoogleBigqueryEndpoints['mlDeleteModel'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, modelId } = input;
	await makeAuthenticatedGoogleBigqueryRequest<void>(
		`/projects/${projectId}/datasets/${datasetId}/models/${modelId}`,
		ctx,
		{ method: 'DELETE' },
	);

	const id = modelEntityId({ projectId, datasetId, modelId });
	if (id && ctx.db.models) {
		try {
			await ctx.db.models.deleteByEntityId(id);
		} catch (error) {
			console.warn('Failed to delete model from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.ml.deleteModel',
		{ ...input },
		'completed',
	);
};

export const listLocations: GoogleBigqueryEndpoints['mlListLocations'] = async (
	ctx,
	input,
) => {
	const { projectId, ...query } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['mlListLocations']
	>(`/projects/${projectId}/locations`, ctx, {
		method: 'GET',
		host: 'reservation',
		query,
	});

	await logEventFromContext(
		ctx,
		'googlebigquery.ml.listLocations',
		{ ...input },
		'completed',
	);
	return result;
};

export const listProjects: GoogleBigqueryEndpoints['mlListProjects'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['mlListProjects']
	>('/projects', ctx, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'googlebigquery.ml.listProjects',
		{ ...input },
		'completed',
	);
	return result;
};
