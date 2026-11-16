import { makeAuthenticatedVercelRequest, seg } from '../client';
import type { VercelContext } from '../index';
import { compactBody, defineEndpoint, maskCommands, pickQuery } from './common';
import {
	VercelProjectsInputSchemas as In,
	VercelProjectsOutputSchemas as Out,
} from './projects-types';

// Raw Vercel project: fields beyond id pass through to the store as is.
type ProjectRecord = { id: string; [key: string]: unknown };

// Raw list or single response item; the id is checked before it is stored.
async function saveProject(ctx: VercelContext, project: unknown) {
	const record = project as ProjectRecord | undefined;
	if (!record?.id || !ctx.db.projects) return;
	// The list and get responses carry each project's env vars; their values
	// are secrets and stay out of the local store.
	const { env: _env, ...rest } = record;
	await ctx.db.projects.upsertByEntityId(record.id, rest);
}

export const getProjects = defineEndpoint({
	event: 'vercel.projects.getProjects',
	input: In.getProjects,
	output: Out.getProjects,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest<{
			// Raw items: saveProject checks each, the output schema parses them.
			projects?: unknown[];
		}>('/v10/projects', ctx, {
			teamId: input.teamId,
			query: pickQuery(input, [
				'limit',
				'since',
				'until',
				'from',
				'search',
				'repo',
				'repoId',
				'repoUrl',
				'excludeRepos',
				'edgeConfigId',
			]),
		});
		for (const project of result?.projects ?? []) {
			await saveProject(ctx, project);
		}
		return result;
	},
});

export const getProject = defineEndpoint({
	event: 'vercel.projects.getProject',
	input: In.getProject,
	output: Out.getProject,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest(
			`/v9/projects/${seg(input.idOrName)}`,
			ctx,
			{ teamId: input.teamId, query: pickQuery(input, ['rollbackInfo']) },
		);
		await saveProject(ctx, result);
		return result;
	},
});

export const createProject = defineEndpoint({
	event: 'vercel.projects.createProject',
	input: In.createProject,
	output: Out.createProject,
	run: async (ctx, input) => {
		const { teamId, ...body } = input;
		const result = await makeAuthenticatedVercelRequest('/v11/projects', ctx, {
			method: 'POST',
			teamId,
			body: compactBody(body),
		});
		await saveProject(ctx, result);
		return result;
	},
	logInput: ({ environmentVariables, ...rest }) => ({
		...maskCommands(rest),
		environmentVariables: environmentVariables?.map(
			({ value: _v, ...env }) => env,
		),
	}),
});

export const updateProject = defineEndpoint({
	event: 'vercel.projects.updateProject',
	input: In.updateProject,
	output: Out.updateProject,
	run: async (ctx, input) => {
		const { teamId, idOrName, ...body } = input;
		const result = await makeAuthenticatedVercelRequest(
			`/v9/projects/${seg(idOrName)}`,
			ctx,
			{ method: 'PATCH', teamId, body: compactBody(body) },
		);
		await saveProject(ctx, result);
		return result;
	},
	logInput: (input) => maskCommands(input) ?? {},
});

export const deleteProject = defineEndpoint({
	event: 'vercel.projects.deleteProject',
	input: In.deleteProject,
	output: Out.deleteProject,
	run: async (ctx, input) => {
		// The local record is keyed by project id; a name is looked up first so
		// the record can be cleared once Vercel confirms the delete.
		let projectId: string | undefined = input.idOrName.startsWith('prj_')
			? input.idOrName
			: undefined;
		if (!projectId && ctx.db.projects) {
			const found = await makeAuthenticatedVercelRequest<{ id?: string }>(
				`/v9/projects/${seg(input.idOrName)}`,
				ctx,
				{ teamId: input.teamId },
			);
			projectId = typeof found?.id === 'string' ? found.id : undefined;
		}
		// Delete by the resolved id, so a rename between the lookup and the
		// delete can't point the name at a different project.
		await makeAuthenticatedVercelRequest(
			`/v9/projects/${seg(projectId ?? input.idOrName)}`,
			ctx,
			{ method: 'DELETE', teamId: input.teamId },
		);
		if (projectId && ctx.db.projects) {
			await ctx.db.projects.deleteByEntityId(projectId);
		}
		// 204 No Content: reaching here means Vercel removed it.
		return { deleted: true, idOrName: input.idOrName };
	},
});

export const pauseProject = defineEndpoint({
	event: 'vercel.projects.pauseProject',
	input: In.pauseProject,
	output: Out.pauseProject,
	run: async (ctx, input) => {
		await makeAuthenticatedVercelRequest(
			`/v1/projects/${seg(input.projectId)}/pause`,
			ctx,
			{ method: 'POST', teamId: input.teamId },
		);
		return { projectId: input.projectId, paused: true };
	},
});

export const unpauseProject = defineEndpoint({
	event: 'vercel.projects.unpauseProject',
	input: In.unpauseProject,
	output: Out.unpauseProject,
	run: async (ctx, input) => {
		await makeAuthenticatedVercelRequest(
			`/v1/projects/${seg(input.projectId)}/unpause`,
			ctx,
			{ method: 'POST', teamId: input.teamId },
		);
		return { projectId: input.projectId, paused: false };
	},
});

export const promoteDeployment = defineEndpoint({
	event: 'vercel.projects.promoteDeployment',
	input: In.promoteDeployment,
	output: Out.promoteDeployment,
	run: async (ctx, input) => {
		// 201/202 with no body: the promotion is queued.
		await makeAuthenticatedVercelRequest(
			`/v10/projects/${seg(input.projectId)}/promote/${seg(input.deploymentId)}`,
			ctx,
			{ method: 'POST', teamId: input.teamId },
		);
		return {
			projectId: input.projectId,
			deploymentId: input.deploymentId,
			requested: true,
		};
	},
});

export const rollbackDeployment = defineEndpoint({
	event: 'vercel.projects.rollbackDeployment',
	input: In.rollbackDeployment,
	output: Out.rollbackDeployment,
	run: async (ctx, input) => {
		await makeAuthenticatedVercelRequest(
			`/v1/projects/${seg(input.projectId)}/rollback/${seg(input.deploymentId)}`,
			ctx,
			{
				method: 'POST',
				teamId: input.teamId,
				query: pickQuery(input, ['description']),
			},
		);
		return {
			projectId: input.projectId,
			deploymentId: input.deploymentId,
			requested: true,
		};
	},
});

export const getProjectMembers = defineEndpoint({
	event: 'vercel.projects.getProjectMembers',
	input: In.getProjectMembers,
	output: Out.getProjectMembers,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v1/projects/${seg(input.idOrName)}/members`,
			ctx,
			{
				teamId: input.teamId,
				query: pickQuery(input, ['limit', 'since', 'until', 'search']),
			},
		),
	// A search term can be an email address: keep it out of the event.
	logInput: ({ search: _search, ...rest }) => rest,
});
