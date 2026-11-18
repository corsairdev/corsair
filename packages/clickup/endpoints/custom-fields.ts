import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	CustomFieldsAccessibleInput,
	CustomFieldsAccessibleResponse,
	CustomFieldsFolderFieldsInput,
	CustomFieldsFolderFieldsResponse,
	CustomFieldsRemoveValueInput,
	CustomFieldsRemoveValueResponse,
	CustomFieldsSetValueInput,
	CustomFieldsSetValueResponse,
} from './types';

export async function accessible(
	ctx: ClickupRequestContext,
	input: CustomFieldsAccessibleInput,
): Promise<CustomFieldsAccessibleResponse> {
	const response = await makeClickupRequest<CustomFieldsAccessibleResponse>(
		`list/${input.list_id}/field`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.customFields.accessible',
		{ list_id: input.list_id },
		'completed',
	);
	return response;
}

export async function folderFields(
	ctx: ClickupRequestContext,
	input: CustomFieldsFolderFieldsInput,
): Promise<CustomFieldsFolderFieldsResponse> {
	const response = await makeClickupRequest<CustomFieldsFolderFieldsResponse>(
		`folder/${input.folder_id}/field`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.customFields.folderFields',
		{ folder_id: input.folder_id },
		'completed',
	);
	return response;
}

export async function setValue(
	ctx: ClickupRequestContext,
	input: CustomFieldsSetValueInput,
): Promise<CustomFieldsSetValueResponse> {
	const { task_id, field_id, custom_task_ids, team_id, ...body } = input;
	const response = await makeClickupRequest<CustomFieldsSetValueResponse>(
		`task/${task_id}/field/${field_id}`,
		ctx.key,
		{ method: 'POST', body, query: { custom_task_ids, team_id } },
	);

	await logEventFromContext(
		ctx,
		'clickup.customFields.setValue',
		{ task_id, field_id },
		'completed',
	);
	return response;
}

export async function removeValue(
	ctx: ClickupRequestContext,
	input: CustomFieldsRemoveValueInput,
): Promise<CustomFieldsRemoveValueResponse> {
	const { task_id, field_id, ...query } = input;
	const response = await makeClickupRequest<CustomFieldsRemoveValueResponse>(
		`task/${task_id}/field/${field_id}`,
		ctx.key,
		{ method: 'DELETE', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.customFields.removeValue',
		{ task_id, field_id },
		'completed',
	);
	return response;
}
