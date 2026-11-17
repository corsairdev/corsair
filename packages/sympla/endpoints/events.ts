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

/** Saves each event's id and name. Replies without a name are skipped. */
async function storeEvents(
	ctx: SymplaContext,
	events: SymplaEvent[],
): Promise<void> {
	if (!ctx.db?.events) return;
	for (const event of events) {
		const id = String(event.id);
		// The row is the id and name only, so a reply without a name has
		// nothing to store; skipping it means a narrow read never overwrites
		// a name another request saved.
		if (event.name == null) continue;
		try {
			const row = SymplaEventEntity.safeParse({ id, name: event.name });
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
