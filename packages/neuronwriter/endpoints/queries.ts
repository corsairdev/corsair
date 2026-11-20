import type { NeuronwriterEndpoints } from '..';
import { asList, call } from './call';
import {
	NeuronwriterEndpointInputSchemas as Inputs,
	NeuronwriterEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Lists the queries in a project. Filtering by `tags` needs every tag present;
 * a single string and a list of one behave the same.
 */
export const list: NeuronwriterEndpoints['queriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'queries.list',
			input: Inputs.queriesList,
			output: Outputs.queriesList,
		},
		input,
		(body) => ({ method: 'list-queries', body }),
		{
			shape: (raw) => ({ queries: asList(raw, 'query') }),
			log: (_, result) => ({ count: result.queries.length }),
		},
	);
