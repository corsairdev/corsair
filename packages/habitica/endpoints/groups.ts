import { logEventFromContext } from 'corsair/core';
import type { HabiticaEndpoints } from '../index';
import { HabiticaGroupEntity } from '../schema/database';
import { auditPayload, countOf } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { compactBody, compactQuery, habiticaCall, pathSegment } from './shared';
import type { HabiticaEndpointOutputs } from './types';

const LABEL = 'group';

/**
 * The two group ids that are names rather than UUIDs.
 *
 * `GET /groups/:groupId` accepts either. Three separate catalog operations
 * resolve to that one route - `GET_GROUP` with a caller-supplied id,
 * `GET_PARTY` fixed to `party`, and `GET_GROUPS_HABITRPG` fixed to `habitrpg`.
 * They are registered separately so no catalog id is missing, but they are one
 * capability, not three.
 */
const PARTY_ALIAS = 'party';
const TAVERN_ALIAS = 'habitrpg';

/**
 * Creates a group.
 *
 * The catalog states guilds were removed in August 2023 and only `party` works,
 * while its own `GET_GROUPS`, `GET_GROUP` and `DELETE_GROUP` entries describe
 * guild behaviour. Both cannot be true. The plugin does not adjudicate: it
 * sends what the caller asked for and lets Habitica answer, because inventing a
 * client-side restriction would break callers if the catalog note is the stale
 * half.
 */
export const create: HabiticaEndpoints['groupsCreate'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['groupsCreate']>(
		ctx,
		'groups',
		{ method: 'POST', body: compactBody({ ...input }) },
	);

	await cacheEntity(ctx.db.groups, HabiticaGroupEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.groups.create',
		auditPayload(input, ['type', 'privacy']),
		'completed',
	);
	return result;
};

/** Lists groups of the requested kinds. */
export const list: HabiticaEndpoints['groupsList'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['groupsList']>(
		ctx,
		'groups',
		{
			query: compactQuery({
				type: input.type,
				paginate: input.paginate,
				page: input.page,
			}),
		},
	);

	await cacheEntities(ctx.db.groups, HabiticaGroupEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.groups.list',
		{ ...auditPayload(input, ['type', 'page']), returned: result.length },
		'completed',
	);
	return result;
};

