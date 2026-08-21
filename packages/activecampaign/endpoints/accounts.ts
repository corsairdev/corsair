import { logEventFromContext } from 'corsair/core';
import { makeActiveCampaignRequest } from '../client';
import type { ActiveCampaignEndpoints } from '../index';
import {
	ActiveCampaignAccount,
	ActiveCampaignAccountContact,
	ActiveCampaignAccountCustomFieldMeta,
	ActiveCampaignNote,
} from '../schema/database';
import { persistRow } from './persist';
import { makeResource } from './resource';
import { AC_PAGE_SIZE_MAX, resolveAccount } from './shared';
import type { ActiveCampaignEndpointOutputs } from './types';

/**
 * CRM accounts (organizations), their contact associations, their custom
 * fields, and the account-wide notes resource.
 *
 * Account and note bodies carry free text a person wrote, so nothing here logs
 * a body - only identifiers and counts reach the event log.
 */

const accounts = makeResource({
	path: 'accounts',
	one: 'account',
	many: 'accounts',
	event: 'activecampaign.accounts',
	entity: ActiveCampaignAccount,
	store: 'accounts',
	label: 'account',
	logKeys: ['id', 'limit', 'offset', 'owner'],
	queryMap: { search: 'search' },
	bodyKeys: ['name', 'accountUrl', 'owner', 'fields'],
});

const accountContacts = makeResource({
	path: 'accountContacts',
	one: 'accountContact',
	many: 'accountContacts',
	event: 'activecampaign.accountContacts',
	entity: ActiveCampaignAccountContact,
	store: 'accountContacts',
	label: 'accountContact',
	logKeys: ['id', 'limit', 'offset', 'contact', 'account'],
	queryMap: { contact: 'filters[contact]', account: 'filters[account]' },
	bodyKeys: ['contact', 'account', 'jobTitle'],
});

const accountFieldMeta = makeResource({
	path: 'accountCustomFieldMeta',
	one: 'accountCustomFieldMetum',
	many: 'accountCustomFieldMeta',
	event: 'activecampaign.accountCustomFieldMeta',
	entity: ActiveCampaignAccountCustomFieldMeta,
	store: 'accountCustomFieldMeta',
	label: 'accountCustomFieldMeta',
	bodyKeys: [
		'fieldLabel',
		'fieldType',
		'fieldOptions',
		'fieldDefault',
		'fieldDefaultCurrency',
		'isFormVisible',
		'isRequired',
		'displayOrder',
	],
});

/**
 * Field *values* on accounts. Not mirrored - a value is only meaningful
 * alongside the account it belongs to, and the account itself is cached.
 */
const accountFieldData = makeResource({
	path: 'accountCustomFieldData',
	one: 'accountCustomFieldDatum',
	many: 'accountCustomFieldData',
	event: 'activecampaign.accountCustomFieldData',
	label: 'accountCustomFieldData',
	logKeys: ['id', 'limit', 'offset', 'accountId', 'customFieldId'],
	bodyKeys: ['accountId', 'customFieldId', 'fieldValue'],
});

const notes = makeResource({
	path: 'notes',
	one: 'note',
	many: 'notes',
	event: 'activecampaign.notes',
	entity: ActiveCampaignNote,
	store: 'notes',
	label: 'note',
	// `note` is the body text a person wrote, so it is never logged by value.
	logKeys: ['id', 'limit', 'offset', 'reltype', 'relid'],
	bodyKeys: ['note', 'reltype', 'relid'],
});

// --- accounts --------------------------------------------------------------
export const list = accounts.list as ActiveCampaignEndpoints['accountsList'];
export const get = accounts.get as ActiveCampaignEndpoints['accountsGet'];
export const create =
	accounts.create as ActiveCampaignEndpoints['accountsCreate'];
export const update =
	accounts.update as ActiveCampaignEndpoints['accountsUpdate'];
export const remove =
	accounts.remove as ActiveCampaignEndpoints['accountsDelete'];

// --- account contacts ------------------------------------------------------
export const listContacts =
	accountContacts.list as ActiveCampaignEndpoints['accountContactsList'];
export const getContact =
	accountContacts.get as ActiveCampaignEndpoints['accountContactsGet'];
export const createContact =
	accountContacts.create as ActiveCampaignEndpoints['accountContactsCreate'];
export const updateContact =
	accountContacts.update as ActiveCampaignEndpoints['accountContactsUpdate'];
export const removeContact =
	accountContacts.remove as ActiveCampaignEndpoints['accountContactsDelete'];

// --- account custom fields -------------------------------------------------
export const listFieldMeta =
	accountFieldMeta.list as ActiveCampaignEndpoints['accountCustomFieldMetaList'];
export const getFieldMeta =
	accountFieldMeta.get as ActiveCampaignEndpoints['accountCustomFieldMetaGet'];
