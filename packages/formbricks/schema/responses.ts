import { z } from 'zod';
import { B, Id, N, S, Timestamp, U, UnknownArray } from './primitives';

/**
 * Response shapes that are returned but **not** mirrored locally.
 *
 * The split is the one made in `schema/database.ts`: configuration is mirrored, collected data
 * stays remote. Stated per family, because "we only cache some of it" deserves reasoning
 * rather than assertion:
 *
 * - **Responses** are survey answers from identifiable respondents. `data` is whatever the
 *   questions asked, `meta` carries the respondent's URL, user agent, country and action, and
 *   `contactAttributes` can hold their email address. This is the most sensitive shape in the
 *   API, and mirroring it would put other people's personal data in local storage for no
 *   lookup benefit.
 * - **Contacts and contact attributes** are the identities of survey respondents. Same
 *   reasoning.
 * - **Displays** are per-impression records - a firehose, and only meaningful in aggregate.
 * - **Client environment state** is a computed bundle with an `expiresAt`; caching something
 *   that declares its own expiry is a way to serve stale data.
 * - **Roles** and **health** are trivial reads with nothing to key a row by.
 *
 * Provenance is per shape. Most were enumerated from live responses on 2026-08-15; the two
 * that could not be are marked, and are `.loose()` with only a key required so a real response
 * cannot fail to parse.
 *
 * @see https://formbricks.com/docs
 */

/**
 * A survey response. 16 live fields.
 *
 * **Read the privacy note above before touching this shape.** Three of these fields carry
 * personal data of people who are not the API caller:
 *
 * - `data` - the answers, keyed by question id. Whatever the survey asked for.
 * - `meta` - observed to carry `url`, `userAgent`, `country` and `action`.
 * - `contactAttributes` - the respondent's attributes, which includes their email when the
 *   survey identified them.
 *
 * None of it is logged: `endpoints/logging.ts` records a count and the survey id. None of it
 * is mirrored.
 */
export const FormbricksResponse = z
	.object({
		id: Id,
		surveyId: S,
		finished: B,
		endingId: S,
		/** The answers themselves, keyed by question id. Survey-defined; personal data. */
		data: U,
		/** Respondent context - url, userAgent, country, action. Personal data. */
		meta: U,
		/** Time-to-complete per question, keyed by question id. */
		ttc: U,
		variables: U,
		/** The respondent's attributes, including their email when identified. */
		contactAttributes: U,
		/** The identified respondent, when the survey links responses to a contact. */
		contact: U,
		singleUseId: S,
		language: S,
		displayId: S,
		tags: UnknownArray,
		createdAt: Timestamp,
		updatedAt: Timestamp,
	})
	.loose();
export type FormbricksResponse = z.infer<typeof FormbricksResponse>;

/**
 * A contact - a survey respondent's identity.
 *
 * **The field set differs by route**, which is why all five are declared and only `id` is required:
 *
 * - `POST v2/management/contacts` returns `{id, createdAt, workspaceId, attributes}`.
 * - `GET v1/management/contacts` and `.../{id}` return `{id, createdAt, updatedAt, workspaceId}` -
 *   **no `attributes` at all**. The values live under `contact-attributes` as a separate resource.
 *
 * So `attributes` is present only on a create, and `updatedAt` only on a read. `updatedAt` was
 * missing from this schema until a live re-check caught it - contacts are not mirrored, so nothing
 * was lost to storage, but the published shape was wrong for every read.
 *
 * `attributes` holds whatever the workspace collects - `email`, `userId`, `firstName`, `lastName` by
 * default. Personal data: never mirrored, never logged.
 */
export const FormbricksContact = z
	.object({
		id: Id,
		workspaceId: S,
		/** Keyed by attribute key. Returned by the create; absent from the read routes. */
		attributes: U,
		createdAt: Timestamp,
		/** Returned by the read routes; absent from the create. */
		updatedAt: Timestamp,
	})
	.loose();
export type FormbricksContact = z.infer<typeof FormbricksContact>;

