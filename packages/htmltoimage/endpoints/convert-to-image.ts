import { logEventFromContext } from 'corsair/core';
import type { HtmlToImageEndpoints } from '..';
import { makeHtmlToImageRequest } from '../client';
import type { HtmlToImageEndpointOutputs } from './types';

export const convertToImage: HtmlToImageEndpoints['convertToImage'] = async (
	ctx,
	input,
) => {
	const response = await makeHtmlToImageRequest<
		HtmlToImageEndpointOutputs['convertToImage']
	>('api/html', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'htmltoimage.convert_to_image',
		{ ...input },
		'completed',
	);

	return response;
};
