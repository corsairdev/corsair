import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointInputSchemas, BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['formsList'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.formsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (validated.page !== undefined) query.page = validated.page;
	if (validated.query !== undefined) query.query = validated.query;

	const res = await makeBasinRequest<unknown>('forms', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.formsList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.forms.list',
		{ ...validated },
		'completed',
	);
	return response;
};

export const get: BasinEndpoints['formsGet'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.formsGet.parse(input);
	const res = await makeBasinRequest<unknown>(
		`forms/${validated.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = BasinEndpointOutputSchemas.formsGet.parse(res);
	await logEventFromContext(
		ctx,
		'basin.forms.get',
		{ ...validated },
		'completed',
	);
	return response;
};

export const create: BasinEndpoints['formsCreate'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.formsCreate.parse(input);
	const { form, ...rest } = validated;
	const body = form ? { form } : { form: rest };

	const res = await makeBasinRequest<unknown>('forms', ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.formsCreate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.forms.create',
		{ ...validated },
		'completed',
	);
	return response;
};

export const update: BasinEndpoints['formsUpdate'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.formsUpdate.parse(input);
	const { id, form, ...rest } = validated;
	const body = form ? { form } : { form: rest };

	const res = await makeBasinRequest<unknown>(`forms/${id}`, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.formsUpdate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.forms.update',
		{ ...validated },
		'completed',
	);
	return response;
};

export const deleteForm: BasinEndpoints['formsDelete'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.formsDelete.parse(input);
	const res = await makeBasinRequest<unknown>(
		`forms/${validated.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = BasinEndpointOutputSchemas.formsDelete.parse(res);
	await logEventFromContext(
		ctx,
		'basin.forms.delete',
		{ ...validated },
		'completed',
	);
	return response;
};
