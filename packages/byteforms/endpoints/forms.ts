import { logEventFromContext } from 'corsair/core';
import { makeByteFormsRequest } from '../client';
import type { ByteFormsEndpoints } from '../index';
import type { ByteFormsEndpointOutputs } from './types';
import {
	ByteFormsEndpointInputSchemas,
	ByteFormsEndpointOutputSchemas,
} from './types';

export const create: ByteFormsEndpoints['formsCreate'] = async (ctx, input) => {
	const parsed = ByteFormsEndpointInputSchemas.formsCreate.parse(input);
	const body = Object.fromEntries(
		Object.entries(parsed).filter(([, value]) => value !== undefined),
	);

	const raw = await makeByteFormsRequest<
		ByteFormsEndpointOutputs['formsCreate']
	>('form', ctx.key, { method: 'POST', body });
	const response = ByteFormsEndpointOutputSchemas.formsCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'byteforms.forms.create',
		{ name: parsed.name },
		'completed',
	);
	return response;
};

export const deleteForm: ByteFormsEndpoints['formsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = ByteFormsEndpointInputSchemas.formsDelete.parse(input);
	const raw = await makeByteFormsRequest<
		ByteFormsEndpointOutputs['formsDelete']
	>(`form/${encodeURIComponent(parsed.formId)}`, ctx.key, { method: 'DELETE' });
	const response = ByteFormsEndpointOutputSchemas.formsDelete.parse(raw);

	await logEventFromContext(
		ctx,
		'byteforms.forms.delete',
		{ formId: parsed.formId },
		'completed',
	);
	return response;
};

export const getById: ByteFormsEndpoints['formsGet'] = async (ctx, input) => {
	const parsed = ByteFormsEndpointInputSchemas.formsGet.parse(input);
	const raw = await makeByteFormsRequest<ByteFormsEndpointOutputs['formsGet']>(
		`form/${encodeURIComponent(parsed.formId)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const response = ByteFormsEndpointOutputSchemas.formsGet.parse(raw);

	await logEventFromContext(
		ctx,
		'byteforms.forms.get',
		{ formId: parsed.formId },
		'completed',
	);
	return response;
};

export const getAll: ByteFormsEndpoints['formsList'] = async (ctx, input) => {
	ByteFormsEndpointInputSchemas.formsList.parse(input);
	const raw = await makeByteFormsRequest<ByteFormsEndpointOutputs['formsList']>(
		'form',
		ctx.key,
		{ method: 'GET' },
	);
	const response = ByteFormsEndpointOutputSchemas.formsList.parse(raw);

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
	const parsed = ByteFormsEndpointInputSchemas.formsResponses.parse(input);
	const { formId, ...query } = parsed;

	const raw = await makeByteFormsRequest<
		ByteFormsEndpointOutputs['formsResponses']
	>(`form/responses/${encodeURIComponent(formId)}`, ctx.key, {
		method: 'GET',
		query,
	});
	const response = ByteFormsEndpointOutputSchemas.formsResponses.parse(raw);

	await logEventFromContext(
		ctx,
		'byteforms.forms.responses',
		{ formId, count: response.count },
		'completed',
	);
	return response;
};
