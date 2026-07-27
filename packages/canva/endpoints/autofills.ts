import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaContext, CanvaEndpoints } from '../index';
import type { CanvaEndpointOutputs } from './types';

async function upsertDesignFromJob(
	ctx: CanvaContext,
	job: CanvaEndpointOutputs['autofillsGet']['job'],
) {
	if (!job.result?.design || !ctx.db.designs) return;
	try {
		const design = job.result.design;
		await ctx.db.designs.upsertByEntityId(design.id, {
			id: design.id,
			title: design.title,
			url: design.url,
		});
	} catch (error) {
		console.warn('Failed to save autofilled design to database:', error);
	}
}

export const create: CanvaEndpoints['autofillsCreate'] = async (ctx, input) => {
	const { brand_template_id, data, title } = input;
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['autofillsCreate']
	>('v1/autofills', ctx.key, {
		method: 'POST',
		body: {
			brand_template_id,
			data,
			...(title !== undefined && { title }),
		},
	});

	await upsertDesignFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.autofills.create',
		{ brand_template_id, title },
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['autofillsGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['autofillsGet']>(
		`v1/autofills/${input.jobId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await upsertDesignFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.autofills.get',
		{ ...input },
		'completed',
	);
	return result;
};
