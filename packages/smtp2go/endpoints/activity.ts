import type { Smtp2goEndpoints } from '..';
import { pickBody } from '../client';
import { call } from './call';
import {
	Smtp2goEndpointInputSchemas as Inputs,
	Smtp2goEndpointOutputSchemas as Outputs,
} from './types';

export const search: Smtp2goEndpoints['activitySearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'activity.search',
			input: Inputs.activitySearch,
			output: Outputs.activitySearch,
		},
		input,
		(parsed) => ({
			path: '/activity/search',
			body: pickBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({ returned: result.data.events.length }),
		},
	);
