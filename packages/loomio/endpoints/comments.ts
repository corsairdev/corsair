import type { LoomioEndpoints } from '..';
import { call, unwrapResource } from './call';
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
		({ discussion_id, body, body_format }) => ({
			method: 'POST',
			path: '/comments',
			body: { discussion_id, body, body_format },
		}),
		{
			shape: (raw) => unwrapResource(raw, 'comments', 'comment'),
			log: (_, result) => ({ commentId: result.comment.id }),
		},
	);
