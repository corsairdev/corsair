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

/** Requests a product demo through Toggl's transactional mail service. */
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

/** Sends a message to a named contact through Toggl's mail service. */
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

/** Sends a meeting invitation through Toggl's mail service. */
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
		// A meeting location can carry a street address, so it is recorded as a
		// supplied field name only — never as an identifier value.
		auditPayload(input, []),
		'completed',
	);
	return { ok: true } satisfies TogglEndpointOutputs['smailSendMeet'];
};
