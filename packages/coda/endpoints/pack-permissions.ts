import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['packPermissionsList'] = async (ctx, input) => {
	const { packId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packPermissionsList']
	>(`packs/${encodeURIComponent(packId)}/permissions`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'coda.packPermissions.list',
		{ ...input },
		'completed',
	);
	return response;
};

const add: CodaEndpoints['packPermissionsAdd'] = async (ctx, input) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packPermissionsAdd']
	>(`packs/${encodeURIComponent(packId)}/permissions`, ctx.key, {
		method: 'POST',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.packPermissions.add',
		{ ...input },
		'completed',
	);
	return response;
};

const deleteOne: CodaEndpoints['packPermissionsDelete'] = async (
	ctx,
	input,
) => {
	const { packId, permissionId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packPermissionsDelete']
	>(
		`packs/${encodeURIComponent(packId)}/permissions/${encodeURIComponent(permissionId)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'coda.packPermissions.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const PackPermissions = {
	list,
	add,
	delete: deleteOne,
};
