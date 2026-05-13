import { logEventFromContext } from 'corsair/core';
import type { BitwardenEndpoints } from '..';
import type { BitwardenEndpointOutputs } from './types';
import { makeBitwardenRequest } from '../client';

export const Organizations = {
	list: (async (ctx, _input) => {
		const response = await makeBitwardenRequest<BitwardenEndpointOutputs['organizationsList']>(
			'/organizations',
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(ctx, 'bitwarden.organizations.list', {}, 'completed');
		return response;
	}) as BitwardenEndpoints['organizationsList'],

	get: (async (ctx, input) => {
		const response = await makeBitwardenRequest<BitwardenEndpointOutputs['organizationsGet']>(
			`/organizations/${input.id}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(ctx, 'bitwarden.organizations.get', input, 'completed');
		return response;
	}) as BitwardenEndpoints['organizationsGet'],
};

export const Collections = {
	list: (async (ctx, input) => {
		const response = await makeBitwardenRequest<BitwardenEndpointOutputs['collectionsList']>(
			`/organizations/${input.organizationId}/collections`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(ctx, 'bitwarden.collections.list', input, 'completed');
		return response;
	}) as BitwardenEndpoints['collectionsList'],

	get: (async (ctx, input) => {
		const response = await makeBitwardenRequest<BitwardenEndpointOutputs['collectionsGet']>(
			`/organizations/${input.organizationId}/collections/${input.id}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(ctx, 'bitwarden.collections.get', input, 'completed');
		return response;
	}) as BitwardenEndpoints['collectionsGet'],
};

export const Members = {
	list: (async (ctx, input) => {
		const response = await makeBitwardenRequest<BitwardenEndpointOutputs['membersList']>(
			`/organizations/${input.organizationId}/members`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(ctx, 'bitwarden.members.list', input, 'completed');
		return response;
	}) as BitwardenEndpoints['membersList'],

	get: (async (ctx, input) => {
		const response = await makeBitwardenRequest<BitwardenEndpointOutputs['membersGet']>(
			`/organizations/${input.organizationId}/members/${input.id}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(ctx, 'bitwarden.members.get', input, 'completed');
		return response;
	}) as BitwardenEndpoints['membersGet'],
};
