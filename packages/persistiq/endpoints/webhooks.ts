import type { PersistiqEndpoints } from '..';
import { call } from './call';
import {
	PersistiqEndpointInputSchemas as Inputs,
	PersistiqEndpointOutputSchemas as Outputs,
} from './types';

export const getSettings: PersistiqEndpoints['webhooksGetSettings'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.getSettings',
			input: Inputs.webhooksGetSettings,
			output: Outputs.webhooksGetSettings,
		},
		input,
		() => ({ method: 'GET', path: '/v1/webhook_plugin' }),
		{ log: (_, page) => ({ enabled: page.data[0]?.enabled ?? undefined }) },
	);

export const updateSettings: PersistiqEndpoints['webhooksUpdateSettings'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.updateSettings',
			input: Inputs.webhooksUpdateSettings,
			output: Outputs.webhooksUpdateSettings,
		},
		input,
		(body) => ({ method: 'PUT', path: '/v1/webhook_plugin', body }),
		{ log: (_, page) => ({ enabled: page.data[0]?.enabled ?? undefined }) },
	);