/** Shared implementation behind the three ids that read one group. */
async function readGroup(
	ctx: Parameters<HabiticaEndpoints['groupsGet']>[0],
	groupId: string,
	event: string,
) {
	const result = await habiticaCall<HabiticaEndpointOutputs['groupsGet']>(
		ctx,
		`groups/${pathSegment(groupId)}`,
	);

	await cacheEntity(ctx.db.groups, HabiticaGroupEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(ctx, event, { groupId }, 'completed');
	return result;
}

/** Retrieves a group by id, or by the `party` / `habitrpg` aliases. */
export const get: HabiticaEndpoints['groupsGet'] = async (ctx, input) =>
	await readGroup(ctx, input.groupId, 'habitica.groups.get');

/**
 * Retrieves the caller's party.
 *
 * The same route as {@link get} with the id fixed. It keeps its own audit event
 * so the two stay distinguishable in a log even though they issue an identical
 * request.
 */
export const getParty: HabiticaEndpoints['groupsGetParty'] = async (ctx) =>
	await readGroup(ctx, PARTY_ALIAS, 'habitica.groups.getParty');

/** Retrieves the Tavern, the global public group. */
export const getTavern: HabiticaEndpoints['groupsGetTavern'] = async (ctx) =>
	await readGroup(ctx, TAVERN_ALIAS, 'habitica.groups.getTavern');

/** Updates a group's properties. Leader only. */
export const update: HabiticaEndpoints['groupsUpdate'] = async (ctx, input) => {
	const { groupId, ...changes } = input;
	const result = await habiticaCall<HabiticaEndpointOutputs['groupsUpdate']>(
		ctx,
		`groups/${pathSegment(groupId)}`,
		{ method: 'PUT', body: compactBody(changes) },
	);

	await cacheEntity(ctx.db.groups, HabiticaGroupEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.groups.update',
		auditPayload(input, ['groupId', 'privacy']),
		'completed',
	);
	return result;
};

/**
 * Leaves a group.
 *
 * The catalog calls this "Leave or Delete" and describes a two-step operation:
 * `POST /groups/:groupId/leave`, and "only if that fails",
 * `DELETE /groups/:groupId`. **That second route does not exist.** The server's
 * routing table has no DELETE under `/groups` other than the chat-message one,
 * and a live request confirms it: `DELETE /groups/<id>` answers `Not found.`,
 * which is the response for an unrouted path, while a real route with a missing
 * id answers `Group not found or you don't have access.` Both are 404s, so only
 * the message distinguishes them.
 *
 * So the fallback is not implemented. Writing it would add a request that can
 * only ever 404, and would make the failure of a legitimate leave look like a
 * delete that also failed.
 *
 * A welcome side effect: the operation has exactly one effect, so replaying it
 * after a transport failure cannot leave *and* delete. The retry hazard the
 * composite would have introduced does not exist.
 */
export const leave: HabiticaEndpoints['groupsLeave'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['groupsLeave']>(
		ctx,
		`groups/${pathSegment(input.groupId)}/leave`,
		{
			method: 'POST',
			query: compactQuery({
				keep: input.keep,
				keepChallenges: input.keepChallenges,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'habitica.groups.leave',
		auditPayload(input, ['groupId', 'keep', 'keepChallenges']),
		'completed',
	);
	return result;
};

/**
 * Lists a group's members.
 *
 * Paginated by cursor: `lastId` is the id of the last member of the previous
 * page. Members are other people and are not mirrored.
 */
export const listMembers: HabiticaEndpoints['groupsListMembers'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['groupsListMembers']
	>(ctx, `groups/${pathSegment(input.groupId)}/members`, {
		query: compactQuery({
			lastId: input.lastId,
			limit: input.limit,
			includeAllPublicFields: input.includeAllPublicFields,
		}),
	});

	await logEventFromContext(
		ctx,
		'habitica.groups.listMembers',
		{ ...auditPayload(input, ['groupId']), returned: result.length },
		'completed',
	);
	return result;
};

/**
 * Invites people to a group by uuid, email or username.
 *
 * The invitee list is logged as **counts per channel**, never as values. Email
 * addresses and usernames identify people who have not consented to appear in
 * this account's audit log.
 */
export const invite: HabiticaEndpoints['groupsInvite'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['groupsInvite']>(
		ctx,
		`groups/${pathSegment(input.groupId)}/invite`,
		{
			method: 'POST',
			body: compactBody({
				uuids: input.uuids,
				emails: input.emails,
				usernames: input.usernames,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'habitica.groups.invite',
		{
			groupId: input.groupId,
			uuids: countOf(input.uuids),
			emails: countOf(input.emails),
			usernames: countOf(input.usernames),
		},
		'completed',
	);
	return result;
};

/** Removes a member from the caller's party. Leader only. */
export const removeMember: HabiticaEndpoints['groupsRemoveMember'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['groupsRemoveMember']
	>(
		ctx,
		`groups/${pathSegment(input.groupId)}/removeMember/${pathSegment(input.memberId)}`,
		{ method: 'POST', query: compactQuery({ message: input.message }) },
	);

	// `message` is free text sent to the removed member and is deliberately
	// absent from the audit record.
	await logEventFromContext(
		ctx,
		'habitica.groups.removeMember',
		auditPayload(input, ['groupId', 'memberId']),
		'completed',
	);
	return result;
};

/** Invites the party to a quest. The account must own the scroll. */
export const inviteToQuest: HabiticaEndpoints['groupsInviteToQuest'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['groupsInviteToQuest']
	>(
		ctx,
		`groups/${pathSegment(input.groupId)}/quests/invite/${pathSegment(input.questKey)}`,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'habitica.groups.inviteToQuest',
		auditPayload(input, ['groupId', 'questKey']),
		'completed',
	);
	return result;
};
