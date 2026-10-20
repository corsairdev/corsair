import type { PloidEndpoints } from '../index';
import { callPloid } from './call';
import {
	AccountCreditsResponseSchema,
	AccountUsageResponseSchema,
	PloidEndpointInputSchemas,
} from './types';

export const credits: PloidEndpoints['accountCredits'] = async (ctx, input) => {
	return callPloid(
		ctx,
		'ploid.account.credits',
		PloidEndpointInputSchemas.accountCredits,
		AccountCreditsResponseSchema,
		input,
		() => ({ method: 'GET', url: '/v1/account/credits' }),
		(_validated, response) => ({
			plan: response.data.plan,
			available: response.data.acu?.available,
		}),
	);
};

export const usage: PloidEndpoints['accountUsage'] = async (ctx, input) => {
	return callPloid(
		ctx,
		'ploid.account.usage',
		PloidEndpointInputSchemas.accountUsage,
		AccountUsageResponseSchema,
		input,
		() => ({ method: 'GET', url: '/v1/account/usage' }),
		(_validated, response) => ({
			plan: response.data.credits?.plan,
			active_keys: response.data.api_key?.active_keys,
		}),
	);
};
