import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheContact, evictEntity } from './persist';
import { accountPath, compactBody, mailtrapCall } from './shared';
import type {
	MailtrapContact,
	MailtrapContactEventResult,
	MailtrapContactExport,
	MailtrapContactImport,
} from './types';

/**
 * Creates a contact.
 *
 * The request body must be wrapped under a top-level `contact` key — the
 * plugin's own `MAILTRAP-PLAN.md` recon: omitting it live-422s with
 * "Please, provide top level key: contact", confirming what
 * `mailtrap@4.8.0`'s `ContactsApi.create` sends. The response is wrapped
 * under `data` (unlike the list/field resources, which are not).
 */
export const create: MailtrapEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/contacts');
	const result = await mailtrapCall<{ data: MailtrapContact }>(ctx, path, {
		method: 'POST',
		body: {
			contact: compactBody({
				email: input.email,
				fields: input.fields,
				list_ids: input.list_ids,
				unsubscribed: input.unsubscribed,
			}),
		},
	});

	await cacheContact(ctx.db?.contacts, result.data);

	await logEventFromContext(
		ctx,
		'mailtrap.contacts.create',
		// Email/fields are personal data; only the resulting id goes to the log.
		{ contact_id: result.data.id },
		'completed',
	);
	return result.data;
};

/**
 * Gets a contact by id or email.
 *
 * `identifier` accepts either, so it is never logged raw — an email is
 * personal data. `result.data.id` is always the contact's UUID regardless
 * of which form was used to look it up, same treatment as `contacts.create`.
 */
export const get: MailtrapEndpoints['contactsGet'] = async (ctx, input) => {
	const path = await accountPath(
		ctx,
		`/contacts/${encodeURIComponent(input.identifier)}`,
	);
	const result = await mailtrapCall<{ data: MailtrapContact }>(ctx, path);

	await cacheContact(ctx.db?.contacts, result.data);

	await logEventFromContext(
		ctx,
		'mailtrap.contacts.get',
		{ contact_id: result.data.id },
		'completed',
	);
	return result.data;
};

/** Updates a contact by id or email. Omitted fields are left unchanged. */
export const update: MailtrapEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(
		ctx,
		`/contacts/${encodeURIComponent(input.identifier)}`,
	);
	const result = await mailtrapCall<{ data: MailtrapContact }>(ctx, path, {
		method: 'PATCH',
		body: {
			contact: compactBody({
				email: input.email,
				fields: input.fields,
				list_ids: input.list_ids,
				unsubscribed: input.unsubscribed,
				list_ids_included: input.list_ids_included,
				list_ids_excluded: input.list_ids_excluded,
			}),
		},
	});

	await cacheContact(ctx.db?.contacts, result.data);

	// `identifier` accepts an email; never logged raw. See `contacts.get`.
	await logEventFromContext(
		ctx,
		'mailtrap.contacts.update',
		{ contact_id: result.data.id },
		'completed',
	);
	return result.data;
};

/**
 * Deletes a contact by id or email. [DESTRUCTIVE]
 *
 * Confirmed live to answer 204 with an empty body — unlike
 * `ContactResponse` in `mailtrap@4.8.0`'s type declarations, which claims
 * the deleted contact comes back.
 *
 * The cache is keyed by the contact's UUID `id` (see `cacheContact`). When
 * `identifier` is that same id, eviction removes the cached row; when it is
 * an email instead, the delete still succeeds against the API but the local
 * mirror only clears on its next `get`/`list` miss — the empty delete body
 * gives no id to evict by.
 */
export const remove: MailtrapEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(
		ctx,
		`/contacts/${encodeURIComponent(input.identifier)}`,
	);
	await mailtrapCall(ctx, path, { method: 'DELETE' });

	/**
	 * The empty 204 body leaves no post-call id to log (unlike `get`/
	 * `update`, which read `result.data.id`), and `identifier` itself may be
	 * an email. Log the UUID form directly — it identifies nothing on its
	 * own — and for the email form, log only that the lookup was by email,
	 * never the address itself.
	 */
	await logEventFromContext(
		ctx,
		'mailtrap.contacts.delete',
		input.identifier.includes('@')
			? { identifier_kind: 'email' }
			: { identifier: input.identifier },
		'completed',
	);

	await evictEntity(ctx.db?.contacts, input.identifier, 'contact');

	return {};
};

/** Records a custom event against a contact (e.g. a purchase or signup). */
export const createEvent: MailtrapEndpoints['contactsCreateEvent'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(
		ctx,
		`/contacts/${encodeURIComponent(input.identifier)}/events`,
	);
	const result = await mailtrapCall<MailtrapContactEventResult>(ctx, path, {
		method: 'POST',
		body: compactBody({ name: input.name, params: input.params }),
	});

	await logEventFromContext(
		ctx,
		'mailtrap.contacts.createEvent',
		auditPayload(input, ['identifier', 'name']),
		'completed',
	);
	return result;
};

/**
 * Starts an async export of contacts matching a filter.
 *
 * Not persisted — export jobs are one-off, not a slow-changing reference
 * record. `filters` must name a real filterable field (`subscription_status`,
 * `list_id`, or a custom contact field) — an unrelated name 422s with a bare
 * `{"filters":"invalid"}` rather than a field-specific error (see `types.ts`
 * for the live-confirmed filter names).
 */
export const createExport: MailtrapEndpoints['contactsCreateExport'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/contacts/exports');
	const result = await mailtrapCall<MailtrapContactExport>(ctx, path, {
		method: 'POST',
		body: { filters: input.filters },
	});

	await logEventFromContext(
		ctx,
		'mailtrap.contacts.createExport',
		{ filter_count: input.filters.length },
		'completed',
	);
	return result;
};

/** Gets the status/download URL of a contact export job by id. */
export const getExport: MailtrapEndpoints['contactsGetExport'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/contacts/exports/${input.export_id}`);
	const result = await mailtrapCall<MailtrapContactExport>(ctx, path);

	await logEventFromContext(
		ctx,
		'mailtrap.contacts.getExport',
		auditPayload(input, ['export_id']),
		'completed',
	);
	return result;
};

/**
 * Bulk-imports contacts, upserting by email.
 *
 * Not persisted — the individual contacts this creates are picked up by
 * `contacts.get`/list operations as needed, not eagerly cached from an
 * import job's response (which does not even echo the contacts back,
 * confirmed live: only `{id, status, created_at, updated_at}`).
 */
export const runImport: MailtrapEndpoints['contactsImport'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/contacts/imports');
	const result = await mailtrapCall<MailtrapContactImport>(ctx, path, {
		method: 'POST',
		body: { contacts: input.contacts },
	});

	await logEventFromContext(
		ctx,
		'mailtrap.contacts.import',
		// Email addresses are personal data; only the count goes to the log.
		{ contact_count: input.contacts.length, import_id: result?.id },
		'completed',
	);
	return result;
};

/** Gets the status of a contact import job by id. */
export const getImport: MailtrapEndpoints['contactsGetImport'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/contacts/imports/${input.import_id}`);
	const result = await mailtrapCall<MailtrapContactImport>(ctx, path);

	await logEventFromContext(
		ctx,
		'mailtrap.contacts.getImport',
		auditPayload(input, ['import_id']),
		'completed',
	);
	return result;
};
