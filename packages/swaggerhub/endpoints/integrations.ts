import { asRecord } from 'corsair/core';
import type { SwaggerhubEndpoints } from '..';
import { specPath } from '../client';
import { call, queryOf } from './call';
import {
	SwaggerhubEndpointInputSchemas as Inputs,
	SwaggerhubEndpointOutputSchemas as Outputs,
} from './types';

/** Integrations hang off one API version at `/integrations`. */
function integrationsPath(
	owner: string,
	api: string,
	version: string,
	integrationId?: string,
): string {
	const base = `${specPath('apis', owner, api, version)}/integrations`;
	return integrationId === undefined
		? base
		: `${base}/${encodeURIComponent(integrationId)}`;
}

export const list: SwaggerhubEndpoints['integrationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'integrations.list',
			input: Inputs.integrationsList,
			output: Outputs.integrationsList,
		},
		input,
		({ owner, api, version }) => ({
			method: 'GET',
			path: integrationsPath(owner, api, version),
		}),
		{
			shape: (raw, parsed) => {
				const record = asRecord(raw);
				if (!record) {
					throw new Error('SwaggerHub returned an unexpected integration list');
				}
				// `integrations` is optional in the spec, so a missing key is an
				// empty list; a present non-array fails the output schema.
				return {
					owner: parsed.owner,
					api: parsed.api,
					version: parsed.version,
					integrations: record.integrations ?? [],
				};
			},
			log: (_, result) => ({ count: result.integrations.length }),
		},
	);

/**
 * Runs the integration once, which pushes the stored definition to its target.
 * A 205 means the API was updated as part of the run.
 */
export const execute: SwaggerhubEndpoints['integrationsExecute'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'integrations.execute',
			input: Inputs.integrationsExecute,
			output: Outputs.integrationsExecute,
		},
		input,
		({ owner, api, version, integrationId, commitMessage }) => ({
			method: 'POST',
			path: `${integrationsPath(owner, api, version, integrationId)}/execute`,
			query: queryOf({ commitMessage }),
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
				integrationId: parsed.integrationId,
				executed: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				integrationId: parsed.integrationId,
			}),
		},
	);
