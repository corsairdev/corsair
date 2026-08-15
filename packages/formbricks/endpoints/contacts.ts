import { logEventFromContext } from 'corsair/core';
import type { FormbricksEndpoints } from '../index';
import { FormbricksContactAttributeKeyEntity } from '../schema/database';
import { deleteAndEvict } from './delete-flow';
import { auditPayload, countOf, keyNamesOf } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { compactBody, formbricksCall, listParams, withQuery } from './shared';
import type { FormbricksEndpointOutputs } from './types';

const KEY_LABEL = 'contactAttributeKey';

/**
 * Contacts, their attribute keys, and their attribute values.
 *
 * The split between what is mirrored and what is not falls **inside** this family, which is why
 * the three live together:
 *
 * - **Attribute keys are mirrored.** They are the *schema* - `email`, `userId`, `firstName` - not
 *   the values. Configuration, small, and the lookup that makes an attribute row legible.
 * - **Contacts and attribute values are not.** They are the identities of survey respondents and
 *   their personal details. An attribute row pairs `attributeKeyId` with a `value`, so mirroring
 *   it would store somebody's email address.
 *
 * Every route here lives under `apps/web/modules/ee/` in the Formbricks repo, and the Cloud
 * pricing page puts contact management at the Pro tier. **Both are true and neither gates the
 * API** - full CRUD works on a free workspace, verified. That is recorded because the opposite
 * conclusion was drawn first, from exactly those two facts.
 *
 * The versions are split: reads are v1, writes are v2. Not a preference - v1 exposes no POST for
 * contacts and no create/delete for attribute keys.
 */

/* -------------------------------------------------------------------------- */
/*                                  contacts                                  */
/* -------------------------------------------------------------------------- */

/**
 * Lists the contacts in the workspace. Every row is a person; the count is logged, not the rows.
 *
 * **Not pageable, and this is the worst place for that to be true.** The route ignores `limit`,
 * `offset` and `skip`, so it returns every contact in the workspace on every call - an unbounded
 * response of personal data. `GET v2/management/contacts` is a **405**, so there is no pageable
 * alternative to switch to.
 *
 * No paging parameters are declared, because accepting a `limit` this route discards would tell a
 * caller they had bounded a response they had not. Raised with the maintainer instead; it needs an
 * API change, and no client-side slice would help - the rows are transferred either way.
 */
export const list: FormbricksEndpoints['contactsList'] = async (ctx, input) =>
	await readContacts(ctx, 'formbricks.contacts.list');

/**
 * The catalog's `LIST_MANAGEMENT_PEOPLE`, over the **same route** as {@link list}.
 *
 * "People" is Formbricks' former name for contacts and `v1/management/people` no longer exists, so
 * this is not a second capability - it is the same request under the id a caller working from the
 * older half of the catalog would look for. Registered so that every catalog id resolves; the
 * overlap is stated here and in the PR rather than implied away.
 *
 * It logs its **own** event name rather than delegating to `contacts.list`, so an operator reading
 * the audit can tell which id was actually called.
 */
export const listPeople: FormbricksEndpoints['contactsListPeople'] = async (
	ctx,
	input,
) => await readContacts(ctx, 'formbricks.contacts.listPeople');

/** Shared by {@link list} and {@link listPeople}; only the audit event differs. */
async function readContacts(
	ctx: Parameters<FormbricksEndpoints['contactsList']>[0],
	event: string,
): Promise<FormbricksEndpointOutputs['contactsList']> {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['contactsList']
	>(ctx, 'v1', 'management/contacts');

	await logEventFromContext(
		ctx,
		event,
		{
			contact_count: countOf(result),
		},
		'completed',
	);
	return result;
}

/** Retrieves one contact. The response carries their attributes, so only the id is logged. */
export const get: FormbricksEndpoints['contactsGet'] = async (ctx, input) =>
	await readContact(ctx, input.contactId, 'formbricks.contacts.get');

/**
 * The catalog's `GET_PERSON_BY_ID`, over the **same route** as {@link get}.
 *
 * Same situation as {@link listPeople}: the `people` route is gone and this id names the contacts
 * one. The input field is still called `contactId`, because that is what the route takes and what
 * every other operation here calls it - renaming it to `personId` would make the two ids look like
 * they address different things.
 */
