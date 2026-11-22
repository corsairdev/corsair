import type { HoneybadgerEndpoints } from '..';
import { call } from './call';
import {
	HoneybadgerEndpointInputSchemas as Inputs,
	HoneybadgerEndpointOutputSchemas as Outputs,
} from './types';

export const accountGet: HoneybadgerEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs['account.get'],
			output: Outputs['account.get'],
		},
		input,
		() => ({ method: 'GET', path: '/account' }),
		// The account email is personal data, so only the id is logged.
		{ log: (_, result) => ({ accountId: result.data.id }) },
	);

export const accountUsage: HoneybadgerEndpoints['accountUsage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.usage',
			input: Inputs['account.usage'],
			output: Outputs['account.usage'],
		},
		input,
		() => ({ method: 'GET', path: '/account/usage' }),
		{ log: (_, result) => ({ accountId: result.data.id }) },
	);

/**
 * Reports what the token can do. It needs no scope, so it is the cheapest way
 * to check that a token works and which region it belongs to.
 */
export const tokenGet: HoneybadgerEndpoints['tokenGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'token.get',
			input: Inputs['token.get'],
			output: Outputs['token.get'],
		},
		input,
		() => ({ method: 'GET', path: '/token' }),
		{
			log: (_, result) => ({
				kind: result.data.kind ?? undefined,
				scopes: result.data.scopes?.length,
			}),
		},
	);
