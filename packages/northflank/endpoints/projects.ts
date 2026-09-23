import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type {
	ProjectsCreateInput,
	ProjectsCreateOrUpdateInput,
	ProjectsCreateOrUpdateOutput,
	ProjectsCreateOutput,
	ProjectsDeleteInput,
	ProjectsDeleteOutput,
	ProjectsGetInput,
	ProjectsGetOutput,
	ProjectsListInput,
	ProjectsListOutput,
	ProjectsUpdateInput,
	ProjectsUpdateOutput,
} from './types';
import {
	ProjectsCreateInputSchema,
	ProjectsCreateOrUpdateInputSchema,
	ProjectsCreateOrUpdateOutputSchema,
	ProjectsCreateOutputSchema,
	ProjectsDeleteInputSchema,
	ProjectsDeleteOutputSchema,
	ProjectsGetInputSchema,
	ProjectsGetOutputSchema,
	ProjectsListInputSchema,
	ProjectsListOutputSchema,
	ProjectsUpdateInputSchema,
	ProjectsUpdateOutputSchema,
} from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

type PaginationQuery = {
	page?: number;
	per_page?: number;
	cursor?: string;
};

function toPaginationQuery(input: PaginationQuery): PaginationQuery {
	const query: PaginationQuery = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	if (input.cursor !== undefined) query.cursor = input.cursor;
	return query;
}

export const list: NorthflankEndpoint<
	ProjectsListInput,
	ProjectsListOutput
> = async (ctx, input = {}) => {
	const validatedInput = ProjectsListInputSchema.parse(input);

	const res = await makeNorthflankRequest<ProjectsListOutput>(
		'projects',
		ctx.key,
		{
			method: 'GET',
			query: toPaginationQuery(validatedInput ?? {}),
		},
	);

	const parsedProjects = ProjectsListOutputSchema.parse(res);
	await logEventFromContext(ctx, 'northflank.projects.list', {}, 'completed');
	return parsedProjects;
};

export const get: NorthflankEndpoint<
	ProjectsGetInput,
	ProjectsGetOutput
> = async (ctx, input) => {
	const validatedInput = ProjectsGetInputSchema.parse(input);
	const res = await makeNorthflankRequest<ProjectsGetOutput>(
		`projects/${encodeURIComponent(validatedInput.projectId)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'northflank.projects.get',
		{ projectId: validatedInput.projectId },
		'completed',
	);
	return ProjectsGetOutputSchema.parse(res);
};

export const create: NorthflankEndpoint<
	ProjectsCreateInput,
	ProjectsCreateOutput
> = async (ctx, input) => {
	const validatedInput = ProjectsCreateInputSchema.parse(input);
	const res = await makeNorthflankRequest<ProjectsCreateOutput>(
		'projects',
		ctx.key,
		{
			method: 'POST',
			body: validatedInput,
		},
	);

	await logEventFromContext(
		ctx,
		'northflank.projects.create',
		{ name: validatedInput.name, region: validatedInput.region },
		'completed',
	);
	return ProjectsCreateOutputSchema.parse(res);
};

// PUT /v1/projects — upsert keyed by name in the body.
// Docs: /docs/v1/api/team/projects/create-or-update-project
export const createOrUpdate: NorthflankEndpoint<
	ProjectsCreateOrUpdateInput,
	ProjectsCreateOrUpdateOutput
> = async (ctx, input) => {
	const validatedInput = ProjectsCreateOrUpdateInputSchema.parse(input);
	const res = await makeNorthflankRequest<ProjectsCreateOrUpdateOutput>(
		'projects',
		ctx.key,
		{
			method: 'PUT',
			body: validatedInput,
		},
	);

	await logEventFromContext(
		ctx,
		'northflank.projects.createOrUpdate',
		{ name: validatedInput.name },
		'completed',
	);
	return ProjectsCreateOrUpdateOutputSchema.parse(res);
};

export const update: NorthflankEndpoint<
	ProjectsUpdateInput,
	ProjectsUpdateOutput
> = async (ctx, input) => {
	const validatedInput = ProjectsUpdateInputSchema.parse(input);
	const { projectId, ...body } = validatedInput;
	const res = await makeNorthflankRequest<ProjectsUpdateOutput>(
		`projects/${encodeURIComponent(projectId)}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'northflank.projects.update',
		{ projectId },
		'completed',
	);
	return ProjectsUpdateOutputSchema.parse(res);
};

// DELETE /v1/projects/{projectId} — fails on non-empty projects unless
// delete_child_objects is true.
// Docs: /docs/v1/api/team/projects/delete-project
export const remove: NorthflankEndpoint<
	ProjectsDeleteInput,
	ProjectsDeleteOutput
> = async (ctx, input) => {
	const validatedInput = ProjectsDeleteInputSchema.parse(input);
	const res = await makeNorthflankRequest<ProjectsDeleteOutput>(
		`projects/${encodeURIComponent(validatedInput.projectId)}`,
		ctx.key,
		{
			method: 'DELETE',
			query:
				validatedInput.delete_child_objects === undefined
					? {}
					: { delete_child_objects: validatedInput.delete_child_objects },
		},
	);

	await logEventFromContext(
		ctx,
		'northflank.projects.delete',
		{ projectId: validatedInput.projectId },
		'completed',
	);
	return ProjectsDeleteOutputSchema.parse(res);
};

export const ProjectsEndpoints = {
	list,
	get,
	create,
	createOrUpdate,
	update,
	delete: remove,
} as const;
