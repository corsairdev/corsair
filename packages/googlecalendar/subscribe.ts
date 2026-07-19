import { googleChannelSubscribe } from 'corsair/core';

/**
 * BYO subscribe for Google Calendar — thin wrapper over the shared Google
 * channel watch, on the connected user's primary calendar.
 */
export const googlecalendarSubscribe = (
	ctx: Parameters<typeof googleChannelSubscribe>[0],
	input: { webhookUrl: string },
) =>
	googleChannelSubscribe(ctx, {
		webhookUrl: input.webhookUrl,
		watchUrl:
			'https://www.googleapis.com/calendar/v3/calendars/primary/events/watch',
	});
