import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './types';

export const list: ChatworkEndpoints['tasksList'] = async (ctx, input) => {
	const { room_id, ...query } =
		ChatworkEndpointInputSchemas.tasksList.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['tasksList']
	>(`rooms/${room_id}/tasks`, ctx.key, {
		method: 'GET',
		query,
		authType: ctx.options?.authType,
		defaultEmptyArray: true,
	});
	const validatedResult = ChatworkEndpointOutputSchemas.tasksList.parse(result);

	if (ctx.db.tasks) {
		try {
			for (const task of validatedResult) {
				await ctx.db.tasks.upsertByEntityId(String(task.task_id), {
					...task,
					room_id,
				});
			}
		} catch (error) {
			console.warn('Failed to save Chatwork tasks to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.tasks.list',
		{ room_id, ...query },
		'completed',
	);

	return validatedResult;
};

export const get: ChatworkEndpoints['tasksGet'] = async (ctx, input) => {
	const { room_id, task_id } =
		ChatworkEndpointInputSchemas.tasksGet.parse(input);
	const result = await makeChatworkRequest<ChatworkEndpointOutputs['tasksGet']>(
		`rooms/${room_id}/tasks/${task_id}`,
		ctx.key,
		{ method: 'GET', authType: ctx.options?.authType },
	);
	const validatedResult = ChatworkEndpointOutputSchemas.tasksGet.parse(result);

	if (ctx.db.tasks) {
		try {
			await ctx.db.tasks.upsertByEntityId(String(validatedResult.task_id), {
				...validatedResult,
				room_id,
			});
		} catch (error) {
			console.warn('Failed to save Chatwork task to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.tasks.get',
		{ room_id, task_id },
		'completed',
	);

	return validatedResult;
};

export const create: ChatworkEndpoints['tasksCreate'] = async (ctx, input) => {
	const { room_id, ...form } =
		ChatworkEndpointInputSchemas.tasksCreate.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['tasksCreate']
	>(`rooms/${room_id}/tasks`, ctx.key, {
		method: 'POST',
		form,
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.tasksCreate.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.tasks.create',
		{
			room_id,
			to_ids: form.to_ids,
			limit: form.limit,
			limit_type: form.limit_type,
			body_length: form.body.length,
		},
		'completed',
	);

	return validatedResult;
};

export const updateStatus: ChatworkEndpoints['tasksUpdateStatus'] = async (
	ctx,
	input,
) => {
	const { room_id, task_id, status } =
		ChatworkEndpointInputSchemas.tasksUpdateStatus.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['tasksUpdateStatus']
	>(`rooms/${room_id}/tasks/${task_id}/status`, ctx.key, {
		method: 'PUT',
		form: { body: status },
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.tasksUpdateStatus.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.tasks.updateStatus',
		{ room_id, task_id, status },
		'completed',
	);

	return validatedResult;
};
