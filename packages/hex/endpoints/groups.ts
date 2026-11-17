import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { compactQuery, makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

export const groupsList: HexEndpoints['groupsList'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.groupsList.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['groupsList']>(
		`/v1/groups`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				after: parsedInput.after,
				before: parsedInput.before,
				limit: parsedInput.limit,
				sortBy: parsedInput.sortBy,
				sortDirection: parsedInput.sortDirection,
				userId: parsedInput.userId,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.groupsList.parse(response);
	await logEventFromContext(
		ctx,
		'hex.groups.list',
		{ operation: 'groups.list' },
		'completed',
	);
	return parsed;
};

export const groupsCreate: HexEndpoints['groupsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.groupsCreate.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['groupsCreate']>(
		`/v1/groups`,
		ctx.key,
		{
			method: 'POST',
			body: {
				members: parsedInput.members,
				name: parsedInput.name,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.groupsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'hex.groups.create',
		{ operation: 'groups.create' },
		'completed',
	);
	return parsed;
};

export const groupsDelete: HexEndpoints['groupsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.groupsDelete.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['groupsDelete']>(
		`/v1/groups/${encodeURIComponent(String(parsedInput.groupId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const parsed = HexEndpointOutputSchemas.groupsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'hex.groups.delete',
		{ operation: 'groups.delete' },
		'completed',
	);
	return parsed;
};

export const groupsGet: HexEndpoints['groupsGet'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.groupsGet.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['groupsGet']>(
		`/v1/groups/${encodeURIComponent(String(parsedInput.groupId))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = HexEndpointOutputSchemas.groupsGet.parse(response);
	await logEventFromContext(
		ctx,
		'hex.groups.get',
		{ operation: 'groups.get' },
		'completed',
	);
	return parsed;
};

export const groupsUpdate: HexEndpoints['groupsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.groupsUpdate.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['groupsUpdate']>(
		`/v1/groups/${encodeURIComponent(String(parsedInput.groupId))}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				members: parsedInput.members,
				name: parsedInput.name,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.groupsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'hex.groups.update',
		{ operation: 'groups.update' },
		'completed',
	);
	return parsed;
};
