import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import { makeHoneyHiveRequest } from '../client';
import type {
	SessionsCreateEventBatchInput,
	SessionsCreateEventBatchResponse,
	SessionsCreateInput,
	SessionsCreateResponse,
} from './types';

export async function createSession(
	ctx: HoneyHiveContext,
	input: SessionsCreateInput,
): Promise<SessionsCreateResponse> {
	const response = await makeHoneyHiveRequest<SessionsCreateResponse>(
		'/v1/sessions',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'honeyhive.sessions.create',
		{
			session_id: response.session_id,
			event_id: response.event_id,
		},
		'completed',
	);

	return response;
}

export async function createSessionEventBatch(
	ctx: HoneyHiveContext,
	input: SessionsCreateEventBatchInput,
): Promise<SessionsCreateEventBatchResponse> {
	const response = await makeHoneyHiveRequest<SessionsCreateEventBatchResponse>(
		`/v1/sessions/${encodeURIComponent(input.session_id)}/events/batch`,
		ctx.key,
		{
			method: 'POST',
			body: { events: input.events },
		},
	);

	await logEventFromContext(
		ctx,
		'honeyhive.sessions.createEventBatch',
		{
			session_id: input.session_id,
			count: input.events.length,
		},
		'completed',
	);

	return response;
}

export const Sessions = {
	create: createSession,
	createEventBatch: createSessionEventBatch,
};
