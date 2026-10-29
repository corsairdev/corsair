import { logEventFromContext } from 'corsair/core';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpoints } from '../index';
import {
	CreateWorkspaceInputSchema,
	CreateWorkspaceResponseSchema,
	DeleteWorkspaceInputSchema,
	DeleteWorkspaceResponseSchema,
	ListWorkspacesResponseSchema,
	UpdateWorkspaceInputSchema,
	UpdateWorkspaceResponseSchema,
} from './types';

export const listWorkspaces: DynapicturesEndpoints['listWorkspaces'] = async (
	ctx,
) => {
	const response = await makeDynapicturesRequest<unknown>(
		'/workspaces',
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = ListWorkspacesResponseSchema.parse(response);
	await logEventFromContext(
		ctx,
		'dynapictures.workspaces.list',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};

export const createWorkspace: DynapicturesEndpoints['createWorkspace'] = async (
	ctx,
	rawInput,
) => {
	const input = CreateWorkspaceInputSchema.parse(rawInput);
	const response = await makeDynapicturesRequest<unknown>(
		'/workspaces',
		ctx.key,
		{ method: 'POST', body: { name: input.name } },
	);
	const parsed = CreateWorkspaceResponseSchema.parse(response);
	await logEventFromContext(
		ctx,
		'dynapictures.workspaces.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const updateWorkspace: DynapicturesEndpoints['updateWorkspace'] = async (
	ctx,
	rawInput,
) => {
	const input = UpdateWorkspaceInputSchema.parse(rawInput);
	const response = await makeDynapicturesRequest<unknown>(
		`/workspaces/${encodeURIComponent(input.id)}`,
		ctx.key,
		{ method: 'PUT', body: { name: input.name } },
	);
	const parsed = UpdateWorkspaceResponseSchema.parse(response);
	await logEventFromContext(
		ctx,
		'dynapictures.workspaces.update',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const deleteWorkspace: DynapicturesEndpoints['deleteWorkspace'] = async (
	ctx,
	rawInput,
) => {
	const input = DeleteWorkspaceInputSchema.parse(rawInput);
	const response = await makeDynapicturesRequest<unknown>(
		`/workspaces/${encodeURIComponent(input.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const parsed = DeleteWorkspaceResponseSchema.parse(response);
	await logEventFromContext(
		ctx,
		'dynapictures.workspaces.delete',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};
