import { logEventFromContext } from 'corsair/core';
import type { ImgixEndpoints } from '..';
import { makeImgixRequest } from '../client';
import { ImgixEndpointInputSchemas, ImgixEndpointOutputSchemas } from './types';

export const create: ImgixEndpoints['purges.create'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['purges.create'].parse(input);

	// `unknown` because payload attributes vary across provider parameters
	const attributes: Record<string, unknown> = {
		url: parsedInput.url,
	};
	if (parsedInput.source_id !== undefined) {
		attributes.source_id = parsedInput.source_id;
	}
	if (parsedInput.sub_image !== undefined) {
		attributes.sub_image = parsedInput.sub_image;
	}

	const body = {
		data: {
			type: 'purges',
			attributes,
		},
	};

	const response = await makeImgixRequest(ctx.key, {
		method: 'POST',
		path: 'purge',
		body,
	});

	const parsed = ImgixEndpointOutputSchemas['purges.create'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.purges.create',
		{ sub_image: parsedInput.sub_image ?? false },
		'completed',
	);

	return parsed;
};
