import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaContext, CanvaEndpoints } from '../index';
import type { CanvaEndpointOutputs } from './types';

async function upsertDesignFromJob(
	ctx: CanvaContext,
	job: CanvaEndpointOutputs['resizesGet']['job'],
) {
	if (!job.result?.design || !ctx.db.designs) return;
	try {
		const design = job.result.design;
		await ctx.db.designs.upsertByEntityId(design.id, {
			id: design.id,
			title: design.title,
			owner_user_id: design.owner?.user_id,
			owner_team_id: design.owner?.team_id,
			created_at: design.created_at ? new Date(design.created_at * 1000) : null,
			updated_at: design.updated_at ? new Date(design.updated_at * 1000) : null,
			page_count: design.page_count,
			edit_url: design.urls?.edit_url,
			view_url: design.urls?.view_url,
		});
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
