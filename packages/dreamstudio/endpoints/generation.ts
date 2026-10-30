import { logEventFromContext } from 'corsair/core';
import type { DreamstudioEndpoints } from '..';
import { generateImageFromImage as postImageToImage } from '../client';
import { GenerateImageFromImageOutputSchema } from './types';

export const generateImageFromImage: DreamstudioEndpoints['generateImageFromImage'] =
	async (ctx, input) => {
		const raw = await postImageToImage(ctx.key, input);
		const response = GenerateImageFromImageOutputSchema.parse(raw);
		await logEventFromContext(
			ctx,
			'dreamstudio.generation.imageFromImage',
			{ engine_id: input.engine_id },
			'completed',
		);
		return response;
	};
