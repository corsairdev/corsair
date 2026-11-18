import type { LeigaEndpoints } from '..';
import { call, wrapList } from './call';
import {
	LeigaEndpointInputSchemas as Inputs,
	LeigaEndpointOutputSchemas as Outputs,
} from './types';

export const list: LeigaEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		() => ({ method: 'GET', path: '/project/list' }),
		{
			shape: (raw) => ({ projects: wrapList(raw, 'project list') }),
			log: (_, result) => ({ count: result.projects.length }),
		},
	);

export const get: LeigaEndpoints['projectsGet'] = (ctx, input) =>
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
			path: '/project/get',
			query: { projectId },
		}),
		{ log: (_, result) => ({ projectId: result.id }) },
	);

export const getByKey: LeigaEndpoints['projectsGetByKey'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.getByKey',
			input: Inputs.projectsGetByKey,
			output: Outputs.projectsGetByKey,
		},
		input,
		({ projectKey }) => ({
			method: 'GET',
			path: '/project/get-by-project-key',
			query: { projectKey },
		}),
		{ log: (_, result) => ({ projectId: result.id }) },
	);

export const templates: LeigaEndpoints['projectsTemplates'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.templates',
			input: Inputs.projectsTemplates,
			output: Outputs.projectsTemplates,
		},
		input,
		() => ({ method: 'GET', path: '/project/project-template' }),
		{
			shape: (raw) => ({ templates: wrapList(raw, 'project template list') }),
			log: (_, result) => ({ count: result.templates.length }),
		},
	);
