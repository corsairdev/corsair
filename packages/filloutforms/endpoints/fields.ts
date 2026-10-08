import { logEventFromContext } from 'corsair/core';
import { makeFilloutRequest, ZITE_API_BASE } from '../client';
import type { FilloutFormsEndpoints } from '../index';
import type { FilloutFormsEndpointOutputs } from './types';

function fieldPath(databaseId: string, tableId: string, fieldId?: string) {
	const base = `bases/${encodeURIComponent(databaseId)}/tables/${encodeURIComponent(tableId)}/fields`;
	return fieldId ? `${base}/${encodeURIComponent(fieldId)}` : base;
}

export const createField: FilloutFormsEndpoints['createField'] = async (
	ctx,
	input,
) => {
	const { databaseId, tableId, name, type, template } = input;
	const body: Record<string, unknown> = { name, type };
	if (template !== undefined) body.template = template;
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['createField']
	>(fieldPath(databaseId, tableId), ctx.key, {
		method: 'POST',
		baseUrl: ZITE_API_BASE,
		body,
	});
	await logEventFromContext(
		ctx,
		'filloutforms.fields.create',
		{ databaseId, tableId, name, type },
		'completed',
	);
	return response;
};

export const updateField: FilloutFormsEndpoints['updateField'] = async (
	ctx,
	input,
) => {
	const { databaseId, tableId, fieldId, name, template } = input;
	const body: Record<string, unknown> = {};
	if (name !== undefined) body.name = name;
	if (template !== undefined) body.template = template;
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['updateField']
	>(fieldPath(databaseId, tableId, fieldId), ctx.key, {
		method: 'PATCH',
		baseUrl: ZITE_API_BASE,
		body,
	});
	await logEventFromContext(
		ctx,
		'filloutforms.fields.update',
		{ databaseId, tableId, fieldId },
		'completed',
	);
	return response;
};

export const deleteField: FilloutFormsEndpoints['deleteField'] = async (
	ctx,
	input,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['deleteField']
	>(fieldPath(input.databaseId, input.tableId, input.fieldId), ctx.key, {
		method: 'DELETE',
		baseUrl: ZITE_API_BASE,
	});
	await logEventFromContext(
		ctx,
		'filloutforms.fields.delete',
		{
			databaseId: input.databaseId,
			tableId: input.tableId,
			fieldId: input.fieldId,
		},
		'completed',
	);
	return response ?? {};
};
