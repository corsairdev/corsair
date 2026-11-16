import { logEventFromContext } from 'corsair/core';
import type { HelpwiseEndpoint } from '..';
import { HELPWISE_APP_BASE, makeHelpwiseRequest } from '../client';
import type { InboxesGetResponse, InboxesListResponse } from './types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './types';

export const list: HelpwiseEndpoint<'inboxes.list'> = async (ctx, input) => {
	const parsedInput = HelpwiseEndpointInputSchemas['inboxes.list'].parse(input);
	const response = await makeHelpwiseRequest<InboxesListResponse>(
		'/dev-apis/mailboxes/list',
		ctx.key,
		{
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: parsedInput,
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['inboxes.list'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.inboxes.list',
		{ count: (parsed.data ?? parsed.mailboxes)?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const get: HelpwiseEndpoint<'inboxes.get'> = async (ctx, input) => {
	const parsedInput = HelpwiseEndpointInputSchemas['inboxes.get'].parse(input);
	const response = await makeHelpwiseRequest<InboxesGetResponse>(
		'/dev-apis/mailboxes/get',
		ctx.key,
		{
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: parsedInput,
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['inboxes.get'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.inboxes.get',
		{ id: parsedInput.id },
		'completed',
	);
	return parsed;
};
