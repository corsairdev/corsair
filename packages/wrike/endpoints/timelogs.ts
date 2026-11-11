import type { WrikeEndpoints } from '..';
import { id } from '../client';
import { call } from './call';
import {
	WrikeEndpointInputSchemas as Inputs,
	WrikeEndpointOutputSchemas as Outputs,
} from './types';

/** All the time logs on the account, filtered. */
export const list: WrikeEndpoints['timelogsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timelogs.list',
			input: Inputs.timelogsList,
			output: Outputs.timelogsList,
		},
		input,
		({
			pageSize,
			nextPageToken,
			taskId,
			userId,
			trackedDate,
			createdDate,
		}) => ({
			method: 'GET',
			path: '/timelogs',
			query: {
				pageSize,
				nextPageToken,
				taskId,
				userId,
				trackedDate,
				createdDate,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				// The total, which is what a report cares about, rather than the
				// per-entry comments.
				hours:
					result.data?.reduce(
						(total, entry) => total + (entry.hours ?? 0),
						0,
					) ?? 0,
			}),
		},
	);

/** The time logged against one task. */
export const task: WrikeEndpoints['taskTimelogs'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timelogs.task',
			input: Inputs.taskTimelogs,
			output: Outputs.taskTimelogs,
		},
		input,
		({ taskId, pageSize, nextPageToken }) => ({
			method: 'GET',
			path: `/tasks/${id(taskId)}/timelogs`,
			query: { pageSize, nextPageToken },
		}),
		{
			log: (parsed, result) => ({
				task: parsed.taskId,
				count: result.data?.length ?? 0,
			}),
		},
	);

/**
 * Logs time against a task. `trackedDate` and `hours` are both required: the
 * date is the day the work belongs to, not when it was entered, and hours is
 * what every report totals.
 */
export const create: WrikeEndpoints['timelogsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timelogs.create',
			input: Inputs.timelogsCreate,
			output: Outputs.timelogsCreate,
		},
		input,
		({ taskId, ...body }) => ({
			method: 'POST',
			path: `/tasks/${id(taskId)}/timelogs`,
			body,
		}),
		{
			log: (parsed, result) => ({
				id: result.data?.[0]?.id ?? undefined,
				task: parsed.taskId,
				hours: parsed.hours,
			}),
		},
	);

export const remove: WrikeEndpoints['timelogsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timelogs.delete',
			input: Inputs.timelogsDelete,
			output: Outputs.timelogsDelete,
		},
		input,
		({ id: timelogId }) => ({
			method: 'DELETE',
			path: `/timelogs/${id(timelogId)}`,
		}),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id: timelogId }) => ({ id: timelogId }),
		},
	);

// ── comments ──────────────────────────────────────────────────────────────

export const listComments: WrikeEndpoints['commentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.list',
			input: Inputs.commentsList,
			output: Outputs.commentsList,
		},
		input,
		({ pageSize, nextPageToken }) => ({
			method: 'GET',
			path: '/comments',
			query: { pageSize, nextPageToken },
		}),
		{ log: (_, result) => ({ count: result.data?.length ?? 0 }) },
	);

/** The comments on a task. */
export const taskComments: WrikeEndpoints['taskComments'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.task',
			input: Inputs.taskComments,
			output: Outputs.taskComments,
		},
		input,
		({ taskId, pageSize, nextPageToken }) => ({
			method: 'GET',
			path: `/tasks/${id(taskId)}/comments`,
			query: { pageSize, nextPageToken },
		}),
		{
			log: (parsed, result) => ({
				task: parsed.taskId,
				count: result.data?.length ?? 0,
			}),
		},
	);

/** Posts a comment on a task. */
export const taskCommentsCreate: WrikeEndpoints['taskCommentsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'comments.create',
			input: Inputs.taskCommentsCreate,
			output: Outputs.taskCommentsCreate,
		},
		input,
		({ taskId, text }) => ({
			method: 'POST',
			path: `/tasks/${id(taskId)}/comments`,
			body: { text },
		}),
		{
			// The comment text is the user's content, so only that one was posted.
			log: (parsed, result) => ({
				id: result.data?.[0]?.id ?? undefined,
				task: parsed.taskId,
				length: parsed.text.length,
			}),
		},
	);

export const updateComment: WrikeEndpoints['commentsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.update',
			input: Inputs.commentsUpdate,
			output: Outputs.commentsUpdate,
		},
		input,
		({ id: commentId, text }) => ({
			method: 'PUT',
			path: `/comments/${id(commentId)}`,
			body: { text },
		}),
		{
			log: (_, result) => ({ id: result.data?.[0]?.id ?? undefined }),
		},
	);

export const removeComment: WrikeEndpoints['commentsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.delete',
			input: Inputs.commentsDelete,
			output: Outputs.commentsDelete,
		},
		input,
		({ id: commentId }) => ({
			method: 'DELETE',
			path: `/comments/${id(commentId)}`,
		}),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id: commentId }) => ({ id: commentId }),
		},
	);
