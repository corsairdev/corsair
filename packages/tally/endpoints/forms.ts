import { logEventFromContext } from 'corsair/core';
import type { TallyEndpoints } from '..';
import { makeTallyRequest } from '../client';
import { safeDbDelete, safeDbUpsert, toFormRecord } from '../utils';
import type { TallyEndpointOutputs } from './types';

export const list: TallyEndpoints['formsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.limit !== undefined) query.limit = input.limit;

	let endpoint = 'forms';
	if (input.workspaceIds?.length) {
		const params = input.workspaceIds
			.map((id) => `workspaceIds[]=${encodeURIComponent(id)}`)
			.join('&');
		endpoint = `forms?${params}`;
	}

	const result = await makeTallyRequest<TallyEndpointOutputs['formsList']>(
		endpoint,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.items) {
		for (const form of result.items) {
			await safeDbUpsert(ctx.db.forms, form.id, toFormRecord(form), 'form');
		}
	}

	await logEventFromContext(ctx, 'tally.forms.list', { ...input }, 'completed');
	return result;
};

export const create: TallyEndpoints['formsCreate'] = async (ctx, input) => {
	const result = await makeTallyRequest<TallyEndpointOutputs['formsCreate']>(
		'forms',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);

	if (result.id) {
		await safeDbUpsert(ctx.db.forms, result.id, toFormRecord(result), 'form');
	}

	await logEventFromContext(
		ctx,
		'tally.forms.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: TallyEndpoints['formsGet'] = async (ctx, input) => {
	const result = await makeTallyRequest<TallyEndpointOutputs['formsGet']>(
		`forms/${input.formId}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id) {
		await safeDbUpsert(ctx.db.forms, result.id, toFormRecord(result), 'form');
	}

	await logEventFromContext(ctx, 'tally.forms.get', { ...input }, 'completed');
	return result;
};

export const update: TallyEndpoints['formsUpdate'] = async (ctx, input) => {
	const { formId, ...body } = input;
	const result = await makeTallyRequest<TallyEndpointOutputs['formsUpdate']>(
		`forms/${formId}`,
		ctx.key,
		{ method: 'PATCH', body: { ...body } },
	);

	if (result.id) {
		await safeDbUpsert(ctx.db.forms, result.id, toFormRecord(result), 'form');
	}

	await logEventFromContext(
		ctx,
		'tally.forms.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteForm: TallyEndpoints['formsDelete'] = async (ctx, input) => {
	const result = await makeTallyRequest<TallyEndpointOutputs['formsDelete']>(
		`forms/${input.formId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await safeDbDelete(ctx.db.forms, input.formId, 'form');

	await logEventFromContext(
		ctx,
		'tally.forms.delete',
		{ ...input },
		'completed',
	);
	return result;
};
