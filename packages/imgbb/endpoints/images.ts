import { logEventFromContext } from 'corsair/core';
import type { ImgBBEndpoints } from '..';
import type { ImgBBUploadParams } from '../client';
import { uploadImageToImgBB } from '../client';
import type { BinaryImageInput } from './types';
import { ImgBBUploadEnvelopeSchema } from './types';

/**
 * What goes in the `image` field, and the name to send with it. ImgBB takes a
 * URL or a base64 string and fetches a link itself, so core's {url} and
 * {base64} forms are sent as those strings, with no download here; their
 * filename is the display name when none was given. Strings and binary data
 * are sent as they were given.
 */
export function toImgBBImage(
	image: BinaryImageInput,
	name: string | undefined,
): Pick<ImgBBUploadParams, 'image' | 'name'> {
	if (typeof image === 'object' && 'url' in image) {
		return { image: image.url, name: name ?? image.filename };
	}
	if (typeof image === 'object' && 'base64' in image) {
		return { image: image.base64, name: name ?? image.filename };
	}
	return { image, name };
}

/**
 * Uploads an image to ImgBB and returns the hosted image URLs and metadata.
 *
 * Accepts an image URL or base64-encoded image data, as a string or as core's
 * {url} or {base64} file object, and binary data (Blob, File, Buffer,
 * Uint8Array) from TypeScript.
 */
export const upload: ImgBBEndpoints['upload'] = async (ctx, input) => {
	const { image, name } = toImgBBImage(input.image, input.name);
	const raw = await uploadImageToImgBB<unknown>({
		apiKey: ctx.key,
		image,
		name,
		expiration: input.expiration,
	});

	// ImgBB always wraps successful uploads in a { data, success, status }
	// envelope; parsing here validates the response shape instead of trusting
	// `unknown` as-is, and unwraps it to just the useful `data` object.
	const envelope = ImgBBUploadEnvelopeSchema.parse(raw);

	// Only the name the caller gave: one taken from the file could carry personal data.
	await logEventFromContext(
		ctx,
		'imgbb.images.upload',
		{ name: input.name },
		'completed',
	);

	return envelope.data;
};
