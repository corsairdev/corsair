import type { GiteaEndpoints } from '..';
import { segment } from '../client';
import { call, pageEcho } from './call';
import {
	GiteaEndpointInputSchemas as Inputs,
	GiteaEndpointOutputSchemas as Outputs,
} from './types';

export const list: GiteaEndpoints['branchesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'branches.list',
			input: Inputs.branchesList,
			output: Outputs.branchesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/repos/${segment(parsed.owner)}/${segment(parsed.repo)}/branches`,
			query: {
				q: parsed.q,
				page: parsed.page ?? 1,
				limit: parsed.limit ?? 50,
			},
			replayable: true,
		}),
		{
			shape: (raw, parsed) => ({ branches: raw, ...pageEcho(parsed) }),
			log: (_, result) => ({ count: result.branches.length }),
		},
	);

export const Branches = { list };
