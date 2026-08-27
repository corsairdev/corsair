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
	>('/api/html', ctx.key, {
		method: 'POST',
		body: {
			html: input.html,
			...(input.css !== undefined && { css: input.css }),
			...(input.width !== undefined && { width: input.width }),
			...(input.height !== undefined && { height: input.height }),
			...(input.fullpage !== undefined && {
				fullpage: input.fullpage,
			}),
			...(input.dpi !== undefined && { dpi: input.dpi }),
		},
	});

	await logEventFromContext(
		ctx,
		'htmltoimage.convert_to_image',
		{ ...input },
		'completed',
	);

	return response;
};
