import { logEventFromContext } from 'corsair/core';
import type { ClickupQueryValue } from '../client';
import {
	CLICKUP_API_V2_BASE,
	ClickupAPIError,
	makeClickupRequest,
} from '../client';
import type { ClickupRequestContext } from './context';
import type {
	TasksAttachmentsCreateInput,
	TasksAttachmentsCreateResponse,
	TasksBulkTimeInStatusInput,
	TasksBulkTimeInStatusResponse,
	TasksCreateFromTemplateInput,
	TasksCreateFromTemplateResponse,
	TasksCreateInput,
	TasksCreateResponse,
	TasksDeleteInput,
	TasksDeleteResponse,
	TasksFilteredTeamInput,
	TasksFilteredTeamResponse,
	TasksGetInput,
	TasksGetResponse,
	TasksListInput,
	TasksListResponse,
	TasksMembersInput,
	TasksMembersResponse,
	TasksMoveToHomeListInput,
	TasksMoveToHomeListResponse,
	TasksTagsAddInput,
	TasksTagsAddResponse,
	TasksTagsRemoveInput,
	TasksTagsRemoveResponse,
	TasksTemplatesInput,
	TasksTemplatesResponse,
	TasksTimeInStatusInput,
	TasksTimeInStatusResponse,
	TasksTrackedTimeCreateInput,
	TasksTrackedTimeCreateResponse,
	TasksTrackedTimeDeleteInput,
	TasksTrackedTimeDeleteResponse,
	TasksTrackedTimeGetInput,
	TasksTrackedTimeGetResponse,
	TasksTrackedTimeUpdateInput,
	TasksTrackedTimeUpdateResponse,
	TasksUpdateInput,
	TasksUpdateResponse,
} from './types';
import { TasksAttachmentsCreateResponseSchema } from './types';

export async function list(
	ctx: ClickupRequestContext,
	input: TasksListInput,
): Promise<TasksListResponse> {
	// Array filters use the documented bracketed query names (statuses[],
	// assignees[], tags[]); schema fields stay bracket-free for clean types.
	const {
		list_id,
		page,
		archived,
		subtasks,
		include_closed,
		statuses,
		assignees,
		tags,
		order_by,
	} = input;
	const query: Record<string, ClickupQueryValue | undefined> = {
		page,
		archived,
		subtasks,
		include_closed,
		order_by,
		'statuses[]': statuses,
		'assignees[]': assignees,
		'tags[]': tags,
	};
	const response = await makeClickupRequest<TasksListResponse>(
		`list/${list_id}/task`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.list',
		{ list_id },
		'completed',
	);
	return response;
}

export async function filteredTeam(
	ctx: ClickupRequestContext,
	input: TasksFilteredTeamInput,
): Promise<TasksFilteredTeamResponse> {
	const {
		team_id,
		page,
		space_ids,
		project_ids,
		list_ids,
		statuses,
		assignees,
		tags,
		parent,
		subtasks,
	} = input;
	const query: Record<string, ClickupQueryValue | undefined> = {
		page,
		parent,
		subtasks,
		'space_ids[]': space_ids,
		'project_ids[]': project_ids,
		'list_ids[]': list_ids,
		'statuses[]': statuses,
		'assignees[]': assignees,
		'tags[]': tags,
	};
	const response = await makeClickupRequest<TasksFilteredTeamResponse>(
		`team/${team_id}/task`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.filteredTeam',
		{ team_id },
		'completed',
	);
	return response;
}

