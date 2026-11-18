import type { VirustotalEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	VirustotalEndpointInputSchemas as Inputs,
	VirustotalEndpointOutputSchemas as Outputs,
} from './types';

/** A domain is addressed by its name, which is the object id too. */
export const get: VirustotalEndpoints['domainsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.get',
			input: Inputs.domainsGet,
			output: Outputs.domainsGet,
		},
		input,
		({ domain, relationships }) => ({
			method: 'GET',
			path: `/domains/${segment(domain)}`,
			query: { relationships },
		}),
		{
			log: (_, result) => ({
				id: result.data?.id ?? undefined,
				malicious: result.data?.attributes?.last_analysis_stats?.malicious ?? 0,
				registrar: result.data?.attributes?.registrar ?? undefined,
			}),
		},
	);

/** Reanalyses the domain, answering a descriptor for the new analysis. */
export const rescan: VirustotalEndpoints['domainsRescan'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.rescan',
			input: Inputs.domainsRescan,
			output: Outputs.domainsRescan,
		},
		input,
		({ id }) => ({ method: 'POST', path: `/domains/${segment(id)}/analyse` }),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				analysis: result.data?.id ?? undefined,
			}),
		},
	);

/** An IP is addressed by the address itself. */
export const ipGet: VirustotalEndpoints['ipAddressesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ipAddresses.get',
			input: Inputs.ipAddressesGet,
			output: Outputs.ipAddressesGet,
		},
		input,
		({ ip, relationships }) => ({
			method: 'GET',
			path: `/ip_addresses/${segment(ip)}`,
			query: { relationships },
		}),
		{
			log: (_, result) => ({
				id: result.data?.id ?? undefined,
				malicious: result.data?.attributes?.last_analysis_stats?.malicious ?? 0,
				country: result.data?.attributes?.country ?? undefined,
			}),
		},
	);

export const ipRescan: VirustotalEndpoints['ipAddressesRescan'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ipAddresses.rescan',
			input: Inputs.ipAddressesRescan,
			output: Outputs.ipAddressesRescan,
		},
		input,
		({ id }) => ({
			method: 'POST',
			path: `/ip_addresses/${segment(id)}/analyse`,
		}),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				analysis: result.data?.id ?? undefined,
			}),
		},
	);
