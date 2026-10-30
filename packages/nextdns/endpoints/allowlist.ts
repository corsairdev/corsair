import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, nextDNSCall } from './shared';
import type { NextDNSAllowlistEntry } from './types';

export const get: NextDNSEndpoints['allowlistGet'] = async (ctx, input) => {
	const result = await nextDNSCall<{ data: NextDNSAllowlistEntry[] }>(
		ctx,
		`/profiles/${input.profileId}/allowlist`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.allowlist.get',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data ?? [];
};

export const add: NextDNSEndpoints['allowlistAdd'] = async (ctx, input) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/allowlist`, {
		method: 'POST',
		body: compactBody({ id: input.id, active: input.active }),
	});
	await logEventFromContext(
		ctx,
		'nextdns.allowlist.add',
		auditPayload(input, ['profileId', 'id']),
		'completed',
	);
	return { id: input.id };
};

export const deleteEntry: NextDNSEndpoints['allowlistDelete'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/allowlist/${input.id}`, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'nextdns.allowlist.delete',
		auditPayload(input, ['profileId', 'id']),
		'completed',
	);
	return { id: input.id };
};

export const update: NextDNSEndpoints['allowlistUpdate'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/allowlist/${input.id}`, {
		method: 'PATCH',
		body: { active: input.active },
	});
	await logEventFromContext(
		ctx,
		'nextdns.allowlist.update',
		auditPayload(input, ['profileId', 'id', 'active']),
		'completed',
	);
	return { id: input.id };
};

export const replace: NextDNSEndpoints['allowlistReplace'] = async (
	ctx,
	input,
) => {
	const result = await nextDNSCall<{ data: NextDNSAllowlistEntry[] }>(
		ctx,
		`/profiles/${input.profileId}/allowlist`,
		{ method: 'PUT', body: input.domains },
	);
	await logEventFromContext(
		ctx,
		'nextdns.allowlist.replace',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data ?? input.domains;
};
