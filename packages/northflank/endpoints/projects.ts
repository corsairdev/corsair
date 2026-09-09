import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type {
	ProjectsCreateInput,
	ProjectsCreateOutput,
	ProjectsGetInput,
	ProjectsGetOutput,
	ProjectsListInput,
	ProjectsListOutput,
	ProjectsUpdateInput,
	ProjectsUpdateOutput,
} from './types';
import {
	ProjectsCreateInputSchema,
	ProjectsCreateOutputSchema,
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

export const list: NorthflankEndpoint<
	ProjectsListInput,
	ProjectsListOutput
> = async (ctx, input = {}) => {
	const validatedInput = ProjectsListInputSchema.parse(input);
	const query: Record<string, unknown> = {};
	if (validatedInput?.page !== undefined) query.page = validatedInput.page;
	if (validatedInput?.per_page !== undefined)
		query.per_page = validatedInput.per_page;
	if (validatedInput?.cursor !== undefined)
		query.cursor = validatedInput.cursor;

	const res = await makeNorthflankRequest<unknown>('projects', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(ctx, 'northflank.projects.list', {}, 'completed');
	return ProjectsListOutputSchema.parse(res);
};

export const get: NorthflankEndpoint<
	ProjectsGetInput,
	ProjectsGetOutput
> = async (ctx, input) => {
	const validatedInput = ProjectsGetInputSchema.parse(input);
	const res = await makeNorthflankRequest<unknown>(
		`projects/${validatedInput.projectId}`,
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
	const res = await makeNorthflankRequest<unknown>('projects', ctx.key, {
		method: 'POST',
		body: validatedInput,
	});

	await logEventFromContext(
		ctx,
		'northflank.projects.create',
		{ name: validatedInput.name, region: validatedInput.region },
		'completed',
	);
	return ProjectsCreateOutputSchema.parse(res);
};

export const update: NorthflankEndpoint<
	ProjectsUpdateInput,
	ProjectsUpdateOutput
> = async (ctx, input) => {
	const validatedInput = ProjectsUpdateInputSchema.parse(input);
	const { projectId, ...body } = validatedInput;
	const res = await makeNorthflankRequest<unknown>(
		`projects/${projectId}`,
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

export const ProjectsEndpoints = {
	list,
	get,
	create,
	update,
} as const;
