import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { UploadMediaAssetResponse } from './types';

export const upload: DynapicturesEndpoints['uploadMediaAsset'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<UploadMediaAssetResponse>(
		'/media',
		ctx.key,
		{
			method: 'POST',
			body: {
				imageUrl: input.imageUrl,
				...(input.name ? { name: input.name } : {}),
			},
		},
	);
	await logEventFromContext(
		ctx,
		'dynapictures.media.upload',
		{ imageUrl: input.imageUrl, name: input.name },
		'completed',
	);
	return response;
};
