import { logEventFromContext } from 'corsair/core';
import type { HabiticaEndpoints } from '../index';
import { HabiticaTaskEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, compactQuery, habiticaCall, pathSegment } from './shared';
import type { HabiticaEndpointOutputs } from './types';

const LABEL = 'task';

/**
 * Task titles and notes are the account holder's own writing and can be about
 * anything, so no operation in this file logs them. Ids, types and positions
 * are recorded; text is not.
 *
 * The identifier lists are given per operation rather than shared, because each
 * one may only name keys its own input actually has.
 */

/** Creates a task: habit, daily, todo or reward. */
export const create: HabiticaEndpoints['tasksCreate'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tasksCreate']>(
		ctx,
		'tasks/user',
		{ method: 'POST', body: compactBody({ ...input }) },
	);

	await cacheEntity(ctx.db.tasks, HabiticaTaskEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'habitica.tasks.create',
		auditPayload(input, ['type']),
		'completed',
	);
	return result;
};

/**
 * Lists the account's tasks.
 *
 * There is no paging to do. `GET /tasks/user` takes no page or cursor parameter
 * and returns every matching task in one response, so a long-lived account's
 * whole list arrives at once - which is also why the whole result is mirrored
 * here rather than a page of it.
 */
export const list: HabiticaEndpoints['tasksList'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tasksList']>(
		ctx,
		'tasks/user',
		{ query: compactQuery({ type: input.type, dueDate: input.dueDate }) },
	);

	await cacheEntities(ctx.db.tasks, HabiticaTaskEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.tasks.list',
		{ ...auditPayload(input, ['type', 'dueDate']), returned: result.length },
		'completed',
	);
	return result;
};

/**
 * Retrieves any task by id - personal or challenge.
 *
 * The catalog calls this `HABITICA_GET_CHALLENGE_TASK` and displays it as "Get
 * Task by ID". The name points at challenges and the description does not; the
 * description is the specification, so this is `GET /tasks/:taskId`. See
 * {@link listChallengeTasks} for the actual challenge listing.
 */
export const get: HabiticaEndpoints['tasksGet'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tasksGet']>(
		ctx,
		`tasks/${pathSegment(input.taskId)}`,
	);

	await cacheEntity(ctx.db.tasks, HabiticaTaskEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'habitica.tasks.get',
		auditPayload(input, ['taskId']),
		'completed',
	);
	return result;
};

/** Updates a task. Omitted fields are left alone. */
export const update: HabiticaEndpoints['tasksUpdate'] = async (ctx, input) => {
	const { taskId, ...changes } = input;
	const result = await habiticaCall<HabiticaEndpointOutputs['tasksUpdate']>(
		ctx,
		`tasks/${pathSegment(taskId)}`,
		{ method: 'PUT', body: compactBody(changes) },
	);

	await cacheEntity(ctx.db.tasks, HabiticaTaskEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'habitica.tasks.update',
		auditPayload(input, ['taskId']),
		'completed',
	);
	return result;
};

/**
 * Deletes a task.
 *
 * The eviction is **required**. Habitica hard-deletes: the task 404s on the
 * next read and disappears from the list, with no soft-delete flag and no way
 * to fetch it again. A mirrored row left behind would describe something that
 * exists nowhere and can never be reconciled, so a failed eviction is reported
 * rather than swallowed.
 */
export const remove: HabiticaEndpoints['tasksDelete'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tasksDelete']>(
		ctx,
		`tasks/${pathSegment(input.taskId)}`,
		{ method: 'DELETE' },
	);

	// Logged before the eviction, not after. A required eviction throws when the
	// local mirror cannot be updated, and the remote delete has already
	// happened by then - so ordering it the other way loses the audit record of
	// a destructive change that really did occur.
	await logEventFromContext(
		ctx,
		'habitica.tasks.delete',
		auditPayload(input, ['taskId']),
		'completed',
	);

	await evictEntity(ctx.db.tasks, input.taskId, LABEL, { required: true });

	return result;
};

/**
 * Scores a task up or down.
 *
 * The response is the user's stats after the score, not the task, so there is
 * nothing here to mirror - and the mirrored copy of this task is now stale in
 * its `value`, `history` and `completed` fields. That is left as-is rather than
 * papered over with a follow-up read: spending a second request against a
 * 30-per-minute budget to refresh a snapshot the caller did not ask for is a
 * poor trade, and `schema/database.ts` documents these fields as point-in-time.
 *
 * Not idempotent. Scoring twice scores twice - it is the one operation here
 * whose replay changes the outcome rather than repeating it.
 */
export const score: HabiticaEndpoints['tasksScore'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tasksScore']>(
		ctx,
		`tasks/${pathSegment(input.taskId)}/score/${pathSegment(input.direction)}`,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'habitica.tasks.score',
		auditPayload(input, ['taskId', 'direction']),
		'completed',
	);
	return result;
};

/**
 * Moves a task to a position in its list. `0` is the top, `-1` the bottom.
 *
 * A completed todo cannot be moved: Habitica answers 400 `Can't move a
 * completed todo.` That is a precondition rather than a malformed request, and
 * it is not documented - it was found by scoring a todo and then trying to move
 * it.
 */
export const move: HabiticaEndpoints['tasksMove'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tasksMove']>(
		ctx,
		`tasks/${pathSegment(input.taskId)}/move/to/${pathSegment(input.position)}`,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'habitica.tasks.move',
		auditPayload(input, ['taskId', 'position']),
		'completed',
	);
	return result;
};

