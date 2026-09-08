import { logEventFromContext } from 'corsair/core';
import { makeLeexiRequest, resolveLeexiCredentials } from '../client';
import type { LeexiEndpoints } from '../index';
import { LeexiEndpointInputSchemas, LeexiEndpointOutputSchemas } from './types';

/**
 * Meeting URLs (Zoom, Teams, Google Meet) can embed a passcode, access
 * token, or other signed query parameters. Only the hostname is safe to
 * persist in the Corsair audit log — never the full URL, path, or query
 * string. Returns `undefined` when the URL can't be parsed rather than
 * falling back to any part of the raw string.
 */
function safeMeetingUrlHost(meetingUrl: string): string | undefined {
	try {
		return new URL(meetingUrl).hostname;
	} catch {
		return undefined;
	}
}

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
		{
			user_uuid: parsed.user_uuid,
			meeting_host: safeMeetingUrlHost(parsed.meeting_url),
			to_record: parsed.to_record,
		},
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
