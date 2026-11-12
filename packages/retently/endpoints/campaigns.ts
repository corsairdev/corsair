import type { RetentlyEndpoints } from '..';
import { call } from './call';
import {
	RetentlyEndpointInputSchemas as Inputs,
	RetentlyEndpointOutputSchemas as Outputs,
} from './types';

export const list: RetentlyEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
		},
		input,
		() => ({ method: 'GET', path: '/campaigns', replayable: true }),
		{
			log: (_, result) => ({ count: result.campaigns?.length ?? 0 }),
		},
	);