/**
 * One attribute value on one contact. 8 live fields.
 *
 * The pairing that makes this sensitive: `attributeKeyId` says *which* attribute - resolvable
 * to `email` through the mirrored key entity - and `value` is the person's actual email
 * address. The key is configuration and is cached; the value is personal data and is not.
 *
 * Three value columns because Formbricks stores by type: `value` for text, `valueNumber` and
 * `valueDate` for the others. All three are personal data.
 */
export const FormbricksContactAttribute = z
	.object({
		id: Id,
		attributeKeyId: S,
		contactId: S,
		value: S,
		valueNumber: N,
		valueDate: Timestamp,
		createdAt: Timestamp,
		updatedAt: Timestamp,
	})
	.loose();
export type FormbricksContactAttribute = z.infer<
	typeof FormbricksContactAttribute
>;

/**
 * The client environment bundle - everything a survey widget needs to decide what to show.
 *
 * Two live fields: `data` and `expiresAt`. Not mirrored precisely because it carries its own
 * expiry; caching a payload that says when it goes stale is a way to serve stale data.
 *
 * The route is `client/{workspaceId}/environment` in **both** API versions. Worth recording:
 * the v2 OpenAPI document calls this operation `workspace-state`, and
 * `client/{workspaceId}/workspace-state` answers **404**. The document's name does not match
 * the route it documents.
 *
 * Formbricks caches this server-side with a **5-minute TTL**, so a survey or action class created
 * a moment ago may not appear here yet. That is the provider's behaviour, not a staleness bug in
 * this plugin, and it is why the payload carries `expiresAt`.
 */
export const FormbricksClientEnvironment = z
	.object({
		/** The survey and action-class bundle. Shape is the widget's contract, not modelled. */
		data: U,
		expiresAt: Timestamp,
	})
	.loose();
export type FormbricksClientEnvironment = z.infer<
	typeof FormbricksClientEnvironment
>;

/**
 * The state of one respondent, as the client API returns it.
 *
 * **Observed live**, on both versions, and it is *not* a contact record - which is the whole point
 * of declaring it separately. `POST client/{workspaceId}/user` answers:
 *
 * ```
 * { state: { data: { contactId, userId, segments, displays, responses, lastDisplayAt },
 *            expiresAt } }
 * ```
 *
 * No `id` at the top level, so a schema built around a contact's primary key describes something
 * this route never returns. `segments`, `displays` and `responses` are the "segment memberships,
 * survey displays, and response history" the catalog attributes to its contacts-state operation.
 *
 * Everything inside `data` concerns one identified person, so **none of it is logged and none of it
 * is mirrored** - only that a call happened, and against which workspace.
 */
export const FormbricksClientUserState = z
	.object({
		state: z
			.object({
				/** Per-respondent state. Personal data: never logged, never cached. */
				data: U,
				expiresAt: Timestamp,
			})
			.loose()
			.optional(),
	})
	.loose();
export type FormbricksClientUserState = z.infer<
	typeof FormbricksClientUserState
>;

/**
 * The result of a display being recorded.
 *
 * **Observed live**, which took setting a survey to `inProgress` first: a `draft` survey answers
 * `403 "Survey is not accepting submissions"`, and the earlier conclusion that respondent data
 * could not be produced on the recon workspace was simply wrong.
 *
 * Three fields, and no timestamps: `{id, contactId, surveyId}`. `contactId` is **`null`** unless
 * the request carried a `userId`, in which case Formbricks creates the contact and links it. An
 * earlier version of this schema declared `createdAt` and `updatedAt`, which this route does not
 * return at all.
 */
export const FormbricksDisplay = z
	.object({
		id: Id,
		surveyId: S,
		/** `null` when the display was recorded without a `userId`. */
		contactId: S,
	})
	.loose();
export type FormbricksDisplay = z.infer<typeof FormbricksDisplay>;

