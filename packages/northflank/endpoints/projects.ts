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

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

export const list: NorthflankEndpoint<
	ProjectsListInput,
	ProjectsListOutput
> = async (ctx, input = {}) => {
	const query: Record<string, unknown> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.per_page !== undefined) query.per_page = input.per_page;
	if (input?.cursor !== undefined) query.cursor = input.cursor;

	const res = await makeNorthflankRequest<ProjectsListOutput>(
		'projects',
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(ctx, 'northflank.projects.list', {}, 'completed');
	return res;
};

export const get: NorthflankEndpoint<
	ProjectsGetInput,
	ProjectsGetOutput
> = async (ctx, input) => {
	const res = await makeNorthflankRequest<ProjectsGetOutput>(
		`projects/${input.projectId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'northflank.projects.get',
		{ projectId: input.projectId },
		'completed',
	);
	return res;
};

export const create: NorthflankEndpoint<
	ProjectsCreateInput,
	ProjectsCreateOutput
> = async (ctx, input) => {
	const res = await makeNorthflankRequest<ProjectsCreateOutput>(
		'projects',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'northflank.projects.create',
		{ name: input.name, region: input.region },
		'completed',
	);
	return res;
};

export const update: NorthflankEndpoint<
	ProjectsUpdateInput,
	ProjectsUpdateOutput
> = async (ctx, input) => {
	const { projectId, ...body } = input;
	const res = await makeNorthflankRequest<ProjectsUpdateOutput>(
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
	return res;
};

export const ProjectsEndpoints = {
	list,
	get,
	create,
	update,
} as const;
