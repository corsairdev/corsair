import type { ListcleanEndpoints } from '..';
import { envelopeData } from '../client';
import { call } from './call';
import {
	ListcleanEndpointInputSchemas as Inputs,
	ListcleanEndpointOutputSchemas as Outputs,
} from './types';

export const getCredits: ListcleanEndpoints['accountGetCredits'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.getCredits',
			input: Inputs.accountGetCredits,
			output: Outputs.accountGetCredits,
		},
		input,
		() => ({ method: 'GET', path: '/credits', replayable: true }),
		{
			shape: envelopeData,
			log: (_, result) => ({ credits: result.credits }),
		},
	);
