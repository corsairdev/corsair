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
		() => ({ method: 'GET', path: '/v1/dnc_domains' }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

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
			shape: (raw) => {
				// The create answers { status: "success" }; anything else is a
				// failure the caller must see rather than a fabricated success.
				// unknown: raw is the untouched response body; only the status
				// flag is inspected before the output schema parses it.
				const record = (raw ?? {}) as { status?: unknown };
				if (record.status !== 'success') {
					throw new Error(
						`PersistIQ dncDomains.create: unexpected answer ${JSON.stringify(raw)}`,
					);
				}
				return { status: 'success' };
			},
			log: (_, result) => ({ success: result.status === 'success' }),
		},
	);
