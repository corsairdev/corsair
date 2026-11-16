import type { NeutrinoEndpoints } from '..';
import { call } from './call';
import {
	NeutrinoEndpointInputSchemas as Inputs,
	NeutrinoEndpointOutputSchemas as Outputs,
} from './types';

/** Geolocation, currency and language for one IPv4 or IPv6 address. */
export const info: NeutrinoEndpoints['ipInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ip.info',
			input: Inputs.ipInfo,
			output: Outputs.ipInfo,
		},
		input,
		({ ip }) => ({ method: 'GET', path: '/ip-info', query: { ip } }),
		{
			// The address is the caller's customer data, so it is not logged.
			log: (_, result) => ({
				countryCode: result['country-code'] ?? undefined,
			}),
		},
	);

/**
 * Checks one address against the blocklists Neutrino tracks, with a flag per
 * threat type and the list of sensors that matched.
 */
export const blocklist: NeutrinoEndpoints['ipBlocklist'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ip.blocklist',
			input: Inputs.ipBlocklist,
			output: Outputs.ipBlocklist,
		},
		input,
		({ ip }) => ({ method: 'GET', path: '/ip-blocklist', query: { ip } }),
		{
			// The address is the caller's customer data, so it is not logged.
			log: (_, result) => ({
				listed: result['is-listed'] ?? undefined,
				listCount: result['list-count'] ?? undefined,
			}),
		},
	);

/** The network and hosting provider behind an address, rather than its place. */
export const probe: NeutrinoEndpoints['ipProbe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ip.probe',
			input: Inputs.ipProbe,
			output: Outputs.ipProbe,
		},
		input,
		({ ip }) => ({ method: 'GET', path: '/ip-probe', query: { ip } }),
		{
			// The address is the caller's customer data, so it is not logged.
			log: (_, result) => ({
				provider: result['provider-domain'] ?? undefined,
			}),
		},
	);
