import type { PersistiqEndpoints } from '..';
import { call } from './call';
import {
	PersistiqEndpointInputSchemas as Inputs,
	PersistiqEndpointOutputSchemas as Outputs,
} from './types';

export const list: PersistiqEndpoints['leadFieldsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leadFields.list',
			input: Inputs.leadFieldsList,
			output: Outputs.leadFieldsList,
		},
		input,
		() => ({ method: 'GET', path: '/v1/lead_fields' }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);
