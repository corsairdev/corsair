import { logEventFromContext } from 'corsair/core';
import type { HtmlToImageEndpoints } from '..';
import { makeHtmlToImageRequest } from '../client';
import type { HtmlToImageEndpointOutputs } from './types';

export const checkUsage: HtmlToImageEndpoints['checkUsage'] = async (
	ctx,
	input,
) => {
	const response = await makeHtmlToImageRequest<
		HtmlToImageEndpointOutputs['checkUsage']
	>('api/me', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'htmltoimage.check_usage',
		{ ...input },
		'completed',
	);

	return response;
};
