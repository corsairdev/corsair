import { logEventFromContext } from 'corsair/core';
import type { HtmlToImageEndpoints } from '..';
import type { HtmlToImageEndpointOutputs } from './types';

export const getImage: HtmlToImageEndpoints['getImage'] = async (
	ctx,
	input,
) => {
	await logEventFromContext(
		ctx,
		'htmltoimage.get_image',
		{ ...input },
		'completed',
	);

	return {
		url: input.url,
	} satisfies HtmlToImageEndpointOutputs['getImage'];
};
