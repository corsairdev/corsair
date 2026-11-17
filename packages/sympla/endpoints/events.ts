import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { SymplaContext } from '../context';
import { SymplaEventEntity } from '../schema/database';
import { callSympla, requireKey } from './shared';
import type {
	GetEventInput,
	GetEventResponse,
	ListEventsInput,
	ListEventsResponse,
	SymplaEvent,
} from './types';
import {
	EventSchema,
	GetEventInputSchema,
	GetEventResponseSchema,
	ListEventsInputSchema,
	ListEventsResponseSchema,
} from './types';

export const listEvents: CorsairEndpoint<
	SymplaContext,
	ListEventsInput,
	ListEventsResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListEventsInputSchema.parse(input ?? {});
	const result = await callSympla(
		ctx,
		'events.list',
		{ path: '/events', query: parsed },
		ListEventsResponseSchema,
		{},
	);
	await storeEvents(ctx, result.data);
	return result;
};

export const getEvent: CorsairEndpoint<
	SymplaContext,
	GetEventInput,
	GetEventResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetEventInputSchema.parse(input);
	const { event_id: _event_id, ...query } = parsed;
	const result = await callSympla(
		ctx,
		'events.get',
		{ path: `/events/${pathPart(parsed.event_id)}`, query },
		GetEventResponseSchema,
		{ event_id: String(parsed.event_id) },
	);
	// The reference shows the event both bare and wrapped in `{ data }`.
	const event = EventSchema.safeParse('data' in result ? result.data : result);
	if (event.success) await storeEvents(ctx, [event.data]);
	return result;
};

/**
 * Saves each event's id and name. A reply without a name leaves a stored
 * event as it is, so a narrow `fields` read cannot undo a newer name.
 */
async function storeEvents(
	ctx: SymplaContext,
	events: SymplaEvent[],
): Promise<void> {
	if (!ctx.db?.events) return;
	for (const event of events) {
		const id = String(event.id);
		try {
			const existing = await ctx.db.events.findByEntityId(id);
			if (event.name == null && existing) continue;
			const row = SymplaEventEntity.safeParse({
				...existing?.data,
				id,
				name: event.name ?? undefined,
			});
			if (!row.success) continue;
			await ctx.db.events.upsertByEntityId(id, row.data);
		} catch {
			console.warn('Failed to save Sympla event');
		}
	}
}

export const Events = {
	list: listEvents,
	get: getEvent,
};
