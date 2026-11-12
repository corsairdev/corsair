import type { z } from 'zod';
import type { RepairshoprEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { deletedShape, pagedShape, singleShape } from './shape';
import {
	RepairshoprEndpointInputSchemas as Inputs,
	RepairshoprEndpointOutputSchemas as Outputs,
} from './types';

export const list: RepairshoprEndpoints['ticketsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.list',
			input: Inputs.ticketsList,
			output: Outputs.ticketsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/tickets',
			replayable: true,
			query: queryOf({
				page: parsed.page,
				customer_id: parsed.customer_id,
				contact_id: parsed.contact_id,
				number: parsed.number,
				status: parsed.status,
				query: parsed.query,
				user_id: parsed.user_id,
				mine: parsed.mine,
				resolved_after: parsed.resolved_after,
				created_after: parsed.created_after,
				since_updated_at: parsed.since_updated_at,
				parent_id: parsed.parent_id,
			}),
		}),
		{
			shape: pagedShape('tickets'),
			log: (_, result) => ({
				count: result.tickets.length,
				hasNext: result.next_page !== null,
			}),
		},
	);

export const get: RepairshoprEndpoints['ticketsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.get',
			input: Inputs.ticketsGet,
			output: Outputs.ticketsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/tickets/${segment(parsed.ticket_id)}`,
			replayable: true,
		}),
		{
			shape: singleShape('ticket'),
			log: (_, result) => ({ ticketId: result.ticket.id ?? 0 }),
		},
	);

/**
 * The ticket fields, already in the wire spelling. `ticket_id` is stripped on an
 * update because it travels in the path.
 */
function ticketBody(
	input: Partial<z.output<(typeof Inputs)['ticketsCreate']>> & {
		ticket_id?: number;
	},
	// unknown: the body is assembled from the parsed input under wire names,
	// so its values are the provider's own shapes rather than one declared type.
): Record<string, unknown> {
	const { ticket_id: _id, ...rest } = input;
	return Object.fromEntries(
		Object.entries(rest).filter(([, value]) => value !== undefined),
	);
}

export const create: RepairshoprEndpoints['ticketsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.create',
			input: Inputs.ticketsCreate,
			output: Outputs.ticketsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/tickets',
			replayable: false,
			body: ticketBody(parsed),
		}),
		{
			shape: singleShape('ticket'),
			log: (_, result) => ({ ticketId: result.ticket.id ?? 0 }),
		},
	);

export const update: RepairshoprEndpoints['ticketsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.update',
			input: Inputs.ticketsUpdate,
			output: Outputs.ticketsUpdate,
		},
		input,
		(parsed) => {
			const { ticket_id: ticketId, ...rest } = parsed;
			return {
				method: 'PUT',
				path: `/tickets/${segment(ticketId)}`,
				replayable: false,
				body: ticketBody(rest),
			};
		},
		{
			shape: singleShape('ticket'),
			log: (parsed, result) => ({
				ticketId: parsed.ticket_id,
				status: result.ticket.status ?? undefined,
			}),
		},
	);

export const remove: RepairshoprEndpoints['ticketsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.delete',
			input: Inputs.ticketsDelete,
			output: Outputs.ticketsDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/tickets/${segment(parsed.ticket_id)}`,
			replayable: false,
		}),
		{
			shape: deletedShape('ticket_id'),
			log: (parsed) => ({ ticketId: parsed.ticket_id }),
		},
	);
