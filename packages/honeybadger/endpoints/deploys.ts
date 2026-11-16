import type { HoneybadgerEndpoints } from '..';
import { segment } from '../client';
import { call, confirmDeleted } from './call';
import {
	HoneybadgerEndpointInputSchemas as Inputs,
	HoneybadgerEndpointOutputSchemas as Outputs,
} from './types';

function projectPath(projectId: string, suffix: string): string {
	return `/projects/${segment(projectId)}/${suffix}`;
}

export const deploysList: HoneybadgerEndpoints['deploysList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deploys.list',
			input: Inputs['deploys.list'],
			output: Outputs['deploys.list'],
		},
		input,
		({ project_id, limit, before, after, environment, local_username }) => ({
			method: 'GET',
			path: projectPath(project_id, 'deploys'),
			query: { limit, before, after, environment, local_username },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const deploysGet: HoneybadgerEndpoints['deploysGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deploys.get',
			input: Inputs['deploys.get'],
			output: Outputs['deploys.get'],
		},
		input,
		({ project_id, deploy_id }) => ({
			method: 'GET',
			path: projectPath(project_id, `deploys/${segment(deploy_id)}`),
		}),
		{ log: ({ deploy_id }) => ({ deployId: deploy_id }) },
	);

export const deploysDelete: HoneybadgerEndpoints['deploysDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'deploys.delete',
			input: Inputs['deploys.delete'],
			output: Outputs['deploys.delete'],
		},
		input,
		({ project_id, deploy_id }) => ({
			method: 'DELETE',
			path: projectPath(project_id, `deploys/${segment(deploy_id)}`),
		}),
		{
			shape: (raw, { project_id, deploy_id }) =>
				confirmDeleted(raw, { project_id, deploy_id }),
			log: ({ deploy_id }) => ({ deployId: deploy_id }),
		},
	);
