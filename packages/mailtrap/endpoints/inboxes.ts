import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheInbox } from './persist';
import { accountPath, compactBody, mailtrapCall } from './shared';
import type { MailtrapInbox } from './types';

/** Lists sandbox inboxes the token can access. */
export const list: MailtrapEndpoints['inboxesList'] = async (ctx) => {
	const path = await accountPath(ctx, '/inboxes');
	const result = await mailtrapCall<MailtrapInbox[]>(ctx, path);

	await Promise.all(
		(result ?? []).map((inbox) => cacheInbox(ctx.db?.inboxes, inbox)),
	);

	await logEventFromContext(ctx, 'mailtrap.inboxes.list', {}, 'completed');
	return result ?? [];
};

/** Gets an inbox's attributes, including its SMTP credentials, by id. */
export const get: MailtrapEndpoints['inboxesGet'] = async (ctx, input) => {
	const path = await accountPath(ctx, `/inboxes/${input.inbox_id}`);
	const result = await mailtrapCall<MailtrapInbox>(ctx, path);

	await cacheInbox(ctx.db?.inboxes, result);

	await logEventFromContext(
		ctx,
		'mailtrap.inboxes.get',
		auditPayload(input, ['inbox_id']),
		'completed',
	);
	return result;
};

/** Updates an inbox's name and/or email username. */
export const update: MailtrapEndpoints['inboxesUpdate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/inboxes/${input.inbox_id}`);
	const result = await mailtrapCall<MailtrapInbox>(ctx, path, {
		method: 'PATCH',
		body: {
			inbox: compactBody({
				name: input.name,
				email_username: input.email_username,
			}),
		},
	});

	await cacheInbox(ctx.db?.inboxes, result);

	await logEventFromContext(
		ctx,
		'mailtrap.inboxes.update',
		auditPayload(input, ['inbox_id']),
		'completed',
	);
	return result;
};

/**
 * Deletes every message in a sandbox inbox. [DESTRUCTIVE]
 *
 * `mailtrap@4.8.0`'s `InboxesApi.cleanInbox` sends the `PATCH` with no
 * body. The response shape was not live-verified (running it against the
 * account's only sandbox would have deleted real test messages), so it is
 * modeled as returning the updated inbox — consistent with every other
 * inbox mutation on this resource — rather than assumed without basis.
 */
export const clean: MailtrapEndpoints['inboxesClean'] = async (ctx, input) => {
	const path = await accountPath(ctx, `/inboxes/${input.inbox_id}/clean`);
	const result = await mailtrapCall<MailtrapInbox>(ctx, path, {
		method: 'PATCH',
	});

	await cacheInbox(ctx.db?.inboxes, result);

	await logEventFromContext(
		ctx,
		'mailtrap.inboxes.clean',
		auditPayload(input, ['inbox_id']),
		'completed',
	);
	return result;
};

/**
 * Marks every message in a sandbox inbox as read.
 *
 * Same not-live-verified caveat as `inboxes.clean` — this would have marked
 * real inbox state as read to observe the response shape.
 */
export const markAsRead: MailtrapEndpoints['inboxesMarkAsRead'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/inboxes/${input.inbox_id}/all_read`);
	const result = await mailtrapCall<MailtrapInbox>(ctx, path, {
		method: 'PATCH',
	});

	await cacheInbox(ctx.db?.inboxes, result);

	await logEventFromContext(
		ctx,
		'mailtrap.inboxes.markAsRead',
		auditPayload(input, ['inbox_id']),
		'completed',
	);
	return result;
};

/**
 * Resets an inbox's SMTP credentials, invalidating the previous
 * username/password. [DESTRUCTIVE]
 *
 * Not exercised live — it would have invalidated the account's real sandbox
 * credentials. Modeled as returning the inbox with its new credentials,
 * same basis as `inboxes.clean`.
 */
export const resetCredentials: MailtrapEndpoints['inboxesResetCredentials'] =
	async (ctx, input) => {
		const path = await accountPath(
			ctx,
			`/inboxes/${input.inbox_id}/reset_credentials`,
		);
		const result = await mailtrapCall<MailtrapInbox>(ctx, path, {
			method: 'PATCH',
		});

		await cacheInbox(ctx.db?.inboxes, result);

		await logEventFromContext(
			ctx,
			'mailtrap.inboxes.resetCredentials',
			auditPayload(input, ['inbox_id']),
			'completed',
		);
		return result;
	};
