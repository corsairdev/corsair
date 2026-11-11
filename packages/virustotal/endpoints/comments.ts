import type { VirustotalEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	VirustotalEndpointInputSchemas as Inputs,
	VirustotalEndpointOutputSchemas as Outputs,
} from './types';

/** Lists comments across the account, optionally filtered. */
export const list: VirustotalEndpoints['commentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.list',
			input: Inputs.commentsList,
			output: Outputs.commentsList,
		},
		input,
		({ limit, filter, cursor }) => ({
			method: 'GET',
			path: '/comments',
			query: { limit, filter, cursor },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.meta?.cursor != null,
			}),
		},
	);

export const get: VirustotalEndpoints['commentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.get',
			input: Inputs.commentsGet,
			output: Outputs.commentsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/comments/${segment(id)}` }),
		{ log: (_, result) => ({ id: result.data?.id ?? undefined }) },
	);

/**
 * Deletes one of your own comments. VirusTotal answers 204 with no body, so the
 * plugin states what it did.
 */
export const remove: VirustotalEndpoints['commentsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.delete',
			input: Inputs.commentsDelete,
			output: Outputs.commentsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/comments/${segment(id)}` }),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);
