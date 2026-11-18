import type { SupportbeeEndpoints } from '..';
import { call } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

/** The company's label names and colours, which a ticket can then be given. */
export const list: SupportbeeEndpoints['labelsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'labels.list',
			input: Inputs.labelsList,
			output: Outputs.labelsList,
		},
		input,
		() => ({ method: 'GET', path: '/labels' }),
		{
			log: (_, result) => ({ count: result.labels.length }),
		},
	);
