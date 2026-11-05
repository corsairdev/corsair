import type { VeoEndpoints } from '..';
import { buildImage, startPrediction } from './predict';
import { VeoEndpointInputSchemas } from './types';

// POST .../models/MODEL_ID:predictLongRunning with referenceImages
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-references

export const referencesCreate: VeoEndpoints['references']['create'] = async (
	ctx,
	input,
) => {
	const parsed = VeoEndpointInputSchemas.referencesCreate.parse(input);
	return startPrediction(ctx, 'veo.references.create', parsed, {
		prompt: parsed.prompt,
		referenceImages: parsed.referenceImages.map((reference) => ({
			image: buildImage(reference.image),
			referenceType: reference.referenceType,
		})),
	});
};
