import { logEventFromContext } from 'corsair/core';
import type { EmeliaEndpoints } from '..';
import { makeEmeliaRestRequest } from '../client';
import type { EmeliaEndpointOutputs } from './types';

// Legacy blacklist (/emails/blacklists/contact) — method + path verified;
// request detail NOT FOUND in static docs, body keeps the documented email.

export const add: EmeliaEndpoints['blacklistAdd'] = async (ctx, input) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['blacklistAdd']
	>('/emails/blacklists/contact', ctx.key, {
		method: 'POST',
		body: { email: input.email },
	});

	await logEventFromContext(
		ctx,
		'emelia.blacklist.add',
		// Email omitted: event payloads persist to corsair_events.
		{},
		'completed',
	);
	return response;
};

export const remove: EmeliaEndpoints['blacklistRemove'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['blacklistRemove']
	>('/emails/blacklists/contact', ctx.key, {
		method: 'DELETE',
		body: { email: input.email },
	});

	await logEventFromContext(
		ctx,
		'emelia.blacklist.remove',
		// Email omitted: event payloads persist to corsair_events.
		{},
		'completed',
	);
	return response;
};
