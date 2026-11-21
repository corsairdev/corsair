import type { ParsioEndpoints } from '..';
import { call } from './call';
import {
	ParsioEndpointInputSchemas as Inputs,
	ParsioEndpointOutputSchemas as Outputs,
} from './types';

export const getParsed: ParsioEndpoints['dataGetParsed'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'data.getParsed',
			input: Inputs.dataGetParsed,
			output: Outputs.dataGetParsed,
		},
		input,
		({ mailboxId, ...query }) => ({
			method: 'GET',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}/parsed`,
			query,
		}),
		{ log: (_, page) => ({ count: page.docs.length }) },
	);

export const listEmails: ParsioEndpoints['dataListEmails'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'data.listEmails',
			input: Inputs.dataListEmails,
			output: Outputs.dataListEmails,
		},
		input,
		({ mailboxId }) => ({
			method: 'GET',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}/emails`,
		}),
		{ log: (_, emails) => ({ count: emails.length }) },
	);
