import { logEventFromContext } from 'corsair/core';
import { makeFilevineRequest } from '../client';
import type { FilevineEndpoints } from '../index';
import type { FilevineEndpointOutputs } from './types';
import {
	CreateDeadlineResponseSchema,
	ListProjectDeadlinesResponseSchema,
} from './types';

export const list: FilevineEndpoints['listProjectDeadlines'] = async (
	ctx,
	input,
) => {
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['listProjectDeadlines']
	>(`/fv-app/v2/projects/${input.projectId}/deadlines`, ctx.key, {
		method: 'GET',
		query: {
			status: input.status,
			from: input.from,
			to: input.to,
			offset: input.offset,
			limit: input.limit,
		},
	});
	const parsed = ListProjectDeadlinesResponseSchema.parse(result);
	if (parsed.items && ctx.db.deadlines) {
		for (const item of parsed.items) {
			try {
				await ctx.db.deadlines.upsertByEntityId(String(item.deadlineId), {
					id: item.deadlineId,
					deadlineId: item.deadlineId,
					projectId: item.projectId,
					name: item.name,
					dueDate: item.dueDate,
					status: item.status,
					assigneeId: item.assigneeId,
					reminders: item.reminders,
				});
			} catch {}
		}
	}
	await logEventFromContext(
		ctx,
		'filevine.deadlines.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const create: FilevineEndpoints['createDeadline'] = async (
	ctx,
	input,
) => {
	const { projectId, ...body } = input;
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['createDeadline']
	>(`/fv-app/v2/projects/${projectId}/deadlines`, ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});
	const parsed = CreateDeadlineResponseSchema.parse(result);
	if (ctx.db.deadlines) {
		try {
			await ctx.db.deadlines.upsertByEntityId(String(parsed.deadlineId), {
				id: parsed.deadlineId,
				deadlineId: parsed.deadlineId,
				projectId: parsed.projectId,
				name: parsed.name,
				dueDate: parsed.dueDate,
				status: parsed.status,
				assigneeId: parsed.assigneeId,
				reminders: parsed.reminders,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.deadlines.create',
		{ ...input },
		'completed',
	);
	return parsed;
};
