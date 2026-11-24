import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaContext, CanvaEndpoints } from '../index';
import { loggable, saveDesign } from './mappers';
import { seg } from './shared';
import type { CanvaEndpointOutputs } from './types';

async function upsertDesignFromJob(
	ctx: CanvaContext,
	job: CanvaEndpointOutputs['resizesGet']['job'],
) {
	await saveDesign(ctx, job.result?.design);
}

export const create: CanvaEndpoints['resizesCreate'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['resizesCreate']>(
		'v1/resizes',
		ctx.key,
		{
			method: 'POST',
			body: {
				design_id: input.design_id,
				design_type: input.design_type,
			},
		},
	);

	await upsertDesignFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.resizes.create',
		loggable(input),
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['resizesGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['resizesGet']>(
		`v1/resizes/${seg(input.jobId)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await upsertDesignFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.resizes.get',
		loggable(input),
		'completed',
	);
	return result;
};
