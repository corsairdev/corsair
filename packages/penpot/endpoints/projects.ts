import type { PenpotEndpoints } from '..';
import { call, shapeDeleted } from './call';
import {
	PenpotEndpointInputSchemas as Inputs,
	PenpotEndpointOutputSchemas as Outputs,
} from './types';

export const listAll: PenpotEndpoints['projectsListAll'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.listAll',
			input: Inputs.projectsListAll,
			output: Outputs.projectsListAll,
		},
		input,
		() => 'get-all-projects',
		{ body: () => ({}), log: (_, projects) => ({ count: projects.length }) },
	);

export const create: PenpotEndpoints['projectsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectsCreate,
			output: Outputs.projectsCreate,
		},
		input,
		() => 'create-project',
		{
			body: (input) => input,
			log: (_, project) => ({ projectId: project.id ?? undefined }),
		},
	);

export const get: PenpotEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		() => 'get-project',
		{
			body: ({ id }) => ({ id }),
			log: (_, project) => ({ projectId: project.id ?? undefined }),
		},
	);

export const rename: PenpotEndpoints['projectsRename'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.rename',
			input: Inputs.projectsRename,
			output: Outputs.projectsRename,
		},
		input,
		() => 'rename-project',
		{
			body: (input) => input,
			shape: (raw, { id, name }) => raw ?? { id, name },
			log: (_, project) => ({ projectId: project.id ?? undefined }),
		},
	);

export const remove: PenpotEndpoints['projectsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.delete',
			input: Inputs.projectsDelete,
			output: Outputs.projectsDelete,
		},
		input,
		() => 'delete-project',
		{
			body: ({ id }) => ({ id }),
			shape: shapeDeleted,
			log: (_, result) => ({ projectId: result.id }),
		},
	);

export const duplicate: PenpotEndpoints['projectsDuplicate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.duplicate',
			input: Inputs.projectsDuplicate,
			output: Outputs.projectsDuplicate,
		},
		input,
		() => 'duplicate-project',
		{
			body: ({ id, name }) => ({ projectId: id, name }),
			log: (_, project) => ({ projectId: project.id ?? undefined }),
		},
	);
