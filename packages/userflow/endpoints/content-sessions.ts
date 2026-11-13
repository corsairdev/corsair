import type { UserflowEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UserflowEndpointInputSchemas as Inputs,
	UserflowEndpointOutputSchemas as Outputs,
} from './types';

export const get: UserflowEndpoints['contentSessionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contentSessions.get',
			input: Inputs.contentSessionsGet,
			output: Outputs.contentSessionsGet,
		},
		input,
		({ id, expand }) => ({
			method: 'GET',
			path: `/content_sessions/${segment(id)}`,
			query: { expand },
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				completed: result.completed ?? false,
				progress: result.progress ?? undefined,
			}),
		},
	);

/** Ending a session is idempotent and answers the session as it now stands. */
export const end: UserflowEndpoints['contentSessionsEnd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contentSessions.end',
			input: Inputs.contentSessionsEnd,
			output: Outputs.contentSessionsEnd,
		},
		input,
		({ id }) => ({
			method: 'POST',
			path: `/content_sessions/${segment(id)}/end`,
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				completed: result.completed ?? false,
			}),
		},
	);

/**
 * Deleting a session also removes its progress and survey answers. The docs
 * mistype this route as `content_sesssions` in one place and spell it
 * `content_sessions` in every example, so the correct spelling is used.
 */
export const remove: UserflowEndpoints['contentSessionsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contentSessions.delete',
			input: Inputs.contentSessionsDelete,
			output: Outputs.contentSessionsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/content_sessions/${segment(id)}`,
		}),
		{
			shape: (raw, parsed) => ({
				...(typeof raw === 'object' && raw !== null ? raw : {}),
				id: parsed.id,
				deleted: true,
			}),
			log: ({ id }) => ({ id }),
		},
	);

export const list: UserflowEndpoints['contentSessionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contentSessions.list',
			input: Inputs.contentSessionsList,
			output: Outputs.contentSessionsList,
		},
		input,
		({ limit, starting_after, content_id, user_id, order_by, expand }) => ({
			method: 'GET',
			path: '/content_sessions',
			query: {
				limit,
				starting_after,
				content_id,
				user_id,
				order_by,
				expand,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.has_more ?? false,
			}),
		},
	);