export const getPerson: FormbricksEndpoints['contactsGetPerson'] = async (
	ctx,
	input,
) => await readContact(ctx, input.contactId, 'formbricks.contacts.getPerson');

/** Shared by {@link get} and {@link getPerson}; only the audit event differs. */
async function readContact(
	ctx: Parameters<FormbricksEndpoints['contactsGet']>[0],
	contactId: string,
	event: string,
): Promise<FormbricksEndpointOutputs['contactsGet']> {
	const result = await formbricksCall<FormbricksEndpointOutputs['contactsGet']>(
		ctx,
		'v1',
		`management/contacts/${contactId}`,
	);

	await logEventFromContext(ctx, event, { contact_id: contactId }, 'completed');
	return result;
}

/**
 * Creates a contact.
 *
 * **v2**, because v1's contacts collection exposes only GET. Answers **201**, unlike the survey
 * create which answers 200.
 *
 * `attributes` is a plain object here. The bulk upload takes the same concept as an **array** - see
 * {@link uploadBulk}.
 *
 * The attribute *values* are the person's details, so the audit records which attribute keys were
 * set and never what they were set to.
 */
export const create: FormbricksEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['contactsCreate']
	>(ctx, 'v2', 'management/contacts', {
		method: 'POST',
		body: compactBody({
			workspaceId: input.workspaceId,
			attributes: input.attributes,
		}),
	});

	await logEventFromContext(
		ctx,
		'formbricks.contacts.create',
		{
			...auditPayload(input, ['workspaceId']),
			contact_id: result.id,
			// Key names only. The values are somebody's email address and name.
			attribute_keys: keyNamesOf(input.attributes),
		},
		'completed',
	);
	return result;
};

/**
 * Uploads contacts in bulk.
 *
 * The shape differs from the single create in a way that catches anyone assuming symmetry:
 * `attributes` is an **array** of `{attributeKey: {key, name}, value}`. The object form the single
 * create accepts is a 422 here. Same field name, two shapes, two endpoints.
 *
 * Non-idempotent, and the most consequential case of it: a replay duplicates every row in the
 * batch rather than one record.
 */
export const uploadBulk: FormbricksEndpoints['contactsUploadBulk'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['contactsUploadBulk']
	>(ctx, 'v2', 'management/contacts/bulk', {
		method: 'PUT',
		body: compactBody({
			workspaceId: input.workspaceId,
			contacts: input.contacts,
		}),
	});

	await logEventFromContext(
		ctx,
		'formbricks.contacts.uploadBulk',
		{
			...auditPayload(input, ['workspaceId']),
			// How many people, and which attribute keys - never the values.
			contact_count: input.contacts.length,
			attribute_keys: [
				...new Set(
					input.contacts.flatMap((c) =>
						c.attributes.map((a) => a.attributeKey.key),
					),
				),
			],
		},
		'completed',
	);
	return result;
};

/**
 * Updates a contact's attribute **values** - the catalog's `UPDATE_CONTACT_ATTRIBUTES`.
 *
 * **This is the one operation here that does not use a management route, because there is no
 * management route for it.** Every candidate was tried against a real contact and every one failed:
 *
 * ```
 * PUT  v2 management/contacts/{id}              404
 * PUT  v1 management/contacts/{id}              405
 * PUT  v2 management/contacts/{id}/attributes   404
 * POST v2 management/contacts/{id}/attributes   404
 * PUT  v1 management/contact-attributes         405
 * POST v2 client/{workspaceId}/user             200, value updated
 * ```
 *
 * So this posts to the client user route, which upserts attributes by `userId` - and that shapes the
 * contract in two ways a caller has to know about:
 *
 * - **It is keyed by `userId`, not `contactId`.** The caller's own identifier for the person, which is
 *   what the catalog's "keep contact information in sync with your app" describes. A `contactId` is
 *   not accepted by this route at all.
 * - **It creates the contact if the `userId` is new.** There is no update-only form, so this cannot be
 *   used to check whether someone exists - asking creates them. That is why it is `write` rather than
 *   an update, and why it is in the non-idempotent set.
 *
 * It returns the respondent's state, like every other call to that route, rather than the contact
 * record - so a caller wanting the updated contact reads it back with {@link get}.
 *
 * `attributes` holds the person's own details, so the audit records **which keys** were set and never
 * their values, and never the `userId`.
 */
