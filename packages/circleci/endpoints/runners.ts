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
 */
export const list: CircleCIEndpoints['runnersList'] = async (ctx, input) => {
	const result = await circleCIV3Call<CircleCIEndpointOutputs['runnersList']>(
		ctx,
		'runner',
		{
			query: compact({
				namespace: input.namespace,
				'resource-class': input.resourceClass,
				'page[cursor]': input.pageCursor,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'circleci.runners.list',
		{
			...auditPayload(input, ['namespace', 'resourceClass']),
			returned: result.length,
		},
		'completed',
	);
	return result;
};
