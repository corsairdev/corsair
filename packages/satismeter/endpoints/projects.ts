import type { SatisMeterEndpoints } from '..';
import { call } from './call';
import {
	SatisMeterEndpointInputSchemas as Inputs,
	SatisMeterEndpointOutputSchemas as Outputs,
} from './types';

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

export const getProject: SatisMeterEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		({ projectId }) => ({
			method: 'GET',
			path: `/projects/${segment(projectId)}`,
		}),
		{
			shape: (envelope) => ({ project: envelope.data }),
			log: (parsed) => ({ projectId: parsed.projectId }),
		},
	);
