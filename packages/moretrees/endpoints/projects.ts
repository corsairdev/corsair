import type { MoreTreesEndpoints } from '..';
import { call } from './call';
import {
	MoreTreesEndpointInputSchemas as Inputs,
	MoreTreesEndpointOutputSchemas as Outputs,
} from './types';

/** Lists every active planting project with its plantable trees. */
export const list: MoreTreesEndpoints['projectsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		() => ({
			service: 'project_management',
			replayable: true,
			method: 'GET',
			path: '/projects',
		}),
		{ log: (_, result) => ({ projects: result.data.length }) },
	);

/**
 * Calculates the CO2 captured and the number of projects supported for a set
 * of tree counts, keyed by project tree ID (not tree ID: 26 and 28 answer,
 * tree IDs answer 404 MTC-0001; probed 11-26). A calculation: nothing is
 * planted or stored.
 */
export const calculateCo2: MoreTreesEndpoints['projectsCalculateCo2'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.calculateCo2',
			input: Inputs.projectsCalculateCo2,
			output: Outputs.projectsCalculateCo2,
		},
		input,
		(parsed) => ({
			service: 'project_management',
			// Read-only calculation, so a 5xx or a dropped connection replays.
			replayable: true,
			method: 'POST',
			path: '/projects/total-co2',
			body: parsed,
		}),
	);
