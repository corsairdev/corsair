import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { nextDNSCall } from './shared';
import type { NextDNSSetupLinkedIp } from './types';

/**
 * Updates the profile's Linked IP to the caller's current public IP.
 * Confirmed live: an empty `PATCH` body is accepted (200) - the provider
 * infers the IP from the request itself rather than a body field, matching
 * the operation's own description.
 */
export const updateLinkedIp: NextDNSEndpoints['setupUpdateLinkedIp'] = async (
	ctx,
	input,
) => {
	const result = await nextDNSCall<{ data: NextDNSSetupLinkedIp }>(
		ctx,
		`/profiles/${input.profileId}/setup/linkedip`,
		{ method: 'PATCH', body: {} },
	);
	await logEventFromContext(
		ctx,
		'nextdns.setup.updateLinkedIp',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};
