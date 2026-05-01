import { logEventFromContext } from 'corsair/core';
import type { TallyEndpoints } from '..';
import { makeTallyRequest } from '../client';
import { safeDbDelete, safeDbUpsert, toWorkspaceRecord } from '../utils';
import type { TallyEndpointOutputs } from './types';

export const list: TallyEndpoints['workspacesList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;

	const result = await makeTallyRequest<TallyEndpointOutputs['workspacesList']>(
		'workspaces',
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.items) {
		for (const workspace of result.items) {
			await safeDbUpsert(
				ctx.db.workspaces,
				workspace.id,
				toWorkspaceRecord(workspace),
				'workspace',
			);
		}
	}

	await logEventFromContext(
		ctx,
		'tally.workspaces.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: TallyEndpoints['workspacesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeTallyRequest<
		TallyEndpointOutputs['workspacesCreate']
	>('workspaces', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	if (result.id) {
		await safeDbUpsert(
			ctx.db.workspaces,
			result.id,
			toWorkspaceRecord(result),
			'workspace',
		);
	}

	await logEventFromContext(
		ctx,
		'tally.workspaces.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: TallyEndpoints['workspacesGet'] = async (ctx, input) => {
	const result = await makeTallyRequest<TallyEndpointOutputs['workspacesGet']>(
		`workspaces/${input.workspaceId}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id) {
		await safeDbUpsert(
			ctx.db.workspaces,
			result.id,
			toWorkspaceRecord(result),
			'workspace',
		);
	}

	await logEventFromContext(
		ctx,
		'tally.workspaces.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TallyEndpoints['workspacesUpdate'] = async (
	ctx,
	input,
) => {
	const { workspaceId, ...body } = input;
	const result = await makeTallyRequest<
		TallyEndpointOutputs['workspacesUpdate']
	>(`workspaces/${workspaceId}`, ctx.key, {
		method: 'PATCH',
		body: { ...body },
	});

	await logEventFromContext(
		ctx,
		'tally.workspaces.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteWorkspace: TallyEndpoints['workspacesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeTallyRequest<
		TallyEndpointOutputs['workspacesDelete']
	>(`workspaces/${input.workspaceId}`, ctx.key, { method: 'DELETE' });

	await safeDbDelete(ctx.db.workspaces, input.workspaceId, 'workspace');

	await logEventFromContext(
		ctx,
		'tally.workspaces.delete',
		{ ...input },
		'completed',
	);
	return result;
};
