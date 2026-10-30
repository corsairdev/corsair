import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheProfile, invalidateCachedProfile } from './persist';
import { compactBody, nextDNSCall } from './shared';
import type { NextDNSProfile, NextDNSProfileSummary } from './types';

/** Lists every profile the API key can see. */
export const list: NextDNSEndpoints['profilesList'] = async (ctx) => {
	const result = await nextDNSCall<{ data: NextDNSProfileSummary[] }>(
		ctx,
		'/profiles',
	);
	const profiles = result.data ?? [];

	for (const profile of profiles) {
		await cacheProfile(ctx.db?.profiles, profile);
	}

	await logEventFromContext(ctx, 'nextdns.profiles.list', {}, 'completed');
	return profiles;
};

/** Gets full profile details, including nested settings and lists. */
export const get: NextDNSEndpoints['profilesGet'] = async (ctx, input) => {
	const result = await nextDNSCall<{ data: NextDNSProfile }>(
		ctx,
		`/profiles/${input.profileId}`,
	);

	await cacheProfile(ctx.db?.profiles, result.data);
	await logEventFromContext(
		ctx,
		'nextdns.profiles.get',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

/** Creates a new profile. `name` is the only confirmed-required field. */
export const create: NextDNSEndpoints['profilesCreate'] = async (
	ctx,
	input,
) => {
	const result = await nextDNSCall<{ data: NextDNSProfileSummary }>(
		ctx,
		'/profiles',
		{
			method: 'POST',
			body: compactBody({
				name: input.name,
				security: input.security,
				privacy: input.privacy,
				parentalControl: input.parentalControl,
				settings: input.settings,
				denylist: input.denylist,
				allowlist: input.allowlist,
				rewrites: input.rewrites,
			}),
		},
	);

	await cacheProfile(ctx.db?.profiles, result.data);
	await logEventFromContext(ctx, 'nextdns.profiles.create', {}, 'completed');
	return result.data;
};

/** Partially updates a profile - only the fields provided are changed. */
export const update: NextDNSEndpoints['profilesUpdate'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}`, {
		method: 'PATCH',
		body: compactBody({
			name: input.name,
			security: input.security,
			privacy: input.privacy,
			parentalControl: input.parentalControl,
			settings: input.settings,
			denylist: input.denylist,
			allowlist: input.allowlist,
			rewrites: input.rewrites,
		}),
	});
	await invalidateCachedProfile(ctx.db?.profiles, input.profileId);

	await logEventFromContext(
		ctx,
		'nextdns.profiles.update',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return { id: input.profileId };
};

/** `NEXTDNS_DELETE_CONFIG` - deletes a profile by id. Cannot be undone. */
export const deleteProfile: NextDNSEndpoints['profilesDelete'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}`, {
		method: 'DELETE',
	});
	await invalidateCachedProfile(ctx.db?.profiles, input.profileId);

	await logEventFromContext(
		ctx,
		'nextdns.profiles.delete',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return { id: input.profileId };
};

/**
 * `NEXTDNS_RENAME_CONFIG` - a thin, name-only wrapper over `profiles.update`,
 * kept as its own operation because the catalog lists it separately.
 */
export const rename: NextDNSEndpoints['profilesRename'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}`, {
		method: 'PATCH',
		body: { name: input.name },
	});
	await invalidateCachedProfile(ctx.db?.profiles, input.profileId);

	await logEventFromContext(
		ctx,
		'nextdns.profiles.rename',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return { id: input.profileId };
};
