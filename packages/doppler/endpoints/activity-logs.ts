import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

/**
 * Not mirrored - each log entry embeds the acting user's real name and
 * email (confirmed live). Never logged, never mirrored. See
 * `endpoints/logging.ts`.
 */

/** Lists workplace activity log entries, paginated. */
export const list: DopplerEndpoints['activityLogsList'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<DopplerEndpointOutputs['activityLogsList']>(
		ctx,
		'logs',
		{
			query: compact({ page: input.page, per_page: input.perPage }),
		},
	);

	await logEventFromContext(
		ctx,
		'doppler.activityLogs.list',
		{ returned: result.logs.length },
		'completed',
	);
	return result;
};

/** Retrieves a single activity log entry by id. */
export const retrieve: DopplerEndpoints['activityLogsRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		log: DopplerEndpointOutputs['activityLogsRetrieve'];
	}>(ctx, 'logs/log', { query: { log: input.log } });

	await logEventFromContext(
		ctx,
		'doppler.activityLogs.retrieve',
		auditPayload(input, ['log']),
		'completed',
	);
	return result.log;
};
