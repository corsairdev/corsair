import type { Smtp2goEndpoints } from '..';
import { pickBody } from '../client';
import { call } from './call';
import {
	Smtp2goEndpointInputSchemas as Inputs,
	Smtp2goEndpointOutputSchemas as Outputs,
} from './types';

export const list: Smtp2goEndpoints['suppressionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'suppressions.list',
			input: Inputs.suppressionsList,
			output: Outputs.suppressionsList,
		},
		input,
		(parsed) => ({
			path: '/suppression/view',
			body: pickBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({ returned: result.data.results.length }),
		},
	);

export const add: Smtp2goEndpoints['suppressionsAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'suppressions.add',
			input: Inputs.suppressionsAdd,
			output: Outputs.suppressionsAdd,
		},
		input,
		(parsed) => ({
			path: '/suppression/add',
			body: pickBody(parsed),
			replayable: false,
		}),
		{},
	);

export const remove: Smtp2goEndpoints['suppressionsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'suppressions.remove',
			input: Inputs.suppressionsRemove,
			output: Outputs.suppressionsRemove,
		},
		input,
		(parsed) => ({
			path: '/suppression/remove',
			body: pickBody(parsed),
			replayable: false,
		}),
		{},
	);
