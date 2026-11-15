import type { RenderformEndpoints } from '..';
import { call } from './call';
import {
	RenderformEndpointInputSchemas as Inputs,
	RenderformEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The organization's usage: credits spent against the plan, plus the next renewal.
 *
 * Worth reading before a bulk render, because a render costs a credit unless it is
 * cached, and a `402` means the balance is gone rather than that the request was
 * wrong.
 */
export const usage: RenderformEndpoints['usage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'usage',
			input: Inputs.usage,
			output: Outputs.usage,
		},
		input,
		() => ({ method: 'GET', path: '/api/v1/usage', replayable: true }),
		{
			log: (_, result) => ({
				plan: result.plan?.name ?? undefined,
				creditsUsed: result.credits?.used ?? undefined,
				creditsTotal: result.credits?.total ?? undefined,
			}),
		},
	);

/**
 * The fonts available to a template. This is on `/api/v1` while templates are on
 * `/api/v2`, which is a quirk of the API rather than a mistake here.
 */
export const fonts: RenderformEndpoints['fonts'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fonts',
			input: Inputs.fonts,
			output: Outputs.fonts,
		},
		input,
		() => ({ method: 'GET', path: '/api/v1/fonts', replayable: true }),
		{
			log: (_, result) => ({ fonts: result.length }),
		},
	);
