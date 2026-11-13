import { logEventFromContext } from 'corsair/core';
import type { FomoEndpoints } from '..';
import { makeFomoRequest } from '../client';
import type {
	EventsCreateOutput,
	EventsDeleteOutput,
	EventsGetOutput,
	EventsListOutput,
	EventsSearchOutput,
	EventsUpdateOutput,
} from './types';
import {
	EventsCreateInputSchema,
	EventsCreateOutputSchema,
	EventsDeleteInputSchema,
	EventsDeleteOutputSchema,
	EventsGetInputSchema,
	EventsGetOutputSchema,
	EventsListInputSchema,
	EventsListOutputSchema,
	EventsSearchInputSchema,
	EventsSearchOutputSchema,
	EventsUpdateInputSchema,
	EventsUpdateOutputSchema,
} from './types';

export const listEvents: FomoEndpoints['events.list'] = async (ctx, input) => {
	const parsedInput = EventsListInputSchema.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.per !== undefined) query.per = parsedInput.per;
	if (parsedInput.page !== undefined) query.page = parsedInput.page;
	if (parsedInput.show_meta !== undefined)
		query.show_meta = parsedInput.show_meta;

	const response = await makeFomoRequest<EventsListOutput>(
		'/applications/me/events',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed = EventsListOutputSchema.parse(response);

	const count = Array.isArray(parsed) ? parsed.length : parsed.events.length;
	await logEventFromContext(ctx, 'fomo.events.list', { count }, 'completed');

	return parsed;
};

export const getEvent: FomoEndpoints['events.get'] = async (ctx, input) => {
	const parsedInput = EventsGetInputSchema.parse(input);
	const response = await makeFomoRequest<EventsGetOutput>(
		`/applications/me/events/${encodeURIComponent(String(parsedInput.id))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed = EventsGetOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.events.get',
		{ eventId: parsed.id },
		'completed',
	);

	return parsed;
};

export const createEvent: FomoEndpoints['events.create'] = async (
	ctx,
	input,
) => {
	const parsedInput = EventsCreateInputSchema.parse(input);
	const response = await makeFomoRequest<EventsCreateOutput>(
		'/applications/me/events',
		ctx.key,
		{
			method: 'POST',
			body: { event: parsedInput },
		},
	);

	const parsed = EventsCreateOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.events.create',
		{ eventId: parsed.id },
		'completed',
	);

	return parsed;
};

export const updateEvent: FomoEndpoints['events.update'] = async (
	ctx,
	input,
) => {
	const parsedInput = EventsUpdateInputSchema.parse(input);
	const { id, ...eventData } = parsedInput;
	const response = await makeFomoRequest<EventsUpdateOutput>(
		`/applications/me/events/${encodeURIComponent(String(id))}`,
		ctx.key,
		{
			method: 'PATCH',
			body: { event: eventData },
		},
	);

	const parsed = EventsUpdateOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.events.update',
		{ eventId: parsed.id },
		'completed',
	);

	return parsed;
};

export const deleteEvent: FomoEndpoints['events.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput = EventsDeleteInputSchema.parse(input);
	const response = await makeFomoRequest<EventsDeleteOutput>(
		`/applications/me/events/${encodeURIComponent(String(parsedInput.id))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = EventsDeleteOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.events.delete',
		{ eventId: parsedInput.id },
		'completed',
	);

	return parsed;
};

export const searchEvents: FomoEndpoints['events.search'] = async (
	ctx,
	input,
) => {
	const parsedInput = EventsSearchInputSchema.parse(input);
	const response = await makeFomoRequest<EventsSearchOutput>(
		'/applications/me/events/find',
		ctx.key,
		{
			method: 'GET',
			query: {
				field: parsedInput.field,
				q: parsedInput.q,
			},
		},
	);

	const parsed = EventsSearchOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.events.search',
		{ field: parsedInput.field, eventId: parsed.id },
		'completed',
	);

	return parsed;
};
