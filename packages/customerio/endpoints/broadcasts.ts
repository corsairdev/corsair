import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import type { CustomerioJsonObject } from '../client';
import { makeAppRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// POST /v1/campaigns/{broadcast_id}/triggers
// Docs: https://docs.customer.io/integrations/api/app/tag/send-messages/triggerBroadcast/
// Rate limit: one request every 10 seconds per broadcast.
export const triggerBroadcast: CustomerioEndpoints['triggerBroadcast'] = async (
	ctx,
	input,
) => {
	const body: CustomerioJsonObject = {};
	if (input.data !== undefined) {
		body.data = input.data;
	}
	if (input.recipients !== undefined) {
		body.recipients = input.recipients;
	}
	if (input.ids !== undefined) {
		body.ids = input.ids;
	}
	if (input.emails !== undefined) {
		body.emails = input.emails;
	}
	if (input.per_user_data !== undefined) {
		body.per_user_data = input.per_user_data;
	}
	if (input.data_file_url !== undefined) {
		body.data_file_url = input.data_file_url;
	}
	if (input.email_add_duplicates !== undefined) {
		body.email_add_duplicates = input.email_add_duplicates;
	}
	if (input.email_ignore_missing !== undefined) {
		body.email_ignore_missing = input.email_ignore_missing;
	}
	if (input.id_ignore_missing !== undefined) {
		body.id_ignore_missing = input.id_ignore_missing;
	}
	const response = await makeAppRequest<
		CustomerioEndpointOutputs['triggerBroadcast']
	>(
		`/v1/campaigns/${encodeURIComponent(String(input.broadcast_id))}/triggers`,
		ctx.key,
		{ method: 'POST', body },
	);
	// Minimal logging: the audience (emails, ids, per-user data) is PII, so
	// only the broadcast identifier is persisted.
	await logEventFromContext(
		ctx,
		'customerio.broadcasts.trigger',
		{ broadcast_id: input.broadcast_id },
		'completed',
	);
	return response;
};

// GET /v1/broadcasts/{broadcast_id}/triggers
// Docs: https://docs.customer.io/integrations/api/app/tag/broadcasts/listBroadcastTriggers/
export const getTriggers: CustomerioEndpoints['getTriggers'] = async (
	ctx,
	input,
) => {
	const response = await makeAppRequest<
		CustomerioEndpointOutputs['getTriggers']
	>(
		`/v1/broadcasts/${encodeURIComponent(String(input.broadcast_id))}/triggers`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'customerio.broadcasts.getTriggers',
		{ ...input },
		'completed',
	);
	return response;
};

// GET /v1/campaigns/{broadcast_id}/triggers/{trigger_id}
// Docs: https://docs.customer.io/integrations/api/app/tag/broadcasts/
export const getTrigger: CustomerioEndpoints['getTrigger'] = async (
	ctx,
	input,
) => {
	const response = await makeAppRequest<
		CustomerioEndpointOutputs['getTrigger']
	>(
		`/v1/campaigns/${encodeURIComponent(String(input.broadcast_id))}/triggers/${encodeURIComponent(String(input.trigger_id))}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'customerio.broadcasts.getTrigger',
		{ ...input },
		'completed',
	);
	return response;
};
