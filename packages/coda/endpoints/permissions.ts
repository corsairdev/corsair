import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['permissionsList'] = async (ctx, input) => {
	const { docId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['permissionsList']
	>(`docs/${encodeURIComponent(docId)}/acl/permissions`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'coda.permissions.list',
		{ ...input },
		'completed',
	);
	return response;
};

const add: CodaEndpoints['permissionsAdd'] = async (ctx, input) => {
	const { docId, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['permissionsAdd']>(
		`docs/${encodeURIComponent(docId)}/acl/permissions`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'coda.permissions.add',
		{ ...input },
		'completed',
	);
	return response;
};

const deleteOne: CodaEndpoints['permissionsDelete'] = async (ctx, input) => {
	const { docId, permissionId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['permissionsDelete']
	>(
		`docs/${encodeURIComponent(docId)}/acl/permissions/${encodeURIComponent(permissionId)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'coda.permissions.delete',
		{ ...input },
		'completed',
	);
	return response;
};

const searchPrincipals: CodaEndpoints['permissionsSearchPrincipals'] = async (
	ctx,
	input,
) => {
	const { docId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['permissionsSearchPrincipals']
	>(`docs/${encodeURIComponent(docId)}/acl/principals/search`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'coda.permissions.searchPrincipals',
		{ ...input },
		'completed',
	);
	return response;
};

const getSharingMetadata: CodaEndpoints['permissionsGetSharingMetadata'] =
	async (ctx, input) => {
		const { docId } = input;
		const response = await makeCodaRequest<
			CodaEndpointOutputs['permissionsGetSharingMetadata']
		>(`docs/${encodeURIComponent(docId)}/acl/metadata`, ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'coda.permissions.getSharingMetadata',
			{ ...input },
			'completed',
		);
		return response;
	};

const getAclSettings: CodaEndpoints['permissionsGetAclSettings'] = async (
	ctx,
	input,
) => {
	const { docId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['permissionsGetAclSettings']
	>(`docs/${encodeURIComponent(docId)}/acl/settings`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'coda.permissions.getAclSettings',
		{ ...input },
		'completed',
	);
	return response;
};

const updateAclSettings: CodaEndpoints['permissionsUpdateAclSettings'] = async (
	ctx,
	input,
) => {
	const { docId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['permissionsUpdateAclSettings']
	>(`docs/${encodeURIComponent(docId)}/acl/settings`, ctx.key, {
		method: 'PATCH',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.permissions.updateAclSettings',
		{ ...input },
		'completed',
	);
	return response;
};

export const Permissions = {
	list,
	add,
	delete: deleteOne,
	searchPrincipals,
	getSharingMetadata,
	getAclSettings,
	updateAclSettings,
};
