import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaContext, CanvaEndpoints } from '../index';
import { loggable, saveDesign } from './mappers';
import { defined, seg } from './shared';
import type { CanvaEndpointOutputs } from './types';
import { CanvaEndpointInputSchemas } from './types';

async function upsertDesignFromJob(
	ctx: CanvaContext,
	job: CanvaEndpointOutputs['autofillsGet']['job'],
) {
	await saveDesign(ctx, job.result?.design);
}

export const create: CanvaEndpoints['autofillsCreate'] = async (ctx, input) => {
	const parsed = CanvaEndpointInputSchemas.autofillsCreate.parse(input);
	const type = parsed.type ?? 'create_from_brand_template';
	const body =
		type === 'create_from_brand_template'
			? defined({
					type,
					brand_template_id: parsed.brand_template_id,
					title: parsed.title,
					data: parsed.data,
				})
			: type === 'create_from_design'
				? defined({
						type,
						design_id: parsed.design_id,
						title: parsed.title,
						data: parsed.data,
					})
				: { type, design_id: parsed.design_id, data: parsed.data };
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['autofillsCreate']
	>('v1/autofills', ctx.key, { method: 'POST', body });

	await upsertDesignFromJob(ctx, result.job);

	// The data can hold anything the user filled in; log only which fields.
	await logEventFromContext(
		ctx,
		'canva.autofills.create',
		{
			type,
			brand_template_id: parsed.brand_template_id,
			design_id: parsed.design_id,
			title: parsed.title,
			fields: Object.keys(parsed.data),
		},
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['autofillsGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['autofillsGet']>(
		`v1/autofills/${seg(input.jobId)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await upsertDesignFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.autofills.get',
		loggable(input),
		'completed',
	);
	return result;
};
