import type { ParadymEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	ParadymEndpointInputSchemas as Inputs,
	ParadymEndpointOutputSchemas as Outputs,
	pageQuery,
} from './types';

export const list: ParadymEndpoints['trustedEntitiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trustedEntities.list',
			input: Inputs.trustedEntitiesList,
			output: Outputs.trustedEntitiesList,
		},
		input,
		(query, walletId) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/trusted-entities`,
			query: {
				sort: query.sort,
				...pageQuery(query),
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const create: ParadymEndpoints['trustedEntitiesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trustedEntities.create',
			input: Inputs.trustedEntitiesCreate,
			output: Outputs.trustedEntitiesCreate,
		},
		input,
		(body, walletId) => ({
			method: 'POST',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/trusted-entities`,
			body,
		}),
		{ log: (_, entity) => ({ trustedEntityId: entity.id }) },
	);

export const get: ParadymEndpoints['trustedEntitiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trustedEntities.get',
			input: Inputs.trustedEntitiesGet,
			output: Outputs.trustedEntitiesGet,
		},
		input,
		({ trustedEntityId }, walletId) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/trusted-entities/${encodeURIComponent(trustedEntityId)}`,
		}),
		{ log: (_, entity) => ({ trustedEntityId: entity.id }) },
	);

export const remove: ParadymEndpoints['trustedEntitiesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trustedEntities.delete',
			input: Inputs.trustedEntitiesDelete,
			output: Outputs.trustedEntitiesDelete,
		},
		input,
		({ trustedEntityId }, walletId) => ({
			method: 'DELETE',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/trusted-entities/${encodeURIComponent(trustedEntityId)}`,
		}),
		{
			shape: (raw, { trustedEntityId }) => {
				expectEmptyBody(raw, 'trustedEntities.delete');
				return { id: trustedEntityId, success: true };
			},
			log: (_, result) => ({ trustedEntityId: result.id }),
		},
	);
