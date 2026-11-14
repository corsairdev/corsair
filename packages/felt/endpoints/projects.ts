import { logEventFromContext } from 'corsair/core';
import { makeFeltRequest } from '../client';
import type { FeltEndpoints } from '../index';
import type { Project, ProjectReference } from './types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './types';

export const Projects = {
	list: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.projectsList.parse(rawInput);
		const response = await makeFeltRequest<ProjectReference[]>(
			'/projects',
			ctx.key,
			{
				method: 'GET',
				query: input.workspace_id
					? { workspace_id: input.workspace_id }
					: undefined,
			},
		);
		const parsed = FeltEndpointOutputSchemas.projectsList.parse(response);
		await logEventFromContext(
			ctx,
			'felt.projects.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['projectsList'],

	create: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.projectsCreate.parse(rawInput);
		const response = await makeFeltRequest<Project>('/projects', ctx.key, {
			method: 'POST',
			body: input,
		});
		const parsed = FeltEndpointOutputSchemas.projectsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.projects.create',
			{ id: parsed.id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['projectsCreate'],

	get: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.projectsGet.parse(rawInput);
		const response = await makeFeltRequest<Project>(
			`/projects/${encodeURIComponent(input.project_id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.projectsGet.parse(response);
		await logEventFromContext(
			ctx,
			'felt.projects.get',
			{ id: input.project_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['projectsGet'],

	update: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.projectsUpdate.parse(rawInput);
		const { project_id, ...body } = input;
		const response = await makeFeltRequest<Project>(
			`/projects/${encodeURIComponent(project_id)}/update`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = FeltEndpointOutputSchemas.projectsUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.projects.update',
			{ id: project_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['projectsUpdate'],

	delete: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.projectsDelete.parse(rawInput);
		await makeFeltRequest<void>(
			`/projects/${encodeURIComponent(input.project_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.projectsDelete.parse({
			success: true,
			id: input.project_id,
		});
		await logEventFromContext(
			ctx,
			'felt.projects.delete',
			{ id: input.project_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['projectsDelete'],
};
