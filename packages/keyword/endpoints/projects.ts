import type { KeywordEndpoints } from '..';
import { projectSegment } from '../client';
import { call, dropUndefined, resourceBody } from './call';
import {
	KeywordEndpointInputSchemas as Inputs,
	KeywordEndpointOutputSchemas as Outputs,
} from './types';

export const list: KeywordEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		() => ({ method: 'GET', path: '/groups/active' }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: KeywordEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		({ projectName }) => ({
			method: 'GET',
			path: `/groups/${projectSegment(projectName)}`,
		}),
		{
			log: (_, result) => ({
				projectId: result.data.attributes.project_id ?? undefined,
			}),
		},
	);

export const create: KeywordEndpoints['projectsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectsCreate,
			output: Outputs.projectsCreate,
		},
		input,
		({ category, ...attributes }) => ({
			method: 'POST',
			path: '/groups',
			body: resourceBody('group', dropUndefined({ category, ...attributes })),
		}),
		{
			log: (_, result) => ({
				projectId: result.data.attributes.project_id ?? undefined,
			}),
		},
	);

// Archiving is a PUT on the group with `status: 2`, which is how Keyword
// documents it. `restore` undoes it.
export const archive: KeywordEndpoints['projectsArchive'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.archive',
			input: Inputs.projectsArchive,
			output: Outputs.projectsArchive,
		},
		input,
		({ projectName }) => ({
			method: 'PUT',
			path: `/groups/${projectSegment(projectName)}`,
			body: resourceBody('group', { status: 2 }),
		}),
		{ log: ({ projectName }) => ({ projectName }) },
	);

export const remove: KeywordEndpoints['projectsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.delete',
			input: Inputs.projectsRemove,
			output: Outputs.projectsRemove,
		},
		input,
		({ projectName }) => ({
			method: 'DELETE',
			path: `/groups/${projectSegment(projectName)}`,
		}),
		{ log: ({ projectName }) => ({ projectName }) },
	);

export const restore: KeywordEndpoints['projectsRestore'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.restore',
			input: Inputs.projectsRestore,
			output: Outputs.projectsRestore,
		},
		input,
		({ projectName }) => ({
			method: 'GET',
			path: `/groups/${projectSegment(projectName)}/undo/archive`,
		}),
		{ log: ({ projectName }) => ({ projectName }) },
	);