/**
 * Updates one checklist item's text.
 *
 * The catalog has update and delete for checklist items but no create, though
 * `POST /tasks/:taskId/checklist` exists. The asymmetry is matched rather than
 * corrected - the same decision as the missing webhook siblings.
 */
export const updateChecklistItem: HabiticaEndpoints['tasksUpdateChecklistItem'] =
	async (ctx, input) => {
		const result = await habiticaCall<
			HabiticaEndpointOutputs['tasksUpdateChecklistItem']
		>(
			ctx,
			`tasks/${pathSegment(input.taskId)}/checklist/${pathSegment(input.itemId)}`,
			{ method: 'PUT', body: { text: input.text } },
		);

		await cacheEntity(ctx.db.tasks, HabiticaTaskEntity, result, {
			label: LABEL,
		});

		await logEventFromContext(
			ctx,
			'habitica.tasks.updateChecklistItem',
			auditPayload(input, ['taskId', 'itemId']),
			'completed',
		);
		return result;
	};

/**
 * Removes one checklist item.
 *
 * Returns the whole updated task, so the mirror is refreshed rather than
 * evicted - the task still exists, only its checklist changed.
 */
export const deleteChecklistItem: HabiticaEndpoints['tasksDeleteChecklistItem'] =
	async (ctx, input) => {
		const result = await habiticaCall<
			HabiticaEndpointOutputs['tasksDeleteChecklistItem']
		>(
			ctx,
			`tasks/${pathSegment(input.taskId)}/checklist/${pathSegment(input.itemId)}`,
			{ method: 'DELETE' },
		);

		await cacheEntity(ctx.db.tasks, HabiticaTaskEntity, result, {
			label: LABEL,
		});

		await logEventFromContext(
			ctx,
			'habitica.tasks.deleteChecklistItem',
			auditPayload(input, ['taskId', 'itemId']),
			'completed',
		);
		return result;
	};

/** Applies an existing tag to a task. */
export const addTag: HabiticaEndpoints['tasksAddTag'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tasksAddTag']>(
		ctx,
		`tasks/${pathSegment(input.taskId)}/tags/${pathSegment(input.tagId)}`,
		{ method: 'POST' },
	);

	await cacheEntity(ctx.db.tasks, HabiticaTaskEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'habitica.tasks.addTag',
		auditPayload(input, ['taskId', 'tagId']),
		'completed',
	);
	return result;
};

/**
 * Adds a task to a challenge.
 *
 * Returns an array: creating a challenge task creates a copy on every member's
 * account, and Habitica returns the set rather than one record.
 */
export const createChallengeTask: HabiticaEndpoints['tasksCreateChallengeTask'] =
	async (ctx, input) => {
		const { challengeId, ...task } = input;
		const raw = await habiticaCall<
			| HabiticaEndpointOutputs['tasksCreateChallengeTask'][number]
			| HabiticaEndpointOutputs['tasksCreateChallengeTask']
		>(ctx, `tasks/challenge/${pathSegment(challengeId)}`, {
			method: 'POST',
			body: compactBody(task),
		});
		// Official POST /tasks/challenge/:id returns the task object when one
		// is created, and an array only when the body is a list.
		const result = Array.isArray(raw) ? raw : [raw];

		await cacheEntities(ctx.db.tasks, HabiticaTaskEntity, result, {
			label: LABEL,
		});

		await logEventFromContext(
			ctx,
			'habitica.tasks.createChallengeTask',
			{
				...auditPayload(input, ['challengeId', 'type']),
				created: result.length,
			},
			'completed',
		);
		return result;
	};

/** Lists the tasks defined by a challenge. */
export const listChallengeTasks: HabiticaEndpoints['tasksListChallengeTasks'] =
	async (ctx, input) => {
		const result = await habiticaCall<
			HabiticaEndpointOutputs['tasksListChallengeTasks']
		>(ctx, `tasks/challenge/${pathSegment(input.challengeId)}`, {
			query: compactQuery({ type: input.type }),
		});

		await cacheEntities(ctx.db.tasks, HabiticaTaskEntity, result, {
			label: LABEL,
		});

		await logEventFromContext(
			ctx,
			'habitica.tasks.listChallengeTasks',
			{
				...auditPayload(input, ['challengeId', 'type']),
				returned: result.length,
			},
			'completed',
		);
		return result;
	};

/**
 * Unlinks every task of a challenge from the members who joined it.
 *
 * `keep: 'remove-all'` deletes those copies outright. The mirror is not touched
 * here: the response says only that the unlink happened, and does not name the
 * tasks affected, so there are no ids to evict. A subsequent `tasks.list`
 * re-syncs, and until then the mirror may name tasks that were removed. That is
 * stated rather than hidden.
 */
export const unlinkAllChallengeTasks: HabiticaEndpoints['tasksUnlinkAllChallengeTasks'] =
	async (ctx, input) => {
		const result = await habiticaCall<
			HabiticaEndpointOutputs['tasksUnlinkAllChallengeTasks']
		>(ctx, `tasks/unlink-all/${pathSegment(input.challengeId)}`, {
			method: 'POST',
			query: compactQuery({ keep: input.keep }),
		});

		await logEventFromContext(
			ctx,
			'habitica.tasks.unlinkAllChallengeTasks',
			auditPayload(input, ['challengeId', 'keep']),
			'completed',
		);
		return result;
	};
