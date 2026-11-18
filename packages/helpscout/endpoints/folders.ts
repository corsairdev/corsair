import { logEventFromContext } from 'corsair/core';
import { makeHelpscoutRequest } from '../client';
import type { HelpScoutEndpoints } from '../index';
import type { HelpScoutEndpointOutputs } from './types';
import {
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
} from './types';

export const list: HelpScoutEndpoints['folders.list'] = async (ctx, input) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['folders.list'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['folders.list']
	>(
		`/mailboxes/${encodeURIComponent(String(parsedInput.mailboxId))}/folders`,
		ctx.key,
		{
			method: 'GET',
			query: {
				page: parsedInput.page,
			},
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['folders.list'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.folders.list',
		{
			mailboxId: parsedInput.mailboxId,
			count: parsed._embedded.folders.length,
		},
		'completed',
	);

	return parsed;
};
