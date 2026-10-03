import { logEventFromContext } from 'corsair/core';
import { makeFinerWorksRequest } from '../client';
import type { FinerWorksEndpoint } from './shared';
import { resolveCredentials } from './shared';
import {
	FramingGetFrameDetailsInputSchema,
	FramingGetFrameDetailsOutputSchema,
	FramingListCollectionsInputSchema,
	FramingListCollectionsOutputSchema,
	FramingListGlazingInputSchema,
	FramingListGlazingOutputSchema,
	FramingListMatsInputSchema,
	FramingListMatsOutputSchema,
} from './types';

/**
 * Dimensions, pricing, materials and imagery for a specific frame.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-frame_details
 */
export const getFrameDetails: FinerWorksEndpoint<
	'framing.getFrameDetails'
> = async (ctx, input) => {
	const validated = FramingGetFrameDetailsInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/frame_details',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.framing.getFrameDetails',
		{ id: validated.id },
		'completed',
	);
	return FramingGetFrameDetailsOutputSchema.parse(res);
};

/**
 * Available frame collections and categories.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_collections
 */
export const listCollections: FinerWorksEndpoint<
	'framing.listCollections'
> = async (ctx, input = {}) => {
	const validated = FramingListCollectionsInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_collections',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.framing.listCollections',
		{ id: validated.id ?? null },
		'completed',
	);
	return FramingListCollectionsOutputSchema.parse(res);
};

/**
 * Available glazing and glass options.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_glazing
 */
export const listGlazing: FinerWorksEndpoint<'framing.listGlazing'> = async (
	ctx,
	input = {},
) => {
	const validated = FramingListGlazingInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_glazing',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.framing.listGlazing',
		{ id: validated.id ?? null },
		'completed',
	);
	return FramingListGlazingOutputSchema.parse(res);
};

/**
 * Matting specifications — dimensions, colours and pricing.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_mats
 */
export const listMats: FinerWorksEndpoint<'framing.listMats'> = async (
	ctx,
	input = {},
) => {
	const validated = FramingListMatsInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_mats',
		credentials,
		{
			method: 'POST',
			body: validated,
		},
	);

	await logEventFromContext(
		ctx,
		'finerworks.framing.listMats',
		{ id: validated.id ?? null },
		'completed',
	);
	return FramingListMatsOutputSchema.parse(res);
};

export const FramingEndpoints = {
	getFrameDetails,
	listCollections,
	listGlazing,
	listMats,
} as const;
