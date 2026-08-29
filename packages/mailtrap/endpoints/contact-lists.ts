import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheContactList, evictEntity } from './persist';
import { accountPath, compactQuery, mailtrapCall } from './shared';
import type { MailtrapContactList } from './types';

/**
 * Lists contact lists, optionally filtered by a case-insensitive prefix
 * match on name.
 *
 * Confirmed live to return a bare array — unlike `sending_domains`, this
 * resource is not wrapped under `data`.
 */
export const list: MailtrapEndpoints['contactListsList'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/contacts/lists');
	const result = await mailtrapCall<MailtrapContactList[]>(ctx, path, {
		query: compactQuery({ search: input.search }),
	});

	await Promise.all(
		(result ?? []).map((list) => cacheContactList(ctx.db?.contactLists, list)),
	);

	await logEventFromContext(
		ctx,
		'mailtrap.contactLists.list',
		auditPayload(input, ['search']),
		'completed',
	);
	return result ?? [];
};

/**
 * Creates a contact list.
 *
 * The body is sent unwrapped (no `contact_list` key) — confirmed live:
 * wrapping it 422s with "name can't be blank" even though `name` is
 * present, and `mailtrap@4.8.0`'s `ContactListsApi.create` passes `data`
 * straight through.
 */
export const create: MailtrapEndpoints['contactListsCreate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/contacts/lists');
	const result = await mailtrapCall<MailtrapContactList>(ctx, path, {
		method: 'POST',
		body: { name: input.name },
	});

	await cacheContactList(ctx.db?.contactLists, result);

	await logEventFromContext(
		ctx,
		'mailtrap.contactLists.create',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** Gets a contact list by id. */
export const get: MailtrapEndpoints['contactListsGet'] = async (ctx, input) => {
	const path = await accountPath(ctx, `/contacts/lists/${input.list_id}`);
	const result = await mailtrapCall<MailtrapContactList>(ctx, path);

	await cacheContactList(ctx.db?.contactLists, result);

	await logEventFromContext(
		ctx,
		'mailtrap.contactLists.get',
		auditPayload(input, ['list_id']),
		'completed',
	);
	return result;
};

/** Renames a contact list. */
export const update: MailtrapEndpoints['contactListsUpdate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/contacts/lists/${input.list_id}`);
	const result = await mailtrapCall<MailtrapContactList>(ctx, path, {
		method: 'PATCH',
		body: { name: input.name },
	});

	await cacheContactList(ctx.db?.contactLists, result);

	await logEventFromContext(
		ctx,
		'mailtrap.contactLists.update',
		auditPayload(input, ['list_id']),
		'completed',
	);
	return result;
};

/** Permanently deletes a contact list. [DESTRUCTIVE] */
export const remove: MailtrapEndpoints['contactListsDelete'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/contacts/lists/${input.list_id}`);
	await mailtrapCall(ctx, path, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'mailtrap.contactLists.delete',
		auditPayload(input, ['list_id']),
		'completed',
	);

	await evictEntity(
		ctx.db?.contactLists,
		String(input.list_id),
		'contact list',
	);

	return {};
};
