import type { SupportbeeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

export const list: SupportbeeEndpoints['repliesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'replies.list',
			input: Inputs.repliesList,
			output: Outputs.repliesList,
		},
		input,
		({ ticket_id }) => ({
			method: 'GET',
			path: `/tickets/${segment(ticket_id)}/replies`,
		}),
		{
			log: (parsed, result) => ({
				ticketId: parsed.ticket_id,
				count: result.replies.length,
			}),
		},
	);

export const get: SupportbeeEndpoints['repliesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'replies.get',
			input: Inputs.repliesGet,
			output: Outputs.repliesGet,
		},
		input,
		({ ticket_id, id }) => ({
			method: 'GET',
			path: `/tickets/${segment(ticket_id)}/replies/${segment(id)}`,
		}),
		{
			// The docs show the bare reply; the live API wraps it as `{ reply }`.
			// Both are accepted and the reply is returned.
			shape: (raw) =>
				raw && typeof raw === 'object' && 'reply' in raw ? raw.reply : raw,
			log: (parsed) => ({ ticketId: parsed.ticket_id, replyId: parsed.id }),
		},
	);

export const create: SupportbeeEndpoints['repliesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'replies.create',
			input: Inputs.repliesCreate,
			output: Outputs.repliesCreate,
		},
		input,
		({ ticket_id, content, cc, bcc, on_behalf_of }) => ({
			method: 'POST',
			path: `/tickets/${segment(ticket_id)}/replies`,
			body: {
				reply: {
					content,
					...(cc === undefined ? {} : { cc }),
					...(bcc === undefined ? {} : { bcc }),
					...(on_behalf_of === undefined ? {} : { on_behalf_of }),
				},
			},
		}),
		{
			log: (parsed, result) => ({
				ticketId: parsed.ticket_id,
				replyId: result.reply.id,
			}),
		},
	);
