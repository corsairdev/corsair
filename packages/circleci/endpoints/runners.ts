import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { auditPayload } from './logging';
import { circleCIV3Call, compact } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * Lists self-hosted runners.
 *
 * Mapped to `GET /api/v3/runner` from `circleci-cli`'s `runner.go`, not
 * live-tested - this development account has no self-hosted runner namespace
 * to query against. Not mirrored: runner availability and connection state
 * are live status, the same reasoning that keeps pipelines and workflows out
 * of the mirror.
 *
 * **Uses `circleCIV3Call`, not `circleCIV3ListCall`.** This route's real
 * response is `{"items": [...]}`, confirmed from `circleci-cli`'s own
 * `ListRunnerInstances` - a flat, v2-shaped envelope with no `data`/`page`
 * JSON:API wrapping and no pagination cursor at all, unlike its
 * `orb/packages` sibling on the same v3 base. `circleCIV3Call`'s generic
 * unwrap (`if ('data' in response) return response.data; return response as
 * T`) falls through to the second branch here, since there is no `data` key
 * to find - which is exactly the behaviour this route needs. An earlier
 * version of this function used `circleCIV3ListCall` instead, assuming the
 * same envelope as `orb/packages`; that version's `items` would have
 * silently come back empty on every real call, since there is no `data` key
 * for it to read from.
 */
export const list: CircleCIEndpoints['runnersList'] = async (ctx, input) => {
	const result = await circleCIV3Call<CircleCIEndpointOutputs['runnersList']>(
		ctx,
		'runner',
		{
			query: compact({
				namespace: input.namespace,
				'resource-class': input.resourceClass,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'circleci.runners.list',
		{
			...auditPayload(input, ['namespace', 'resourceClass']),
			returned: result.items.length,
		},
		'completed',
	);
	return result;
};
