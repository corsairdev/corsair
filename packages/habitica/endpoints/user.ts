import { logEventFromContext } from 'corsair/core';
import type { HabiticaEndpoints } from '../index';
import { auditPayload, countOf } from './logging';
import { clearMirroredTasks } from './persist';
import {
	compactQuery,
	habiticaCall,
	pathSegment,
	withRedactedPathValue,
} from './shared';
import type { HabiticaEndpointOutputs } from './types';

/**
 * The user document and everything hanging off it.
 *
 * None of it is mirrored. The user document carries the account holder's email
 * address under `auth.local.email`, their profile text and their private
 * message history; copying that into local storage is not something an
 * integration should do on the caller's behalf. Field *names* are logged where
 * useful, values are not.
 */

/**
 * Reads the account's own user document.
 *
 * `userFields` is worth supplying: the full document is large and includes the
 * email address. The projection is passed through untouched so the caller can
 * ask for only what they need.
 */
export const get: HabiticaEndpoints['userGet'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['userGet']>(
		ctx,
		'user',
		{ query: compactQuery({ userFields: input.userFields }) },
	);

	// The projection is recorded, not the document.
	await logEventFromContext(
		ctx,
		'habitica.user.get',
		auditPayload(input, ['userFields']),
		'completed',
	);
	return result;
};

/**
 * Updates the user document by dot path.
 *
 * Only the **paths** are audited, never the values: an update can set
 * `profile.name` or `profile.blurb`, which are personal text. Some paths are
 * protected and rejected by Habitica - `stats.class` is the documented example.
 */
export const update: HabiticaEndpoints['userUpdate'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['userUpdate']>(
		ctx,
		'user',
		{ method: 'PUT', body: { ...input.updates } },
	);

	await logEventFromContext(
		ctx,
		'habitica.user.update',
		{ paths: Object.keys(input.updates) },
		'completed',
	);
	return result;
};

/**
 * Resets the account to its starting state.
 *
 * Irreversible, and the most destructive operation in the plugin: every task is
 * deleted and the character returns to level 1. It was never exercised against
 * a live account during development, and its `riskLevel` is `destructive`.
 *
 * The mirrored task collection is emptied afterwards. The response is the reset
 * user and does not name what it removed, so there are no ids to evict one by
 * one - without this the mirror would keep answering with the account's entire
 * previous task list. See `clearMirroredTasks` for why that failure warns
 * rather than raises.
 */
export const reset: HabiticaEndpoints['userReset'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['userReset']>(
		ctx,
		'user/reset',
		{ method: 'POST' },
	);

	await clearMirroredTasks(ctx.db.tasks);

	await logEventFromContext(
		ctx,
		'habitica.user.reset',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/**
 * Equips or unequips gear, a costume piece, a pet, a mount or a background.
 *
 * A toggle rather than a setter: equipping something already equipped unequips
 * it. So this is **not** idempotent in the usual sense - replaying the call
 * undoes it. Worth knowing before assuming a retry is harmless.
 */
export const equip: HabiticaEndpoints['userEquip'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['userEquip']>(
		ctx,
		`user/equip/${pathSegment(input.type)}/${pathSegment(input.key)}`,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'habitica.user.equip',
		auditPayload(input, ['type', 'key']),
		'completed',
	);
	return result;
};

/** Marks a received card as read. */
export const readCard: HabiticaEndpoints['userReadCard'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['userReadCard']>(
		ctx,
		`user/read-card/${pathSegment(input.cardType)}`,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'habitica.user.readCard',
		auditPayload(input, ['cardType']),
		'completed',
	);
	return result;
};

/** Reorders a pinned item in the rewards column. */
export const movePinnedItem: HabiticaEndpoints['userMovePinnedItem'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['userMovePinnedItem']
	>(
		ctx,
		`user/move-pinned-item/${pathSegment(input.path)}/move/to/${pathSegment(input.position)}`,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'habitica.user.movePinnedItem',
		auditPayload(input, ['path', 'position']),
		'completed',
	);
	return result;
};

/**
 * Deletes one message from the account's inbox.
 *
 * The message id is logged; nothing about its contents or its sender is.
 */
export const deleteMessage: HabiticaEndpoints['userDeleteMessage'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['userDeleteMessage']
	>(ctx, `user/messages/${pathSegment(input.id)}`, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'habitica.user.deleteMessage',
		auditPayload(input, ['id']),
		'completed',
	);
	return result;
};

/**
 * Registers a push-notification device.
 *
 * `regId` is a device registration token issued by the push service. It is an
 * identifier for someone's physical device, so it is **not** logged - only the
 * platform is.
 */
export const addPushDevice: HabiticaEndpoints['userAddPushDevice'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['userAddPushDevice']
	>(ctx, 'user/push-devices', {
		method: 'POST',
		body: { regId: input.regId, type: input.type },
	});

	await logEventFromContext(
		ctx,
		'habitica.user.addPushDevice',
		{ type: input.type, devices: countOf(result) },
		'completed',
	);
	return result;
};

/**
 * Unregisters a push-notification device.
 *
 * `regId` is not logged, and it is also kept out of any thrown error: Habitica
 * takes it as a path parameter, and the shared transport redacts sensitive
 * query parameters but not path segments.
 */
export const deletePushDevice: HabiticaEndpoints['userDeletePushDevice'] =
	async (ctx, input) => {
		const result = await withRedactedPathValue(input.regId, () =>
			habiticaCall<HabiticaEndpointOutputs['userDeletePushDevice']>(
				ctx,
				`user/push-devices/${pathSegment(input.regId)}`,
				{ method: 'DELETE' },
			),
		);

		await logEventFromContext(
			ctx,
			'habitica.user.deletePushDevice',
			{ devices: countOf(result) },
			'completed',
		);
		return result;
	};

/** Marks one notification as seen. */
export const markNotificationSeen: HabiticaEndpoints['userMarkNotificationSeen'] =
	async (ctx, input) => {
		const result = await habiticaCall<
			HabiticaEndpointOutputs['userMarkNotificationSeen']
		>(ctx, `notifications/${pathSegment(input.notificationId)}/see`, {
			method: 'POST',
		});

		await logEventFromContext(
			ctx,
			'habitica.user.markNotificationSeen',
			auditPayload(input, ['notificationId']),
			'completed',
		);
		return result;
	};

/** Marks several notifications as seen. */
export const markNotificationsSeen: HabiticaEndpoints['userMarkNotificationsSeen'] =
	async (ctx, input) => {
		const result = await habiticaCall<
			HabiticaEndpointOutputs['userMarkNotificationsSeen']
		>(ctx, 'notifications/see', {
			method: 'POST',
			body: { notificationIds: input.notificationIds ?? [] },
		});

		await logEventFromContext(
			ctx,
			'habitica.user.markNotificationsSeen',
			{ notifications: countOf(input.notificationIds) },
			'completed',
		);
		return result;
	};
