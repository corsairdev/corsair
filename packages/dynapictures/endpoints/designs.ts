import { logEventFromContext } from 'corsair/core';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpoints } from '../index';
import type { DynapicturesEndpointOutputs } from './types';

export const generateDesign: DynapicturesEndpoints['generateDesign'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<
		DynapicturesEndpointOutputs['generateDesign']
	>(`designs/${encodeURIComponent(input.designId)}`, ctx.key, {
		method: 'POST',
		body: {
			params: input.params,
			format: input.format,
			metadata: input.metadata,
		},
	});

	await logEventFromContext(
		ctx,
		'dynapictures.designs.generate',
		{ ...input },
		'completed',
	);

	return response;
};

export const getDesign: DynapicturesEndpoints['getDesign'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<
		DynapicturesEndpointOutputs['getDesign']
	>(`designs/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'dynapictures.designs.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const listDesigns: DynapicturesEndpoints['listDesigns'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<
		DynapicturesEndpointOutputs['listDesigns']
	>('designs', ctx.key, {
		method: 'GET',
		query: {
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'dynapictures.designs.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const deleteDesign: DynapicturesEndpoints['deleteDesign'] = async (
	ctx,
	input,
) => {
	await makeDynapicturesRequest(
		`designs/${encodeURIComponent(input.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'dynapictures.designs.delete',
		{ ...input },
		'completed',
	);

	return { success: true };
};
