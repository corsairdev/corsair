import { logEventFromContext } from 'corsair/core';
import type { ImgBBEndpoints } from '..';
import { uploadImageToImgBB } from '../client';
import { ImgBBUploadEnvelopeSchema } from './types';

/**
 * Uploads an image to ImgBB and returns the hosted image URLs and metadata.
 *
 * Accepts base64-encoded image data or an image URL (ImgBB also accepts raw
 * binary, but a Corsair endpoint call is JSON-in/JSON-out, so binary bytes
 * aren't a practical input shape here — callers should base64-encode first).
 */
export const upload: ImgBBEndpoints['upload'] = async (ctx, input) => {
	const raw = await uploadImageToImgBB<unknown>({
		apiKey: ctx.key,
		image: input.image,
		name: input.name,
		expiration: input.expiration,
	});

	// ImgBB always wraps successful uploads in a { data, success, status }
	// envelope; parsing here validates the response shape instead of trusting
	// `unknown` as-is, and unwraps it to just the useful `data` object.
	const envelope = ImgBBUploadEnvelopeSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'imgbb.images.upload',
		{ name: input.name },
		'completed',
	);

	return envelope.data;
};
