import type { PersistiqEndpoints } from '..';
import { call } from './call';
import {
	PersistiqEndpointInputSchemas as Inputs,
	PersistiqEndpointOutputSchemas as Outputs,
} from './types';

export const list: PersistiqEndpoints['dncDomainsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'dncDomains.list',
			input: Inputs.dncDomainsList,
			output: Outputs.dncDomainsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/v1/dnc_domains', query }),
		{ log: (_, page) => ({ count: page.dnc_domains.length }) },
	);

/**
 * The create answers `{ status, error, dnc_domain }`. The output schema
 * refuses a 200 that says status "error", so it fails loudly instead of
 * reading as a success.
 */
export const create: PersistiqEndpoints['dncDomainsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'dncDomains.create',
			input: Inputs.dncDomainsCreate,
			output: Outputs.dncDomainsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/dnc_domains', body }),
		{
			log: (_, result) => ({
				dncDomainId: result.dnc_domain?.id ?? undefined,
			}),
		},
	);
