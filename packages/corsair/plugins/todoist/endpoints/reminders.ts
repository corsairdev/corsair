import type { TodoistEndpoints } from '..';
import type { TodoistEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeTodoistRequest } from '../client';

export const create: TodoistEndpoints['remindersCreate'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['remindersCreate']
	>('reminders', ctx.key, {
		method: 'POST',
		body: {
			task_id: input.task_id,
			due_datetime: input.due_datetime,
			due_date: input.due_date,
			due_string: input.due_string,
			relative_duration: input.relative_duration,
			notification_type: input.notification_type,
			notify_uid: input.notify_uid,
			description: input.description,
		},
	});

	if (ctx.db.reminders) {
		await ctx.db.reminders.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.reminders.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteReminder: TodoistEndpoints['remindersDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['remindersDelete']
	>(`reminders/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.reminders) {
		await ctx.db.reminders.deleteByEntityId(input.id);
	}

	await logEventFromContext(
		ctx,
		'todoist.reminders.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMany: TodoistEndpoints['remindersGetMany'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['remindersGetMany']
	>('reminders', ctx.key, {
		method: 'GET',
	});

	if (Array.isArray(result) && ctx.db.reminders) {
		for (const reminder of result) {
			await ctx.db.reminders.upsertByEntityId(reminder.id, {
				...reminder,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'todoist.reminders.getMany',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TodoistEndpoints['remindersUpdate'] = async (ctx, input) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['remindersUpdate']
	>(`reminders/${id}`, ctx.key, {
		method: 'POST',
		body: updates,
	});

	if (ctx.db.reminders) {
		await ctx.db.reminders.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.reminders.update',
		{ ...input },
		'completed',
	);
	return result;
};

