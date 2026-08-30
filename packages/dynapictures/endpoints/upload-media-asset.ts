import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpointOutputs } from './types';

export const uploadMediaAsset: DynapicturesEndpoints['uploadMediaAsset'] =
	async (ctx, input) => {
		const response = await makeDynapicturesRequest<
			DynapicturesEndpointOutputs['uploadMediaAsset']
		>(`media/${encodeURIComponent(input.workspaceId)}/assets`, ctx.key, {
			method: 'POST',
			body: { imageUrl: input.imageUrl },
		});

		await logEventFromContext(
			ctx,
			'dynapictures.media.upload',
			{ ...input },
			'completed',
		);
		return response;
	};
