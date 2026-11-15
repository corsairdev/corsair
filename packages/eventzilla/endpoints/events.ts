import { asRecord } from 'corsair/core';
import type { EventzillaEndpoints } from '..';
import { emptyListMessage, segment } from '../client';
import { call } from './call';
import type { EventzillaPagination } from './types';
import {
	EventzillaEndpointInputSchemas as Inputs,
	nextOffset,
	EventzillaEndpointOutputSchemas as Outputs,
	shapeAttendees,
} from './types';

/**
 * Adds `next_offset` beside the provider's own `pagination` array, and turns the
 * empty-list answer into an empty page. That answer is HTTP 200 with only
 * `{"message":"No events found"}` — verified live — and carries no resource
 * array at all, so without this it fails the parse rather than reading as no
 * results. The row count has to be the real one: a short page is how the last
 * page is recognised when `total` is absent. Exported so the tests parse what
 * the endpoint really returns rather than the bare documented body.
 */
export function withNextOffset(
	// unknown: the response body, validated by the output schema after this.
	raw: unknown,
	key: string,
) {
	const empty = emptyListMessage(raw);
	if (empty !== undefined)
		return { [key]: [], next_offset: null, message: empty };
	const body = asRecord(raw) ?? {};
	// unknown: `pagination` is validated by the output schema; it is only
	// counted here to work out the next offset.
	const pagination = body.pagination as EventzillaPagination | undefined;
	const rows = body[key];
	return {
		...body,
		next_offset: nextOffset(pagination, Array.isArray(rows) ? rows.length : 0),
	};
}

export const list: EventzillaEndpoints['eventsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.list',
			input: Inputs.eventsList,
			output: Outputs.eventsList,
			toRequest: ({ status, category, offset, limit }) => ({
				method: 'GET',
				path: '/events',
				query: { status, category, offset, limit },
			}),
		},
		input,
		{
			shape: (raw) => withNextOffset(raw, 'events'),
			log: (_, result) => ({
				count: result.events.length,
				nextOffset: result.next_offset ?? undefined,
			}),
		},
	);

export const get: EventzillaEndpoints['eventsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.get',
			input: Inputs.eventsGet,
			output: Outputs.eventsGet,
			toRequest: ({ eventid }) => ({
				method: 'GET',
				path: `/events/${segment(eventid)}`,
			}),
		},
		input,
		{
			log: ({ eventid }, result) => ({
				eventId: eventid,
				title: result.events[0]?.title ?? undefined,
			}),
		},
	);

export const transactions: EventzillaEndpoints['eventsTransactions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.transactions',
			input: Inputs.eventsTransactions,
			output: Outputs.eventsTransactions,
			toRequest: ({ eventid, offset, limit }) => ({
				method: 'GET',
				path: `/events/${segment(eventid)}/transactions`,
				query: { offset, limit },
			}),
		},
		input,
		{
			shape: (raw) => withNextOffset(raw, 'transactions'),
			log: ({ eventid }, result) => ({
				eventId: eventid,
				count: result.transactions.length,
			}),
		},
	);

export const attendees: EventzillaEndpoints['eventsAttendees'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.attendees',
			input: Inputs.eventsAttendees,
			output: Outputs.eventsAttendees,
			toRequest: ({ eventid }) => ({
				method: 'GET',
				path: `/events/${segment(eventid)}/attendees`,
			}),
		},
		input,
		{
			// `is_attended` stays as sent; `attended` is the derived boolean the
			// output schema declares. Derived in `shapeAttendees` rather than with
			// a transform, which the docs generator cannot see.
			shape: shapeAttendees,
			log: ({ eventid }, result) => ({
				eventId: eventid,
				count: result.attendees.length,
				attended: result.attendees.filter((row) => row.attended === true)
					.length,
			}),
		},
	);
