import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, nextDNSCall } from './shared';
import type { NextDNSRewrite } from './types';

export const get: NextDNSEndpoints['rewritesGet'] = async (ctx, input) => {
	const result = await nextDNSCall<{ data: NextDNSRewrite[] }>(
		ctx,
		`/profiles/${input.profileId}/rewrites`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.rewrites.get',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data ?? [];
};

/**
 * `content` (the rewrite target) is not logged - it's caller-authored data
 * (an IP or hostname), not a structural identifier, matching this repo's
 * discipline of keeping free-text/target values out of audit payloads.
 */
export const add: NextDNSEndpoints['rewritesAdd'] = async (ctx, input) => {
	const result = await nextDNSCall<{ data: NextDNSRewrite }>(
		ctx,
		`/profiles/${input.profileId}/rewrites`,
		{
			method: 'POST',
			body: compactBody({
				name: input.name,
				content: input.content,
				type: input.type,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'nextdns.rewrites.add',
		auditPayload(input, ['profileId', 'name']),
		'completed',
	);
	return result.data;
};

export const deleteRewrite: NextDNSEndpoints['rewritesDelete'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/rewrites/${input.id}`, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'nextdns.rewrites.delete',
		auditPayload(input, ['profileId', 'id']),
		'completed',
	);
	return { id: input.id };
};
