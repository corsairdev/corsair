import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, nextDNSCall } from './shared';
import type {
	NextDNSPrivacy,
	NextDNSPrivacyBlocklist,
	NextDNSPrivacyNative,
} from './types';

export const get: NextDNSEndpoints['privacyGet'] = async (ctx, input) => {
	const result = await nextDNSCall<{ data: NextDNSPrivacy }>(
		ctx,
		`/profiles/${input.profileId}/privacy`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.privacy.get',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

/** Confirmed live: `PATCH .../privacy` returns `204` with no body - a `GET` after follows to return the resulting state. */
export const update: NextDNSEndpoints['privacyUpdate'] = async (ctx, input) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/privacy`, {
		method: 'PATCH',
		body: compactBody({
			disguisedTrackers: input.disguisedTrackers,
			allowAffiliate: input.allowAffiliate,
			blocklists: input.blocklists,
			natives: input.natives,
		}),
	});
	const result = await nextDNSCall<{ data: NextDNSPrivacy }>(
		ctx,
		`/profiles/${input.profileId}/privacy`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.privacy.update',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

export const addBlocklist: NextDNSEndpoints['privacyAddBlocklist'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/privacy/blocklists`, {
		method: 'POST',
		body: { id: input.id },
	});
	await logEventFromContext(
		ctx,
		'nextdns.privacy.addBlocklist',
		auditPayload(input, ['profileId', 'id']),
		'completed',
	);
	return { id: input.id };
};

export const deleteBlocklist: NextDNSEndpoints['privacyDeleteBlocklist'] =
	async (ctx, input) => {
		await nextDNSCall(
			ctx,
			`/profiles/${input.profileId}/privacy/blocklists/${input.id}`,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'nextdns.privacy.deleteBlocklist',
			auditPayload(input, ['profileId', 'id']),
			'completed',
		);
		return { id: input.id };
	};

export const replaceBlocklists: NextDNSEndpoints['privacyReplaceBlocklists'] =
	async (ctx, input) => {
		const body = input.ids.map((id) => ({ id }));
		const result = await nextDNSCall<{ data: NextDNSPrivacyBlocklist[] }>(
			ctx,
			`/profiles/${input.profileId}/privacy/blocklists`,
			{ method: 'PUT', body },
		);
		await logEventFromContext(
			ctx,
			'nextdns.privacy.replaceBlocklists',
			auditPayload(input, ['profileId']),
			'completed',
		);
		return result.data ?? body;
	};

export const addNative: NextDNSEndpoints['privacyAddNative'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/privacy/natives`, {
		method: 'POST',
		body: { id: input.id },
	});
	await logEventFromContext(
		ctx,
		'nextdns.privacy.addNative',
		auditPayload(input, ['profileId', 'id']),
		'completed',
	);
	return { id: input.id };
};

export const deleteNative: NextDNSEndpoints['privacyDeleteNative'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(
		ctx,
		`/profiles/${input.profileId}/privacy/natives/${input.id}`,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'nextdns.privacy.deleteNative',
		auditPayload(input, ['profileId', 'id']),
		'completed',
	);
	return { id: input.id };
};

export const replaceNatives: NextDNSEndpoints['privacyReplaceNatives'] = async (
	ctx,
	input,
) => {
	const body = input.ids.map((id) => ({ id }));
	const result = await nextDNSCall<{ data: NextDNSPrivacyNative[] }>(
		ctx,
		`/profiles/${input.profileId}/privacy/natives`,
		{ method: 'PUT', body },
	);
	await logEventFromContext(
		ctx,
		'nextdns.privacy.replaceNatives',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data ?? body;
};
