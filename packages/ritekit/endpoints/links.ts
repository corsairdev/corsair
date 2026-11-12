import type { RiteKitEndpoints } from '..';
import { call } from './call';
import {
	RiteKitEndpointInputSchemas as Inputs,
	RiteKitEndpointOutputSchemas as Outputs,
} from './types';

/**
 * RiteKit's demo page says this "requires each user to authenticate with
 * RiteKit", but live (11-12) the Client ID alone lists the account's own Link
 * Ads, which is what links.shorten needs for its `cta`.
 */
export const listCtas: RiteKitEndpoints['linksListCtas'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.listCtas',
			input: Inputs.linksListCtas,
			output: Outputs.linksListCtas,
		},
		input,
		() => ({
			method: 'GET',
			path: '/v1/link/cta',
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.list?.length ?? 0 }),
		},
	);

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
