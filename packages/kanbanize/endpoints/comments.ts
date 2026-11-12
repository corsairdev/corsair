import type { KanbanizeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	KanbanizeEndpointInputSchemas as Inputs,
	KanbanizeEndpointOutputSchemas as Outputs,
} from './types';

export const list: KanbanizeEndpoints['commentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.list',
			input: Inputs.commentsList,
			output: Outputs.commentsList,
		},
		input,
		({ card_id }) => ({
			method: 'GET',
			path: `/cards/${segment(card_id)}/comments`,
		}),
		{
			log: ({ card_id }, result) => ({
				cardId: card_id,
				count: result.data.length,
			}),
		},
	);

export const create: KanbanizeEndpoints['commentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.create',
			input: Inputs.commentsCreate,
			output: Outputs.commentsCreate,
		},
		input,
		({ card_id, text }) => ({
			method: 'POST',
			path: `/cards/${segment(card_id)}/comments`,
			body: { text },
		}),
		// The comment text is not logged: a comment can hold anything.
		{
			log: ({ card_id }, result) => ({
				cardId: card_id,
				commentId: result.data.comment_id,
			}),
		},
	);
