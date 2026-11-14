import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import { makeHoneyHiveRequest } from '../client';
import type {
	EventsCreateBatchInput,
	EventsCreateBatchResponse,
	EventsCreateInput,
	EventsCreateResponse,
	EventsGetInput,
	EventsGetLegacyInput,
	EventsGetResponse,
	EventsSearchInput,
	EventsSearchLegacyInput,
	EventsSearchResponse,
	EventsUpdateInput,
	EventsUpdateResponse,
} from './types';

export async function createEvent(
	ctx: HoneyHiveContext,
	input: EventsCreateInput,
): Promise<EventsCreateResponse> {
	const response = await makeHoneyHiveRequest<EventsCreateResponse>(
		'/v1/events',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'honeyhive.events.create',
		{ event_id: response.event_id },
		'completed',
	);

	return response;
}

export async function createEventBatch(
	ctx: HoneyHiveContext,
	input: EventsCreateBatchInput,
): Promise<EventsCreateBatchResponse> {
	const response = await makeHoneyHiveRequest<EventsCreateBatchResponse>(
		'/v1/events/batch',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'honeyhive.events.createBatch',
		{ count: input.events.length },
		'completed',
	);

	return response;
}

export async function getEvent(
	ctx: HoneyHiveContext,
	input: EventsGetInput,
): Promise<EventsGetResponse> {
	const response = await makeHoneyHiveRequest<EventsGetResponse>(
		`/v1/projects/${encodeURIComponent(input.project_id)}/events/${encodeURIComponent(input.event_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.events.get',
		{ project_id: input.project_id, event_id: input.event_id },
		'completed',
	);

	return response;
}

export async function getEventLegacy(
	ctx: HoneyHiveContext,
	input: EventsGetLegacyInput,
): Promise<EventsGetResponse> {
	const response = await makeHoneyHiveRequest<EventsGetResponse>(
		`/v1/events/${encodeURIComponent(input.event_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.events.getLegacy',
		{ event_id: input.event_id },
		'completed',
	);

	return response;
}

export async function updateEvent(
	ctx: HoneyHiveContext,
	input: EventsUpdateInput,
): Promise<EventsUpdateResponse> {
	const { event_id, ...body } = input;
	const response = await makeHoneyHiveRequest<EventsUpdateResponse>(
		`/v1/events/${encodeURIComponent(event_id)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'honeyhive.events.update',
		{ event_id },
		'completed',
	);

	return response;
}

export async function searchEvents(
	ctx: HoneyHiveContext,
	input: EventsSearchInput,
): Promise<EventsSearchResponse> {
	const { project_id, ...body } = input;
	const response = await makeHoneyHiveRequest<EventsSearchResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/events/search`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'honeyhive.events.search',
		{ project_id, count: response.count ?? response.events?.length },
		'completed',
	);

	return response;
}

export async function searchEventsLegacy(
	ctx: HoneyHiveContext,
	input: EventsSearchLegacyInput,
): Promise<EventsSearchResponse> {
	const response = await makeHoneyHiveRequest<EventsSearchResponse>(
		'/v1/events/search',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'honeyhive.events.searchLegacy',
		{ count: response.count ?? response.events?.length },
		'completed',
	);

	return response;
}

export const Events = {
	create: createEvent,
	createBatch: createEventBatch,
	get: getEvent,
	getLegacy: getEventLegacy,
	update: updateEvent,
	search: searchEvents,
	searchLegacy: searchEventsLegacy,
};
