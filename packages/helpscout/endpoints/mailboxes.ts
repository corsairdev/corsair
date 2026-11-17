import { logEventFromContext } from 'corsair/core';
import { makeHelpscoutRequest } from '../client';
import type { HelpScoutEndpoints } from '../index';
import type { HelpScoutEndpointOutputs } from './types';
import {
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
} from './types';

export const list: HelpScoutEndpoints['mailboxes.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['mailboxes.list'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['mailboxes.list']
	>('/mailboxes', ctx.key, {
		method: 'GET',
		query: {
			page: parsedInput.page,
		},
	});

	const parsed =
		HelpScoutEndpointOutputSchemas['mailboxes.list'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.mailboxes.list',
		{ count: parsed._embedded.mailboxes.length },
		'completed',
	);

	return parsed;
};

export const get: HelpScoutEndpoints['mailboxes.get'] = async (ctx, input) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['mailboxes.get'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['mailboxes.get']
	>(
		`/mailboxes/${encodeURIComponent(String(parsedInput.mailboxId))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed =
		HelpScoutEndpointOutputSchemas['mailboxes.get'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.mailboxes.get',
		{ mailboxId: parsed.id },
		'completed',
	);

	return parsed;
};
