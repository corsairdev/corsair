import { logEventFromContext } from 'corsair/core';
import type { OcrWebServiceEndpoints } from '..';
import { makeOcrWebServiceRequest } from '../client';
import type { OcrWebServiceEndpointOutputs } from './types';

export const get: OcrWebServiceEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeOcrWebServiceRequest<
		OcrWebServiceEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'ocrwebservice.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
