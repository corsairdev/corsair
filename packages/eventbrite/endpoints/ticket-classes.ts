import type { EventbriteEndpoints } from '..';
import { segment } from '../client';
import { call, commaList } from './call';
import {
	EventbriteEndpointInputSchemas as Inputs,
	EventbriteEndpointOutputSchemas as Outputs,
} from './types';

export const list: EventbriteEndpoints['ticketClassesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ticketClasses.list',
			input: Inputs.ticketClassesList,
			output: Outputs.ticketClassesList,
		},
		input,
		({
			event_id,
			pos,
			category,
			include_holds,
			page_size,
			continuation,
			page,
		}) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/ticket_classes/`,
			query: {
				pos,
				category: commaList(category),
				include_holds,
				page_size,
				continuation,
				page,
			},
		}),
		{
			log: ({ event_id }, result) => ({
				eventId: event_id,
				count: result.ticket_classes.length,
			}),
		},
	);

/**
 * The for-sale view returns the same envelope but a public subset of each
 * ticket class, so it parses with the same schema.
 */
export const listForSale: EventbriteEndpoints['ticketClassesListForSale'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ticketClasses.listForSale',
			input: Inputs.ticketClassesListForSale,
			output: Outputs.ticketClassesListForSale,
		},
		input,
		({ event_id, pos, code, hold_id, page_size, continuation, page }) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/ticket_classes/for_sale/`,
			query: { pos, code, hold_id, page_size, continuation, page },
		}),
		{
			log: ({ event_id }, result) => ({
				eventId: event_id,
				count: result.ticket_classes.length,
			}),
		},
	);

export const get: EventbriteEndpoints['ticketClassGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ticketClass.get',
			input: Inputs.ticketClassGet,
			output: Outputs.ticketClassGet,
		},
		input,
		({ event_id, ticket_class_id }) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/ticket_classes/${segment(ticket_class_id)}/`,
		}),
		{
			log: ({ event_id, ticket_class_id }) => ({
				eventId: event_id,
				ticketClassId: ticket_class_id,
			}),
		},
	);

export const create: EventbriteEndpoints['ticketClassCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ticketClass.create',
			input: Inputs.ticketClassCreate,
			output: Outputs.ticketClassCreate,
		},
		input,
		({ event_id, ticket_class }) => ({
			method: 'POST',
			path: `/events/${segment(event_id)}/ticket_classes/`,
			body: { ticket_class },
		}),
		{
			log: ({ event_id }, result) => ({
				eventId: event_id,
				ticketClassId: result.id ?? undefined,
			}),
		},
	);

export const update: EventbriteEndpoints['ticketClassUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ticketClass.update',
			input: Inputs.ticketClassUpdate,
			output: Outputs.ticketClassUpdate,
		},
		input,
		({ event_id, ticket_class_id, ticket_class }) => ({
			method: 'POST',
			path: `/events/${segment(event_id)}/ticket_classes/${segment(ticket_class_id)}/`,
			body: { ticket_class },
		}),
		{
			log: ({ event_id, ticket_class_id }) => ({
				eventId: event_id,
				ticketClassId: ticket_class_id,
			}),
		},
	);

export const remove: EventbriteEndpoints['ticketClassDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ticketClass.delete',
			input: Inputs.ticketClassDelete,
			output: Outputs.ticketClassDelete,
		},
		input,
		({ event_id, ticket_class_id }) => ({
			method: 'DELETE',
			path: `/events/${segment(event_id)}/ticket_classes/${segment(ticket_class_id)}/`,
		}),
		{
			log: ({ event_id, ticket_class_id }) => ({
				eventId: event_id,
				ticketClassId: ticket_class_id,
			}),
		},
	);
