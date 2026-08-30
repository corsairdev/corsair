import { logEventFromContext } from 'corsair/core';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpoints } from '../index';
import type { DynapicturesEndpointOutputs } from './types';

/**
 * Generates an image or document from a Dynapictures template design.
 *
 * Sends a POST request to `POST /designs/{designId}` with dynamic layer parameter overrides,
 * output format selection, and optional custom metadata.
 *
 * @param ctx - Corsair plugin context containing API authentication key
 * @param input - Generation parameters including template design ID, layer params, format, and metadata
 * @returns Generated design response containing image URL, thumbnail, dimensions, and template ID
 */
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

/**
 * Retrieves details for a specific generated design image by unique ID.
 *
 * @param ctx - Corsair plugin context containing API authentication key
 * @param input - Input containing the design unique ID
 * @returns Generated design metadata including image URL and dimensions
 */
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

/**
 * Lists previously generated design images associated with the account.
 *
 * @param ctx - Corsair plugin context containing API authentication key
 * @param input - Optional pagination controls (limit and offset)
 * @returns Array of generated design records
 */
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
