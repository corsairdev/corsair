import type { CanvaContext, CanvaEndpoints } from '../index';
import { loggable, saveDesign } from './mappers';
import { callCanva, seg } from './shared';
import type { CanvaEndpointOutputs, DesignSummary } from './types';
import { CanvaEndpointInputSchemas } from './types';

async function upsertDesign(ctx: CanvaContext, design?: DesignSummary) {
	await saveDesign(ctx, design);
}

export const create: CanvaEndpoints['mergesCreate'] = async (ctx, input) => {
	const parsed = CanvaEndpointInputSchemas.mergesCreate.parse(input);
	const body =
		parsed.type === 'create_new_design'
			? {
					type: parsed.type,
					title: parsed.title,
					operations: parsed.operations,
				}
			: {
					type: parsed.type,
					design_id: parsed.design_id,
					operations: parsed.operations,
					...(parsed.title !== undefined && { title: parsed.title }),
				};
	const result = await callCanva<CanvaEndpointOutputs['mergesCreate']>(
		ctx,
		'merges.create',
		{
			type: parsed.type,
			design_id: parsed.design_id,
			operations: parsed.operations.map((op) => op.type),
		},
		'v1/merges',
		{ method: 'POST', body },
	);
	await upsertDesign(ctx, result.job.result?.design);
	return result;
};

export const get: CanvaEndpoints['mergesGet'] = async (ctx, input) => {
	const result = await callCanva<CanvaEndpointOutputs['mergesGet']>(
		ctx,
		'merges.get',
		loggable(input),
		`v1/merges/${seg(input.jobId)}`,
	);
	await upsertDesign(ctx, result.job.result?.design);
	return result;
};
