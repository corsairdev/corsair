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
	const { html, url, selector, ...options } = parsedInput;
	const raw = url
		? await makeHtmlToImageRequest('api/screenshot', ctx.key, {
				method: 'POST',
				body: {
					url,
					...options,
					...(selector !== undefined ? { selector } : {}),
				},
			})
		: await makeHtmlToImageRequest('api/html', ctx.key, {
				method: 'POST',
				body: { html, ...options },
			});
	const response = HtmlToImageEndpointOutputSchemas.convertToImage.parse(raw);

	await logEventFromContext(
		ctx,
		'htmltoimage.convert_to_image',
		{
			id: response.id,
			...(url !== undefined ? { url } : {}),
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
