import { logEventFromContext } from 'corsair/core';
import type { HabiticaEndpoints } from '../index';
import { HabiticaChallengeEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import {
	compactBody,
	compactQuery,
	habiticaCall,
	habiticaExportRaw,
	pathSegment,
} from './shared';
import type { HabiticaEndpointOutputs } from './types';

const LABEL = 'challenge';

/** Creates a challenge inside a group. */
export const create: HabiticaEndpoints['challengesCreate'] = async (
	ctx,
	input,
) => {
	const { groupId, ...challenge } = input;
	const result = await habiticaCall<
		HabiticaEndpointOutputs['challengesCreate']
	>(ctx, 'challenges', {
		method: 'POST',
		body: compactBody({ group: groupId, ...challenge }),
	});

	await cacheEntity(ctx.db.challenges, HabiticaChallengeEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.challenges.create',
		auditPayload(input, ['groupId']),
		'completed',
	);
	return result;
};

/** Retrieves one challenge. */
export const get: HabiticaEndpoints['challengesGet'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['challengesGet']>(
		ctx,
		`challenges/${pathSegment(input.challengeId)}`,
	);

	await cacheEntity(ctx.db.challenges, HabiticaChallengeEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.challenges.get',
		auditPayload(input, ['challengeId']),
		'completed',
	);
	return result;
};

/**
 * Duplicates a challenge.
 *
 * Not idempotent: each call produces another copy. Replaying it after a
 * transport failure creates a second challenge rather than returning the first.
 */
export const clone: HabiticaEndpoints['challengesClone'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['challengesClone']>(
		ctx,
		`challenges/${pathSegment(input.challengeId)}/clone`,
		{ method: 'POST' },
	);

	await cacheEntity(ctx.db.challenges, HabiticaChallengeEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.challenges.clone',
		auditPayload(input, ['challengeId']),
		'completed',
	);
	return result;
};

/**
 * Deletes a challenge permanently, along with its tasks on every member's
 * account. Required eviction - Habitica hard-deletes.
 */
export const remove: HabiticaEndpoints['challengesDelete'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['challengesDelete']
	>(ctx, `challenges/${pathSegment(input.challengeId)}`, { method: 'DELETE' });

	// Logged before the eviction - see the note on `tasks.delete`.
	await logEventFromContext(
		ctx,
		'habitica.challenges.delete',
		auditPayload(input, ['challengeId']),
		'completed',
	);

	await evictEntity(ctx.db.challenges, input.challengeId, LABEL, {
		required: true,
	});

	return result;
};

/** Joins a challenge, copying its tasks onto the account. */
export const join: HabiticaEndpoints['challengesJoin'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['challengesJoin']>(
		ctx,
		`challenges/${pathSegment(input.challengeId)}/join`,
		{ method: 'POST' },
	);

	await cacheEntity(ctx.db.challenges, HabiticaChallengeEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.challenges.join',
		auditPayload(input, ['challengeId']),
		'completed',
	);
	return result;
};

/**
 * Leaves a challenge.
 *
 * The challenge itself still exists - this is the caller's membership ending -
 * so the mirrored challenge row is kept rather than evicted. What changes is
 * the caller's task list, which `tasks.list` re-reads.
 */
export const leave: HabiticaEndpoints['challengesLeave'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['challengesLeave']>(
		ctx,
		`challenges/${pathSegment(input.challengeId)}/leave`,
		{ method: 'POST', query: compactQuery({ keep: input.keep }) },
	);

	await logEventFromContext(
		ctx,
		'habitica.challenges.leave',
		auditPayload(input, ['challengeId', 'keep']),
		'completed',
	);
	return result;
};

/** Lists the challenges of one group. */
export const listByGroup: HabiticaEndpoints['challengesListByGroup'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['challengesListByGroup']
	>(ctx, `challenges/groups/${pathSegment(input.groupId)}`);

	await cacheEntities(ctx.db.challenges, HabiticaChallengeEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.challenges.listByGroup',
		{ ...auditPayload(input, ['groupId']), returned: result.length },
		'completed',
	);
	return result;
};

/**
 * Lists the challenges the account takes part in.
 *
 * `page` is required and zero-indexed. Habitica answers 400 without it - the
 * route validates `page` with `notEmpty().isInt({min:0})` - which is why the
 * input schema does not make it optional. Ten rows came back per page on the
 * account used for development.
 */
export const listForUser: HabiticaEndpoints['challengesListForUser'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['challengesListForUser']
	>(ctx, 'challenges/user', {
		query: compactQuery({
			page: input.page,
			member: input.member,
			owned: input.owned,
			search: input.search,
		}),
	});

	await cacheEntities(ctx.db.challenges, HabiticaChallengeEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.challenges.listForUser',
		{
			...auditPayload(input, ['page', 'member', 'owned']),
			returned: result.length,
		},
		'completed',
	);
	return result;
};

/**
 * Exports a challenge's tasks and participants as CSV.
 *
 * One of four operations in this plugin whose response is not JSON. The
 * document is returned as text with its declared content type rather than
 * parsed into rows: the columns depend on the challenge's own tasks, so any
 * parser here would be inventing a schema the next challenge breaks.
 */
export const exportCsv: HabiticaEndpoints['challengesExportCsv'] = async (
	ctx,
	input,
) => {
	const result = await habiticaExportRaw(
		ctx,
		`challenges/${pathSegment(input.challengeId)}/export/csv`,
	);

	await logEventFromContext(
		ctx,
		'habitica.challenges.exportCsv',
		{ ...auditPayload(input, ['challengeId']), bytes: result.body.length },
		'completed',
	);
	return result;
};
