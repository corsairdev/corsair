import { logEventFromContext } from 'corsair/core';
import type { HtmlToImageEndpoints } from '..';
import { makeHtmlToImageRequest } from '../client';
import {
	HtmlToImageEndpointInputSchemas,
	HtmlToImageEndpointOutputSchemas,
} from './types';

export const convertToImage: HtmlToImageEndpoints['convertToImage'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HtmlToImageEndpointInputSchemas.convertToImage.parse(input);
	const raw = await makeHtmlToImageRequest('api/html', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const response = HtmlToImageEndpointOutputSchemas.convertToImage.parse(raw);

	await logEventFromContext(
		ctx,
		'htmltoimage.convert_to_image',
		{
			id: response.id,
			...(parsedInput.format !== undefined
				? { format: parsedInput.format }
				: {}),
			...(parsedInput.width !== undefined ? { width: parsedInput.width } : {}),
			...(parsedInput.height !== undefined
				? { height: parsedInput.height }
				: {}),
		},
		response.status === 'processing' ? 'processing' : 'completed',
	);

	return response;
};
