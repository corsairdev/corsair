import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeAbuseIPDBRequest } from '../client';
import type { AbuseIPDBEndpoints } from '../index';
import type { CheckBlockResponse } from './types';
import { CheckBlockResponseSchema } from './types';

/**
 * Check a CIDR network block and list the addresses within it that have
 * been reported to AbuseIPDB.
 *
 * API: GET /api/v2/check-block
 * Docs: https://docs.abuseipdb.com/#check-block-endpoint
 */
export const check: AbuseIPDBEndpoints['checkBlock'] = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('abuseipdb', 'api_key');
	}

	const response = await makeAbuseIPDBRequest<{
		data: CheckBlockResponse;
	}>('check-block', ctx.key, {
		query: {
			network: input.network,
			maxAgeInDays: input.maxAgeInDays,
		},
	});

	const blockResult = CheckBlockResponseSchema.parse(response.data);

	await logEventFromContext(
		ctx,
		'abuseipdb.block.check',
		{ network: input.network },
		'completed',
	);

	return blockResult;
};
