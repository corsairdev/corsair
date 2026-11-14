import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import { makeHoneyHiveRequest, resolveDataPlaneUrl } from '../client';
import type {
	SessionsCreateEventBatchInput,
	SessionsCreateEventBatchResponse,
	SessionsCreateInput,
	SessionsCreateResponse,
} from './types';
import {
	HoneyHiveEndpointInputSchemas,
	HoneyHiveEndpointOutputSchemas,
} from './types';

export async function createSession(
	ctx: HoneyHiveContext,
	input: SessionsCreateInput,
): Promise<SessionsCreateResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.sessionsCreate.parse(input);
	const response = await makeHoneyHiveRequest<SessionsCreateResponse>(
		'/v1/sessions',
		ctx.key,
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body: parsedInput,
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.sessionsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.sessions.create',
		{
			session_id: parsed.session_id,
			event_id: parsed.event_id,
		},
		'completed',
	);

	return parsed;
}

export async function createSessionEventBatch(
	ctx: HoneyHiveContext,
	input: SessionsCreateEventBatchInput,
): Promise<SessionsCreateEventBatchResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.sessionsCreateEventBatch.parse(input);
	const response = await makeHoneyHiveRequest<SessionsCreateEventBatchResponse>(
		`/v1/sessions/${encodeURIComponent(parsedInput.session_id)}/events/batch`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body: { events: parsedInput.events },
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.sessionsCreateEventBatch.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.sessions.createEventBatch',
		{
			session_id: parsedInput.session_id,
			count: parsedInput.events.length,
		},
		'completed',
	);

	return parsed;
}

export const Sessions = {
	create: createSession,
	createEventBatch: createSessionEventBatch,
};
