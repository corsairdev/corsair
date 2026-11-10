import type { RoboflowEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	RoboflowEndpointInputSchemas as Inputs,
	RoboflowEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Runs a model on an image, on the inference host rather than the management host.
 *
 * Every input is a query parameter, including the image itself: the Inference
 * server takes `image` as a URL, a base64 string or a data URI, with `image_type`
 * telling it which. There is no request body, which is why this reads unlike the
 * Platform API's POSTs.
 *
 * A model ID from `models.list` is `project/version`, so `modelId` is split on the
 * first slash to fill the two path segments; a model not tied to a version is
 * `workspace/model` and splits the same way.
 *
 * Inference is billed per image, so this is never replayed.
 */
export const infer: RoboflowEndpoints['infer'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'infer',
			input: Inputs.infer,
			output: Outputs.infer,
		},
		input,
		({ modelId, image, imageType, confidence, overlap, maxDetections }) => {
			const slash = modelId.indexOf('/');
			// A model ID without a slash cannot be addressed, and the schema has already
			// required a non-empty string; the error names what was sent.
			if (slash <= 0 || slash === modelId.length - 1) {
				throw new Error(
					`Roboflow modelId must look like project/version, received "${modelId}".`,
				);
			}
			const dataset = modelId.slice(0, slash);
			const version = modelId.slice(slash + 1);

			// A data URI already says what it is, so the type is only defaulted when the
			// caller gave neither.
			const resolvedType =
				imageType ?? (image.startsWith('data:') ? 'base64' : 'url');

			return {
				method: 'POST',
				path: `/${segment(dataset)}/${segment(version)}`,
				query: {
					image,
					image_type: resolvedType === 'base64' ? 'base64' : undefined,
					confidence,
					overlap,
					max_detections: maxDetections,
				},
				host: 'inference' as const,
				replayable: false,
			};
		},
		{
			log: (parsed, result) => ({
				modelId: parsed.modelId,
				predictions: result.predictions?.length ?? result.count ?? 0,
			}),
		},
	);
