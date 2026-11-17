import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { compactQuery, makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

/** List the workspace's data connections. */
export const dataConnectionsList: HexEndpoints['dataConnectionsList'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.dataConnectionsList.parse(input);
	const response = await makeHexRequest<
		HexEndpointOutputs['dataConnectionsList']
	>(`/v1/data-connections`, ctx.key, {
		method: 'GET',
		query: compactQuery({
			after: parsedInput.after,
			before: parsedInput.before,
			limit: parsedInput.limit,
			sortBy: parsedInput.sortBy,
			sortDirection: parsedInput.sortDirection,
		}),
	});
	const parsed = HexEndpointOutputSchemas.dataConnectionsList.parse(response);
	await logEventFromContext(
		ctx,
		'hex.dataConnections.list',
		{ operation: 'dataConnections.list' },
		'completed',
	);
	return parsed;
};

export const dataConnectionsCreate: HexEndpoints['dataConnectionsCreate'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.dataConnectionsCreate.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['dataConnectionsCreate']
		>(`/v1/data-connections`, ctx.key, {
			method: 'POST',
			body: {
				sharing: parsedInput.sharing,
				schemaRefreshAccess: parsedInput.schemaRefreshAccess,
				schemaRefreshSchedule: parsedInput.schemaRefreshSchedule,
				schemaFilters: parsedInput.schemaFilters,
				sensitivity: parsedInput.sensitivity,
				allowWritebackCells: parsedInput.allowWritebackCells,
				includeMagic: parsedInput.includeMagic,
				connectViaSsh: parsedInput.connectViaSsh,
				description: parsedInput.description,
				connectionDetails: parsedInput.connectionDetails,
				type: parsedInput.type,
				name: parsedInput.name,
			},
		});
		const parsed =
			HexEndpointOutputSchemas.dataConnectionsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'hex.dataConnections.create',
			{ operation: 'dataConnections.create' },
			'completed',
		);
		return parsed;
	};

/** Get a single data connection by its ID. */
export const dataConnectionsGet: HexEndpoints['dataConnectionsGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.dataConnectionsGet.parse(input);
	const response = await makeHexRequest<
		HexEndpointOutputs['dataConnectionsGet']
	>(
		`/v1/data-connections/${encodeURIComponent(String(parsedInput.dataConnectionId))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = HexEndpointOutputSchemas.dataConnectionsGet.parse(response);
	await logEventFromContext(
		ctx,
		'hex.dataConnections.get',
		{ operation: 'dataConnections.get' },
		'completed',
	);
	return parsed;
};

export const dataConnectionsUpdate: HexEndpoints['dataConnectionsUpdate'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.dataConnectionsUpdate.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['dataConnectionsUpdate']
		>(
			`/v1/data-connections/${encodeURIComponent(String(parsedInput.dataConnectionId))}`,
			ctx.key,
			{
				method: 'PATCH',
				body: {
					sharing: parsedInput.sharing,
					schemaRefreshAccess: parsedInput.schemaRefreshAccess,
					schemaRefreshSchedule: parsedInput.schemaRefreshSchedule,
					schemaFilters: parsedInput.schemaFilters,
					sensitivity: parsedInput.sensitivity,
					allowWritebackCells: parsedInput.allowWritebackCells,
					includeMagic: parsedInput.includeMagic,
					connectViaSsh: parsedInput.connectViaSsh,
					description: parsedInput.description,
					connectionDetails: parsedInput.connectionDetails,
					name: parsedInput.name,
				},
			},
		);
		const parsed =
			HexEndpointOutputSchemas.dataConnectionsUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'hex.dataConnections.update',
			{ operation: 'dataConnections.update' },
			'completed',
		);
		return parsed;
	};

/** Use this endpoint to add or remove a status (including endorsements) from databases, schemas, and tables */
export const dataConnectionsUpdateSchema: HexEndpoints['dataConnectionsUpdateSchema'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.dataConnectionsUpdateSchema.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['dataConnectionsUpdateSchema']
		>(
			`/v1/data-connections/${encodeURIComponent(String(parsedInput.dataConnectionId))}/schema`,
			ctx.key,
			{
				method: 'PATCH',
				body: {
					updates: parsedInput.updates,
				},
			},
		);
		const parsed =
			HexEndpointOutputSchemas.dataConnectionsUpdateSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hex.dataConnections.updateSchema',
			{ operation: 'dataConnections.updateSchema' },
			'completed',
		);
		return parsed;
	};
