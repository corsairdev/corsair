import type { TombaEndpoints } from '..';
import { call } from './call';
import { TombaEndpointInputSchemas, TombaEndpointOutputSchemas } from './types';

// The account body carries the account's own `secret_token` and an
// `intercom_user_jwt`. Neither belongs in an agent's context or the event log,
// so they are dropped before the (loose) output schema sees the body.
const ACCOUNT_SECRETS = ['secret_token', 'intercom_user_jwt'];

// unknown: the raw response body, before the output schema parses it.
export function withoutAccountSecrets(raw: unknown): unknown {
	if (!raw || typeof raw !== 'object') return raw;
	const body = raw as Record<string, unknown>;
	const data = body.data;
	if (!data || typeof data !== 'object' || Array.isArray(data)) return raw;
	const kept = Object.fromEntries(
		Object.entries(data).filter(([key]) => !ACCOUNT_SECRETS.includes(key)),
	);
	return { ...body, data: kept };
}

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
			shape: withoutAccountSecrets,
			log: (_parsed, result) => ({
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
		{
			log: (_parsed, result) => ({
				routes: Object.keys(result.data ?? {}).length,
			}),
		},
	);
