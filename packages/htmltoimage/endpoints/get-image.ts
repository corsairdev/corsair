import { logEventFromContext } from 'corsair/core';
import type { HtmlToImageEndpoints } from '..';
import {
	HtmlToImageEndpointInputSchemas,
	HtmlToImageEndpointOutputSchemas,
} from './types';

export const getImage: HtmlToImageEndpoints['getImage'] = async (
	ctx,
	input,
) => {
	const parsedInput = HtmlToImageEndpointInputSchemas.getImage.parse(input);
	const response = HtmlToImageEndpointOutputSchemas.getImage.parse({
		url: parsedInput.url,
	});

	await logEventFromContext(
		ctx,
		'htmltoimage.get_image',
		{ host: new URL(response.url).hostname },
		'completed',
	);

	return response;
};
