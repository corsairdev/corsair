import type { SpotlightrEndpoints } from '..';
import { call } from './call';
import {
	SpotlightrEndpointInputSchemas,
	SpotlightrEndpointOutputSchemas,
} from './types';

export const list: SpotlightrEndpoints['projectsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: SpotlightrEndpointInputSchemas.listGroups,
			output: SpotlightrEndpointOutputSchemas.listGroups,
		},
		input,
		() => ({ method: 'GET', path: 'groups' }),
		{ log: (_parsed, result) => ({ projects: result.length }) },
	);

export const create: SpotlightrEndpoints['projectsCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: SpotlightrEndpointInputSchemas.createGroup,
			output: SpotlightrEndpointOutputSchemas.createGroup,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'groups',
			formData: { name: parsed.name },
		}),
		// The project name is customer content, so only the new id is logged.
		{
			log: (_parsed, result) => ({
				project_id: typeof result === 'number' ? result : undefined,
			}),
		},
	);
