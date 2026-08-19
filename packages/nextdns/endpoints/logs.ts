import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactQuery, nextDNSCall } from './shared';
import type { NextDNSLogsResponse } from './types';

export const get: NextDNSEndpoints['logsGet'] = async (ctx, input) => {
	const result = await nextDNSCall<NextDNSLogsResponse>(
		ctx,
		`/profiles/${input.profileId}/logs`,
		{
			query: compactQuery({
				from: input.from,
				to: input.to,
				limit: input.limit,
				cursor: input.cursor,
				raw: input.raw,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'nextdns.logs.get',
		auditPayload(input, ['profileId', 'from', 'to']),
		'completed',
	);
	return result;
};

/**
 * Confirmed live: this returns the raw CSV log export directly
 * (`Content-Type: text/csv`), not a JSON-wrapped download URL despite what
 * the catalog description claims.
 */
export const download: NextDNSEndpoints['logsDownload'] = async (
	ctx,
	input,
) => {
	const result = await nextDNSCall<string>(
		ctx,
		`/profiles/${input.profileId}/logs/download`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.logs.download',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result ?? '';
};

/** Cannot be undone - deletes every stored query log for the profile. */
export const clear: NextDNSEndpoints['logsClear'] = async (ctx, input) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/logs`, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'nextdns.logs.clear',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return { cleared: true };
};