/**
 * What a bulk contact upload answers with.
 *
 * `{status, message}` - **not** the uploaded contacts. An earlier version of this plugin declared
 * this operation's output as an array of contacts, which is a shape the route never returns, so a
 * caller reading the published schema would have expected ids that do not arrive. There is nothing
 * here to mirror, and no way to learn the new contact ids except by listing afterwards.
 *
 * The catalog says this route answers **207** on partial success "with details about skipped
 * contacts". That was not reproducible: a batch mixing an existing email with a new one answers
 * **200 `success`**, and the failure cases reject the whole batch with 422 rather than partially
 * applying it. `status` is still declared loosely, because a 207 body would arrive here.
 */
export const FormbricksBulkUploadResult = z
	.object({
		status: S,
		message: S,
	})
	.loose();
export type FormbricksBulkUploadResult = z.infer<
	typeof FormbricksBulkUploadResult
>;

/**
 * The identity of the API key in use.
 *
 * Four live fields. `workspacePermissions` is an array of
 * `{permissions, workspaceId, workspaceName}` and is how a caller discovers which workspace a
 * key can reach - which matters because **every write needs a `workspaceId` in the body**, and
 * this is where it comes from.
 *
 * `environmentPermissions` is present and was empty on the recon account. Formbricks documents
 * environments as deprecated in favour of workspaces, so it is declared and not relied on.
 */
export const FormbricksMe = z
	.object({
		organizationId: S,
		workspacePermissions: UnknownArray,
		/** Deprecated upstream in favour of workspaces. Empty on the recon account. */
		environmentPermissions: UnknownArray,
		organizationAccess: U,
	})
	.loose();
export type FormbricksMe = z.infer<typeof FormbricksMe>;

/**
 * The v1 account payload - **environment** identity, which is a different question from
 * {@link FormbricksMe}.
 *
 * Observed live:
 *
 * ```
 * { id, type: "production", createdAt, updatedAt, appSetupCompleted: true,
 *   workspace: {id, name}, project: {id, name} }
 * ```
 *
 * An earlier version of this schema said "shape not observed", on the strength of a
 * `400 "This endpoint only supports API keys that are scoped to a single workspace"` seen with an
 * organization-scoped key. That reason was real but the conclusion was not: the workspace-scoped
 * key used for the rest of recon reads this route fine, so the shape was observable all along and
 * simply had not been asked for a second time.
 *
 * `type` is the environment kind - `production` or `development` - and `appSetupCompleted` is the
 * setup flag. Those two fields plus `project` are what distinguishes this from the v2 identity
 * payload, and they are why the catalog's account-info operation maps here rather than to v2.
 *
 * On the recon workspace `id`, `workspace.id` and `project.id` were all the **same** value. That is
 * one account's arrangement, not a documented invariant, so nothing here derives one id from
 * another.
 */
export const FormbricksManagementMe = z
	.object({
		id: Id,
		/** `production` or `development`. */
		type: S,
		createdAt: Timestamp,
		updatedAt: Timestamp,
		appSetupCompleted: B,
		/** `{id, name}`. */
		workspace: U,
		/** `{id, name}`. */
		project: U,
	})
	.loose();
export type FormbricksManagementMe = z.infer<typeof FormbricksManagementMe>;

/**
 * Service health. Two live fields, each a boolean-ish status per dependency.
 *
 * `{main_database, cache_database}` - snake_case, unlike every other shape in this API, which
 * is camelCase. Declared as observed rather than normalised, because renaming a field is how a
 * plugin starts lying about its provider.
 */
export const FormbricksHealth = z
	.object({
		main_database: U,
		cache_database: U,
	})
	.loose();
export type FormbricksHealth = z.infer<typeof FormbricksHealth>;

/**
 * The organization roles a member can hold.
 *
 * **Not an array of objects.** `GET v2/roles` returns
 * `["owner","manager","member","billing"]` - bare strings. This is declared as a string schema
 * for that reason, and a test asserts it, because an earlier reading of the recon output
 * reported "6 fields" for this endpoint: the reporter printed `'string'.length`. A plausible
 * number from a broken measurement.
 */
export const FormbricksRole = z.string();
export type FormbricksRole = z.infer<typeof FormbricksRole>;