export const createFieldMeta =
	accountFieldMeta.create as ActiveCampaignEndpoints['accountCustomFieldMetaCreate'];
export const updateFieldMeta =
	accountFieldMeta.update as ActiveCampaignEndpoints['accountCustomFieldMetaUpdate'];
export const removeFieldMeta =
	accountFieldMeta.remove as ActiveCampaignEndpoints['accountCustomFieldMetaDelete'];

export const listFieldData =
	accountFieldData.list as ActiveCampaignEndpoints['accountCustomFieldDataList'];
export const getFieldData =
	accountFieldData.get as ActiveCampaignEndpoints['accountCustomFieldDataGet'];
export const createFieldData =
	accountFieldData.create as ActiveCampaignEndpoints['accountCustomFieldDataCreate'];
export const updateFieldData =
	accountFieldData.update as ActiveCampaignEndpoints['accountCustomFieldDataUpdate'];
export const removeFieldData =
	accountFieldData.remove as ActiveCampaignEndpoints['accountCustomFieldDataDelete'];

// --- notes -----------------------------------------------------------------
export const listNotes = notes.list as ActiveCampaignEndpoints['notesList'];
export const getNote = notes.get as ActiveCampaignEndpoints['notesGet'];
export const createNote =
	notes.create as ActiveCampaignEndpoints['notesCreate'];
export const updateNote =
	notes.update as ActiveCampaignEndpoints['notesUpdate'];
export const removeNote =
	notes.remove as ActiveCampaignEndpoints['notesDelete'];

// ---------------------------------------------------------------------------
// Operations outside the standard resource shape
// ---------------------------------------------------------------------------

/**
 * Creates an account, or updates the existing one with the same name.
 *
 * ActiveCampaign has no upsert route for accounts and enforces unique names,
 * so this searches by name first and branches. The lookup is a read, so a
 * transport failure between the two calls is safe to retry; the write half is
 * listed as non-idempotent.
 */
export const upsert: ActiveCampaignEndpoints['accountsUpsert'] = async (
	ctx,
	input,
) => {
	const acct = await resolveAccount(ctx);

	// `search` is a substring match, so an exact name comparison decides.
	// A match past the first page would otherwise POST and hit uniqueness.
	let existing: { id?: string; name?: string } | undefined;
	for (let offset = 0; ; ) {
		const found = await makeActiveCampaignRequest<{
			accounts?: Array<{ id?: string; name?: string }>;
		}>('accounts', ctx.key, acct, {
			method: 'GET',
			query: { search: input.name, limit: AC_PAGE_SIZE_MAX, offset },
		});
		existing = found.accounts?.find((a) => a.name === input.name);
		if (existing) break;
		const page = found.accounts?.length ?? 0;
		if (page < AC_PAGE_SIZE_MAX) break;
		offset += page;
	}

	const body = {
		account: {
			name: input.name,
			...(input.accountUrl !== undefined && { accountUrl: input.accountUrl }),
			...(input.owner !== undefined && { owner: input.owner }),
			...(input.fields !== undefined && { fields: input.fields }),
		},
	};

	const response = existing?.id
		? await makeActiveCampaignRequest<
				ActiveCampaignEndpointOutputs['accountsUpsert']
			>(`accounts/${existing.id}`, ctx.key, acct, { method: 'PUT', body })
		: await makeActiveCampaignRequest<
				ActiveCampaignEndpointOutputs['accountsUpsert']
			>('accounts', ctx.key, acct, { method: 'POST', body });

	await persistRow(
		ctx.db.accounts,
		ActiveCampaignAccount,
		response.account,
		'account',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.accounts.upsert',
		{
			created: existing?.id === undefined,
			owner: input.owner,
			fields: ['name'],
		},
		'completed',
	);
	return response;
};

/**
 * Deletes many accounts in one request.
 *
 * Irreversible, and the whole batch is one call - a retry would re-issue every
 * deletion, so it is listed as non-idempotent.
 */
