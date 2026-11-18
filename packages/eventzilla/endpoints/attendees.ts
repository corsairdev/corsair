import { asRecord } from 'corsair/core';
import type { EventzillaEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	checkinSucceeded,
	EventzillaEndpointInputSchemas as Inputs,
	EventzillaEndpointOutputSchemas as Outputs,
	shapeAttendees,
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
			shape: shapeAttendees,
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
			// `checkedIn` is derived here, not in `log`: a log field is discarded by
			// `call`, so a caller would never see it. It answers the fact that
			// Eventzilla reports a failed check-in with HTTP 200 and only a status
			// string to go on.
			shape: (raw, { eventcheckin }) => {
				const body = asRecord(raw) ?? {};
				const status = asRecord(body.checkinstatus)?.status;
				return {
					...body,
					checkedIn: checkinSucceeded(
						typeof status === 'string' ? status : undefined,
						eventcheckin,
					),
				};
			},
			log: ({ barcode, eventcheckin }, result) => ({
				barCodeSuffix: barcode.slice(-4),
				requested: eventcheckin,
				status: result.checkinstatus.status ?? undefined,
				checkedIn: result.checkedIn ?? undefined,
			}),
		},
	);