export const updateAttributes: FormbricksEndpoints['contactsUpdateAttributes'] =
	async (ctx, input) => {
		const result = await formbricksCall<
			FormbricksEndpointOutputs['contactsUpdateAttributes']
		>(ctx, 'v2', `client/${input.workspaceId}/user`, {
			method: 'POST',
			body: compactBody({
				userId: input.userId,
				attributes: input.attributes,
			}),
		});

		await logEventFromContext(
			ctx,
			'formbricks.contacts.updateAttributes',
			{
				...auditPayload(input, ['workspaceId']),
				attribute_keys: keyNamesOf(input.attributes),
			},
			'completed',
		);
		return result;
	};

/**
 * Deletes a contact.
 *
 * This is the catalog's `DELETE_PERSON`, which the catalog points at the removed `people` route.
 * The capability is real: `DELETE v1/management/contacts/{contactId}` answers 200.
 *
 * Marked `destructive` - it removes a person's identity and unlinks their responses. Nothing is
 * evicted because contacts are not mirrored, which is also what makes this operation clean: there
 * is no local copy of the person to leave behind.
 */
export const remove: FormbricksEndpoints['contactsDelete'] = async (
	ctx,
	input,
) =>
	await deleteAndEvict(ctx, {
		version: 'v1',
		path: `management/contacts/${input.contactId}`,
		event: 'formbricks.contacts.delete',
		input,
		identifierKeys: ['contactId'],
		resultId: input.contactId,
		// No mirror: contacts are never cached, so nothing local survives the delete.
	});

/* -------------------------------------------------------------------------- */
/*                           contact attribute keys                          */
/* -------------------------------------------------------------------------- */

/**
 * Lists the attribute keys the workspace defines.
 *
 * Mirrored - this is the schema, not the data. A new workspace starts with five: `userId`,
 * `email`, `firstName`, `lastName`, `language`.
 *
 * **Reads v2, unlike its sibling operations, because only v2 pages.** The v1 route ignores `limit`
 * entirely and returns every key; the v2 route honours `limit` with `skip` and reports
 * `meta: {total, ...}`. Both return the identical ten fields, verified by comparing the two
 * responses field by field - so this is the same data from a route that can be paged, not a
 * different projection.
 */
export const listAttributeKeys: FormbricksEndpoints['contactAttributeKeysList'] =
	async (ctx, input) =>
		await readAttributeKeys(ctx, input, 'formbricks.contactAttributeKeys.list');

/**
 * The catalog's `LIST_ATTRIBUTE_CLASSES`, over the **same route** as {@link listAttributeKeys}.
 *
 * "Attribute classes" is the former name for contact attribute keys; `v1/management/attribute-classes`
 * is gone. The catalog lists both names, so both resolve here rather than one 404ing for a caller who
 * read the older entry.
 */
export const listAttributeClasses: FormbricksEndpoints['contactAttributeKeysListClasses'] =
	async (ctx, input) =>
		await readAttributeKeys(
			ctx,
			input,
			'formbricks.contactAttributeKeys.listClasses',
		);

/** Shared by {@link listAttributeKeys} and {@link listAttributeClasses}. */
async function readAttributeKeys(
	ctx: Parameters<FormbricksEndpoints['contactAttributeKeysList']>[0],
	input: { limit?: number | undefined; offset?: number | undefined },
	event: string,
): Promise<FormbricksEndpointOutputs['contactAttributeKeysList']> {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['contactAttributeKeysList']
	>(
		ctx,
		'v2',
		withQuery('management/contact-attribute-keys', listParams('skip', input)),
	);

	await cacheEntities(
		ctx.db.contactAttributeKeys,
		FormbricksContactAttributeKeyEntity,
		result,
		{ label: KEY_LABEL },
	);

	await logEventFromContext(
		ctx,
		event,
		{
			...auditPayload(input, ['limit', 'offset']),
			attribute_key_count: countOf(result),
		},
		'completed',
	);
	return result;
}

/** Retrieves one attribute key. */
export const getAttributeKey: FormbricksEndpoints['contactAttributeKeysGet'] =
	async (ctx, input) =>
		await readAttributeKey(
			ctx,
			input.contactAttributeKeyId,
			'formbricks.contactAttributeKeys.get',
		);

