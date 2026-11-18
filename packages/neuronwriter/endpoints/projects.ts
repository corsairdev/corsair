import type { NeuronwriterEndpoints } from '..';
import { asList, call } from './call';
import {
	NeuronwriterEndpointInputSchemas as Inputs,
	NeuronwriterEndpointOutputSchemas as Outputs,
} from './types';

/** Lists the projects in the account, with the id every other call needs. */
export const list: NeuronwriterEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		() => ({ method: 'list-projects' }),
		{
			shape: (raw) => ({ projects: asList(raw, 'project') }),
			log: (_, result) => ({ count: result.projects.length }),
		},
	);
