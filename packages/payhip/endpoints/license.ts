import type { PayhipEndpoints } from '..';
import { call } from './call';
import {
	PayhipEndpointInputSchemas as Inputs,
	PayhipEndpointOutputSchemas as Outputs,
} from './types';

export const verify: PayhipEndpoints['licenseVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'license.verify',
			input: Inputs.licenseVerify,
			output: Outputs.licenseVerify,
			productSecret: true,
		},
		input,
		({ license_key }) => ({
			method: 'GET',
			path: '/api/v2/license/verify',
			auth: 'product',
			query: { license_key },
		}),
		{
			log: (_, result) => ({
				enabled: result.data.enabled,
				uses: result.data.uses ?? undefined,
			}),
		},
	);

export const disable: PayhipEndpoints['licenseDisable'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'license.disable',
			input: Inputs.licenseDisable,
			output: Outputs.licenseDisable,
			productSecret: true,
		},
		input,
		({ license_key }) => ({
			method: 'PUT',
			path: '/api/v2/license/disable',
			auth: 'product',
			form: { license_key },
		}),
		{ log: (_, result) => ({ enabled: result.data.enabled }) },
	);

export const enable: PayhipEndpoints['licenseEnable'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'license.enable',
			input: Inputs.licenseEnable,
			output: Outputs.licenseEnable,
			productSecret: true,
		},
		input,
		({ license_key }) => ({
			method: 'PUT',
			path: '/api/v2/license/enable',
			auth: 'product',
			form: { license_key },
		}),
		{ log: (_, result) => ({ enabled: result.data.enabled }) },
	);

export const increaseUsage: PayhipEndpoints['licenseIncreaseUsage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'license.increaseUsage',
			input: Inputs.licenseIncreaseUsage,
			output: Outputs.licenseIncreaseUsage,
			productSecret: true,
		},
		input,
		({ license_key }) => ({
			method: 'PUT',
			path: '/api/v2/license/usage',
			auth: 'product',
			form: { license_key },
		}),
		{ log: (_, result) => ({ uses: result.data.uses ?? undefined }) },
	);

// The reference's endpoints list names /api/v2/license/decrease for
// decreasing usage, though its curl example reuses the /usage URL; the
// plugin follows the endpoints list and the discrepancy is documented.
export const decreaseUsage: PayhipEndpoints['licenseDecreaseUsage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'license.decreaseUsage',
			input: Inputs.licenseDecreaseUsage,
			output: Outputs.licenseDecreaseUsage,
			productSecret: true,
		},
		input,
		({ license_key }) => ({
			method: 'PUT',
			path: '/api/v2/license/decrease',
			auth: 'product',
			form: { license_key },
		}),
		{ log: (_, result) => ({ uses: result.data.uses ?? undefined }) },
	);
