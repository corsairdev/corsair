import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './types';

export const get: ChatworkEndpoints['accountGet'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.accountGet.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['accountGet']
	>('me', ctx.key, {
		method: 'GET',
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.accountGet.parse(result);

	if (ctx.db.accounts) {
		try {
			await ctx.db.accounts.upsertByEntityId(
				String(validatedResult.account_id),
				validatedResult,
			);
		} catch (error) {
			console.warn('Failed to save Chatwork account to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.account.get',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};

export const getStatus: ChatworkEndpoints['accountGetStatus'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ChatworkEndpointInputSchemas.accountGetStatus.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['accountGetStatus']
	>('my/status', ctx.key, {
		method: 'GET',
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.accountGetStatus.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.account.getStatus',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};

export const listTasks: ChatworkEndpoints['accountListTasks'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ChatworkEndpointInputSchemas.accountListTasks.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['accountListTasks']
	>('my/tasks', ctx.key, {
		method: 'GET',
		query: parsedInput,
		authType: ctx.options?.authType,
		defaultEmptyArray: true,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.accountListTasks.parse(result);

	if (ctx.db.tasks) {
		try {
			for (const task of validatedResult) {
				await ctx.db.tasks.upsertByEntityId(String(task.task_id), {
					...task,
					room_id: task.room.room_id,
				});
			}
		} catch (error) {
			console.warn('Failed to save Chatwork tasks to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.account.listTasks',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};
