import { logEventFromContext } from 'corsair/core';
import { makeNeonRequest } from '../client';
import type { NeonEndpoints, NeonContext } from '../index';
import type {
	ProjectsListResponse,
	Project,
} from './types';

export const list: NeonEndpoints['projectsList'] = async (ctx, input) => {
	const { limit, cursor } = input;
	const result = await makeNeonRequest<ProjectsListResponse>(
		'/projects',
		ctx,
		{
			query: { limit, cursor },
		},
	);

	const db = (ctx as NeonContext & { db?: any }).db;
	if (result?.projects && db?.projects) {
		try {
			for (const project of result.projects) {
				await db.projects.upsertByEntityId(project.id, project);
			}
		} catch (error) {
			console.warn('Failed to save projects to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'neon.projects.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: NeonEndpoints['projectsGet'] = async (ctx, input) => {
	const { projectId } = input;
	const endpoint = `/projects/${projectId}`;
	const result = await makeNeonRequest<Project>(endpoint, ctx);

	const db = (ctx as NeonContext & { db?: any }).db;
	if (result && db?.projects) {
		try {
			await db.projects.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'neon.projects.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: NeonEndpoints['projectsCreate'] = async (ctx, input) => {
	const result = await makeNeonRequest<Project>('/projects', ctx, {
		method: 'POST',
		body: input,
	});

	const db = (ctx as NeonContext & { db?: any }).db;
	if (result && db?.projects) {
		try {
			await db.projects.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'neon.projects.create',
		{ ...input },
		'completed',
	);
	return result;
};
