import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import {
	classicKey,
	makeHoneyHiveRequest,
	resolveDataPlaneKey,
	resolveDataPlaneUrl,
} from '../client';
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
import {
	HoneyHiveEndpointInputSchemas,
	HoneyHiveEndpointOutputSchemas,
} from './types';

export async function createEvent(
	ctx: HoneyHiveContext,
	input: EventsCreateInput,
): Promise<EventsCreateResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.eventsCreate.parse(input);
	const response = await makeHoneyHiveRequest<EventsCreateResponse>(
		'/v1/events',
		classicKey(ctx),
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body: parsedInput,
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.eventsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.events.create',
		{ event_id: parsed.event_id },
		'completed',
	);

	return parsed;
}

export async function createEventBatch(
	ctx: HoneyHiveContext,
	input: EventsCreateBatchInput,
): Promise<EventsCreateBatchResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.eventsCreateBatch.parse(input);
	const response = await makeHoneyHiveRequest<EventsCreateBatchResponse>(
		'/v1/events/batch',
		classicKey(ctx),
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body: parsedInput,
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.eventsCreateBatch.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.events.createBatch',
		{ count: parsedInput.events.length },
		'completed',
	);

	return parsed;
}

export async function getEvent(
	ctx: HoneyHiveContext,
	input: EventsGetInput,
): Promise<EventsGetResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.eventsGet.parse(input);
	const response = await makeHoneyHiveRequest<EventsGetResponse>(
		`/v1/projects/${encodeURIComponent(parsedInput.project_id)}/events/${encodeURIComponent(parsedInput.event_id)}`,
		await resolveDataPlaneKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx) },
	);
	const parsed = HoneyHiveEndpointOutputSchemas.eventsGet.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.events.get',
		{ project_id: parsedInput.project_id, event_id: parsedInput.event_id },
		'completed',
	);

	return parsed;
}

export async function getEventLegacy(
	ctx: HoneyHiveContext,
	input: EventsGetLegacyInput,
): Promise<EventsGetResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.eventsGetLegacy.parse(input);
	const response = await makeHoneyHiveRequest<EventsGetResponse>(
		`/v1/events/${encodeURIComponent(parsedInput.event_id)}`,
		classicKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx) },
	);
	const parsed = HoneyHiveEndpointOutputSchemas.eventsGetLegacy.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.events.getLegacy',
		{ event_id: parsedInput.event_id },
		'completed',
	);

	return parsed;
}

export async function updateEvent(
	ctx: HoneyHiveContext,
	input: EventsUpdateInput,
): Promise<EventsUpdateResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.eventsUpdate.parse(input);
	const { event_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<EventsUpdateResponse>(
		`/v1/events/${encodeURIComponent(event_id)}`,
		classicKey(ctx),
		{
			method: 'PUT',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body,
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.eventsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.events.update',
		{ event_id },
		'completed',
	);

	return parsed;
}

export async function searchEvents(
	ctx: HoneyHiveContext,
	input: EventsSearchInput,
): Promise<EventsSearchResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.eventsSearch.parse(input);
	const { project_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<EventsSearchResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/events/search`,
		await resolveDataPlaneKey(ctx),
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body,
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.eventsSearch.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.events.search',
		{ project_id, count: parsed.count ?? parsed.events?.length },
		'completed',
	);

	return parsed;
}

export async function searchEventsLegacy(
	ctx: HoneyHiveContext,
	input: EventsSearchLegacyInput,
): Promise<EventsSearchResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.eventsSearchLegacy.parse(input);
	const response = await makeHoneyHiveRequest<EventsSearchResponse>(
		'/v1/events/search',
		classicKey(ctx),
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body: parsedInput,
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.eventsSearchLegacy.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.events.searchLegacy',
		{ count: parsed.count ?? parsed.events?.length },
		'completed',
	);

	return parsed;
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
