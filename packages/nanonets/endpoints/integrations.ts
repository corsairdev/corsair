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
			// A changed or wrapped payload must fail the array parse instead of
			// reading as an empty list; only a genuinely empty body falls back.
			shape: (raw) => ({ integrations: raw ?? [] }),
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
			// See integrations.list: only an empty body falls back to no rows.
			shape: (raw) => ({ rows: raw ?? [] }),
			log: ({ external_integration_id }, result) => ({
				external_integration_id,
				rows: result.rows.length,
			}),
		},
	);
