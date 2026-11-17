import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { ParsehubContext } from '../context';
import { ParsehubProjectEntity } from '../schema/database';
import { callParsehub, flag, requireKey } from './shared';
import type {
	GetLastReadyDataInput,
	GetLastReadyDataResponse,
	GetProjectInput,
	GetProjectResponse,
	ListProjectsInput,
	ListProjectsResponse,
	ParsehubProject,
	RunProjectInput,
	RunProjectResponse,
} from './types';
import {
	GetLastReadyDataInputSchema,
	GetLastReadyDataResponseSchema,
	GetProjectInputSchema,
	GetProjectResponseSchema,
	ListProjectsInputSchema,
	ListProjectsResponseSchema,
	RunProjectInputSchema,
	RunProjectResponseSchema,
} from './types';

export const listProjects: CorsairEndpoint<
	ParsehubContext,
	ListProjectsInput,
	ListProjectsResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListProjectsInputSchema.parse(input ?? {});
	const result = await callParsehub(
		ctx,
		'projects.list',
		{
			path: '/projects',
			query: {
				offset: parsed.offset,
				limit: parsed.limit,
				include_options: flag(parsed.include_options),
			},
		},
		ListProjectsResponseSchema,
		{ offset: parsed.offset ?? 0 },
	);
	await storeProjects(ctx, result.projects);
	return result;
};

export const getProject: CorsairEndpoint<
	ParsehubContext,
	GetProjectInput,
	GetProjectResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetProjectInputSchema.parse(input);
	const result = await callParsehub(
		ctx,
		'projects.get',
		{
			path: `/projects/${pathPart(parsed.project_token)}`,
			query: {
				offset: parsed.offset,
				include_options: flag(parsed.include_options),
			},
		},
		GetProjectResponseSchema,
		{ project_token: parsed.project_token },
	);
	await storeProjects(ctx, [result]);
	return result;
};

export const runProject: CorsairEndpoint<
	ParsehubContext,
	RunProjectInput,
	RunProjectResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = RunProjectInputSchema.parse(input);
	const sendEmail = flag(parsed.send_email);
	return callParsehub(
		ctx,
		'projects.run',
		{
			method: 'POST',
			path: `/projects/${pathPart(parsed.project_token)}/run`,
			form: {
				start_url: parsed.start_url,
				start_template: parsed.start_template,
				start_value_override:
					parsed.start_value_override === undefined
						? undefined
						: JSON.stringify(parsed.start_value_override),
				send_email: sendEmail === undefined ? undefined : String(sendEmail),
			},
		},
		RunProjectResponseSchema,
		{ project_token: parsed.project_token },
	);
};

export const getLastReadyData: CorsairEndpoint<
	ParsehubContext,
	GetLastReadyDataInput,
	GetLastReadyDataResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetLastReadyDataInputSchema.parse(input);
	return callParsehub(
		ctx,
		'projects.getLastReadyData',
		{
			path: `/projects/${pathPart(parsed.project_token)}/last_ready_run/data`,
			query: { format: parsed.format },
		},
		GetLastReadyDataResponseSchema,
		{ project_token: parsed.project_token },
	);
};

/**
 * Saves each project's token and title. A response without a title leaves
 * a stored project as it is.
 */
async function storeProjects(
	ctx: ParsehubContext,
	projects: ParsehubProject[],
): Promise<void> {
	if (!ctx.db?.projects) return;
	for (const project of projects) {
		try {
			const existing = await ctx.db.projects.findByEntityId(project.token);
			// A reply without a title carries nothing new for a stored project:
			// skip the write so it cannot put back a title another call changed.
			if (project.title == null && existing) continue;
			const row = ParsehubProjectEntity.safeParse({
				...existing?.data,
				token: project.token,
				title: project.title ?? undefined,
			});
			if (!row.success) continue;
			await ctx.db.projects.upsertByEntityId(project.token, row.data);
		} catch {
			console.warn('Failed to save ParseHub project');
		}
	}
}

export const Projects = {
	list: listProjects,
	get: getProject,
	run: runProject,
	getLastReadyData,
};
