import { logEventFromContext } from 'corsair/core';
import type { GoogleCalendarEndpoints } from '..';
import { makeAuthenticatedCalendarRequest } from '../client';
import type { GoogleCalendarEndpointOutputs } from './types';

export const getAvailability: GoogleCalendarEndpoints['calendarGetAvailability'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedCalendarRequest<
			GoogleCalendarEndpointOutputs['calendarGetAvailability']
		>('/freeBusy', ctx, {
			method: 'POST',
			body: {
				timeMin: input.timeMin,
				timeMax: input.timeMax,
				timeZone: input.timeZone,
				groupExpansionMax: input.groupExpansionMax,
				calendarExpansionMax: input.calendarExpansionMax,
				items: input.items,
			},
		});

		await logEventFromContext(
			ctx,
			'googlecalendar.calendar.getAvailability',
			{ ...input },
			'completed',
		);
		return result;
	};
