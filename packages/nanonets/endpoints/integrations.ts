import type { NanonetsEndpoints } from '..';
import { call } from './call';
import {
	NanonetsEndpointInputSchemas as Inputs,
	NanonetsEndpointOutputSchemas as Outputs,
} from './types';

export const list: NanonetsEndpoints['integrationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'integrations.list',
			input: Inputs.integrationsList,
			output: Outputs.integrationsList,
		},
		input,
		() => ({
			method: 'GET',
			path: '/externalIntegrations',
			replaySafe: true,
		}),
		{
			shape: (raw) => ({ integrations: Array.isArray(raw) ? raw : [] }),
			log: (_, result) => ({ count: result.integrations.length }),
		},
	);

export const executeQuery: NanonetsEndpoints['integrationsExecuteQuery'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'integrations.executeQuery',
			input: Inputs.integrationsExecuteQuery,
			output: Outputs.integrationsExecuteQuery,
		},
		input,
		({ external_integration_id, query }) => ({
			method: 'POST',
			path: `/externalIntegrations/${encodeURIComponent(external_integration_id)}/executequery`,
			body: { query },
		}),
		{
			shape: (raw) => ({ rows: Array.isArray(raw) ? raw : [] }),
			log: ({ external_integration_id }, result) => ({
				external_integration_id,
				rows: result.rows.length,
			}),
		},
	);
