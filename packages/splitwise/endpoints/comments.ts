import type { SplitwiseEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	SplitwiseEndpointInputSchemas,
	SplitwiseEndpointOutputSchemas,
} from './types';

export const list: SplitwiseEndpoints['commentsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.list',
			input: SplitwiseEndpointInputSchemas.listComments,
			output: SplitwiseEndpointOutputSchemas.listComments,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'get_comments',
			query: { expense_id: parsed.expense_id },
		}),
		{
			log: (parsed, result) => ({
				expense_id: parsed.expense_id,
				comments: result.comments.length,
			}),
		},
	);

export const create: SplitwiseEndpoints['commentsCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'comments.create',
			input: SplitwiseEndpointInputSchemas.createComment,
			output: SplitwiseEndpointOutputSchemas.createComment,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'create_comment',
			body: { expense_id: parsed.expense_id, content: parsed.content },
		}),
		{ log: (parsed) => ({ expense_id: parsed.expense_id }) },
	);

export const remove: SplitwiseEndpoints['commentsDelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'comments.delete',
			input: SplitwiseEndpointInputSchemas.deleteComment,
			output: SplitwiseEndpointOutputSchemas.deleteComment,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `delete_comment/${segment(parsed.comment_id)}`,
		}),
		{ log: (parsed) => ({ comment_id: parsed.comment_id }) },
	);
