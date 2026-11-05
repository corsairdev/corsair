import { logEventFromContext } from 'corsair/core';
import type { ScaleAiEndpoints } from '..';
import { makeScaleAiRequest } from '../client';
import type { StudioAssignmentsResponse, StudioBatchesResponse } from './types';

export const getStudioAssignments: ScaleAiEndpoints['getStudioAssignments'] =
	async (ctx) => {
		const response = await makeScaleAiRequest<StudioAssignmentsResponse>(
			'studio/assignments',
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'scaleai.studio.getAssignments',
			{ members: Object.keys(response).length },
			'completed',
		);
		return response;
	};

export const addStudioAssignments: ScaleAiEndpoints['addStudioAssignments'] =
	async (ctx, input) => {
		const response = await makeScaleAiRequest<StudioAssignmentsResponse>(
			'studio/assignments/add',
			ctx.key,
			{ method: 'POST', body: input },
		);
		await logEventFromContext(
			ctx,
			'scaleai.studio.addAssignments',
			{
				email_count: input.emails.length,
				project_count: input.projects.length,
			},
			'completed',
		);
		return response;
	};

export const removeStudioAssignments: ScaleAiEndpoints['removeStudioAssignments'] =
	async (ctx, input) => {
		const response = await makeScaleAiRequest<StudioAssignmentsResponse>(
			'studio/assignments/remove',
			ctx.key,
			{ method: 'POST', body: input },
		);
		await logEventFromContext(
			ctx,
			'scaleai.studio.removeAssignments',
			{
				email_count: input.emails.length,
				project_count: input.projects.length,
			},
			'completed',
		);
		return response;
	};

export const getStudioBatches: ScaleAiEndpoints['getStudioBatches'] = async (
	ctx,
) => {
	const response = await makeScaleAiRequest<StudioBatchesResponse>(
		'studio/batches',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'scaleai.studio.getBatches',
		{ count: response.length },
		'completed',
	);
	return response;
};

export const setBatchPriorities: ScaleAiEndpoints['setBatchPriorities'] =
	async (ctx, input) => {
		const response = await makeScaleAiRequest<StudioBatchesResponse>(
			'studio/batches/set_priorities',
			ctx.key,
			{
				method: 'POST',
				body: { batches: input.batch_names.map((name) => ({ name })) },
			},
		);
		await logEventFromContext(
			ctx,
			'scaleai.studio.setBatchPriorities',
			{ batch_names: input.batch_names },
			'completed',
		);
		return response;
	};

export const resetBatchPriorities: ScaleAiEndpoints['resetBatchPriorities'] =
	async (ctx) => {
		const response = await makeScaleAiRequest<StudioBatchesResponse>(
			'studio/batches/reset_priorities',
			ctx.key,
			{ method: 'POST' },
		);
		await logEventFromContext(
			ctx,
			'scaleai.studio.resetBatchPriorities',
			{},
			'completed',
		);
		return response;
	};
