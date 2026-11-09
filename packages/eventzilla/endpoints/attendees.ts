import { asRecord } from 'corsair/core';
import type { EventzillaEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EventzillaEndpointInputSchemas as Inputs,
	isAttendedFlag,
	EventzillaEndpointOutputSchemas as Outputs,
} from './types';

export const get: EventzillaEndpoints['attendeesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'attendees.get',
			input: Inputs.attendeesGet,
			output: Outputs.attendeesGet,
			toRequest: ({ attendeeid }) => ({
				method: 'GET',
				path: `/attendees/${segment(attendeeid)}`,
			}),
		},
		input,
		{
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
			log: ({ attendeeid }, result) => ({
				attendeeId: attendeeid,
				found: result.attendees.length,
			}),
		},
	);

/**
 * Checks in, or reverts a check-in, by barcode. `eventcheckin` is sent as a
 * boolean: the API also accepts the strings `"true"`/`"false"`, and a backend
 * that tests truthiness would read `"false"` as a check-in.
 */
export const checkin: EventzillaEndpoints['attendeesCheckin'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'attendees.checkin',
			input: Inputs.attendeesCheckin,
			output: Outputs.attendeesCheckin,
			// The docs page names this route POST /attendee/checkin, but that path
			// answers API Gateway's "Missing Authentication Token" 403 even with a
			// key; /attendees/checkin is the route that exists.
			toRequest: (body) => ({
				method: 'POST',
				path: '/attendees/checkin',
				body,
			}),
		},
		input,
		{
			log: ({ barcode, eventcheckin }, result) => ({
				barCodeSuffix: barcode.slice(-4),
				checkedIn: eventcheckin,
				status: result.status ?? undefined,
			}),
		},
	);
