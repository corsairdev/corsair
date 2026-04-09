import { logEventFromContext } from 'corsair/core';
import type { ExaEndpoints } from '..';
import { makeExaRequest } from '../client';
import type { ExaEndpointOutputs } from './types';

export const listEvents: ExaEndpoints['eventsList'] = async (ctx, input) => {
	const { websetId, ...queryParams } = input;
	const result = await makeExaRequest<ExaEndpointOutputs['eventsList']>(
		`websets/v0/websets/${websetId}/events`,
		ctx.key,
		{
			method: 'GET',
			query: queryParams as Record<
				string,
				string | number | boolean | undefined
			>,
		},
	);

	if (result.data && ctx.db.events) {
		try {
			for (const event of result.data) {
				await ctx.db.events.upsertByEntityId(event.id, {
					id: event.id,
					type: event.type,
					websetId,
					createdAt: new Date(event.createdAt),
				});
			}
		} catch (error) {
			console.warn('Failed to save events to database:', error);
		}
	}

	await logEventFromContext(ctx, 'exa.events.list', { websetId }, 'completed');
	return result;
};

export const getEvent: ExaEndpoints['eventsGet'] = async (ctx, input) => {
	const result = await makeExaRequest<ExaEndpointOutputs['eventsGet']>(
		`websets/v0/websets/${input.websetId}/events/${input.eventId}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (ctx.db.events) {
		try {
			await ctx.db.events.upsertByEntityId(result.id, {
				id: result.id,
				type: result.type,
				websetId: input.websetId,
				createdAt: new Date(result.createdAt),
			});
		} catch (error) {
			console.warn('Failed to save event to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.events.get',
		{ websetId: input.websetId, eventId: input.eventId },
		'completed',
	);
	return result;
};