/**
 * The catalog's `GET_ATTRIBUTE_CLASS`, over the **same route** as {@link getAttributeKey}.
 *
 * The input keeps the name `contactAttributeKeyId` rather than `attributeClassId`, for the same
 * reason {@link getPerson} keeps `contactId`: the id is opaque and identical, and a second name for
 * it would suggest the two operations address different resources.
 */
export const getAttributeClass: FormbricksEndpoints['contactAttributeKeysGetClass'] =
	async (ctx, input) =>
		await readAttributeKey(
			ctx,
			input.contactAttributeKeyId,
			'formbricks.contactAttributeKeys.getClass',
		);

/** Shared by {@link getAttributeKey} and {@link getAttributeClass}. */
async function readAttributeKey(
	ctx: Parameters<FormbricksEndpoints['contactAttributeKeysGet']>[0],
	contactAttributeKeyId: string,
	event: string,
): Promise<FormbricksEndpointOutputs['contactAttributeKeysGet']> {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['contactAttributeKeysGet']
	>(ctx, 'v1', `management/contact-attribute-keys/${contactAttributeKeyId}`);

	await cacheEntity(
		ctx.db.contactAttributeKeys,
		FormbricksContactAttributeKeyEntity,
		result,
		{ label: KEY_LABEL },
	);

	await logEventFromContext(
		ctx,
		event,
		{ contact_attribute_key_id: contactAttributeKeyId },
		'completed',
	);
	return result;
}

/**
 * Creates an attribute key.
 *
 * This is the catalog's `CREATE_ATTRIBUTE_CLASS`, against the removed `attribute-classes` route.
 * The current route is `contact-attribute-keys`, and it is **v2** - v1 exposes no create.
 *
 * `description` is **required** - a 422 without it, despite reading like documentation.
 */
export const createAttributeKey: FormbricksEndpoints['contactAttributeKeysCreate'] =
	async (ctx, input) => {
		const result = await formbricksCall<
			FormbricksEndpointOutputs['contactAttributeKeysCreate']
		>(ctx, 'v2', 'management/contact-attribute-keys', {
			method: 'POST',
			body: compactBody({
				workspaceId: input.workspaceId,
				key: input.key,
				name: input.name,
				description: input.description,
			}),
		});

		await cacheEntity(
			ctx.db.contactAttributeKeys,
			FormbricksContactAttributeKeyEntity,
			result,
			{ label: KEY_LABEL },
		);

		await logEventFromContext(
			ctx,
			'formbricks.contactAttributeKeys.create',
			{
				...auditPayload(input, ['workspaceId', 'key']),
				contact_attribute_key_id: result.id,
			},
			'completed',
		);
		return result;
	};

/**
 * Updates an attribute key's **definition** - its display name and description.
 *
 * **This operation claims no catalog id**, and the correction is worth recording. It used to be
 * registered as the catalog's `UPDATE_CONTACT_ATTRIBUTES`, on the reasoning that the catalog name
 * reads as though it updates values but "the only update route in either version is for a key". The
 * second half of that was untested and wrong.
 *
 * What this route does, verified by reading a contact's value before and after: renaming the
 * `firstName` key from `First Name` to `Renamed Key` leaves every contact's stored `firstName` value
 * exactly as it was. It edits the schema, not the data - a different capability from the one the
 * catalog describes ("update a contact's attributes ... keep contact information in sync with your
 * app").
 *
 * **v1, because only v1 accepts a partial update.** This operation's inputs are optional, so a caller
 * may send `name` alone - and the two versions disagree about whether that is allowed:
 *
 * ```
 * PUT v2 {name}                -> 422  description: expected string, received undefined
 * PUT v2 {description}         -> 422  name: expected string, received undefined
 * PUT v2 {name, description}   -> 200
 * PUT v1 {name}                -> 200  description preserved
 * PUT v1 {description}         -> 200  name preserved
 * ```
 *
 * v2 re-validates the whole body like the webhook update does. This function used to call v2 while
 * declaring both fields optional, so any caller updating one field got a 422 - the same defect as the
 * webhook `source` omission, in a second place, and found by diffing the input schemas against
 * Formbricks' published OpenAPI document rather than by a test.
 *
 * Both versions return the identical ten fields, so nothing is lost by preferring v1 here; the
 * mirrored row is the same either way. Note that `PUT v1/management/contact-attribute-keys/{id}` is
 * **absent from the published v1 document** and was verified live - the spec is incomplete rather
 * than authoritative, which it also is for `DELETE v1/management/contacts/{id}`.
 *
 * The capability the catalog *does* describe has **no management route at all**. Each candidate was
 * tried against a real contact:
 *
 * ```
 * PUT  v2 management/contacts/{id}              404
 * PUT  v1 management/contacts/{id}              405
 * PUT  v2 management/contacts/{id}/attributes   404
 * POST v2 management/contacts/{id}/attributes   404
 * PUT  v1 management/contact-attributes         405
 * POST v1|v2 client/{workspaceId}/user          200, value updated
 * PUT  v2 management/contacts/bulk              200, value updated
 * ```
 *
 * So a caller updating a contact's attributes uses {@link ClientApi.identifyUser} or the bulk upsert,
 * both already registered. This operation stays because it is a real capability the catalog simply
 * omits - like team creation - and dropping working, tested code to make an id count tidy would be
 * the wrong trade.
 */
