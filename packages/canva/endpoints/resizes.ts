import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaContext, CanvaEndpoints } from '../index';
import { toDesignEntity } from './mappers';
import type { CanvaEndpointOutputs } from './types';

async function upsertDesignFromJob(
	ctx: CanvaContext,
	job: CanvaEndpointOutputs['resizesGet']['job'],
) {
	if (!job.result?.design || !ctx.db.designs) return;
	try {
		await ctx.db.designs.upsertByEntityId(
			job.result.design.id,
			toDesignEntity(job.result.design),
		);
	} catch (error) {
		console.warn('Failed to save resized design to database:', error);
	}
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
		{ ...input },
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['resizesGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['resizesGet']>(
		`v1/resizes/${input.jobId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await upsertDesignFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.resizes.get',
		{ ...input },
		'completed',
	);
	return result;
};
