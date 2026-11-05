import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerContactEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'contact';

/**
 * A contact's `id` is only unique *within* its brand. `deleteContact`/
 * `getContact` also accept an email address in place of the id
 * (`ContactIdParam`: "ID or email address of the contact") - the cache key
 * is always derived from the response's real `id`, never from whichever
 * form the caller happened to pass in, so a lookup by email and a lookup by
 * id land on the same cached row.
 */
const entityId = (c: { brandId?: string; id: string }) =>
	`${c.brandId}:${c.id}`;

const fieldValuesBody = (
	values:
		| readonly {
				name: string;
				string?: string;
				date?: string;
				integer?: number;
		  }[]
		| undefined,
) =>
	values?.map((v) =>
		compact({
			name: v.name,
			string: v.string,
			date: v.date,
			integer: v.integer,
		}),
	);

/** Lists contacts within a brand, optionally filtered to a single list. */
export const list: BigmailerEndpoints['contactsList'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['contactsList']>(
		ctx,
		`brands/${seg(input.brandId)}/contacts`,
		{
			query: compact({
				limit: input.limit,
				cursor: input.cursor,
				list_id: input.listId,
			}),
		},
	);

	await cacheEntities(
		ctx.db.contacts,
		BigmailerContactEntity,
		result.data.map((c) => ({ ...c, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.contacts.list',
		{
			...auditPayload(input, ['brandId', 'listId']),
			returned: result.data.length,
		},
		'completed',
	);
	return result;
};

/** Creates a contact. */
export const create: BigmailerEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['contactsCreate']
	>(ctx, `brands/${seg(input.brandId)}/contacts`, {
		method: 'POST',
		// `createContact` has no `*_op` query params - those exist only on
		// `updateContact`, which has an existing record's arrays to merge
		// against. Confirmed live from `createcontact.md`'s own OpenAPI
		// `parameters` array (`validate` only).
		query: compact({ validate: input.validate }),
		body: compact({
			email: input.email,
			field_values: fieldValuesBody(input.fieldValues),
			list_ids: input.listIds,
			unsubscribe_all: input.unsubscribeAll,
			unsubscribe_ids: input.unsubscribeIds,
		}),
	});

	await cacheEntity(
		ctx.db.contacts,
		BigmailerContactEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	// `email` is never an identifier key here (see `logging.ts`'s
	// `NEVER_LOG_VALUE` - `email` is deny-listed as a second, independent
	// guarantee), and `listIds` are opaque UUID references, not personal data.
	await logEventFromContext(
		ctx,
		'bigmailer.contacts.create',
		auditPayload(input, ['brandId', 'listIds']),
		'completed',
	);
	return result;
};

/** Retrieves a single contact by id or email address. */
export const get: BigmailerEndpoints['contactsGet'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['contactsGet']>(
		ctx,
		`brands/${seg(input.brandId)}/contacts/${seg(input.contactId)}`,
	);

	await cacheEntity(
		ctx.db.contacts,
		BigmailerContactEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	// `contactId` is never an identifier key here - it may itself be an email
	// address (see the type's own doc comment), so only `brandId` is logged.
	await logEventFromContext(
		ctx,
		'bigmailer.contacts.get',
		auditPayload(input, ['brandId']),
		'completed',
	);
	return result;
};

/**
 * Updates a contact. `POST .../contacts/{contactId}` - confirmed live from
 * `updatecontact.md`'s own OpenAPI path/method (an earlier, unverified
 * version of this file guessed `PATCH`). Distinct from `upsert` below, which
 * is a different path entirely (`.../contacts/upsert`) and creates a missing
 * contact rather than erroring.
 */
export const update: BigmailerEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['contactsUpdate']
	>(ctx, `brands/${seg(input.brandId)}/contacts/${seg(input.contactId)}`, {
		method: 'POST',
		query: compact({
			field_values_op: input.fieldValuesOp,
			list_ids_op: input.listIdsOp,
			unsubscribe_ids_op: input.unsubscribeIdsOp,
		}),
		body: compact({
			email: input.email,
			field_values: fieldValuesBody(input.fieldValues),
			list_ids: input.listIds,
			unsubscribe_all: input.unsubscribeAll,
			unsubscribe_ids: input.unsubscribeIds,
		}),
	});

	await cacheEntity(
		ctx.db.contacts,
		BigmailerContactEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.contacts.update',
		auditPayload(input, ['brandId', 'listIds']),
		'completed',
	);
	return result;
};

/** Deletes a contact. */
export const remove: BigmailerEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['contactsDelete']
	>(ctx, `brands/${seg(input.brandId)}/contacts/${seg(input.contactId)}`, {
		method: 'DELETE',
	});

	// Evict using the delete response's own echoed `id` - never `input.contactId`
	// directly, since that path parameter may itself be an email address
	// (confirmed live: "ID or email address of the contact"). The cache was
	// always keyed on the response's real `id` (see `entityId` above and every
	// other operation's `cacheEntity` call); evicting under a raw email would
	// therefore silently miss the actual cached row and leave it stale.
	// `deleteContact`'s own response schema confirms `id` is present
	// (`"id?: string(uuid) -- ID of the contact deleted"`).
	if (result.id) {
		await evictEntity(
			ctx.db.contacts,
			entityId({ brandId: input.brandId, id: result.id }),
			LABEL,
		);
	}
	await logEventFromContext(
		ctx,
		'bigmailer.contacts.delete',
		auditPayload(input, ['brandId']),
		'completed',
	);
	return result;
};

/**
 * Creates or updates a contact by email address. `POST .../contacts/upsert`
 * - a distinct path from get/update/delete's `.../contacts/{contactId}`, and
 * `POST` rather than `PUT` - both confirmed live from `upsertcontact.md`'s
 * own OpenAPI path/method (an earlier, unverified version of this file
 * guessed `PUT` on the `{contactId}` path, which is actually `update`'s
 * path).
 */
export const upsert: BigmailerEndpoints['contactsUpsert'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['contactsUpsert']
	>(ctx, `brands/${seg(input.brandId)}/contacts/upsert`, {
		method: 'POST',
		query: compact({ validate: input.validate }),
		body: compact({
			email: input.email,
			field_values: fieldValuesBody(input.fieldValues),
			list_ids: input.listIds,
			unsubscribe_all: input.unsubscribeAll,
			unsubscribe_ids: input.unsubscribeIds,
		}),
	});

	await cacheEntity(
		ctx.db.contacts,
		BigmailerContactEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.contacts.upsert',
		auditPayload(input, ['brandId']),
		'completed',
	);
	return result;
};

/**
 * Uploads a batch of up to 1,000 contacts for asynchronous processing.
 * `POST .../contacts/batches` with the array under `items` - confirmed live
 * from `createcontactbatch.md`'s own path and request-body schema (an
 * earlier, unverified version of this file used a separate top-level
 * `contact_batches` resource and a `contacts` body key, neither of which
 * exist). `validate` has no documented server-side default on this specific
 * operation (unlike single-contact create/upsert, which do) - pinned to
 * `false` explicitly rather than left to an unstated default. Not cached -
 * see `endpoints/types.ts`'s `ContactBatchSchema` doc comment.
 */
export const createBatch: BigmailerEndpoints['contactsCreateBatch'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['contactsCreateBatch']
	>(ctx, `brands/${seg(input.brandId)}/contacts/batches`, {
		method: 'POST',
		body: {
			validate: input.validate ?? false,
			items: input.contacts.map((c) =>
				compact({
					email: c.email,
					field_values: fieldValuesBody(c.fieldValues),
					list_ids: c.listIds,
					unsubscribe_all: c.unsubscribeAll,
					unsubscribe_ids: c.unsubscribeIds,
					custom_id: c.customId,
				}),
			),
		},
	});

	await logEventFromContext(
		ctx,
		'bigmailer.contacts.createBatch',
		{ ...auditPayload(input, ['brandId']), count: input.contacts.length },
		'completed',
	);
	return result;
};

/** Checks the processing status of a previously submitted contact batch. */
export const getBatch: BigmailerEndpoints['contactsGetBatch'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['contactsGetBatch']
	>(ctx, `brands/${seg(input.brandId)}/contacts/batches/${seg(input.batchId)}`);

	await logEventFromContext(
		ctx,
		'bigmailer.contacts.getBatch',
		auditPayload(input, ['brandId', 'batchId']),
		'completed',
	);
	return result;
};
