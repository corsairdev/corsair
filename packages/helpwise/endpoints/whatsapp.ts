import { logEventFromContext } from 'corsair/core';
import type { HelpwiseEndpoint } from '..';
import { HELPWISE_APP_BASE, makeHelpwiseRequest } from '../client';
import type { WhatsAppListTemplatesResponse } from './types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './types';

export const listTemplates: HelpwiseEndpoint<'whatsapp.listTemplates'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['whatsapp.listTemplates'].parse(input);
	const response = await makeHelpwiseRequest<WhatsAppListTemplatesResponse>(
		'/dev-apis/whatsapp/templates/list',
		ctx.key,
		{
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['whatsapp.listTemplates'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.whatsapp.listTemplates',
		{ mailboxId: parsedInput.mailbox_id },
		'completed',
	);
	return parsed;
};
