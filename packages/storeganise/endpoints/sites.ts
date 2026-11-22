import type { StoreganiseEndpoints } from '..';
import { call } from './call';
import {
	StoreganiseEndpointInputSchemas as Inputs,
	StoreganiseEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoreganiseEndpoints['sitesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sites.list',
			input: Inputs.sitesList,
			output: Outputs.sitesList,
		},
		input,
		({ search }, base) => ({
			method: 'GET',
			base,
			path: '/admin/sites',
			query: { search },
		}),
		{
			log: (_, sites) => ({ count: sites.length }),
		},
	);

export const get: StoreganiseEndpoints['sitesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sites.get',
			input: Inputs.sitesGet,
			output: Outputs.sitesGet,
		},
		input,
		({ siteIdOrCode }, base) => ({
			method: 'GET',
			base,
			path: `/admin/sites/${encodeURIComponent(siteIdOrCode)}`,
		}),
		{
			log: (_, site) => ({ siteId: site.id }),
		},
	);
