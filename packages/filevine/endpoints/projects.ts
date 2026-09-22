import { logEventFromContext } from 'corsair/core';
import { makeFilevineRequest } from '../client';
import type { FilevineEndpoints } from '../index';
import type { FilevineEndpointOutputs } from './types';
import { GetProjectResponseSchema, ListProjectsResponseSchema } from './types';

export const list: FilevineEndpoints['listProjects'] = async (ctx, input) => {
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['listProjects']
	>('/fv-app/v2/Projects', ctx.key, {
		method: 'GET',
		query: {
			offset: input.offset,
			limit: input.limit,
			projectTypeId: input.projectTypeId,
			phaseName: input.phaseName,
			modifiedSince: input.modifiedSince,
		},
	});
	const parsed = ListProjectsResponseSchema.parse(result);
	if (parsed.items && ctx.db.projects) {
		for (const item of parsed.items) {
			try {
				await ctx.db.projects.upsertByEntityId(String(item.projectId), {
					id: item.projectId,
					projectId: item.projectId,
					projectName: item.projectName,
					number: item.number,
					projectTypeId: item.projectTypeId,
					clientId: item.clientId,
					phaseName: item.phaseName,
					isArchived: item.isArchived,
					createdDate: item.createdDate,
					modifiedDate: item.modifiedDate,
				});
			} catch {}
		}
	}
	await logEventFromContext(
		ctx,
		'filevine.projects.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const get: FilevineEndpoints['getProject'] = async (ctx, input) => {
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['getProject']
	>(`/fv-app/v2/Projects/${input.projectId}`, ctx.key, { method: 'GET' });
	const parsed = GetProjectResponseSchema.parse(result);
	if (ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(String(parsed.projectId), {
				id: parsed.projectId,
				projectId: parsed.projectId,
				projectName: parsed.projectName,
				number: parsed.number,
				projectTypeId: parsed.projectTypeId,
				clientId: parsed.clientId,
				phaseName: parsed.phaseName,
				isArchived: parsed.isArchived,
				createdDate: parsed.createdDate,
				modifiedDate: parsed.modifiedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.projects.get',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const create: FilevineEndpoints['createProject'] = async (
	ctx,
	input,
) => {
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['createProject']
	>('/fv-app/v2/Projects', ctx.key, {
		method: 'POST',
		body: {
			projectTypeId: input.projectTypeId,
			projectName: input.projectName,
			clientId: input.clientId,
			phaseName: input.phaseName,
		} as Record<string, unknown>,
	});
	const parsed = GetProjectResponseSchema.parse(result);
	if (ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(String(parsed.projectId), {
				id: parsed.projectId,
				projectId: parsed.projectId,
				projectName: parsed.projectName,
				number: parsed.number,
				projectTypeId: parsed.projectTypeId,
				clientId: parsed.clientId,
				phaseName: parsed.phaseName,
				isArchived: parsed.isArchived,
				createdDate: parsed.createdDate,
				modifiedDate: parsed.modifiedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.projects.create',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const update: FilevineEndpoints['updateProject'] = async (
	ctx,
	input,
) => {
	const { projectId, ...patch } = input;
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['updateProject']
	>(`/fv-app/v2/Projects/${projectId}`, ctx.key, {
		method: 'PATCH',
		body: patch as Record<string, unknown>,
	});
	const parsed = GetProjectResponseSchema.parse(result);
	if (ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(String(parsed.projectId), {
				id: parsed.projectId,
				projectId: parsed.projectId,
				projectName: parsed.projectName,
				number: parsed.number,
				projectTypeId: parsed.projectTypeId,
				clientId: parsed.clientId,
				phaseName: parsed.phaseName,
				isArchived: parsed.isArchived,
				createdDate: parsed.createdDate,
				modifiedDate: parsed.modifiedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.projects.update',
		{ ...input },
		'completed',
	);
	return parsed;
};
