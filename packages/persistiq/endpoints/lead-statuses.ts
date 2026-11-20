import type { PersistiqEndpoints } from '..';
import { call } from './call';
import {
	PersistiqEndpointInputSchemas as Inputs,
	PersistiqEndpointOutputSchemas as Outputs,
} from './types';

export const list: PersistiqEndpoints['leadStatusesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leadStatuses.list',
			input: Inputs.leadStatusesList,
			output: Outputs.leadStatusesList,
		},
		input,
		() => ({ method: 'GET', path: '/v1/lead_statuses' }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);
