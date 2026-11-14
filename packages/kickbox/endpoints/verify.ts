import type { KickboxEndpoints } from '..';
import {
	definedQuery,
	KICKBOX_API_BASE,
	KICKBOX_DISPOSABLE_PATH,
	KICKBOX_EU_API_BASE,
	KICKBOX_OPEN_BASE,
	segment,
} from '../client';
import { call, domainOf } from './call';
import {
	KickboxEndpointInputSchemas as Inputs,
	KickboxEndpointOutputSchemas as Outputs,
} from './types';

/** The verification host, which is the EU one for an EU-only account. */
function verifyBase(region: 'us' | 'eu' | undefined): string {
	return region === 'eu' ? KICKBOX_EU_API_BASE : KICKBOX_API_BASE;
}

export const verify: KickboxEndpoints['verify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'verify.verify',
			input: Inputs.verify,
			output: Outputs.verify,
		},
		input,
		({ email, timeout }) => ({
			method: 'GET',
			base: verifyBase(ctx.options.region),
			path: '/v2/verify',
			query: definedQuery({ email, apikey: ctx.key, timeout }),
		}),
		{
			// The domain and the verdict, never the address.
			log: (_, result) => ({
				domain: result.domain ?? undefined,
				result: result.result,
				reason: result.reason ?? undefined,
			}),
		},
	);

// The open host needs no key, so none is sent. It is a different service from
// verification, which is why the base travels on the request rather than living
// on the client.
export const disposable: KickboxEndpoints['disposable'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'verify.disposable',
			input: Inputs.disposable,
			output: Outputs.disposable,
		},
		input,
		({ address }) => ({
			method: 'GET',
			base: KICKBOX_OPEN_BASE,
			path: `${KICKBOX_DISPOSABLE_PATH}${segment(address)}`,
		}),
		{ log: ({ address }) => ({ domain: domainOf(address) }) },
	);
