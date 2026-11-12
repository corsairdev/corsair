import type { RiteKitEndpoints } from '..';
import { call } from './call';
import {
	RiteKitEndpointInputSchemas as Inputs,
	RiteKitEndpointOutputSchemas as Outputs,
} from './types';

/**
 * `links.listCtas` is not wrapped: RiteKit's demo page says it "requires each
 * user to authenticate with RiteKit and cannot be shown in the Demo", i.e. it
 * needs a per-user OAuth consent this plugin's single Client ID cannot supply, so
 * its response shape is unpublished. `links.shorten` accepts the same `cta` value
 * from the Rite.ly dashboard.
 */
export const shorten: RiteKitEndpoints['linksShorten'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.shorten',
			input: Inputs.linksShorten,
			output: Outputs.linksShorten,
		},
		input,
		({ url, cta }) => ({
			method: 'GET',
			path: '/v1/link/short-link',
			query: { url, cta },
			// Each call creates a new rite.ly link and spends a credit, so a 5xx is
			// not sent again: RiteKit may have made the link before it failed.
			replayable: false,
		}),
		{
			log: (_, result) => ({
				shortened: result.url !== undefined && result.url !== null,
				remaining: result.limit?.remaining ?? undefined,
			}),
		},
	);
