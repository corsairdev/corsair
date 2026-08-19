import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, nextDNSCall } from './shared';
import type { NextDNSDenylistEntry } from './types';

export const list: NextDNSEndpoints['denylistList'] = async (ctx, input) => {
	const result = await nextDNSCall<{ data: NextDNSDenylistEntry[] }>(
		ctx,
		`/profiles/${input.profileId}/denylist`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.denylist.list',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data ?? [];
};

/** Confirmed live: `POST` appends a single entry without disturbing the rest of the list. */
export const add: NextDNSEndpoints['denylistAdd'] = async (ctx, input) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/denylist`, {
		method: 'POST',
		body: compactBody({ id: input.id, active: input.active }),
	});
	await logEventFromContext(
		ctx,
		'nextdns.denylist.add',
		auditPayload(input, ['profileId', 'id']),
		'completed',
	);
	return { id: input.id };
};

export const remove: NextDNSEndpoints['denylistRemove'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/denylist/${input.id}`, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'nextdns.denylist.remove',
		auditPayload(input, ['profileId', 'id']),
		'completed',
	);
	return { id: input.id };
};

/** Confirmed live: `PATCH .../denylist/:id` toggles `active` without removing the entry. */
export const update: NextDNSEndpoints['denylistUpdate'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/denylist/${input.id}`, {
		method: 'PATCH',
		body: { active: input.active },
	});
	await logEventFromContext(
		ctx,
		'nextdns.denylist.update',
		auditPayload(input, ['profileId', 'id', 'active']),
		'completed',
	);
	return { id: input.id };
};

/** Full-replace via `PUT` - every existing entry not in `domains` is removed. */
export const replace: NextDNSEndpoints['denylistReplace'] = async (
	ctx,
	input,
) => {
	const result = await nextDNSCall<{ data: NextDNSDenylistEntry[] }>(
		ctx,
		`/profiles/${input.profileId}/denylist`,
		{ method: 'PUT', body: input.domains },
	);
	await logEventFromContext(
		ctx,
		'nextdns.denylist.replace',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data ?? input.domains;
};
