import { z } from 'zod';
import type { DocRaptorEndpoints } from '..';
import { call } from './call';
import {
	DocRaptorEndpointInputSchemas as Inputs,
	DocRaptorEndpointOutputSchemas as Outputs,
} from './types';

// Public endpoint on the marketing host; the standard auth header is sent
// anyway and DocRaptor ignores it here.
export const list: DocRaptorEndpoints['ipsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ips.list',
			input: Inputs.ipsList,
			output: Outputs.ipsList,
		},
		input,
		() => ({ method: 'GET', host: 'site', path: '/ips.json' }),
		{
			shape: (raw) => ({ ips: z.array(z.string()).parse(raw) }),
			log: (_, result) => ({ count: result.ips.length }),
		},
	);
