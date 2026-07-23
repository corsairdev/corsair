import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleBigqueryRequest } from '../client';
import type { GoogleBigqueryEndpoints } from '../index';
import type { GoogleBigqueryEndpointOutputs } from './types';

export const list: GoogleBigqueryEndpoints['datasetsList'] = async (
	ctx,
	input,
) => {
	const { projectId, ...query } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['datasetsList']
	>(`/projects/${projectId}/datasets`, ctx, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'googlebigquery.datasets.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleBigqueryEndpoints['datasetsGet'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, ...query } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['datasetsGet']
	>(`/projects/${projectId}/datasets/${datasetId}`, ctx, {
		method: 'GET',
		query,
	});

	if (result.id && ctx.db.datasets) {
		try {
			await ctx.db.datasets.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save dataset to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.datasets.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GoogleBigqueryEndpoints['datasetsCreate'] = async (
	ctx,
	input,
) => {
	const { projectId, ...body } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['datasetsCreate']
	>(`/projects/${projectId}/datasets`, ctx, { method: 'POST', body });

	if (result.id && ctx.db.datasets) {
		try {
			await ctx.db.datasets.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save dataset to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.datasets.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GoogleBigqueryEndpoints['datasetsUpdate'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, dataset } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['datasetsUpdate']
	>(`/projects/${projectId}/datasets/${datasetId}`, ctx, {
		method: 'PUT',
		body: dataset,
	});

	if (result.id && ctx.db.datasets) {
		try {
			await ctx.db.datasets.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save dataset to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.datasets.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const patch: GoogleBigqueryEndpoints['datasetsPatch'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, dataset } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['datasetsPatch']
	>(`/projects/${projectId}/datasets/${datasetId}`, ctx, {
		method: 'PATCH',
		body: dataset,
	});

	if (result.id && ctx.db.datasets) {
		try {
			await ctx.db.datasets.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save dataset to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.datasets.patch',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteDataset: GoogleBigqueryEndpoints['datasetsDelete'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, deleteContents } = input;
	await makeAuthenticatedGoogleBigqueryRequest<void>(
		`/projects/${projectId}/datasets/${datasetId}`,
		ctx,
		{ method: 'DELETE', query: { deleteContents } },
	);

	if (ctx.db.datasets) {
		try {
			// Matches BigQuery dataset resource id used on upsert: "projectId:datasetId"
			await ctx.db.datasets.deleteByEntityId(`${projectId}:${datasetId}`);
		} catch (error) {
			console.warn('Failed to delete dataset from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.datasets.delete',
		{ ...input },
		'completed',
	);
};

export const undelete: GoogleBigqueryEndpoints['datasetsUndelete'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, deletionTime } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['datasetsUndelete']
	>(`/projects/${projectId}/datasets/${datasetId}:undelete`, ctx, {
		method: 'POST',
		body: { deletionTime },
	});

	if (result.id && ctx.db.datasets) {
		try {
			await ctx.db.datasets.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save dataset to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.datasets.undelete',
		{ ...input },
		'completed',
	);
	return result;
};
