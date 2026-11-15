import type { EventbriteEndpoints } from '..';
import { segment } from '../client';
import { call, commaList } from './call';
import {
	EventbriteEndpointInputSchemas as Inputs,
	EventbriteEndpointOutputSchemas as Outputs,
} from './types';

export const list: EventbriteEndpoints['attendeesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'attendees.list',
			input: Inputs.attendeesList,
			output: Outputs.attendeesList,
		},
		input,
		({
			event_id,
			status,
			changed_since,
			last_item_seen,
			attendee_ids,
			page_size,
			continuation,
			page,
		}) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/attendees/`,
			query: {
				status,
				changed_since,
				last_item_seen,
				attendee_ids: commaList(attendee_ids),
				page_size,
				continuation,
				page,
			},
		}),
		{
			// Attendee names and emails are private; count and status only.
			log: ({ event_id, status }, result) => ({
				eventId: event_id,
				status,
				count: result.attendees.length,
			}),
		},
	);

export const get: EventbriteEndpoints['attendeeGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'attendees.get',
			input: Inputs.attendeeGet,
			output: Outputs.attendeeGet,
		},
		input,
		({ event_id, attendee_id }) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/attendees/${segment(attendee_id)}/`,
		}),
		{
			log: ({ event_id, attendee_id }) => ({
				eventId: event_id,
				attendeeId: attendee_id,
			}),
		},
	);
