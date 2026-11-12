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
 * Image URLs go in the `image` query parameter. Base64 and data URIs go in
 * the raw form body with `image_type=base64`. Other options stay in the query.
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

			// HTTP URLs select URL transport; data URIs and raw base64 use the body.
			const resolvedType =
				imageType ?? (/^https?:\/\//i.test(image) ? 'url' : 'base64');

			return {
				method: 'POST',
				path: `/${segment(dataset)}/${segment(version)}`,
				query: {
					image: resolvedType === 'url' ? image : undefined,
					image_type: resolvedType === 'base64' ? 'base64' : undefined,
					confidence,
					overlap,
					max_detections: maxDetections,
				},
				body: resolvedType === 'base64' ? image : undefined,
				mediaType: 'application/x-www-form-urlencoded',
				host: 'inference' as const,
				replayable: false,
			};
		},
		{
			log: (parsed, result) => ({
				modelId: parsed.modelId,
				predictions:
					result.count ??
					result.predicted_classes?.length ??
					(Array.isArray(result.predictions) ? result.predictions.length : 0),
			}),
		},
	);
