import { logEventFromContext } from 'corsair/core';
import { makeLeexiRequest, resolveLeexiCredentials } from '../client';
import type { LeexiEndpoints } from '../index';
import { LeexiEndpointInputSchemas, LeexiEndpointOutputSchemas } from './types';

export const list: LeexiEndpoints['meetingEventsList'] = async (ctx, input) => {
	const parsed = LeexiEndpointInputSchemas.meetingEventsList.parse(input);
	const credentials = await resolveLeexiCredentials(ctx);

	const raw = await makeLeexiRequest<unknown>('meeting_events', credentials, {
		method: 'GET',
		query: parsed,
	});
	const response = LeexiEndpointOutputSchemas.meetingEventsList.parse(raw);

	await logEventFromContext(
		ctx,
		'leexi.meetingEvents.list',
		{ ...parsed },
		'completed',
	);
	return response;
};

export const get: LeexiEndpoints['meetingEventsGet'] = async (ctx, input) => {
	const parsed = LeexiEndpointInputSchemas.meetingEventsGet.parse(input);
	const credentials = await resolveLeexiCredentials(ctx);

	const raw = await makeLeexiRequest<unknown>(
		`meeting_events/${parsed.uuid}`,
		credentials,
		{ method: 'GET' },
	);
	const response = LeexiEndpointOutputSchemas.meetingEventsGet.parse(raw);

	await logEventFromContext(
		ctx,
		'leexi.meetingEvents.get',
		{ uuid: parsed.uuid },
		'completed',
	);
	return response;
};

export const create: LeexiEndpoints['meetingEventsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = LeexiEndpointInputSchemas.meetingEventsCreate.parse(input);
	const credentials = await resolveLeexiCredentials(ctx);

	const raw = await makeLeexiRequest<unknown>('meeting_events', credentials, {
		method: 'POST',
		body: parsed,
	});
	const response = LeexiEndpointOutputSchemas.meetingEventsCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'leexi.meetingEvents.create',
		{ meeting_url: parsed.meeting_url, user_uuid: parsed.user_uuid },
		'completed',
	);
	return response;
};

export const deleteMeetingEvent: LeexiEndpoints['meetingEventsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = LeexiEndpointInputSchemas.meetingEventsDelete.parse(input);
	const credentials = await resolveLeexiCredentials(ctx);

	const raw = await makeLeexiRequest<unknown>(
		`meeting_events/${parsed.uuid}`,
		credentials,
		{ method: 'DELETE' },
	);
	const response = LeexiEndpointOutputSchemas.meetingEventsDelete.parse(raw);

	await logEventFromContext(
		ctx,
		'leexi.meetingEvents.delete',
		{ uuid: parsed.uuid },
		'completed',
	);
	return response;
};
