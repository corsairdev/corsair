import type { RocketReachEndpoints } from '..';
import { call } from './call';
import {
	RocketReachEndpointInputSchemas as Inputs,
	RocketReachEndpointOutputSchemas as Outputs,
} from './types';

export const get: RocketReachEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({ method: 'GET', path: '/account/', replayable: true }),
		{
			log: (_, result) => ({
				state: result.state ?? undefined,
				credits: result.credit_usage?.length ?? 0,
				limits: result.rate_limits?.length ?? 0,
			}),
		},
	);

/**
 * The universal-credits account. Its body includes the caller's own `api_key`,
 * which is removed before the output schema sees it: a credential must not be
 * copied into a caller's logs or stored records.
 */
export const universal: RocketReachEndpoints['accountUniversal'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.universal',
			input: Inputs.accountUniversal,
			output: Outputs.accountUniversal,
		},
		input,
		() => ({ method: 'GET', path: '/universal/account/', replayable: true }),
		{
			// unknown: the raw body is RocketReach's account object until the
			// output schema validates it.
			shape: (raw) => {
				if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
					return raw;
				}
				const { api_key: _omitted, ...rest } = raw as Record<string, unknown>;
				return rest;
			},
			log: (_, result) => ({
				plan: result.plan?.name ?? undefined,
				callsToday: result.daily_api_num_calls ?? undefined,
				dailyLimit: result.daily_api_limit ?? undefined,
			}),
		},
	);
