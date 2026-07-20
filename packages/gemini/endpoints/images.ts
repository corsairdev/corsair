import { logEventFromContext } from 'corsair/core';
import type { GeminiEndpoints } from '..';
import { makeGeminiRequest } from '../client';
import type { Candidate } from '../schema/content';
import {
	buildImageGenerationConfig,
	extractImagesFromCandidates,
} from './image-utils';
import type { GenerateImageResponse } from './types';

export {
	buildImageGenerationConfig,
	extractImagesFromCandidates,
} from './image-utils';

export const generateImage: GeminiEndpoints['generateImage'] = async (
	ctx,
	input,
) => {
	const parts: Array<{
		text?: string;
		inlineData?: { mimeType: string; data: string };
	}> = [
		{ text: input.prompt },
		...(input.referenceImages ?? []).map((image) => ({
			inlineData: { mimeType: image.mimeType, data: image.data },
		})),
	];

	const response = await makeGeminiRequest<{
		candidates?: Candidate[];
		usageMetadata?: GenerateImageResponse['usageMetadata'];
		// Generative Language API requires the /models/ segment for model-scoped methods
	}>(`/models/${input.model}:generateContent`, ctx.key, {
		method: 'POST',
		body: {
			contents: [{ role: 'user', parts }],
			generationConfig: buildImageGenerationConfig(input.generationConfig),
		},
	});

	const images = extractImagesFromCandidates(response.candidates);

	await logEventFromContext(
		ctx,
		'gemini.images.generateImage',
		{ ...input },
		'completed',
	);
	return {
		images,
		candidates: response.candidates,
		usageMetadata: response.usageMetadata,
	};
};
