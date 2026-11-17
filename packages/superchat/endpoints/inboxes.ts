import type { SuperchatEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SuperchatEndpointInputSchemas as Inputs,
	SuperchatEndpointOutputSchemas as Outputs,
} from './types';

export const list: SuperchatEndpoints['inboxesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inboxes.list',
			input: Inputs.inboxesList,
			output: Outputs.inboxesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/inboxes', query }),
		{ log: (_, result) => ({ count: result.results.length }) },
	);

export const get: SuperchatEndpoints['inboxesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inboxes.get',
			input: Inputs.inboxesGet,
			output: Outputs.inboxesGet,
		},
		input,
		({ inboxId }) => ({
			method: 'GET',
			path: `/inboxes/${segment(inboxId)}`,
		}),
		{ log: ({ inboxId }) => ({ inboxId }) },
	);
