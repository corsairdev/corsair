import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaEndpoints } from '../index';
import type { CanvaEndpointOutputs } from './types';

export const list: CanvaEndpoints['designsList'] = async (ctx, input) => {
	const { query, continuation, ownership, sort_by, limit } = input;
	const result = await makeCanvaRequest<CanvaEndpointOutputs['designsList']>(
		'v1/designs',
		ctx.key,
		{
			method: 'GET',
			query: {
				...(query !== undefined && { query }),
				...(continuation !== undefined && { continuation }),
				...(ownership !== undefined && { ownership }),
				...(sort_by !== undefined && { sort_by }),
				...(limit !== undefined && { limit }),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'canva.designs.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['designsGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['designsGet']>(
		`v1/designs/${input.designId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'canva.designs.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: CanvaEndpoints['designsCreate'] = async (ctx, input) => {
	const { type, design_type, asset_id, title } = input;
	const result = await makeCanvaRequest<CanvaEndpointOutputs['designsCreate']>(
		'v1/designs',
		ctx.key,
		{
			method: 'POST',
			body: {
				...(type !== undefined && { type }),
				...(design_type !== undefined && { design_type }),
				...(asset_id !== undefined && { asset_id }),
				...(title !== undefined && { title }),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'canva.designs.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const getPages: CanvaEndpoints['designsGetPages'] = async (
	ctx,
	input,
) => {
	const { designId, offset, limit } = input;
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['designsGetPages']
	>(`v1/designs/${designId}/pages`, ctx.key, {
		method: 'GET',
		query: {
			...(offset !== undefined && { offset }),
			...(limit !== undefined && { limit }),
		},
	});

	await logEventFromContext(
		ctx,
		'canva.designs.getPages',
		{ ...input },
		'completed',
	);
	return result;
};
