import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	ChecklistItemsCreateInput,
	ChecklistItemsCreateResponse,
	ChecklistItemsDeleteInput,
	ChecklistItemsDeleteResponse,
	ChecklistItemsUpdateInput,
	ChecklistItemsUpdateResponse,
	ChecklistsCreateInput,
	ChecklistsCreateResponse,
	ChecklistsDeleteInput,
	ChecklistsDeleteResponse,
	ChecklistsUpdateInput,
	ChecklistsUpdateResponse,
} from './types';

export async function create(
	ctx: ClickupRequestContext,
	input: ChecklistsCreateInput,
): Promise<ChecklistsCreateResponse> {
	const { task_id, ...rest } = input;
	const { custom_task_ids, team_id, ...body } = rest;
	const response = await makeClickupRequest<ChecklistsCreateResponse>(
		`task/${task_id}/checklist`,
		ctx.key,
		{ method: 'POST', body, query: { custom_task_ids, team_id } },
	);

	await logEventFromContext(
		ctx,
		'clickup.checklists.create',
		{ task_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: ChecklistsUpdateInput,
): Promise<ChecklistsUpdateResponse> {
	const { checklist_id, ...body } = input;
	const response = await makeClickupRequest<ChecklistsUpdateResponse>(
		`checklist/${checklist_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.checklists.update',
		{ checklist_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: ChecklistsDeleteInput,
): Promise<ChecklistsDeleteResponse> {
	const response = await makeClickupRequest<ChecklistsDeleteResponse>(
		`checklist/${input.checklist_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.checklists.delete',
		{ checklist_id: input.checklist_id },
		'completed',
	);
	return response;
}

export async function itemsCreate(
	ctx: ClickupRequestContext,
	input: ChecklistItemsCreateInput,
): Promise<ChecklistItemsCreateResponse> {
	const { checklist_id, ...body } = input;
	const response = await makeClickupRequest<ChecklistItemsCreateResponse>(
		`checklist/${checklist_id}/checklist_item`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.checklists.itemsCreate',
		{ checklist_id },
		'completed',
	);
	return response;
}

export async function itemsUpdate(
	ctx: ClickupRequestContext,
	input: ChecklistItemsUpdateInput,
): Promise<ChecklistItemsUpdateResponse> {
	const { checklist_id, checklist_item_id, ...body } = input;
	const response = await makeClickupRequest<ChecklistItemsUpdateResponse>(
		`checklist/${checklist_id}/checklist_item/${checklist_item_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.checklists.itemsUpdate',
		{ checklist_id },
		'completed',
	);
	return response;
}

export async function itemsDelete(
	ctx: ClickupRequestContext,
	input: ChecklistItemsDeleteInput,
): Promise<ChecklistItemsDeleteResponse> {
	const response = await makeClickupRequest<ChecklistItemsDeleteResponse>(
		`checklist/${input.checklist_id}/checklist_item/${input.checklist_item_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.checklists.itemsDelete',
		{ checklist_id: input.checklist_id },
		'completed',
	);
	return response;
}
