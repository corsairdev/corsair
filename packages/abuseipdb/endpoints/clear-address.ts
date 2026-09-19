import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeAbuseIPDBRequest } from '../client';
import type { AbuseIPDBEndpoints } from '../index';
import type { ClearAddressResponse } from './types';
import { ClearAddressResponseSchema } from './types';

/**
 * Remove all reports for an IP address from your account, and return the
 * number of reports that were deleted.
 *
 * API: DELETE /api/v2/clear-address
 * Docs: https://docs.abuseipdb.com/#clear-address-endpoint
 */
export const clear: AbuseIPDBEndpoints['clearAddress'] = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('abuseipdb', 'api_key');
	}

	const response = await makeAbuseIPDBRequest<{
		data: ClearAddressResponse;
	}>('clear-address', ctx.key, {
		method: 'DELETE',
		query: {
			ipAddress: input.ipAddress,
		},
	});

	const clearResult = ClearAddressResponseSchema.parse(response.data);

	if (ctx.db?.reports) {
		try {
			await ctx.db.reports.deleteByEntityId(input.ipAddress);
		} catch (error) {
			console.warn('Failed to remove report from database:', error);
		}
	}
	if (ctx.db?.ipChecks) {
		try {
			await ctx.db.ipChecks.deleteByEntityId(input.ipAddress);
		} catch (error) {
			console.warn('Failed to remove IP check from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'abuseipdb.address.clear',
		{ ipAddress: input.ipAddress },
		'completed',
	);

	return clearResult;
};
