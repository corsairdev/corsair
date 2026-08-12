import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import type { TogglEndpointOutputs } from './types';

/**
 * Toggl's transactional mail ("smail") endpoints.
 *
 * Every operation here causes Toggl to send a real email, so they are marked
 * `write` and are covered by mocked tests only — the live integration suite
 * deliberately never calls them. Recipient addresses and message bodies are
 * kept out of the event log for the same reason the profile endpoints are.
 */

export const sendDemo: TogglEndpoints['smailSendDemo'] = async (ctx, input) => {
	await makeTogglRequest<unknown>('smail/demo', ctx.key, {
		method: 'POST',
		body: {
			email: input.email,
			name: input.name,
			company: input.company,
			message: input.message,
		},
	});

	await logEventFromContext(
		ctx,
		'toggl.smail.sendDemo',
		auditPayload(input, []),
		'completed',
	);
	return { ok: true } satisfies TogglEndpointOutputs['smailSendDemo'];
};

export const sendContact: TogglEndpoints['smailSendContact'] = async (
	ctx,
	input,
) => {
	await makeTogglRequest<unknown>('smail/contact', ctx.key, {
		method: 'POST',
		body: {
			email: input.email,
			name: input.name,
			message: input.message,
		},
	});

	await logEventFromContext(
		ctx,
		'toggl.smail.sendContact',
		auditPayload(input, []),
		'completed',
	);
	return { ok: true } satisfies TogglEndpointOutputs['smailSendContact'];
};

export const sendMeet: TogglEndpoints['smailSendMeet'] = async (ctx, input) => {
	await makeTogglRequest<unknown>('smail/meet', ctx.key, {
		method: 'POST',
		body: {
			email: input.email,
			name: input.name,
			location: input.location,
		},
	});

	await logEventFromContext(
		ctx,
		'toggl.smail.sendMeet',
		auditPayload(input, ['location']),
		'completed',
	);
	return { ok: true } satisfies TogglEndpointOutputs['smailSendMeet'];
};
