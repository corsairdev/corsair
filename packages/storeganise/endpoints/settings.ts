import type { StoreganiseEndpoints } from '..';
import { call } from './call';
import {
	StoreganiseEndpointInputSchemas as Inputs,
	StoreganiseEndpointOutputSchemas as Outputs,
} from './types';

export const get: StoreganiseEndpoints['settingsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'settings.get',
			input: Inputs.settingsGet,
			output: Outputs.settingsGet,
		},
		input,
		(_parsed, base) => ({
			method: 'GET',
			base,
			path: '/admin/settings',
		}),
	);
