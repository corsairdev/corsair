import { logEventFromContext } from 'corsair/core';
import { makeByteFormsRequest } from '../client';
import type { ByteFormsEndpoints } from '../index';
import type { ByteFormsEndpointOutputs } from './types';

export const create: ByteFormsEndpoints['formsCreate'] = async (ctx, input) => {
	const body = Object.fromEntries(
		Object.entries(input).filter(([, value]) => value !== undefined),
	);

	const response = await makeByteFormsRequest<
		ByteFormsEndpointOutputs['formsCreate']
	>('form', ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'byteforms.forms.create',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const deleteForm: ByteFormsEndpoints['formsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeByteFormsRequest<
		ByteFormsEndpointOutputs['formsDelete']
	>(`form/${encodeURIComponent(input.formId)}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'byteforms.forms.delete',
		{ formId: input.formId },
		'completed',
	);
	return response;
};

export const getById: ByteFormsEndpoints['formsGet'] = async (ctx, input) => {
	const response = await makeByteFormsRequest<
		ByteFormsEndpointOutputs['formsGet']
	>(`form/${encodeURIComponent(input.formId)}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'byteforms.forms.get',
		{ formId: input.formId },
		'completed',
	);
	return response;
};

export const getAll: ByteFormsEndpoints['formsList'] = async (ctx, input) => {
	const response = await makeByteFormsRequest<
		ByteFormsEndpointOutputs['formsList']
	>('form', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'byteforms.forms.list',
		{ count: response.data.length },
		'completed',
	);
	return response;
};

export const getResponses: ByteFormsEndpoints['formsResponses'] = async (
	ctx,
	input,
) => {
	const { formId, ...query } = input;

	const response = await makeByteFormsRequest<
		ByteFormsEndpointOutputs['formsResponses']
	>(`form/responses/${encodeURIComponent(formId)}`, ctx.key, {
		method: 'GET',
		query: query as Record<string, never>,
	});

	await logEventFromContext(
		ctx,
		'byteforms.forms.responses',
		{ formId, count: response.count },
		'completed',
	);
	return response;
};
