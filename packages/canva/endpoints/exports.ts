import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaEndpoints } from '../index';
import type { CanvaEndpointOutputs } from './types';

export const create: CanvaEndpoints['exportsCreate'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['exportsCreate']>(
		'v1/exports',
		ctx.key,
		{
			method: 'POST',
			body: {
				design_id: input.design_id,
				format: input.format,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'canva.exports.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['exportsGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['exportsGet']>(
		`v1/exports/${input.exportId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'canva.exports.get',
		{ ...input },
		'completed',
	);
	return result;
};
