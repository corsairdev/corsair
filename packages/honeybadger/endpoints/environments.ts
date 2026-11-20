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

export const environmentsList: HoneybadgerEndpoints['environmentsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'environments.list',
			input: Inputs['environments.list'],
			output: Outputs['environments.list'],
		},
		input,
		({ project_id, page, per_page }) => ({
			method: 'GET',
			path: projectPath(project_id, 'environments'),
			query: { page, per_page },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const environmentsGet: HoneybadgerEndpoints['environmentsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'environments.get',
			input: Inputs['environments.get'],
			output: Outputs['environments.get'],
		},
		input,
		({ project_id, environment_id }) => ({
			method: 'GET',
			path: projectPath(project_id, `environments/${segment(environment_id)}`),
		}),
		{ log: ({ environment_id }) => ({ environmentId: environment_id }) },
	);

export const environmentsCreate: HoneybadgerEndpoints['environmentsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'environments.create',
			input: Inputs['environments.create'],
			output: Outputs['environments.create'],
		},
		input,
		({ project_id, name, notifications }) => ({
			method: 'POST',
			path: projectPath(project_id, 'environments'),
			body: { name, notifications },
			// A second request under the same name is a conflict, not a second
			// environment, but it still fails, so it is not replayed.
			replayable: false,
		}),
		{
			log: ({ project_id }, result) => ({
				projectId: project_id,
				environmentId: result.data.id,
			}),
		},
	);

export const environmentsUpdate: HoneybadgerEndpoints['environmentsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'environments.update',
			input: Inputs['environments.update'],
			output: Outputs['environments.update'],
		},
		input,
		({ project_id, environment_id, notifications }) => ({
			method: 'PATCH',
			path: projectPath(project_id, `environments/${segment(environment_id)}`),
			body: { notifications },
			replayable: true,
		}),
		{ log: ({ environment_id }) => ({ environmentId: environment_id }) },
	);

export const environmentsDelete: HoneybadgerEndpoints['environmentsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'environments.delete',
			input: Inputs['environments.delete'],
			output: Outputs['environments.delete'],
		},
		input,
		({ project_id, environment_id }) => ({
			method: 'DELETE',
			path: projectPath(project_id, `environments/${segment(environment_id)}`),
		}),
		{
			shape: (raw, { project_id, environment_id }) =>
				confirmDeleted(raw, { project_id, environment_id }),
			log: ({ environment_id }) => ({ environmentId: environment_id }),
		},
	);

export const environmentsBulkDelete: HoneybadgerEndpoints['environmentsBulkDelete'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'environments.bulkDelete',
				input: Inputs['environments.bulkDelete'],
				output: Outputs['environments.bulkDelete'],
			},
			input,
			({ project_id, environment_ids }) => ({
				method: 'POST',
				path: projectPath(project_id, 'environments/bulk_delete'),
				body: { environment_ids },
				// Deletes by id: a repeat finds them gone and reports 0, which is
				// not the result the caller asked for.
				replayable: false,
			}),
			{ log: (_, result) => ({ count: result.data.count }) },
		);

export const environmentsBulkUpdate: HoneybadgerEndpoints['environmentsBulkUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'environments.bulkUpdate',
				input: Inputs['environments.bulkUpdate'],
				output: Outputs['environments.bulkUpdate'],
			},
			input,
			({ project_id, environment_ids, notifications }) => ({
				method: 'PATCH',
				path: projectPath(project_id, 'environments/bulk_update'),
				body: { environment_ids, notifications },
				replayable: true,
			}),
			{ log: (_, result) => ({ count: result.data.count }) },
		);
