import { logEventFromContext } from 'corsair/core';
import { makeRemovebgRequest } from '../client';
import type { RemovebgEndpoints } from '../index';
import type { RemoveBackgroundInput } from './types';
import {
	RemoveBackgroundInputSchema,
	RemoveBackgroundOutputSchema,
} from './types';

function buildRequestBody(
	input: RemoveBackgroundInput,
): Record<string, unknown> {
	return {
		image_url: input.imageUrl,
		image_file_b64: input.imageFileB64,
		size: input.size,
		type: input.type,
		type_level: input.typeLevel,
		format: input.format,
		roi: input.roi,
		crop: input.crop,
		crop_margin: input.cropMargin,
		scale: input.scale,
		position: input.position,
		channels: input.channels,
		shadow_type: input.shadowType,
		shadow_opacity: input.shadowOpacity,
		semitransparency: input.semitransparency,
		bg_color: input.bgColor,
		bg_image_url: input.bgImageUrl,
	};
}

export const remove: RemovebgEndpoints['removeBackground'] = async (
	ctx,
	rawInput,
) => {
	const input = RemoveBackgroundInputSchema.parse(rawInput);

	const response = RemoveBackgroundOutputSchema.parse(
		await makeRemovebgRequest('/removebg', ctx.key, {
			method: 'POST',
			body: buildRequestBody(input),
		}),
	);

	await logEventFromContext(
		ctx,
		'removebg.remove_background.remove',
		{
			source: input.imageUrl ? 'url' : 'file',
			size: input.size,
			type: input.type,
		},
		'completed',
	);

	return response;
};
