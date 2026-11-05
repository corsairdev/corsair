import type { VeoEndpoints } from '..';
import { startPrediction } from './predict';
import { VeoEndpointInputSchemas } from './types';

// POST .../models/MODEL_ID:predictLongRunning with instances[].video
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/extend-videos

export const extendCreate: VeoEndpoints['extend']['create'] = async (
	ctx,
	input,
) => {
	const parsed = VeoEndpointInputSchemas.extendCreate.parse(input);
	return startPrediction(ctx, 'veo.extend.create', parsed, {
		prompt: parsed.prompt,
		video: {
			gcsUri: parsed.video.gcsUri,
			mimeType: parsed.video.mimeType,
		},
	});
};
