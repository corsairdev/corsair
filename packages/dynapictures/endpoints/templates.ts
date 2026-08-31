import { logEventFromContext } from 'corsair/core';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpoints } from '../index';
import type { DynapicturesEndpointOutputs } from './types';

type RawDynapicturesTemplate = {
	id: string;
	name: string;
	width?: number;
	height?: number;
	thumbnail?: string;
	thumbnailUrl?: string;
	[key: string]: unknown;
};

/**
 * Lists available design templates defined in the Dynapictures account.
 *
 * @param ctx - Corsair plugin context containing API authentication key
 * @param input - Optional pagination parameters (limit and offset)
 * @returns Array of available template design definitions with normalized thumbnailUrl
 */
export const listTemplates: DynapicturesEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<RawDynapicturesTemplate[]>(
		'templates',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				offset: input.offset,
			},
		},
	);

	const normalizedResponse: DynapicturesEndpointOutputs['listTemplates'] =
		response.map((template) => {
			const { thumbnail, thumbnailUrl, ...rest } = template;
			return {
				...rest,
				thumbnailUrl: thumbnailUrl ?? thumbnail,
			};
		});

	await logEventFromContext(
		ctx,
		'dynapictures.templates.list',
		{ ...input },
		'completed',
	);

	return normalizedResponse;
};