export async function get(
	ctx: ClickupRequestContext,
	input: TasksGetInput,
): Promise<TasksGetResponse> {
	const { task_id, ...query } = input;
	const response = await makeClickupRequest<TasksGetResponse>(
		`task/${task_id}`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(ctx, 'clickup.tasks.get', { task_id }, 'completed');
	return response;
}

export async function create(
	ctx: ClickupRequestContext,
	input: TasksCreateInput,
): Promise<TasksCreateResponse> {
	const { list_id, ...body } = input;
	const response = await makeClickupRequest<TasksCreateResponse>(
		`list/${list_id}/task`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.create',
		{ list_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: TasksUpdateInput,
): Promise<TasksUpdateResponse> {
	const { task_id, ...body } = input;
	const response = await makeClickupRequest<TasksUpdateResponse>(
		`task/${task_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.update',
		{ task_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: TasksDeleteInput,
): Promise<TasksDeleteResponse> {
	const { task_id, ...query } = input;
	const response = await makeClickupRequest<TasksDeleteResponse>(
		`task/${task_id}`,
		ctx.key,
		{ method: 'DELETE', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.delete',
		{ task_id },
		'completed',
	);
	return response;
}

export async function createFromTemplate(
	ctx: ClickupRequestContext,
	input: TasksCreateFromTemplateInput,
): Promise<TasksCreateFromTemplateResponse> {
	const { list_id, template_id, ...body } = input;
	const response = await makeClickupRequest<TasksCreateFromTemplateResponse>(
		`list/${list_id}/taskTemplate/${template_id}`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.createFromTemplate',
		{ list_id },
		'completed',
	);
	return response;
}

export async function moveToHomeList(
	ctx: ClickupRequestContext,
	input: TasksMoveToHomeListInput,
): Promise<TasksMoveToHomeListResponse> {
	const { workspace_id, task_id, list_id, ...body } = input;
	const response = await makeClickupRequest<TasksMoveToHomeListResponse>(
		`workspaces/${workspace_id}/tasks/${task_id}/home_list/${list_id}`,
		ctx.key,
		{ method: 'PUT', version: 'v3', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.moveToHomeList',
		{ task_id, list_id },
		'completed',
	);
	return response;
}

export async function members(
	ctx: ClickupRequestContext,
	input: TasksMembersInput,
): Promise<TasksMembersResponse> {
	const response = await makeClickupRequest<TasksMembersResponse>(
		`task/${input.task_id}/member`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.members',
		{ task_id: input.task_id },
		'completed',
	);
	return response;
}

export async function timeInStatus(
	ctx: ClickupRequestContext,
	input: TasksTimeInStatusInput,
): Promise<TasksTimeInStatusResponse> {
	const response = await makeClickupRequest<TasksTimeInStatusResponse>(
		`task/${input.task_id}/time_in_status`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.timeInStatus',
		{ task_id: input.task_id },
		'completed',
	);
	return response;
}

export async function bulkTimeInStatus(
	ctx: ClickupRequestContext,
	input: TasksBulkTimeInStatusInput,
): Promise<TasksBulkTimeInStatusResponse> {
	const response = await makeClickupRequest<TasksBulkTimeInStatusResponse>(
		'task/bulk_time_in_status/task_ids',
		ctx.key,
		{ method: 'GET', query: { task_ids: input.task_ids } },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.bulkTimeInStatus',
		{},
		'completed',
	);
	return response;
}

export async function templates(
	ctx: ClickupRequestContext,
	input: TasksTemplatesInput,
): Promise<TasksTemplatesResponse> {
	const { team_id, ...query } = input;
	const response = await makeClickupRequest<TasksTemplatesResponse>(
		`team/${team_id}/taskTemplate`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.templates',
		{ team_id },
		'completed',
	);
	return response;
}

export async function trackedTimeGet(
	ctx: ClickupRequestContext,
	input: TasksTrackedTimeGetInput,
): Promise<TasksTrackedTimeGetResponse> {
	const response = await makeClickupRequest<TasksTrackedTimeGetResponse>(
		`task/${input.task_id}/time`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.trackedTimeGet',
		{ task_id: input.task_id },
		'completed',
	);
	return response;
}

export async function trackedTimeCreate(
	ctx: ClickupRequestContext,
	input: TasksTrackedTimeCreateInput,
): Promise<TasksTrackedTimeCreateResponse> {
	const { task_id, ...body } = input;
	const response = await makeClickupRequest<TasksTrackedTimeCreateResponse>(
		`task/${task_id}/time`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.trackedTimeCreate',
		{ task_id },
		'completed',
	);
	return response;
}

export async function trackedTimeUpdate(
	ctx: ClickupRequestContext,
	input: TasksTrackedTimeUpdateInput,
): Promise<TasksTrackedTimeUpdateResponse> {
	const { task_id, interval_id, ...body } = input;
	const response = await makeClickupRequest<TasksTrackedTimeUpdateResponse>(
		`task/${task_id}/time/${interval_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.trackedTimeUpdate',
		{ task_id },
		'completed',
	);
	return response;
}

export async function trackedTimeDelete(
	ctx: ClickupRequestContext,
	input: TasksTrackedTimeDeleteInput,
): Promise<TasksTrackedTimeDeleteResponse> {
	const response = await makeClickupRequest<TasksTrackedTimeDeleteResponse>(
		`task/${input.task_id}/time/${input.interval_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.trackedTimeDelete',
		{ task_id: input.task_id },
		'completed',
	);
	return response;
}

export async function tagsAdd(
	ctx: ClickupRequestContext,
	input: TasksTagsAddInput,
): Promise<TasksTagsAddResponse> {
	const { task_id, tag_name, ...query } = input;
	const response = await makeClickupRequest<TasksTagsAddResponse>(
		`task/${task_id}/tag/${tag_name}`,
		ctx.key,
		{ method: 'POST', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.tagsAdd',
		{ task_id, tag_name },
		'completed',
	);
	return response;
}

export async function tagsRemove(
	ctx: ClickupRequestContext,
	input: TasksTagsRemoveInput,
): Promise<TasksTagsRemoveResponse> {
	const { task_id, tag_name, ...query } = input;
	const response = await makeClickupRequest<TasksTagsRemoveResponse>(
		`task/${task_id}/tag/${tag_name}`,
		ctx.key,
		{ method: 'DELETE', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.tagsRemove',
		{ task_id, tag_name },
		'completed',
	);
	return response;
}

export async function attachmentsCreate(
	ctx: ClickupRequestContext,
	input: TasksAttachmentsCreateInput,
): Promise<TasksAttachmentsCreateResponse> {
	const form = new FormData();
	const bytes = Buffer.from(input.file_base64, 'base64');
	const type = input.content_type ?? 'application/octet-stream';
	form.append('attachment', new Blob([bytes], { type }), input.filename);

	const res: Response = await fetch(
		`${CLICKUP_API_V2_BASE}/task/${input.task_id}/attachment`,
		{
			method: 'POST',
			headers: { Authorization: ctx.key },
			body: form,
		},
	);
	if (!res.ok) {
		throw new ClickupAPIError(`Attachment upload failed: ${res.status}`);
	}
	// unknown: ClickUp attachment payloads vary by file kind; Zod validates below.
	const data: unknown = await res.json();
	const parsed: TasksAttachmentsCreateResponse =
		TasksAttachmentsCreateResponseSchema.parse(data);

	await logEventFromContext(
		ctx,
		'clickup.tasks.attachmentsCreate',
		{ task_id: input.task_id },
		'completed',
	);
	return parsed;
}
