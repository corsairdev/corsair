import { logEventFromContext } from 'corsair/core';
import type { MondayMcpEndpoints } from '..';
import { makeMondayMcpToolCall } from '../client';
import { safeEventPayload } from '../safe-event';
import {
	MondayMcpEndpointInputSchemas,
	MondayMcpEndpointOutputSchemas,
} from './types';

// Workspaces & Folders family: create_workspace, update_workspace,
// list_workspaces, workspace_info, create_folder, update_folder, move_object.
export const workspacesCreate: MondayMcpEndpoints['workspaces.create'] = async (
	ctx,
	input,
) => {
	const parsed =
		MondayMcpEndpointInputSchemas['workspaces.create'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'create_workspace',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['workspaces.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.workspaces.create',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const workspacesUpdate: MondayMcpEndpoints['workspaces.update'] = async (
	ctx,
	input,
) => {
	const parsed =
		MondayMcpEndpointInputSchemas['workspaces.update'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'update_workspace',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['workspaces.update'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.workspaces.update',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const workspacesList: MondayMcpEndpoints['workspaces.list'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['workspaces.list'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'list_workspaces',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['workspaces.list'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.workspaces.list',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const workspacesGetInfo: MondayMcpEndpoints['workspaces.getInfo'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['workspaces.getInfo'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'workspace_info',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['workspaces.getInfo'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.workspaces.getInfo',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const foldersCreate: MondayMcpEndpoints['folders.create'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['folders.create'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'create_folder', parsed);
	const output = MondayMcpEndpointOutputSchemas['folders.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.folders.create',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const foldersUpdate: MondayMcpEndpoints['folders.update'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['folders.update'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'update_folder', parsed);
	const output = MondayMcpEndpointOutputSchemas['folders.update'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.folders.update',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const foldersMoveObject: MondayMcpEndpoints['folders.moveObject'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['folders.moveObject'].parse(input);
		const result = await makeMondayMcpToolCall(ctx.key, 'move_object', parsed);
		const output =
			MondayMcpEndpointOutputSchemas['folders.moveObject'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.folders.moveObject',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};
