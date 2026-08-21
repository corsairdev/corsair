import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { safeDbDelete, safeDbUpsert, toFormRecord } from '../utils';
import type { BasinEndpointOutputs } from './types';

export const create: BasinEndpoints['formsCreate'] = async (ctx, input) => {
	const result = await makeBasinRequest<BasinEndpointOutputs['formsCreate']>(
		'forms',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);

	if (result.id) {
		await safeDbUpsert(ctx.db.forms, result.id, toFormRecord(result), 'form');
	}

	await logEventFromContext(
		ctx,
		'basin.forms.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: BasinEndpoints['formsList'] = async (ctx, input = {}) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.query !== undefined) query.query = input.query;

	const result = await makeBasinRequest<BasinEndpointOutputs['formsList']>(
		'forms',
		ctx.key,
		{ method: 'GET', query },
	);

	const formsList = Array.isArray(result)
		? result
		: (result as { forms?: unknown[] }).forms;

	if (Array.isArray(formsList)) {
		for (const form of formsList) {
			if (form && typeof form === 'object' && 'id' in form) {
				await safeDbUpsert(
					ctx.db.forms,
					(form as { id: string | number }).id,
					toFormRecord(form as Parameters<typeof toFormRecord>[0]),
					'form',
				);
			}
		}
	}

	await logEventFromContext(ctx, 'basin.forms.list', { ...input }, 'completed');
	return result;
};

export const get: BasinEndpoints['formsGet'] = async (ctx, input) => {
	const result = await makeBasinRequest<BasinEndpointOutputs['formsGet']>(
		`forms/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id) {
		await safeDbUpsert(ctx.db.forms, result.id, toFormRecord(result), 'form');
	}

	await logEventFromContext(ctx, 'basin.forms.get', { ...input }, 'completed');
	return result;
};

export const update: BasinEndpoints['formsUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeBasinRequest<BasinEndpointOutputs['formsUpdate']>(
		`forms/${id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	if (result.id) {
		await safeDbUpsert(ctx.db.forms, result.id, toFormRecord(result), 'form');
	}

	await logEventFromContext(
		ctx,
		'basin.forms.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteForm: BasinEndpoints['formsDelete'] = async (ctx, input) => {
	const result = await makeBasinRequest<BasinEndpointOutputs['formsDelete']>(
		`forms/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await safeDbDelete(ctx.db.forms, input.id, 'form');

	await logEventFromContext(
		ctx,
		'basin.forms.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const Forms = {
	create,
	list,
	get,
	update,
	delete: deleteForm,
};
