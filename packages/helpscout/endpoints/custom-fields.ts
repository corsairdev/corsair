import { logEventFromContext } from 'corsair/core';
import { makeHelpscoutRequest } from '../client';
import type { HelpScoutEndpoints } from '../index';
import type { HelpScoutEndpointOutputs } from './types';
import {
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
} from './types';

export const list: HelpScoutEndpoints['customFields.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customFields.list'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customFields.list']
	>(
		`/mailboxes/${encodeURIComponent(String(parsedInput.mailboxId))}/fields`,
		ctx.key,
		{
			method: 'GET',
			query: {
				page: parsedInput.page,
			},
		},
	);

	const parsed =
		HelpScoutEndpointOutputSchemas['customFields.list'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.customFields.list',
		{
			mailboxId: parsedInput.mailboxId,
			count: parsed._embedded.fields.length,
		},
		'completed',
	);

	return parsed;
};
