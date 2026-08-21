import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['formsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.query !== undefined) query.query = input.query;

	const res = await makeBasinRequest<unknown>('forms', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.formsList.parse(res);
	await logEventFromContext(ctx, 'basin.forms.list', { ...input }, 'completed');
	return response;
};

export const get: BasinEndpoints['formsGet'] = async (ctx, input) => {
	const res = await makeBasinRequest<unknown>(`forms/${input.id}`, ctx.key, {
		method: 'GET',
	});
	const response = BasinEndpointOutputSchemas.formsGet.parse(res);
	await logEventFromContext(ctx, 'basin.forms.get', { ...input }, 'completed');
	return response;
};

export const create: BasinEndpoints['formsCreate'] = async (ctx, input) => {
	const { form, ...rest } = input;
	const body = form ? { form } : { form: rest };

	const res = await makeBasinRequest<unknown>('forms', ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.formsCreate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.forms.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: BasinEndpoints['formsUpdate'] = async (ctx, input) => {
	const { id, form, ...rest } = input;
	const body = form ? { form } : { form: rest };

	const res = await makeBasinRequest<unknown>(`forms/${id}`, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.formsUpdate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.forms.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteForm: BasinEndpoints['formsDelete'] = async (ctx, input) => {
	const res = await makeBasinRequest<unknown>(`forms/${input.id}`, ctx.key, {
		method: 'DELETE',
	});
	const response = BasinEndpointOutputSchemas.formsDelete.parse(res);
	await logEventFromContext(
		ctx,
		'basin.forms.delete',
		{ ...input },
		'completed',
	);
	return response;
};
