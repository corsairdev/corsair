import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type {
	CreateWorkspaceResponse,
	DeleteWorkspaceResponse,
	ListWorkspacesResponse,
	UpdateWorkspaceResponse,
} from './types';

export const create: DynapicturesEndpoints['createWorkspace'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<CreateWorkspaceResponse>(
		'/workspaces',
		ctx.key,
		{
			method: 'POST',
			body: { name: input.name },
		},
	);
	await logEventFromContext(
		ctx,
		'dynapictures.workspaces.create',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const deleteWorkspace: DynapicturesEndpoints['deleteWorkspace'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<DeleteWorkspaceResponse>(
		`/workspaces/${encodeURIComponent(input.workspaceId)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	await logEventFromContext(
		ctx,
		'dynapictures.workspaces.delete',
		{ workspaceId: input.workspaceId },
		'completed',
	);
	return response;
};

export const list: DynapicturesEndpoints['listWorkspaces'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<ListWorkspacesResponse>(
		'/workspaces',
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'dynapictures.workspaces.list',
		input ?? {},
		'completed',
	);
	return response;
};

export const update: DynapicturesEndpoints['updateWorkspace'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<UpdateWorkspaceResponse>(
		`/workspaces/${encodeURIComponent(input.workspaceId)}`,
		ctx.key,
		{
			method: 'PUT',
			body: { name: input.name },
		},
	);
	await logEventFromContext(
		ctx,
		'dynapictures.workspaces.update',
		{ workspaceId: input.workspaceId, name: input.name },
		'completed',
	);
	return response;
};
