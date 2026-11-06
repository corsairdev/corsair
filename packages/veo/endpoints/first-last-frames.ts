import type { VeoEndpoints } from '..';
import { buildImage, startPrediction } from './predict';
import { VeoEndpointInputSchemas } from './types';

// POST .../models/MODEL_ID:predictLongRunning with image and lastFrame
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-first-and-last-frames

export const framesCreate: VeoEndpoints['frames']['create'] = async (
	ctx,
	input,
) => {
	const parsed = VeoEndpointInputSchemas.framesCreate.parse(input);
	return startPrediction(ctx, 'veo.frames.create', parsed, {
		...(parsed.prompt ? { prompt: parsed.prompt } : {}),
		image: buildImage(parsed.image),
		lastFrame: buildImage(parsed.lastFrame),
	});
};
