import { asRecord } from 'corsair/core';
import type { EventzillaEndpoints } from '..';
import { emptyListMessage, segment } from '../client';
import { call } from './call';
import type { EventzillaPagination } from './types';
import {
	EventzillaEndpointInputSchemas as Inputs,
	nextOffset,
	EventzillaEndpointOutputSchemas as Outputs,
} from './types';

export const list: EventzillaEndpoints['ticketsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.list',
			input: Inputs.ticketsList,
			output: Outputs.ticketsList,
			toRequest: ({ eventid }) => ({
				method: 'GET',
				path: `/events/${segment(eventid)}/tickets`,
			}),
		},
		input,
		{
			// An event with no ticket types yet answers the empty-list message
			// rather than `tickets: []`; anything else goes to the schema as sent.
			shape: (raw) => {
				const empty = emptyListMessage(raw);
				return empty === undefined ? raw : { tickets: [], message: empty };
			},
			log: ({ eventid }, result) => ({
				eventId: eventid,
				count: result.tickets.length,
			}),
		},
	);

/**
 * `eventid` names the event in the path and `ticket_type_id` names the ticket
 * type in the path, so neither belongs in the body. Building the body field by
 * field keeps the parsed type; a spread-with-omission would need a cast.
 */
function upsertBody(parsed: {
	ticket_type_name: string;
	quantity_total: number;
	ticket_type_description: string;
	sales_start_date: string;
	sales_start_time: string;
	sales_end_date: string;
	sales_end_time: string;
	limit_minimum: number;
	limit_maximum: number;
	is_visible: boolean;
	boxoffice_only: boolean;
	additional_instructions?: string;
	unlock_code?: string;
}) {
	return {
		ticket_type_name: parsed.ticket_type_name,
		quantity_total: parsed.quantity_total,
		ticket_type_description: parsed.ticket_type_description,
		sales_start_date: parsed.sales_start_date,
		sales_start_time: parsed.sales_start_time,
		sales_end_date: parsed.sales_end_date,
		sales_end_time: parsed.sales_end_time,
		limit_minimum: parsed.limit_minimum,
		limit_maximum: parsed.limit_maximum,
		is_visible: parsed.is_visible,
		boxoffice_only: parsed.boxoffice_only,
		additional_instructions: parsed.additional_instructions,
		unlock_code: parsed.unlock_code,
	};
}

export const create: EventzillaEndpoints['ticketsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.create',
			input: Inputs.ticketsCreate,
			output: Outputs.ticketsCreate,
			toRequest: (parsed) => ({
				method: 'POST',
				path: `/events/${segment(parsed.eventid)}/ticket-types`,
				body: upsertBody(parsed),
			}),
		},
		input,
		{
			log: ({ eventid }, result) => ({
				eventId: eventid,
				ticketTypeId: result.ticket_type_id ?? undefined,
			}),
		},
	);

export const update: EventzillaEndpoints['ticketsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.update',
			input: Inputs.ticketsUpdate,
			output: Outputs.ticketsUpdate,
			toRequest: (parsed) => ({
				method: 'PATCH',
				path: `/events/${segment(parsed.eventid)}/ticket-types/${segment(
					parsed.ticket_type_id,
				)}`,
				body: upsertBody(parsed),
			}),
		},
		input,
		{
			log: ({ eventid, ticket_type_id }, result) => ({
				eventId: eventid,
				ticketTypeId: result.ticket_type_id ?? ticket_type_id,
			}),
		},
	);

export const categories: EventzillaEndpoints['categoriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'categories.list',
			input: Inputs.categoriesList,
			output: Outputs.categoriesList,
			toRequest: () => ({ method: 'GET', path: '/categories' }),
		},
		input,
		{
			log: (_, result) => ({ count: result.categories.length }),
		},
	);

export const users: EventzillaEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
			toRequest: ({ offset, limit }) => ({
				method: 'GET',
				path: '/users',
				query: { offset, limit },
			}),
		},
		input,
		{
			shape: (raw) => {
				const empty = emptyListMessage(raw);
				if (empty !== undefined) {
					return { users: [], next_offset: null, message: empty };
				}
				const body = asRecord(raw) ?? {};
				// unknown: `users` is validated by the output schema; the count is
				// only needed to decide whether another page exists.
				const pagination = body.pagination as EventzillaPagination | undefined;
				const rows = Array.isArray(body.users) ? body.users : [];
				return { ...body, next_offset: nextOffset(pagination, rows.length) };
			},
			log: (_, result) => ({ count: result.users.length }),
		},
	);

export const user: EventzillaEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
			toRequest: ({ userid }) => ({
				method: 'GET',
				path: `/users/${segment(userid)}`,
			}),
		},
		input,
		{
			// The single-user route answers `user` (singular) where the list answers
			// `users`; verified live. Nothing is reshaped beyond that.
			log: ({ userid }, result) => ({
				userId: userid,
				company: result.user[0]?.company ?? undefined,
			}),
		},
	);

export const transaction: EventzillaEndpoints['transactionsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transactions.get',
			input: Inputs.transactionsGet,
			output: Outputs.transactionsGet,
			toRequest: ({ identifier }) => ({
				method: 'GET',
				// One path segment takes either a checkout id or a reference, so it
				// is encoded whole rather than split on the dash.
				path: `/transactions/${segment(identifier)}`,
			}),
		},
		input,
		{
			log: ({ identifier }, result) => ({
				identifier,
				found: result.transaction.length,
			}),
		},
	);
