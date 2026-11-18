import type { VaquillEndpoints } from '..';
import { makeVaquillRequest } from '../client';
import { callVaquill } from './call';
import {
	VaquillEndpointInputSchemas,
	VaquillEndpointOutputSchemas,
} from './types';

export const creditsBalance: VaquillEndpoints['creditsBalance'] = async (
	ctx,
) => {
	return callVaquill(
		ctx,
		'vaquill.account.creditsBalance',
		VaquillEndpointInputSchemas.creditsBalance,
		VaquillEndpointOutputSchemas.creditsBalance,
		{},
		() => makeVaquillRequest('/credits/balance', ctx.key, { method: 'GET' }),
		(_validated, response) => ({
			creditsRemaining: response.creditsRemaining,
			plan: response.plan,
		}),
	);
};

export const creditsPricing: VaquillEndpoints['creditsPricing'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.account.creditsPricing',
		VaquillEndpointInputSchemas.creditsPricing,
		VaquillEndpointOutputSchemas.creditsPricing,
		input,
		(validated) =>
			makeVaquillRequest('/api-credits/pricing', ctx.key, {
				method: 'GET',
				query: { region: validated.region },
			}),
		(_validated, response) => ({
			dollarPerCredit: response.dollarPerCredit,
		}),
	);
};
