import type { LoopsEndpoints } from '..';
import { call } from './call';
import {
	LoopsEndpointInputSchemas as Inputs,
	LoopsEndpointOutputSchemas as Outputs,
} from './types';

export const verifyConnection: LoopsEndpoints['apikeyVerifyConnection'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apikey.verifyConnection',
			input: Inputs.apikeyVerifyConnection,
			output: Outputs.apikeyVerifyConnection,
		},
		input,
		() => ({ method: 'GET', path: '/v1/api-key' }),
		{
			log: (_parsed, result) => ({ teamName: result.teamName }),
		},
	);
