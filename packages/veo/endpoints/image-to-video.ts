import type { VeoEndpoints } from '..';
import { buildImage, startPrediction } from './predict';
import { VeoEndpointInputSchemas } from './types';

// POST .../models/MODEL_ID:predictLongRunning with instances[].image
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-an-image

export const imageToVideoCreate: VeoEndpoints['imageToVideo']['create'] =
	async (ctx, input) => {
		const parsed = VeoEndpointInputSchemas.imageToVideoCreate.parse(input);
		return startPrediction(ctx, 'veo.imageToVideo.create', parsed, {
			...(parsed.prompt ? { prompt: parsed.prompt } : {}),
			image: buildImage(parsed.image),
		});
	};
