import { asRecord } from 'corsair/core';
import type { LoomioContext, LoomioEndpoints } from '..';
import { makeLoomioRequest } from '../client';
import { call, resolveBaseUrl, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	nextOffset,
	LoomioEndpointOutputSchemas as Outputs,
	relatedQuery,
} from './types';

const MEMBER_PAGE = 500;
const MAX_MEMBER_PAGES = 200;

/**
 * The group's stored email spellings, keyed by their lowercase form. Loomio's
 * memberships#create subtracts the sent list from the stored emails as plain
 * Ruby strings, so with remove_absent a member listed as `Ada@Example.org`
 * whose account says `ada@example.org` would be revoked. Admins (the only
 * callers manage accepts) see every member's user_email on the list route.
 */
async function storedEmails(
	ctx: LoomioContext,
	groupId: number,
): Promise<Map<string, string>> {
	const connection = { key: ctx.key, baseUrl: await resolveBaseUrl(ctx) };
	const byLower = new Map<string, string>();
	let offset: number | undefined = 0;
	for (let page = 0; offset !== undefined && page < MAX_MEMBER_PAGES; page++) {
		const envelope = asRecord(
			await makeLoomioRequest(connection, {
				method: 'GET',
				path: '/memberships',
				query: { group_id: groupId, limit: MEMBER_PAGE, offset, compact: 1 },
			}),
		);
		const memberships = Array.isArray(envelope?.memberships)
			? envelope.memberships
			: [];
		for (const membership of memberships) {
			const email = asRecord(membership)?.user_email;
			if (typeof email === 'string') byLower.set(email.toLowerCase(), email);
		}
		const total = asRecord(envelope?.meta)?.total;
		offset = nextOffset(
			typeof total === 'number' ? total : null,
			offset,
			memberships.length,
		);
	}
	return byLower;
}

export const list: LoomioEndpoints['membershipsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memberships.list',
			input: Inputs.membershipsList,
			output: Outputs.membershipsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/memberships',
			query: {
				group_id: parsed.group_id,
				limit: parsed.limit,
				offset: parsed.offset,
				...relatedQuery(parsed),
			},
		}),
		{
			shape: (raw, parsed) =>
				withPaging(raw, 'memberships', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.memberships.length }),
		},
	);

export const manage: LoomioEndpoints['membershipsManage'] = async (
	ctx,
	input,
) => {
	const parsed = Inputs.membershipsManage.parse(input ?? {});
	let emails = parsed.emails;
	if (parsed.remove_absent) {
		const stored = await storedEmails(ctx, parsed.group_id);
		emails = emails.map(
			(email) => stored.get(email.trim().toLowerCase()) ?? email,
		);
	}
	return call(
		ctx,
		{
			event: 'memberships.manage',
			input: Inputs.membershipsManage,
			output: Outputs.membershipsManage,
		},
		{ ...parsed, emails },
		// The controller checks `remove_absent.to_i == 1`, and true.to_i raises
		// in Ruby, so the flag goes out as 1 or 0 (documented legacy values).
		({ group_id, emails, remove_absent }) => ({
			method: 'POST',
			path: '/memberships',
			body: {
				group_id,
				emails,
				remove_absent:
					remove_absent === undefined ? undefined : remove_absent ? 1 : 0,
			},
		}),
		{
			// Counts only: the email lists are personal data.
			log: ({ group_id }, result) => ({
				groupId: group_id,
				added: result.added_emails?.length ?? 0,
				removed: result.removed_emails?.length ?? 0,
			}),
		},
	);
};
