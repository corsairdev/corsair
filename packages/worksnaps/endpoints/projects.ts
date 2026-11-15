import type { WorksnapsEndpoints } from '..';
import { segment } from '../client';
import { toXml } from '../xml';
import { call } from './call';
import {
	WorksnapsEndpointInputSchemas as Inputs,
	WorksnapsEndpointOutputSchemas as Outputs,
} from './types';

export const list: WorksnapsEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		({ include_user_assignment }) => ({
			method: 'GET',
			path: '/projects.xml',
			query: {
				include_user_assignment: include_user_assignment ? 1 : undefined,
			},
		}),
		{
			log: (_, result) => ({ count: result.projects?.length ?? 0 }),
		},
	);

export const get: WorksnapsEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		({ project_id }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}.xml`,
		}),
		{
			log: (_, result) => ({
				id: result.project?.id ?? undefined,
				name: result.project?.name ?? undefined,
			}),
		},
	);

export const create: WorksnapsEndpoints['projectsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectsCreate,
			output: Outputs.projectsCreate,
		},
		input,
		({ name, description }) => ({
			method: 'POST',
			path: '/projects.xml',
			body: toXml('project', { name, description }),
		}),
		{
			log: (parsed, result) => ({
				id: result.project?.id ?? undefined,
				name: parsed.name,
			}),
		},
	);

/**
 * Updates a project. Only the fields given are written, which is why an update
 * with no field is rejected before the request.
 */
export const update: WorksnapsEndpoints['projectsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs.projectsUpdate,
			output: Outputs.projectsUpdate,
		},
		input,
		({ project_id, name, description, status }) => ({
			method: 'PUT',
			path: `/projects/${segment(project_id)}.xml`,
			body: toXml('project', { name, description, status }),
		}),
		{
			log: (parsed, result) => ({
				id: result.project?.id ?? parsed.project_id,
				name: result.project?.name ?? undefined,
			}),
		},
	);

/**
 * The API archives the project rather than deleting it: it is marked archived
 * and drops out of projects.list. projects.update with status 'active'
 * restores it.
 */
export const remove: WorksnapsEndpoints['projectsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.delete',
			input: Inputs.projectsDelete,
			output: Outputs.projectsDelete,
		},
		input,
		({ project_id }) => ({
			method: 'DELETE',
			path: `/projects/${segment(project_id)}.xml`,
		}),
		{
			// A delete answers 200 with an empty body.
			shape: (_, parsed) => ({ id: parsed.project_id, deleted: true }),
			log: ({ project_id }) => ({ id: project_id }),
		},
	);
