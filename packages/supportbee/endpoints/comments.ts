import type { SupportbeeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

export const list: SupportbeeEndpoints['commentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.list',
			input: Inputs.commentsList,
			output: Outputs.commentsList,
		},
		input,
		({ ticket_id }) => ({
			method: 'GET',
			path: `/tickets/${segment(ticket_id)}/comments`,
		}),
		{
			log: (parsed, result) => ({
				ticketId: parsed.ticket_id,
				count: result.comments.length,
			}),
		},
	);

export const create: SupportbeeEndpoints['commentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.create',
			input: Inputs.commentsCreate,
			output: Outputs.commentsCreate,
		},
		input,
		({ ticket_id, content }) => ({
			method: 'POST',
			path: `/tickets/${segment(ticket_id)}/comments`,
			body: { comment: { content } },
		}),
		{
			log: (parsed, result) => ({
				ticketId: parsed.ticket_id,
				commentId: result.comment.id,
			}),
		},
	);
