import { logEventFromContext } from 'corsair/core';
import type { HtmlToImageEndpoints } from '..';
import { makeHtmlToImageRequest } from '../client';
import {
	HtmlToImageEndpointInputSchemas,
	HtmlToImageEndpointOutputSchemas,
} from './types';

export const checkUsage: HtmlToImageEndpoints['checkUsage'] = async (
	ctx,
	input,
) => {
	const parsedInput = HtmlToImageEndpointInputSchemas.checkUsage.parse(input);
	const raw = await makeHtmlToImageRequest('api/me', ctx.key, {
		method: 'GET',
	});
	const response = HtmlToImageEndpointOutputSchemas.checkUsage.parse(raw);

	await logEventFromContext(
		ctx,
		'htmltoimage.check_usage',
		{ ...parsedInput },
		'completed',
	);

	return response;
};
