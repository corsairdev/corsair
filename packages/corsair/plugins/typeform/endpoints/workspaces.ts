import type { TypeformEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeTypeformRequest } from '../client';
import type { TypeformEndpointOutputs } from './types';

export const list: TypeformEndpoints['workspacesList'] = async (ctx, input) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['workspacesList']
	>('/workspaces', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			search: input.search,
			page_size: input.page_size,
		},
	});

	if (response.workspaces && ctx.db.workspaces) {
		for (const workspace of response.workspaces) {
			const id = workspace.id;
			if (id) {
				try {
					// id narrowed to string; spread + override to satisfy DB entity requirement
					await ctx.db.workspaces.upsertByEntityId(id, { ...workspace, id });
				} catch (error) {
					console.warn('Failed to save workspace to database:', error);
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.workspaces.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: TypeformEndpoints['workspacesGet'] = async (ctx, input) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['workspacesGet']
	>(`/workspaces/${input.workspace_id}`, ctx.key);

	const id = response.id;
	if (id && ctx.db.workspaces) {
		try {
			// id narrowed to string; spread + override to satisfy DB entity requirement
			await ctx.db.workspaces.upsertByEntityId(id, { ...response, id });
		} catch (error) {
			console.warn('Failed to save workspace to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.workspaces.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: TypeformEndpoints['workspacesCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['workspacesCreate']
	>('/workspaces', ctx.key, {
		method: 'POST',
		body: { name: input.name },
	});

	const id = response.id;
	if (id && ctx.db.workspaces) {
		try {
			// id narrowed to string; self.href normalized to href for DB entity
			await ctx.db.workspaces.upsertByEntityId(id, {
				id,
				name: response.name,
				forms: response.forms,
				members: response.members,
				shared: response.shared,
				default: response.default,
				account_id: response.account_id,
				href: response.self?.href,
			});
		} catch (error) {
			console.warn('Failed to save workspace to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.workspaces.create',
		{ name: input.name },
		'completed',
	);

	return response;
};

export const createForAccount: TypeformEndpoints['workspacesCreateForAccount'] =
	async (ctx, input) => {
		const response = await makeTypeformRequest<
			TypeformEndpointOutputs['workspacesCreateForAccount']
		>(`/accounts/${input.account_id}/workspaces`, ctx.key, {
			method: 'POST',
			body: { name: input.name },
		});

		const id = response.id;
		if (id && ctx.db.workspaces) {
			try {
				// id narrowed to string; self.href normalized to href for DB entity
				await ctx.db.workspaces.upsertByEntityId(id, {
					id,
					name: response.name,
					forms: response.forms,
					members: response.members,
					shared: response.shared,
					default: response.default,
					account_id: response.account_id,
					href: response.self?.href,
				});
			} catch (error) {
				console.warn('Failed to save workspace to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'typeform.workspaces.createForAccount',
			{ name: input.name, account_id: input.account_id },
			'completed',
		);

		return response;
	};

export const update: TypeformEndpoints['workspacesUpdate'] = async (
	ctx,
	input,
) => {
	const { workspace_id, operations } = input;
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['workspacesUpdate']
	>(`/workspaces/${workspace_id}`, ctx.key, {
		method: 'PATCH',
		// Typeform PATCH /workspaces expects the JSON Patch operations array as the body directly (RFC 6902)
		body: operations as unknown as unknown[],
	});

	// PATCH /workspaces returns 204 No Content; no response body to upsert

	await logEventFromContext(
		ctx,
		'typeform.workspaces.update',
		{ workspace_id },
		'completed',
	);

	return response;
};

export const deleteWorkspace: TypeformEndpoints['workspacesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['workspacesDelete']
	>(`/workspaces/${input.workspace_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'typeform.workspaces.delete',
		{ ...input },
		'completed',
	);

	return response;
};
