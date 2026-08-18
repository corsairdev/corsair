import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { nextDNSCall } from './shared';
import type { NextDNSProfileSummary } from './types';

/**
 * `NEXTDNS_LOGIN`'s catalog description describes a real NextDNS mechanism
 * ("verify credentials and obtain session headers and cookies") - but the
 * real endpoint behind that description (`POST /accounts/@login`, confirmed
 * from an independent open-source client's source, not the provider's own
 * docs) authenticates with email + password (plus an optional 2FA code),
 * not the `X-Api-Key` header this entire 71-op catalog is built on, and
 * isn't documented anywhere in the provider's public API reference.
 *
 * Implemented instead as credential verification using the one credential
 * this plugin actually declares: a successful `GET /profiles` call (the
 * cheapest already-authenticated read in this catalog) proves the API key
 * is valid. This deliberately does not accept or forward an email/password -
 * doing so would mean silently asking for a second, materially more
 * sensitive credential the catalog never declared, against an undocumented
 * endpoint.
 */
export const login: NextDNSEndpoints['authLogin'] = async (ctx) => {
	const result = await nextDNSCall<{ data: NextDNSProfileSummary[] }>(
		ctx,
		'/profiles',
	);
	const profileCount = result.data?.length ?? 0;

	await logEventFromContext(ctx, 'nextdns.auth.login', {}, 'completed');
	return { valid: true, profileCount };
};
