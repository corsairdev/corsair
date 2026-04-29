import { logEventFromContext } from 'corsair/core';
import { makeVapiRequest } from '../client';
import type { VapiEndpoints } from '../index';
import type { VapiEndpointOutputs } from './types';

export const list: VapiEndpoints['phoneNumbersList'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['phoneNumbersList']>(
		'phone-number',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.phone-numbers.list', { ...input }, 'completed');
	return result;
};

export const create: VapiEndpoints['phoneNumbersCreate'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['phoneNumbersCreate']>(
		'phone-number',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.phone-numbers.create', { ...input }, 'completed');
	return result;
};

export const get: VapiEndpoints['phoneNumbersGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['phoneNumbersGet']>(
		`phone-number/${id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'vapi.phone-numbers.get', { id }, 'completed');
	return result;
};

export const update: VapiEndpoints['phoneNumbersUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['phoneNumbersUpdate']>(
		`phone-number/${id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(ctx, 'vapi.phone-numbers.update', { id }, 'completed');
	return result;
};

export const deletePhoneNumber: VapiEndpoints['phoneNumbersDelete'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['phoneNumbersDelete']>(
		`phone-number/${id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'vapi.phone-numbers.delete', { id }, 'completed');
	return result;
};
