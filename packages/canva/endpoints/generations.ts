import type { CanvaContext, CanvaEndpoints } from '../index';
import { toDesignEntity } from './mappers';
import { callCanva, seg } from './shared';
import type { CanvaEndpointOutputs, DesignSummary } from './types';

async function upsertDesign(ctx: CanvaContext, design?: DesignSummary) {
	if (!design || !ctx.db.designs) return;
	try {
		await ctx.db.designs.upsertByEntityId(design.id, toDesignEntity(design));
	} catch (error) {
		console.warn('Failed to save generated design to database:', error);
	}
}

export const create: CanvaEndpoints['generationsCreate'] = async (
	ctx,
	input,
) => {
	const result = await callCanva<CanvaEndpointOutputs['generationsCreate']>(
		ctx,
		'generations.create',
		{ design_type: input.design_type, sections: input.outline?.length },
		'v1/generations',
		{
			method: 'POST',
			body: {
				brief: input.brief,
				design_type: { type: 'preset', name: input.design_type },
				...(input.outline !== undefined && {
					outline: { sections: input.outline },
				}),
			},
		},
	);
	await upsertDesign(ctx, result.job.result?.design);
	return result;
};

export const get: CanvaEndpoints['generationsGet'] = async (ctx, input) => {
	const result = await callCanva<CanvaEndpointOutputs['generationsGet']>(
		ctx,
		'generations.get',
		{ ...input },
		`v1/generations/${seg(input.jobId)}`,
	);
	await upsertDesign(ctx, result.job.result?.design);
	return result;
};
