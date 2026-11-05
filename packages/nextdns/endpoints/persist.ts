import type { PluginEntityClient } from 'corsair/orm';
import type { NextDNSProfileEntity } from '../schema/database';
import type { NextDNSProfileSummary } from './types';

type ProfileStore = PluginEntityClient<typeof NextDNSProfileEntity>;

/** Best-effort: a caching failure must never fail the caller's real request. */
async function safely(fn: () => Promise<unknown>): Promise<void> {
	try {
		await fn();
	} catch {
		// Swallowed deliberately - persistence is a cache, not the source of
		// truth. The provider's own response is still returned to the caller.
	}
}

export async function cacheProfile(
	store: ProfileStore | undefined,
	profile: NextDNSProfileSummary,
): Promise<void> {
	if (!store) return;
	await safely(() =>
		store.upsertByEntityId(profile.id, {
			id: profile.id,
			name: profile.name,
			fingerprint: profile.fingerprint,
			role: profile.role,
		}),
	);
}

/**
 * Evicts a cached profile rather than trying to keep it fresh: `update`/
 * `rename` don't fetch the resulting profile back (unlike the sub-resource
 * `PATCH`s that follow up with a `GET`), so a cached `name` would go stale
 * after a rename; `delete` removes the profile entirely, so a stale entry
 * would otherwise point at a profile that no longer exists. Same "delete
 * doesn't evict" bug class this repo's Mailtrap plugin had for contacts.
 */
export async function invalidateCachedProfile(
	store: ProfileStore | undefined,
	profileId: string,
): Promise<void> {
	if (!store) return;
	await safely(() => store.deleteByEntityId(profileId));
}
