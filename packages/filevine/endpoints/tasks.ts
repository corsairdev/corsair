import { logEventFromContext } from 'corsair/core';
import { makeFilevineRequest, resolveFilevineOrgContext } from '../client';
import type { FilevineEndpoints } from '../index';
import type { FilevineEndpointOutputs } from './types';
import {
	CreateTaskResponseSchema,
	ListProjectTasksResponseSchema,
	UpdateTaskResponseSchema,
} from './types';

export const list: FilevineEndpoints['listProjectTasks'] = async (
	ctx,
	input,
) => {
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(ctx.key, input.orgId, input.userId);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['listProjectTasks']
	>(`/fv-app/v2/projects/${input.projectId}/tasks`, ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'GET',
		query: {
			assigneeId: input.assigneeId,
			status: input.status,
			offset: input.offset,
			limit: input.limit,
		},
	});
	const parsed = ListProjectTasksResponseSchema.parse(result);
	if (parsed.items && ctx.db.tasks) {
		for (const item of parsed.items) {
			try {
				await ctx.db.tasks.upsertByEntityId(String(item.taskId), {
					id: item.taskId,
					taskId: item.taskId,
					projectId: item.projectId,
					title: item.title,
					body: item.body,
					status: item.status,
					priority: item.priority,
					dueDate: item.dueDate,
					assigneeId: item.assigneeId,
					completedDate: item.completedDate,
				});
			} catch {}
		}
	}
	await logEventFromContext(
		ctx,
		'filevine.tasks.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const create: FilevineEndpoints['createTask'] = async (ctx, input) => {
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(ctx.key, input.orgId, input.userId);
	const { projectId, orgId: _orgT, userId: _userT, ...body } = input;
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['createTask']
	>(`/fv-app/v2/projects/${projectId}/tasks`, ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'POST',
		body: body as Record<string, unknown>,
	});
	const parsed = CreateTaskResponseSchema.parse(result);
	if (ctx.db.tasks) {
		try {
			await ctx.db.tasks.upsertByEntityId(String(parsed.taskId), {
				id: parsed.taskId,
				taskId: parsed.taskId,
				projectId: parsed.projectId,
				title: parsed.title,
				body: parsed.body,
				status: parsed.status,
				priority: parsed.priority,
				dueDate: parsed.dueDate,
				assigneeId: parsed.assigneeId,
				completedDate: parsed.completedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.tasks.create',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const update: FilevineEndpoints['updateTask'] = async (ctx, input) => {
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(ctx.key, input.orgId, input.userId);
	const { taskId, orgId: _orgTU, userId: _userTU, ...patch } = input;
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['updateTask']
	>(`/fv-app/v2/tasks/${taskId}`, ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'PATCH',
		body: patch as Record<string, unknown>,
	});
	const parsed = UpdateTaskResponseSchema.parse(result);
	if (ctx.db.tasks) {
		try {
			await ctx.db.tasks.upsertByEntityId(String(parsed.taskId), {
				id: parsed.taskId,
				taskId: parsed.taskId,
				projectId: parsed.projectId,
				title: parsed.title,
				body: parsed.body,
				status: parsed.status,
				priority: parsed.priority,
				dueDate: parsed.dueDate,
				assigneeId: parsed.assigneeId,
				completedDate: parsed.completedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.tasks.update',
		{ ...input },
		'completed',
	);
	return parsed;
};
