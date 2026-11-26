import type { LoomioEndpoints } from '..';
import { segment } from '../client';
import { bodyWithout, call, unwrapResource } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
} from './types';

export const create: LoomioEndpoints['commentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.create',
			input: Inputs.commentsCreate,
			output: Outputs.commentsCreate,
		},
		input,
		// A reply names its parent comment; Loomio needs parent_type with it
		// (the controller only defaults the parent to the discussion).
		(parsed) => ({
			method: 'POST',
			path: '/comments',
			body: {
				...parsed,
				parent_type: parsed.parent_id === undefined ? undefined : 'Comment',
			},
		}),
		{
			shape: (raw) => unwrapResource(raw, 'comments', 'comment'),
			log: (_, result) => ({ commentId: result.comment.id }),
		},
	);

export const update: LoomioEndpoints['commentsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.update',
			input: Inputs.commentsUpdate,
			output: Outputs.commentsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/comments/${segment(parsed.id)}`,
			body: bodyWithout(parsed, 'id'),
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'comments', 'comment'),
			log: (_, result) => ({ commentId: result.comment.id }),
		},
	);

export const remove: LoomioEndpoints['commentsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.delete',
			input: Inputs.commentsDelete,
			output: Outputs.commentsDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/comments/${segment(parsed.id)}`,
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'comments', 'comment'),
			log: (_, result) => ({ commentId: result.comment.id }),
		},
	);