export const removeBulk: ActiveCampaignEndpoints['accountsDeleteBulk'] = async (
	ctx,
	input,
) => {
	const acct = await resolveAccount(ctx);
	await makeActiveCampaignRequest<unknown>(
		'accounts/bulk_delete',
		ctx.key,
		acct,
		{
			method: 'POST',
			body: { ids: input.ids },
		},
	);

	// Evicting is best-effort per row; a mirror failure must not fail the call.
	for (const id of input.ids) {
		const store = ctx.db.accounts as
			| { deleteByEntityId?: (entityId: string) => Promise<unknown> }
			| undefined;
		if (store?.deleteByEntityId) {
			try {
				await store.deleteByEntityId(String(id));
			} catch (error) {
				console.warn(
					`[ACTIVECAMPAIGN] Failed to evict account ${id} from the cache:`,
					error,
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'activecampaign.accounts.deleteBulk',
		{ accountCount: input.ids.length, fields: ['ids'] },
		'completed',
	);
	return { ids: input.ids };
};

/**
 * Sets many account custom field values in one request.
 *
 * ActiveCampaign notes that when several items reference the same account,
 * only the first updates that account's Last Modified date.
 */
export const createFieldDataBulk: ActiveCampaignEndpoints['accountCustomFieldDataCreateBulk'] =
	async (ctx, input) => {
		const acct = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['accountCustomFieldDataCreateBulk']
		>('accountCustomFieldData/bulkCreate', ctx.key, acct, {
			method: 'POST',
			body: input.items,
		});

		await logEventFromContext(
			ctx,
			'activecampaign.accountCustomFieldData.createBulk',
			{ itemCount: input.items.length, fields: ['items'] },
			'completed',
		);
		return response;
	};

export const updateFieldDataBulk: ActiveCampaignEndpoints['accountCustomFieldDataUpdateBulk'] =
	async (ctx, input) => {
		const acct = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['accountCustomFieldDataUpdateBulk']
		>('accountCustomFieldData/bulkUpdate', ctx.key, acct, {
			method: 'PATCH',
			body: input.items,
		});

		await logEventFromContext(
			ctx,
			'activecampaign.accountCustomFieldData.updateBulk',
			{ itemCount: input.items.length, fields: ['items'] },
			'completed',
		);
		return response;
	};

/**
 * Adds a note to a contact, looked up by email.
 *
 * ActiveCampaign attaches contact notes with `reltype: 'Subscriber'`, so the
 * email is resolved to an id first. The note body is caller-supplied text and
 * is never logged.
 */
export const addContactNote: ActiveCampaignEndpoints['notesAddToContact'] =
	async (ctx, input) => {
		const acct = await resolveAccount(ctx);

		const found = await makeActiveCampaignRequest<{
			contacts?: Array<{ id?: string }>;
		}>('contacts', ctx.key, acct, {
			method: 'GET',
			query: { email: input.email },
		});

		const contactId = found.contacts?.[0]?.id;
		if (!contactId) {
			throw new Error(
				`No ActiveCampaign contact matches the supplied email address`,
			);
		}

		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['notesAddToContact']
		>('notes', ctx.key, acct, {
			method: 'POST',
			body: {
				note: { note: input.note, reltype: 'Subscriber', relid: contactId },
			},
		});

		await persistRow(ctx.db.notes, ActiveCampaignNote, response.note, 'note');

		await logEventFromContext(
			ctx,
			'activecampaign.notes.addToContact',
			{ relid: contactId, reltype: 'Subscriber', fields: ['email', 'note'] },
			'completed',
		);
		return response;
	};

/**
 * Notes attached to an account or a deal.
 *
 * ActiveCampaign has no per-entity note route - `/accounts/{id}/notes` and
 * `/deals/{id}/notes` both answer 404 - so these post to the shared `/notes`
 * collection with `reltype` fixed. They exist as named operations rather than
 * leaving callers to set `reltype` themselves because the catalog lists them
 * separately, and because an agent looking for "add a note to this deal"
 * should find exactly that.
 *
 * The note body is text a person wrote and is never logged.
 */
function typedNote<K extends 'notesCreateForAccount' | 'notesCreateForDeal'>(
	reltype: 'Account' | 'Deal',
	event: string,
): ActiveCampaignEndpoints[K] {
	return (async (
		ctx: Parameters<ActiveCampaignEndpoints[K]>[0],
		input: { id: string; note: string },
	) => {
		const acct = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs[K]
		>('notes', ctx.key, acct, {
			method: 'POST',
			body: { note: { note: input.note, reltype, relid: input.id } },
		});

		await persistRow(ctx.db.notes, ActiveCampaignNote, response.note, 'note');

		await logEventFromContext(
			ctx,
			event,
			{ relid: input.id, reltype, fields: ['note'] },
			'completed',
		);
		return response;
	}) as ActiveCampaignEndpoints[K];
}

export const createAccountNote = typedNote<'notesCreateForAccount'>(
	'Account',
	'activecampaign.notes.createForAccount',
);
export const createDealNote = typedNote<'notesCreateForDeal'>(
	'Deal',
	'activecampaign.notes.createForDeal',
);

/**
 * Updating a note is the same call whichever entity it hangs off, because the
 * note id already identifies it. These two exist so the operation surface
 * matches the catalog; both delegate to the shared update rather than
 * duplicating it.
 */
export const updateAccountNote =
	notes.update as ActiveCampaignEndpoints['notesUpdateForAccount'];
export const updateDealNote =
	notes.update as ActiveCampaignEndpoints['notesUpdateForDeal'];
