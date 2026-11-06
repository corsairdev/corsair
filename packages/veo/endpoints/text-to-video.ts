import type { VeoEndpoints } from '..';
import { startPrediction } from './predict';
import { VeoEndpointInputSchemas } from './types';

// POST .../models/MODEL_ID:predictLongRunning
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-text

export const textToVideoCreate: VeoEndpoints['textToVideo']['create'] = async (
	ctx,
	input,
) => {
	const parsed = VeoEndpointInputSchemas.textToVideoCreate.parse(input);
	return startPrediction(ctx, 'veo.textToVideo.create', parsed, {
		prompt: parsed.prompt,
	});
};