export const updateAttributeKey: FormbricksEndpoints['contactAttributeKeysUpdate'] =
	async (ctx, input) => {
		const result = await formbricksCall<
			FormbricksEndpointOutputs['contactAttributeKeysUpdate']
		>(
			ctx,
			// v1, and the version matters here in a way it does not for the sibling operations.
			'v1',
			`management/contact-attribute-keys/${input.contactAttributeKeyId}`,
			{
				method: 'PUT',
				body: compactBody({ name: input.name, description: input.description }),
			},
		);

		await cacheEntity(
			ctx.db.contactAttributeKeys,
			FormbricksContactAttributeKeyEntity,
			result,
			{ label: KEY_LABEL },
		);

		await logEventFromContext(
			ctx,
			'formbricks.contactAttributeKeys.update',
			auditPayload(input, ['contactAttributeKeyId']),
			'completed',
		);
		return result;
	};

/**
 * Deletes an attribute key.
 *
 * The catalog's `DELETE_ATTRIBUTE_CLASS`, against the current route. **v2** - v1 has no delete.
 *
 * The eviction is **required** rather than best-effort. An attribute key is the schema that makes
 * respondent data legible, so a surviving mirrored key describes a field the workspace believes it
 * removed - and a caller resolving an old attribute row through the mirror would get an answer the
 * API would no longer give.
 */
export const removeAttributeKey: FormbricksEndpoints['contactAttributeKeysDelete'] =
	async (ctx, input) =>
		await deleteAndEvict(ctx, {
			version: 'v2',
			path: `management/contact-attribute-keys/${input.contactAttributeKeyId}`,
			event: 'formbricks.contactAttributeKeys.delete',
			input,
			identifierKeys: ['contactAttributeKeyId'],
			resultId: input.contactAttributeKeyId,
			mirror: {
				store: ctx.db.contactAttributeKeys,
				entityId: input.contactAttributeKeyId,
				label: KEY_LABEL,
				required: true,
			},
		});

/* -------------------------------------------------------------------------- */
/*                          contact attribute values                         */
/* -------------------------------------------------------------------------- */

/**
 * Lists attribute *values* across contacts.
 *
 * Not mirrored. Each row pairs an `attributeKeyId` with a `value`, and resolving the key through
 * the mirror turns that into "this person's email address is X" - so the row is personal data even
 * though it looks like a join table.
 *
 * Three value columns because Formbricks stores by type: `value`, `valueNumber`, `valueDate`.
 *
 * **Not pageable**, and unlike the attribute *keys* list there is no v2 route to move to -
 * `v2/management/contact-attributes` is a 404. So this operation declares no paging parameters, and
 * like `contacts.list` it returns every row of personal data on every call.
 */
export const listAttributes: FormbricksEndpoints['contactAttributesList'] =
	async (ctx, input) => {
		const result = await formbricksCall<
			FormbricksEndpointOutputs['contactAttributesList']
		>(ctx, 'v1', 'management/contact-attributes');

		await logEventFromContext(
			ctx,
			'formbricks.contactAttributes.list',
			{
				attribute_count: countOf(result),
			},
			'completed',
		);
		return result;
	};
