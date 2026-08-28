import { logEventFromContext } from 'corsair/core';
import type { HtmlToImageEndpoints } from '..';
import { makeHtmlToImageRequest } from '../client';
import type { HtmlToImageEndpointOutputs } from './types';

export const get: HtmlToImageEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeHtmlToImageRequest<
		HtmlToImageEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'htmltoimage.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