/**
 * A workspace-team join - which teams have access to which workspace.
 *
 * **Observed live.** The earlier note here said the shape could not be observed because the list
 * came back empty "even with a team present". The missing piece was the join itself:
 * `POST organizations/{id}/workspace-teams` with `{teamId, workspaceId, permission}` creates one,
 * and then the list returns rows. Neither that operation nor the team create appears in the
 * catalog, which is why the earlier attempt concluded the join was unreachable.
 *
 * Five fields: `{createdAt, updatedAt, workspaceId, teamId, permission, projectId}`. There is no
 * `id` - the row is identified by its pair of foreign keys - which is why this is the one entity
 * here with no primary key declared.
 */
export const FormbricksWorkspaceTeam = z
	.object({
		teamId: S,
		workspaceId: S,
		permission: S,
		projectId: S,
		createdAt: Timestamp,
		updatedAt: Timestamp,
	})
	.loose();
export type FormbricksWorkspaceTeam = z.infer<typeof FormbricksWorkspaceTeam>;

/**
 * The result of requesting a file upload.
 *
 * **Observed live**, and it is an S3 **presigned POST**, not the signed-PUT exchange the earlier
 * note here assumed. Three fields:
 *
 * ```
 * { signedUrl, presignedFields, fileUrl }
 * ```
 *
 * The earlier declaration listed `url` and `fileName`, neither of which this route returns, and
 * omitted `presignedFields`, which is the field the upload cannot be performed without.
 *
 * **`presignedFields` is a credential.** It carries `X-Amz-Signature`, `X-Amz-Credential`,
 * `X-Amz-Security-Token` and `Policy` - a short-lived authorisation to write into Formbricks'
 * bucket. Anyone holding it can upload under this workspace until it expires. So it is passed
 * straight to the caller, who needs it, and it is **never logged and never mirrored** - the same
 * treatment as a webhook signing secret. `signedUrl` is scoped to the same grant and is treated
 * the same way.
 *
 * A caller completes the upload by POSTing `multipart/form-data` to `signedUrl` with every
 * `presignedFields` entry as a form field and the file last. This plugin stops at obtaining the
 * grant: transferring bytes is the caller's step, not an API operation.
 */
export const FormbricksUploadResult = z
	.object({
		/** The S3 endpoint to POST the multipart form to. */
		signedUrl: S,
		/**
		 * S3 presigned POST form fields, including the signature. A credential - never log this.
		 * Shape is S3's, not Formbricks', so it is not modelled.
		 */
		presignedFields: U,
		/** Where the file will be readable once uploaded. */
		fileUrl: S,
	})
	.loose();
export type FormbricksUploadResult = z.infer<typeof FormbricksUploadResult>;

/**
 * The paging envelope v2 list endpoints return alongside `data`.
 *
 * `{total, limit, offset}`, observed live. This is a genuine improvement on providers that put
 * paging in headers: `total` is in the body, so a caller can tell how far through it is without
 * a second call and without the transport having to surface a header.
 *
 * v1 lists return **no** meta - just `{data}` - so the same paging parameters work but the
 * total is unknowable there. See `endpoints/shared.ts`.
 */
export const FormbricksListMeta = z
	.object({
		total: N,
		limit: N,
		offset: N,
	})
	.loose();
export type FormbricksListMeta = z.infer<typeof FormbricksListMeta>;

/**
 * What a successful DELETE reports.
 *
 * Formbricks answers a delete with **200 and the deleted record**, not 204 with an empty body -
 * confirmed on surveys, responses, action classes, webhooks, contacts, attribute keys and
 * teams. So unlike a provider that returns nothing, there is a body to parse; the operations
 * still report the outcome explicitly rather than passing it through, so that a caller can tell
 * "removed" from "was already absent".
 */
export const DeleteResultSchema = z.object({
	success: z.boolean(),
	id: z.string(),
	/**
	 * `true` when the record was already gone - the API answered 404 rather than removing
	 * anything.
	 *
	 * Reported rather than hidden because a delete of a named resource is replayed after a
	 * network failure, and the replay legitimately finds nothing. See
	 * `endpoints/delete-flow.ts`.
	 */
	already_absent: z.boolean(),
});
