import type { PilvioEndpoints } from '..';
import { call } from './call';
import {
	PilvioEndpointInputSchemas as Inputs,
	PilvioEndpointOutputSchemas as Outputs,
} from './types';

const CONFIG = '/v1/config';

export const listLocations: PilvioEndpoints['configListLocations'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'config.listLocations',
			input: Inputs.configListLocations,
			output: Outputs.configListLocations,
		},
		input,
		() => ({ method: 'GET', path: `${CONFIG}/locations` }),
		{ log: (_, locations) => ({ count: locations.length }) },
	);

export const listVmImages: PilvioEndpoints['configListVmImages'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'config.listVmImages',
			input: Inputs.configListVmImages,
			output: Outputs.configListVmImages,
		},
		input,
		() => ({ method: 'GET', path: `${CONFIG}/vm_images` }),
		{ log: (_, images) => ({ count: images.length }) },
	);

export const listPlainOsImages: PilvioEndpoints['configListPlainOsImages'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'config.listPlainOsImages',
			input: Inputs.configListPlainOsImages,
			output: Outputs.configListPlainOsImages,
		},
		input,
		() => ({ method: 'GET', path: `${CONFIG}/vm_images/plain_os` }),
		{ log: (_, images) => ({ count: images.length }) },
	);

export const listAppCatalogImages: PilvioEndpoints['configListAppCatalogImages'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'config.listAppCatalogImages',
				input: Inputs.configListAppCatalogImages,
				output: Outputs.configListAppCatalogImages,
			},
			input,
			() => ({ method: 'GET', path: `${CONFIG}/vm_images/app_catalog` }),
			{ log: (_, images) => ({ count: images.length }) },
		);

export const listBootImages: PilvioEndpoints['configListBootImages'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'config.listBootImages',
			input: Inputs.configListBootImages,
			output: Outputs.configListBootImages,
		},
		input,
		() => ({ method: 'GET', path: `${CONFIG}/boot_images` }),
		{ log: (_, images) => ({ count: images.length }) },
	);

export const listResourcePools: PilvioEndpoints['configListResourcePools'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'config.listResourcePools',
			input: Inputs.configListResourcePools,
			output: Outputs.configListResourcePools,
		},
		input,
		() => ({ method: 'GET', path: '/v1/user-resource/host_pool/list' }),
		{ log: (_, pools) => ({ count: pools.length }) },
	);

export const getPricingPolicy: PilvioEndpoints['configGetPricingPolicy'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'config.getPricingPolicy',
			input: Inputs.configGetPricingPolicy,
			output: Outputs.configGetPricingPolicy,
		},
		input,
		() => ({ method: 'GET', path: '/v1/pricing/policy' }),
		{ log: (_, policy) => ({ lines: policy.policy.length }) },
	);
