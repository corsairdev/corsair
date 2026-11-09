import { asRecord } from 'corsair/core';
import type { EventzillaEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import type { EventzillaPagination } from './types';
import {
	EventzillaEndpointInputSchemas as Inputs,
	isAttendedFlag,
	nextOffset,
	EventzillaEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Adds `next_offset` beside the provider's own `pagination` array. The row count
 * has to be the real one: a short page is how the last page is recognised when
 * `total` is absent.
 */
/**
 * Adds `next_offset` beside the provider's own `pagination` array. The row count
 * has to be the real one: a short page is how the last page is recognised when
 * `total` is absent. Exported so the tests parse what the endpoint really
 * returns rather than the bare documented body.
 */
export function withNextOffset(
	// unknown: the response body, validated by the output schema after this.
	raw: unknown,
	key: string,
) {
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
			// output schema declares. Derived here rather than with a transform
			// because the docs generator reads a transform's input side.
			shape: (raw) => {
				const body = asRecord(raw) ?? {};
				const rows = Array.isArray(body.attendees) ? body.attendees : [];
				return {
					...body,
					attendees: rows.map((row) => {
						const record = asRecord(row) ?? {};
						const flag = record.is_attended;
						return {
							...record,
							attended: isAttendedFlag(
								typeof flag === 'string' ? flag : undefined,
							),
						};
					}),
				};
			},
			log: ({ eventid }, result) => ({
				eventId: eventid,
				count: result.attendees.length,
				attended: result.attendees.filter((row) => row.attended === true)
					.length,
			}),
		},
	);
