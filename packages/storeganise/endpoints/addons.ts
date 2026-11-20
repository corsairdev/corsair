import type { StoreganiseEndpoints } from '..';
import { call } from './call';
import {
	StoreganiseEndpointInputSchemas as Inputs,
	StoreganiseEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoreganiseEndpoints['addonsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addons.list',
			input: Inputs.addonsList,
			output: Outputs.addonsList,
		},
		input,
		(_parsed, base) => ({
			method: 'GET',
			base,
			path: '/admin/addons',
		}),
		{
			log: (_, addons) => ({ count: addons.length }),
		},
	);

export const get: StoreganiseEndpoints['addonsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addons.get',
			input: Inputs.addonsGet,
			output: Outputs.addonsGet,
		},
		input,
		({ addonId }, base) => ({
			method: 'GET',
			base,
			path: `/admin/addons/${encodeURIComponent(addonId)}`,
		}),
		{
			log: (_, addon) => ({ addonId: addon.id }),
		},
	);
