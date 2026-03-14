import { logEventFromContext } from '../../utils/events';
import type { SentryEndpoints } from '..';
import { makeSentryRequest } from '../client';
import type { SentryEndpointOutputs } from './types';

export const get: SentryEndpoints['eventsGet'] = async (ctx, input) => {
	const response = await makeSentryRequest<SentryEndpointOutputs['eventsGet']>(
		`projects/${input.organizationSlug}/${input.projectSlug}/events/${input.eventId}/`,
		ctx.key,
		{ method: 'GET' },
	);

	if (response && ctx.db.events) {
		try {
			await ctx.db.events.upsertByEntityId(response.eventID, {
				...response,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
				dateReceived: response.dateReceived
					? new Date(response.dateReceived)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save event to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.events.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: SentryEndpoints['eventsList'] = async (ctx, input) => {
	const response = await makeSentryRequest<SentryEndpointOutputs['eventsList']>(
		`projects/${input.organizationSlug}/${input.projectSlug}/events/`,
		ctx.key,
		{
			method: 'GET',
			query: {
				cursor: input.cursor,
			},
		},
	);

	if (response && ctx.db.events) {
		try {
			for (const event of response) {
				await ctx.db.events.upsertByEntityId(event.eventID, {
					...event,
					dateCreated: event.dateCreated ? new Date(event.dateCreated) : null,
					dateReceived: event.dateReceived
						? new Date(event.dateReceived)
						: null,
				});
			}
		} catch (error) {
			console.warn('Failed to save events to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.events.list',
		{ ...input },
		'completed',
	);
	return response;
};
