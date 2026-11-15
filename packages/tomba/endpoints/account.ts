import type { TombaEndpoints } from '..';
import { call } from './call';
import { TombaEndpointInputSchemas, TombaEndpointOutputSchemas } from './types';

export const getAccount: TombaEndpoints['accountGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: TombaEndpointInputSchemas.getAccount,
			output: TombaEndpointOutputSchemas.getAccount,
		},
		input,
		() => ({ method: 'GET', path: 'me' }),
		{
			log: (_parsed, result) => ({
				// Never log secret_token, which the account body also carries.
				confirmed: result.data.confirmed ?? false,
			}),
		},
	);

export const rateLimits: TombaEndpoints['accountRateLimits'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.rateLimits',
			input: TombaEndpointInputSchemas.rateLimits,
			output: TombaEndpointOutputSchemas.rateLimits,
		},
		input,
		() => ({ method: 'GET', path: 'rate-limits' }),
		{ log: (_parsed, result) => ({ routes: result.data?.length ?? 0 }) },
	);
