import type { HotspotSystemEndpoints } from '..';
import { readOne } from './call';
import {
	HotspotSystemEndpointInputSchemas as Inputs,
	HotspotSystemEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Confirms the API answers. Documented as `{"ping": "pong"}`.
 *
 * The endpoint itself needs no key, but Corsair resolves one before it invokes
 * any endpoint, so a call without a connected account fails before it gets
 * here.
 */
export const pingCheck: HotspotSystemEndpoints['pingCheck'] = (ctx, input) =>
	readOne(
		ctx,
		{
			event: 'ping.check',
			input: Inputs['ping.check'],
			output: Outputs['ping.check'],
		},
		input,
		'/ping',
	);

/** Read the resource owner: a user ID and an operator name. */
export const meGet: HotspotSystemEndpoints['meGet'] = (ctx, input) =>
	readOne(
		ctx,
		{
			event: 'me.get',
			input: Inputs['me.get'],
			output: Outputs['me.get'],
		},
		input,
		'/me',
		// The operator is a person's name, so only the numeric ID is logged.
		{ log: (result) => ({ userId: result.userId ?? undefined }) },
	);
