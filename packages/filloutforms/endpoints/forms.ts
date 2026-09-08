import { logEventFromContext } from 'corsair/core';
import { makeFilloutRequest } from '../client';
import type { FilloutFormsEndpoints } from '../index';
import type { FilloutFormsEndpointOutputs } from './types';

export const getForms: FilloutFormsEndpoints['getForms'] = async (ctx) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['getForms']
	>('forms', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'filloutforms.forms.getForms',
		{},
		'completed',
	);
	return response;
};

export const getFormMetadata: FilloutFormsEndpoints['getFormMetadata'] = async (
	ctx,
	input,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['getFormMetadata']
	>(`forms/${encodeURIComponent(input.formId)}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'filloutforms.forms.getFormMetadata',
		{ ...input },
		'completed',
	);
	return response;
};
