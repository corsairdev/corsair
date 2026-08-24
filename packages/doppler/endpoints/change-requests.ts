import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

/**
 * Requires a Team or Enterprise plan - the catalog's own description states
 * it plainly, and this session's Developer-plan account confirmed a live
 * 403. Implemented and covered by mocked tests only.
 *
 * The response is a bare JSON array (not the `{change_requests: [...],
 * page}` envelope most other `v3` list routes use) - confirmed from the
 * spec fragment's own response schema, not assumed by analogy. See
 * `endpoints/types.ts`'s `ChangeRequestsListInputSchema` doc comment.
 */
export const list: DopplerEndpoints['changeRequestsList'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<
		DopplerEndpointOutputs['changeRequestsList']
	>(ctx, 'workplace/change_requests', {
		query: compact({
			page: input.page,
			per_page: input.perPage,
			// `[].join(',')` is `''`, not `undefined` - `compact` would keep an
			// empty string and send a literal `?status=`, which is not the same
			// request as omitting the filter. Only join when there is something
			// to filter on.
			status: input.status?.length ? input.status.join(',') : undefined,
			title: input.title,
		}),
	});

	await logEventFromContext(
		ctx,
		'doppler.changeRequests.list',
		{ ...auditPayload(input, []), returned: result.length },
		'completed',
	);
	return result;
};
