import type { ShotstackEndpoints } from '..';
import { attributesList, attributesOf, segment } from '../client';
import { call } from './call';
import type {
	AssetsDeleteInput,
	AssetsGetByRenderIdInput,
	AssetsGetInput,
	AssetsTransferInput,
} from './types';
import {
	ShotstackEndpointInputSchemas,
	ShotstackEndpointOutputSchemas,
} from './types';

export const get: ShotstackEndpoints['assetsGet'] = async (ctx, rawInput) => {
	return call(
		ctx,
		{
			event: 'assets.get',
			input: ShotstackEndpointInputSchemas.assetsGet,
			output: ShotstackEndpointOutputSchemas.assetsGet,
		},
		rawInput,
		(input: AssetsGetInput) => ({
			method: 'GET',
			service: 'serve',
			path: `/assets/${segment(input.id)}`,
		}),
		{
			shape: (raw) => attributesOf(raw),
			log: (_input, result) => ({
				assetId: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);
};

export const getByRenderId: ShotstackEndpoints['assetsGetByRenderId'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'assets.getByRenderId',
			input: ShotstackEndpointInputSchemas.assetsGetByRenderId,
			output: ShotstackEndpointOutputSchemas.assetsGetByRenderId,
		},
		rawInput,
		(input: AssetsGetByRenderIdInput) => ({
			method: 'GET',
			service: 'serve',
			path: `/assets/render/${segment(input.id)}`,
		}),
		{
			shape: (raw) => ({ assets: attributesList(raw) }),
			log: (_input, result) => ({ count: result.assets.length }),
		},
	);
};

export const transfer: ShotstackEndpoints['assetsTransfer'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'assets.transfer',
			input: ShotstackEndpointInputSchemas.assetsTransfer,
			output: ShotstackEndpointOutputSchemas.assetsTransfer,
		},
		rawInput,
		(input: AssetsTransferInput) => ({
			method: 'POST',
			service: 'serve',
			path: '/assets',
			body: {
				url: input.url,
				id: input.id,
				destinations: input.destinations,
			},
		}),
		{
			shape: (raw) => attributesOf(raw),
			log: (_input, result) => ({
				assetId: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);
};

// `delete` is a reserved word, so the function is `remove`.
export const remove: ShotstackEndpoints['assetsDelete'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'assets.delete',
			input: ShotstackEndpointInputSchemas.assetsDelete,
			output: ShotstackEndpointOutputSchemas.assetsDelete,
		},
		rawInput,
		(input: AssetsDeleteInput) => ({
			method: 'DELETE',
			service: 'serve',
			path: `/assets/${segment(input.id)}`,
		}),
		{
			shape: (raw) => raw ?? {},
		},
	);
};
