import type { RagieEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	RagieEndpointInputSchemas as Inputs,
	RagieEndpointOutputSchemas as Outputs,
} from './types';

export const list: RagieEndpoints['connectionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'connections.list',
			input: Inputs.connectionsList,
			output: Outputs.connectionsList,
		},
		input,
		({ cursor, page_size }) => ({
			method: 'GET',
			path: '/connections',
			query: { cursor, page_size },
		}),
	);

export const get: RagieEndpoints['connectionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'connections.get',
			input: Inputs.connectionsGet,
			output: Outputs.connectionsGet,
		},
		input,
		({ connection_id }) => ({
			method: 'GET',
			path: `/connections/${segment(connection_id)}`,
		}),
	);

export const listSourceTypes: RagieEndpoints['connectionsListSourceTypes'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'connections.listSourceTypes',
			input: Inputs.connectionsListSourceTypes,
			output: Outputs.connectionsListSourceTypes,
		},
		input,
		() => ({ method: 'GET', path: '/connections/source-type' }),
	);

export const create: RagieEndpoints['connectionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'connections.create',
			input: Inputs.connectionsCreate,
			output: Outputs.connectionsCreate,
		},
		input,
		({ connection, partition_strategy, page_limit }) => ({
			method: 'POST',
			// The create path is singular; every other connection route is plural.
			path: '/connection',
			body: { connection, partition_strategy, page_limit },
		}),
	);

export const createOAuthRedirectUrl: RagieEndpoints['connectionsCreateOAuthRedirectUrl'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'connections.createOAuthRedirectUrl',
				input: Inputs.connectionsCreateOAuthRedirectUrl,
				output: Outputs.connectionsCreateOAuthRedirectUrl,
			},
			input,
			({ redirect_uri, source_type, partition, page_limit }) => ({
				method: 'POST',
				path: '/connections/oauth',
				body: {
					redirect_uri,
					source_type,
					partition,
					page_limit,
				},
			}),
		);

export const update: RagieEndpoints['connectionsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'connections.update',
			input: Inputs.connectionsUpdate,
			output: Outputs.connectionsUpdate,
		},
		input,
		({ connection_id, metadata, mode, partition_strategy, page_limit }) => ({
			method: 'PUT',
			path: `/connections/${segment(connection_id)}`,
			body: { metadata, mode, partition_strategy, page_limit },
		}),
	);

export const sync: RagieEndpoints['connectionsSync'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'connections.sync',
			input: Inputs.connectionsSync,
			output: Outputs.connectionsSync,
		},
		input,
		({ connection_id }) => ({
			method: 'POST',
			path: `/connections/${segment(connection_id)}/sync`,
		}),
		{
			// Ragie has accepted the sync by the time it answers; a bodyless 200
			// is the same success, as for documents.delete.
			shape: (raw) => raw ?? {},
		},
	);

// Deletion is POST /connections/{id}/delete with a keep_files body, not a
// DELETE method: the canonical API spell, confirmed by the official SDK. The
// mirror spec's DELETE /connections/{id} is outdated.
export const remove: RagieEndpoints['connectionsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'connections.delete',
			input: Inputs.connectionsDelete,
			output: Outputs.connectionsDelete,
		},
		input,
		({ connection_id, keep_files }) => ({
			method: 'POST',
			path: `/connections/${segment(connection_id)}/delete`,
			body: { keep_files },
		}),
		{
			log: ({ connection_id, keep_files }) => ({
				connectionId: connection_id,
				keepFiles: keep_files,
			}),
			// The deletion has started by the time Ragie answers; a bodyless
			// 200 must not turn it into an error.
			shape: (raw) => raw ?? {},
		},
	);

export const setEnabled: RagieEndpoints['connectionsSetEnabled'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'connections.setEnabled',
			input: Inputs.connectionsSetEnabled,
			output: Outputs.connectionsSetEnabled,
		},
		input,
		({ connection_id, enabled }) => ({
			method: 'PUT',
			path: `/connections/${segment(connection_id)}/enabled`,
			body: { enabled },
		}),
	);

export const setLimits: RagieEndpoints['connectionsSetLimits'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'connections.setLimits',
			input: Inputs.connectionsSetLimits,
			output: Outputs.connectionsSetLimits,
		},
		input,
		({ connection_id, page_limit }) => ({
			method: 'PUT',
			path: `/connections/${segment(connection_id)}/limit`,
			body: { page_limit },
		}),
	);
