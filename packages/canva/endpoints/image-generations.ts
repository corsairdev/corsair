import type { CanvaEndpoints } from '../index';
import { loggable } from './mappers';
import { callCanva, defined, seg } from './shared';
import type { CanvaEndpointOutputs } from './types';

export const create: CanvaEndpoints['imageGenerationsCreate'] = async (
	ctx,
	input,
) => {
	const { prompt, aspect_ratio, model, save_to_uploads, asset_name } = input;
	// Canva requires the key; a fresh one per call keeps retries of this call safe.
	const idempotency_key = input.idempotency_key ?? crypto.randomUUID();
	return callCanva<CanvaEndpointOutputs['imageGenerationsCreate']>(
		ctx,
		'imageGenerations.create',
		{ aspect_ratio, model, save_to_uploads, idempotency_key },
		'v1/image-generations',
		{
			method: 'POST',
			body: defined({
				prompt,
				aspect_ratio,
				model,
				idempotency_key,
				asset_upload:
					save_to_uploads === undefined
						? undefined
						: save_to_uploads
							? defined({ type: 'upload', asset_name })
							: { type: 'none' },
			}),
		},
	);
};

export const get: CanvaEndpoints['imageGenerationsGet'] = async (ctx, input) =>
	callCanva<CanvaEndpointOutputs['imageGenerationsGet']>(
		ctx,
		'imageGenerations.get',
		loggable(input),
		`v1/image-generations/${seg(input.jobId)}`,
	);
