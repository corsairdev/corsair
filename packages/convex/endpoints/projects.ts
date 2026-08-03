import { logEventFromContext } from 'corsair/core';
import type { ConvexEndpoints } from '..';
import { makeConvexRequest, tryCacheWrite } from '../client';
import type { ConvexEndpointOutputs } from './types';

export const list: ConvexEndpoints['projectsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.cursor !== undefined) query.cursor = input.cursor;
	if (input.limit !== undefined) query.limit = input.limit;
	if (input.q !== undefined) query.q = input.q;

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['projectsList']
	>(`/teams/${input.team_id}/projects`, ctx.key, {
		method: 'GET',
		query,
	});

	const projects = ctx.db.projects;
	if (response.items && projects) {
		await tryCacheWrite(async () => {
			for (const project of response.items) {
				await projects.upsertByEntityId(project.id, { ...project });
			}
		});
	}

	await logEventFromContext(
		ctx,
		'convex.projects.list',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
};

export const getById: ConvexEndpoints['projectGetById'] = async (
	ctx,
	input,
) => {
	const response = await makeConvexRequest<
		ConvexEndpointOutputs['projectGetById']
	>(`/projects/${input.project_id}`, ctx.key, { method: 'GET' });

	const projects = ctx.db.projects;
	if (response && projects) {
		await tryCacheWrite(() =>
			projects.upsertByEntityId(response.id, { ...response }),
		);
	}

	await logEventFromContext(
		ctx,
		'convex.projects.getById',
		{ ...input },
		'completed',
	);
	return response;
};

export const getBySlug: ConvexEndpoints['projectGetBySlug'] = async (
	ctx,
	input,
) => {
	const response = await makeConvexRequest<
		ConvexEndpointOutputs['projectGetBySlug']
	>(`/teams/${input.team_id_or_slug}/projects/${input.project_slug}`, ctx.key, {
		method: 'GET',
	});

	const projects = ctx.db.projects;
	if (response && projects) {
		await tryCacheWrite(() =>
			projects.upsertByEntityId(response.id, { ...response }),
		);
	}

	await logEventFromContext(
		ctx,
		'convex.projects.getBySlug',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: ConvexEndpoints['projectCreate'] = async (ctx, input) => {
	const body: Record<string, unknown> = { projectName: input.projectName };
	if (input.deploymentType !== undefined) {
		body.deploymentType = input.deploymentType;
	}
	if (input.deploymentClass !== undefined) {
		body.deploymentClass = input.deploymentClass;
	}
	if (input.deploymentRegion !== undefined) {
		body.deploymentRegion = input.deploymentRegion;
	}

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['projectCreate']
	>(`/teams/${input.team_id}/create_project`, ctx.key, {
		method: 'POST',
		body,
	});

	// The project was created upstream — a cache failure must not turn this
	// successful non-idempotent call into an endpoint error (which could prompt
	// a duplicate create on retry).
	const projects = ctx.db.projects;
	if (response.id && projects) {
		await tryCacheWrite(() =>
			projects.upsertByEntityId(response.id, { ...response }),
		);
	}

	await logEventFromContext(
		ctx,
		'convex.projects.create',
		{ team_id: input.team_id, projectName: input.projectName },
		'completed',
	);
	return response;
};

export const deleteProject: ConvexEndpoints['projectDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeConvexRequest<
		ConvexEndpointOutputs['projectDelete']
	>(`/projects/${input.project_id}/delete`, ctx.key, { method: 'POST' });

	// The project was deleted upstream — best-effort cache cleanup only. Also
	// remove cached deployments that belonged to this project, since deleting a
	// project deletes all of its deployments.
	const { projects, deployments } = ctx.db;
	if (projects) {
		await tryCacheWrite(() => projects.deleteByEntityId(input.project_id));
	}
	if (deployments) {
		await tryCacheWrite(async () => {
			const cached = await deployments.list();
			for (const deployment of cached) {
				if (deployment.data.projectId === input.project_id) {
					await deployments.deleteByEntityId(deployment.entity_id);
				}
			}
		});
	}

	await logEventFromContext(
		ctx,
		'convex.projects.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const ProjectsEndpoints = {
	list,
	getById,
	getBySlug,
	create,
	delete: deleteProject,
} as const;
