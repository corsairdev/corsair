import { z } from 'zod';
import {
	DeleteResultSchema,
	FormbricksActionClassEntity,
	FormbricksBulkUploadResult,
	FormbricksClientEnvironment,
	FormbricksClientUserState,
	FormbricksContact,
	FormbricksContactAttribute,
	FormbricksContactAttributeKeyEntity,
	FormbricksDisplay,
	FormbricksHealth,
	FormbricksManagementMe,
	FormbricksMe,
	FormbricksResponse,
	FormbricksRole,
	FormbricksSurveyEntity,
	FormbricksTeamEntity,
	FormbricksUploadResult,
	FormbricksWebhookEntity,
	FormbricksWorkspaceTeam,
} from '../schema';

/**
 * Input and output schemas for every Formbricks operation.
 *
 * Output schemas reuse the definitions in `schema/` rather than restating them, so the persisted
 * shape and the returned shape cannot drift apart.
 *
 * Required inputs are required because the API rejects the call without them, **observed rather
 * than assumed**. Each non-obvious one names the status it produced, because Formbricks reports a
 * missing field as a 400 with no field name on v1, and once as a **500**.
 */

/* -------------------------------------------------------------------------- */
/*                                  Envelopes                                 */
/* -------------------------------------------------------------------------- */

/**
 * Every response is wrapped in `{ data }`, and `endpoints/shared.ts` unwraps it. So these output
 * schemas describe the **unwrapped** record - what a caller actually receives.
 *
 * v2 list endpoints also return `meta: {total, limit, offset}`. That is dropped rather than
 * surfaced, because half the operations are v1 and return no meta at all: exposing it on some
 * lists and not others would be a worse contract than exposing it on none. A caller pages by
 * incrementing `offset` until a short page arrives, which works on both versions.
 *
 * Note that the `offset` in that envelope is **not** the parameter most routes honour - see
 * `PageStyle` in `endpoints/shared.ts`. Believing the envelope is how this plugin shipped six
 * broken list operations in its first draft.
 */
const listOf = <Item extends z.ZodType>(item: Item) => z.array(item);

/**
 * Paging parameters, for the operations whose route actually pages.
 *
 * `limit` and `offset` are the caller-facing names on every pageable operation;
 * `listParams(style, input)` in `endpoints/shared.ts` translates `offset` to whichever wire
 * parameter that specific route honours, because Formbricks disagrees with itself about the name.
 *
 * **Not every list gets these.** Four v1 routes - contacts, action-classes, contact-attributes and
 * v1 contact-attribute-keys - ignore `limit` as well as both cursor names and return every row
 * regardless. Those operations therefore accept no paging parameters at all: an input field the
 * provider discards is a promise the plugin cannot keep, and a caller who sets `limit: 10` and gets
 * 4,000 rows has been misled by this plugin rather than by Formbricks.
 *
 * `limit` is bounded at 250, which is the ceiling the catalog documents for responses. The API
 * enforces no maximum of its own - `?limit=1000` answers 200 - so this is a client-side guard
 * against one call pulling an unbounded page, set at the documented figure rather than an invented
 * one. The previous bound of 100 was below what the catalog promises.
 */
const ListQuery = {
	limit: z.number().int().min(1).max(250).optional(),
	offset: z.number().int().min(0).optional(),
};

/**
 * The workspace a write belongs to.
 *
 * Required **in the body** on most writes - not merely in the API key's scope. A caller finds
 * theirs from `me.get`, whose `workspacePermissions` names every workspace the key can reach.
 *
 * Declared per operation rather than mixed into a shared base, because the requirement is not
 * universal: `responses.update` accepts a body without it. Assuming otherwise is how a 400 that
 * mentions a field the caller did supply reaches a user.
 */
const WorkspaceId = z.string().min(1);

/** Receiver URL for a Formbricks webhook. Only http(s) — not javascript:/ftp:/bare strings. */
const WebhookUrl = z
	.string()
	.min(1)
	.refine(
		(value) => {
			try {
				const parsed = new URL(value);
				return parsed.protocol === 'http:' || parsed.protocol === 'https:';
			} catch {
				return false;
			}
		},
		{ message: 'url must be an http or https URL' },
	);

/**
 * Where a webhook was registered from.
 *
 * Taken verbatim from the API's rejection of an invalid value:
 * `422 'Invalid option: expected one of "user"|"zapier"|"make"|"n8n"'`. `user` is the value for a
 * webhook created through the API rather than by one of the three named integrations.
 */
const WebhookSource = z.enum(['user', 'zapier', 'make', 'n8n']);

/**
 * The response lifecycle events a webhook can subscribe to.
 *
 * Also taken from a 422:
 * `'expected one of "responseFinished"|"responseCreated"|"responseUpdated"'`.
 *
 * `responseCreated` fires when a respondent starts, `responseUpdated` on each save, and
 * `responseFinished` only on completion - so a receiver subscribing to all three sees the same
 * response more than once, by design.
 */
const WebhookTrigger = z.enum([
	'responseFinished',
	'responseCreated',
	'responseUpdated',
]);

/**
 * An object whose keys are defined by the caller, the survey or the workspace.
 *
 * Deliberately unmodelled. A response's `data` is keyed by question id and holds whatever that
 * question type produces; a contact's `attributes` is keyed by whichever attribute keys the
 * workspace defined. A closed schema would reject valid input.
 *
 * `unknown` rather than `any`, so a consumer must narrow - `PLUGIN_PR_RULES.md` bans `any` on
 * exported surfaces.
 */
const OpenRecord = z.record(z.string(), z.unknown());

/* -------------------------------------------------------------------------- */
/*                              Common id inputs                              */
/* -------------------------------------------------------------------------- */

const SurveyId = z.object({ surveyId: z.string().min(1) });
const ResponseId = z.object({ responseId: z.string().min(1) });
const ContactId = z.object({ contactId: z.string().min(1) });
const WebhookId = z.object({ webhookId: z.string().min(1) });
const OrganizationId = z.object({ organizationId: z.string().min(1) });
const WorkspaceScoped = z.object({ workspaceId: WorkspaceId });

/* -------------------------------------------------------------------------- */
/*                            Input schema registry                           */
/* -------------------------------------------------------------------------- */

export const FormbricksEndpointInputSchemas = {
	/* -------------------------------- surveys ------------------------------- */
	surveysList: z.object(ListQuery),
	/**
	 * `workspaceId` required - 400 `"workspaceId must be provided"` without it.
	 *
	 * `questions` is required by the product rather than the schema: a survey with none is
	 * accepted by the API but cannot be answered. Left optional so a caller can create a shell and
	 * fill it in, which is what the Formbricks editor itself does.
	 */
	surveysCreate: z.object({
		workspaceId: WorkspaceId,
		name: z.string().min(1),
		type: z.string().optional(),
		questions: z.array(OpenRecord).optional(),
		welcomeCard: OpenRecord.optional(),
		endings: z.array(OpenRecord).optional(),
		status: z.string().optional(),
		triggers: z.array(OpenRecord).optional(),
	}),
	/**
	 * **PUT**, not POST. `POST` on the item route answers **405 with an empty body**, so the v1
	 * documentation's claim of POST for update is wrong.
	 */
	surveysUpdate: z.object({
		surveyId: z.string().min(1),
		name: z.string().min(1).optional(),
		status: z.string().optional(),
		questions: z.array(OpenRecord).optional(),
		welcomeCard: OpenRecord.optional(),
		endings: z.array(OpenRecord).optional(),
		triggers: z.array(OpenRecord).optional(),
	}),
	surveysDelete: SurveyId,

	/* ------------------------------- responses ------------------------------ */
	/**
	 * `surveyId` is the **only** filter this route applies.
	 *
	 * The catalog additionally documents `contactId`, `startDate`, `endDate`, `filterDateField`,
	 * `sortBy` and `order` here. Every one of them is accepted with a 200 and then **ignored**,
	 * verified by effect rather than by status:
	 *
	 * ```
	 * ?contactId=<nonexistent>                     -> all 3 rows   (a real filter returns 0)
	 * ?startDate=1990-01-01&endDate=1990-01-02     -> all 3 rows   (impossible range)
	 * ?sortBy=createdAt&order=asc  vs  order=desc  -> identical order
	 * ```
	 *
	 * The date filters were retried as bare dates, ISO datetimes, epoch milliseconds and with
	 * `filterDateField` set, in case the format was the problem rather than the parameter. All five
	 * forms returned every row.
	 *
	 * So they are **not declared here**. A `contactId` filter that quietly returns every
	 * respondent's answers is worse than a missing one: a caller asking for one person's responses
	 * would receive everybody's and have no way to tell.
	 */
	responsesList: z.object({
		...ListQuery,
		/** Formbricks filters responses by survey through a query parameter. Applied - verified. */
		surveyId: z.string().min(1).optional(),
	}),
	responsesCreate: z.object({
		workspaceId: WorkspaceId,
		surveyId: z.string().min(1),
		/** The answers, keyed by question id. Personal data - never logged. */
		data: OpenRecord,
		finished: z.boolean().optional(),
		meta: OpenRecord.optional(),
		ttc: OpenRecord.optional(),
		language: z.string().optional(),
	}),
	/**
	 * `data` is **required**, and this is the one input in the plugin required to work around a
	 * server bug rather than a documented rule.
	 *
	 * `PUT v1/management/responses/{id}` answers **500 `internal_server_error`** when `data` is
	 * absent - `{finished: true}` crashes, `{data: {}, finished: true}` succeeds. A missing
	 * required field should be a 422, and every sibling endpoint does exactly that. Requiring it
	 * here turns the 500 into a local validation error.
	 *
	 * `workspaceId` is **not** required on this one, unlike the creates - verified by a 200
	 * without it.
	 */
	responsesUpdate: z.object({
		responseId: z.string().min(1),
		data: OpenRecord,
		finished: z.boolean().optional(),
		variables: OpenRecord.optional(),
		language: z.string().optional(),
	}),
	responsesDelete: ResponseId,

	/* ----------------------------- action classes --------------------------- */
	/**
	 * **No paging parameters.** `GET v1/management/action-classes` ignores `limit`, `offset` and
	 * `skip` alike - three seeded rows, `?limit=1`, three rows back. Declaring them would advertise
	 * a page size this route will not honour. See `PageStyle` in `endpoints/shared.ts`.
	 */
	actionClassesList: z.object({}),
	/**
	 * `type` selects how the action fires - `code` for one the application reports, `noCode` for
	 * one matched by a selector. `key` is what a code action reports itself as, so it is required
	 * for that type and meaningless for the other; the refinement enforces the pairing rather
	 * than leaving the API to reject it.
	 */
	actionClassesCreate: z
		.object({
			workspaceId: WorkspaceId,
			name: z.string().min(1),
			description: z.string().optional(),
			type: z.enum(['code', 'noCode']),
			key: z.string().min(1).optional(),
			noCodeConfig: OpenRecord.optional(),
		})
		.refine((input) => input.type !== 'code' || input.key !== undefined, {
			message:
				'key is required when type is code - it is how the action reports itself',
		}),

	/* -------------------------------- contacts ------------------------------ */
	/**
	 * **No paging parameters** - `GET v1/management/contacts` ignores all three, verified by effect
	 * on three seeded contacts. This is the one that matters most of the four: a contact list is
	 * unbounded in principle and holds personal data, so a caller has good reason to want a page and
	 * no way to get one. Flagged for the maintainer rather than papered over locally, because a
	 * client-side slice would still transfer every row.
	 */
	contactsList: z.object({}),
	/**
	 * The catalog's `LIST_MANAGEMENT_PEOPLE` - the **same route** as {@link contactsList}.
	 *
	 * "People" is Formbricks' former name for contacts and `v1/management/people` is gone, so this is
	 * one capability under two catalog ids rather than two capabilities. Registered so every id in the
	 * catalog resolves; the duplication is documented on the endpoint, in the registry meta and in the
	 * PR, because a reviewer counting distinct routes will otherwise find one fewer than the id count
	 * suggests.
	 */
	contactsListPeople: z.object({}),
	contactsGet: ContactId,
	/** The catalog's `GET_PERSON_BY_ID` - the same route as {@link contactsGet}. */
	contactsGetPerson: ContactId,
	/**
	 * The catalog's `UPDATE_CONTACT_ATTRIBUTES`, and the only operation here that is **not** a
	 * management route: no management route sets a contact's attribute values, verified against five
	 * candidates that answer 404 or 405.
	 *
	 * Keyed by `userId` - the caller's own identifier - because the client user route is what does the
	 * work, and it **creates the contact if that id is new**. There is no update-only form.
	 */
	contactsUpdateAttributes: z.object({
		workspaceId: WorkspaceId,
		/** The caller's identifier for the person. Personal data: sent, never logged. */
		userId: z.string().min(1),
		/** Keyed by attribute key. The values are the person's details - never logged. */
		attributes: OpenRecord,
	}),
	/**
	 * `workspaceId` required in the body; answers **201**, unlike the surveys create which answers
	 * 200.
	 *
	 * `attributes` here is a plain **object** keyed by attribute key. Note the asymmetry with
	 * {@link contactsUploadBulk}, where the same concept is an **array**.
	 */
	contactsCreate: z.object({
		workspaceId: WorkspaceId,
		/** Keyed by attribute key - `email`, `userId`, and any the workspace defined. */
		attributes: OpenRecord,
	}),
	/**
	 * Bulk upload, and the shape differs from the single create in a way that will catch anyone
	 * who assumes symmetry: `attributes` is an **array** of
	 * `{attributeKey: {key, name}, value}`, not an object. Sending the object form is a 422.
	 *
	 * Two constraints enforced locally, both observed from the API's own rejections:
	 *
	 * - **250 rows maximum.** `422 "Maximum 250 contacts allowed at a time."` Checking here means a
	 *   251-row batch fails before it is serialised and sent.
	 * - **Every row needs an `email` attribute.** `422 "Email attribute is required for contact at
	 *   index 0"`. The refinement names the offending index the same way, so the local error is as
	 *   useful as the remote one.
	 *
	 * Duplicate emails **within one batch** are also a 422 (`"Duplicate emails found in the
	 *  records"`, listing them). Not checked locally: two rows can legitimately be built from
	 * sources that only turn out to collide, and a local check would have to decide whether to drop
	 * or fail, which is the caller's decision to make.
	 *
	 * The whole batch is atomic in practice - the failure cases above reject every row rather than
	 * applying the valid ones - so a caller retrying after a 422 will not double-insert.
	 */
	contactsUploadBulk: z.object({
		workspaceId: WorkspaceId,
		contacts: z
			.array(
				z.object({
					attributes: z.array(
						z.object({
							attributeKey: z.object({
								key: z.string().min(1),
								name: z.string().optional(),
							}),
							value: z.string(),
						}),
					),
				}),
			)
			.min(1)
			.max(250, 'Formbricks accepts a maximum of 250 contacts per bulk upload')
			.superRefine((contacts, ctx) => {
				// Reported per offending row rather than once for the batch, and with the row's index,
				// so the local error is as useful as the API's own
				// `"Email attribute is required for contact at index 0"`.
				for (const [index, contact] of contacts.entries()) {
					const hasEmail = contact.attributes.some(
						(attribute) => attribute.attributeKey.key === 'email',
					);
					if (hasEmail) continue;
					ctx.addIssue({
						code: 'custom',
						path: [index, 'attributes'],
						message: `Email attribute is required for contact at index ${index}`,
					});
				}
			}),
	}),
	/**
	 * Deleting a contact removes a survey respondent's identity.
	 *
	 * This is the operation the catalog lists as `DELETE_PERSON`, against the removed `people`
	 * route. The capability is real and the route is `DELETE v1/management/contacts/{contactId}`.
	 */
	contactsDelete: ContactId,

	/* -------------------------- contact attribute keys ---------------------- */
	/**
	 * Paging works here, but only on **v2**.
	 *
	 * `GET v1/management/contact-attribute-keys` ignores `limit` entirely; the v2 route honours
	 * `limit` with `skip` and returns `meta: {total, limit, offset}`. Both return the identical ten
	 * fields, so this operation reads v2 - the same data, and pageable. That is why this list keeps
	 * its paging parameters while the other three v1 lists lost theirs.
	 */
	contactAttributeKeysList: z.object({ ...ListQuery }),
	/**
	 * The catalog's `LIST_ATTRIBUTE_CLASSES` - the **same route** as
	 * {@link contactAttributeKeysList}. "Attribute classes" is the former name and its route is gone.
	 */
	contactAttributeKeysListClasses: z.object({ ...ListQuery }),
	contactAttributeKeysGet: z.object({
		contactAttributeKeyId: z.string().min(1),
	}),
	/**
	 * The catalog's `GET_ATTRIBUTE_CLASS` - the same route as {@link contactAttributeKeysGet}.
	 *
	 * The field keeps the name `contactAttributeKeyId`: it is the same opaque id, and a second name
	 * would imply the two ids address different resources.
	 */
	contactAttributeKeysGetClass: z.object({
		contactAttributeKeyId: z.string().min(1),
	}),
	/**
	 * `description` is **required** - a 422 without it, despite reading like documentation.
	 *
	 * This is the operation the catalog lists as `CREATE_ATTRIBUTE_CLASS`, against the removed
	 * `attribute-classes` route.
	 */
	contactAttributeKeysCreate: z.object({
		workspaceId: WorkspaceId,
		key: z.string().min(1),
		name: z.string().min(1),
		description: z.string(),
	}),
	/**
	 * Edits an attribute key's **definition**, and claims **no catalog id**.
	 *
	 * It was previously registered as `UPDATE_CONTACT_ATTRIBUTES`. That id describes updating a
	 * contact's values, which no management route does - see the endpoint's own comment for the full
	 * list of 404s and 405s, and for the two routes that do it.
	 */
	contactAttributeKeysUpdate: z.object({
		contactAttributeKeyId: z.string().min(1),
		name: z.string().min(1).optional(),
		description: z.string().optional(),
	}),
	/** The catalog's `DELETE_ATTRIBUTE_CLASS`, against the current route. */
	contactAttributeKeysDelete: z.object({
		contactAttributeKeyId: z.string().min(1),
	}),

	/* --------------------------- contact attributes ------------------------- */
	/**
	 * **No paging parameters** - `GET v1/management/contact-attributes` ignores all three, and there
	 * is no v2 equivalent (`v2/management/contact-attributes` is a 404). Unlike the attribute *keys*
	 * list, this one cannot be fixed by changing version.
	 */
	contactAttributesList: z.object({}),

	/* -------------------------------- webhooks ------------------------------ */
	/**
	 * Pages by `limit` + `skip` on the wire, despite `meta` reporting an `offset`.
	 *
	 * The catalog also documents filtering by `surveyIds` and by date, and sorting. `surveyIds` is
	 * the interesting one: sending it as a bare string is `422 "expected array, received string"`,
	 * which reads like the parameter is real. Only `?surveyIds[]=<id>` is accepted - and it then has
	 * **no effect**, returning every webhook. A 422 that teaches you the correct syntax for a
	 * parameter the route ignores is about the most misleading combination available, so the filter
	 * is not declared.
	 */
	webhooksList: z.object({ ...ListQuery }),
	webhooksGet: WebhookId,
	/**
	 * v2 requires more than v1 does: `name`, `source` and **`surveyIds` as an array** on top of
	 * `url` and `triggers`. Each was found from a 422.
	 *
	 * An empty `surveyIds` means "all surveys" in Formbricks, so it is required but may be empty -
	 * which is why there is no `min(1)`.
	 *
	 * Both enums come from the API's own rejection messages rather than from documentation, so they
	 * are exact rather than guessed:
	 *
	 * ```
	 * source:   "user" | "zapier" | "make" | "n8n"
	 * triggers: "responseFinished" | "responseCreated" | "responseUpdated"
	 * ```
	 *
	 * Declared as enums rather than free strings so a typo is a local validation error naming the
	 * valid options, instead of a round trip that returns a 422.
	 */
	webhooksCreate: z.object({
		workspaceId: WorkspaceId,
		name: z.string().min(1),
		url: WebhookUrl,
		source: WebhookSource,
		triggers: z.array(WebhookTrigger).min(1),
		surveyIds: z.array(z.string()),
	}),
	/**
	 * **A full replace, not a patch** - every field is required.
	 *
	 * `PUT v2/management/webhooks/{id}` re-validates the entire body, so a partial update is a 422:
	 *
	 * ```
	 * PUT {name}                          -> 422  url missing, source missing
	 * PUT {name, url, triggers, surveyIds} -> 422  source missing
	 * PUT {name, url, triggers, surveyIds, source} -> 200
	 * ```
	 *
	 * The middle line is exactly what an earlier version of this plugin sent, and it made this
	 * operation **impossible to call successfully**: `source` was neither in the input schema nor in
	 * the request body, so every update failed regardless of what the caller supplied. All fields are
	 * now required, which makes the replace semantics visible in the signature rather than something
	 * a caller discovers from a 422.
	 */
	webhooksUpdate: z.object({
		webhookId: z.string().min(1),
		workspaceId: WorkspaceId,
		name: z.string().min(1),
		url: WebhookUrl,
		source: WebhookSource,
		triggers: z.array(WebhookTrigger).min(1),
		surveyIds: z.array(z.string()),
	}),
	webhooksDelete: WebhookId,

	/* --------------------------------- teams -------------------------------- */
	/** Pages by `limit` + `skip` on the wire, verified on three seeded teams. */
	teamsList: z.object({ ...ListQuery, organizationId: z.string().min(1) }),
	teamsDelete: z.object({
		organizationId: z.string().min(1),
		teamId: z.string().min(1),
	}),
	/**
	 * The catalog calls this "project teams"; the route is `workspace-teams`. The same rename as
	 * `environmentId` to `workspaceId`, and the reason the catalog reads oddly here.
	 *
	 * Pages by `limit` + `skip`, verified on two seeded joins. The catalog also documents filtering
	 * by team, project and date range; those are not declared, for the same reason as on the other
	 * lists - `?teamId=none` returns every row.
	 */
	teamsListWorkspaceTeams: z.object({
		...ListQuery,
		organizationId: z.string().min(1),
	}),

	/* --------------------------------- roles -------------------------------- */
	rolesList: z.object({}),

	/* ---------------------------------- me ---------------------------------- */
	meGet: z.object({}),
	/**
	 * The v1 account route, which is **not** interchangeable with v2's. It rejects an
	 * organization-scoped key with a 400 telling the caller to use `v2/me`.
	 */
	meGetManagement: z.object({}),
	/**
	 * The catalog's third account-identity operation, and it reads the **v1** route.
	 *
	 * Its description is what settles which route it belongs to: "environment information ...
	 * including the associated project and setup completion status". `v1/management/me` returns
	 * `{type: "production", project: {...}, appSetupCompleted: true}`; `v2/me` returns none of those
	 * three. An earlier version of this plugin pointed this operation at v2 and called it a duplicate
	 * of {@link meGet}, which fit the field the catalog never mentions and missed the three it does.
	 *
	 * So the duplicate pair is this operation and {@link meGetManagement} - both v1 - rather than this
	 * one and `meGet`. Same number of overlapping ids, correctly assigned.
	 */
	meGetAccountInfo: z.object({}),

	/* -------------------------------- health -------------------------------- */
	healthCheck: z.object({}),
	/** The catalog's second health id, over the single health route. */
	healthList: z.object({}),

	/* ------------------------------- client API ----------------------------- */
	/**
	 * The client API is workspace-scoped in the **path**, and is the surface a survey widget uses.
	 *
	 * The link parameter is **`userId`, not `contactId`** - the caller's own identifier for the
	 * person, the same one {@link clientCreateUser} takes. Formbricks resolves it to a contact,
	 * creating one if the id is new, and returns the resolved `contactId` on the display.
	 *
	 * An earlier version of this operation accepted and sent `contactId`. That is **accepted with a
	 * 200 and ignored**: the display is recorded with `contactId: null`, unlinked, and the caller has
	 * no signal that the link they asked for was dropped. Verified by sending a real contact's id and
	 * reading the result back.
	 *
	 * Also worth stating because it costs a confusing 403: the survey must be **`inProgress`**. A
	 * `draft` survey answers `403 "Survey is not accepting submissions"`, which sounds like a
	 * permissions problem and is a survey-status one.
	 */
	clientCreateDisplay: z.object({
		workspaceId: WorkspaceId,
		surveyId: z.string().min(1),
		/**
		 * The caller's identifier for the respondent. Omit for an anonymous display. Personal data:
		 * never logged.
		 */
		userId: z.string().min(1).optional(),
	}),
	clientCreateUser: z.object({
		workspaceId: WorkspaceId,
		userId: z.string().min(1),
		attributes: OpenRecord.optional(),
	}),
	/**
	 * The catalog lists both `CREATE_CLIENT_USER` and `CREATE_OR_IDENTIFY_USER`. Both v1 and v2
	 * expose a client user route, so the two ids are split across the versions rather than one
	 * being dropped - v2 for this one, v1 for the other.
	 */
	clientIdentifyUser: z.object({
		workspaceId: WorkspaceId,
		userId: z.string().min(1),
		attributes: OpenRecord.optional(),
	}),
	clientEnvironment: WorkspaceScoped,
	/**
	 * The catalog's "get client contacts state", and it needs a **`userId`** - state is per
	 * respondent.
	 *
	 * An earlier version of this operation read `client/{workspaceId}/environment` on v2 and
	 * described the catalog's two client-read ids as one route serving two names. That was wrong.
	 * The environment bundle is workspace-wide configuration; the catalog describes this operation as
	 * "the current state of a contact ... their segment memberships, survey displays, and response
	 * history", which is a different payload entirely:
	 *
	 * ```
	 * POST client/{workspaceId}/user  ->  { state: { data: { contactId, userId, segments,
	 *                                                        displays, responses, lastDisplayAt },
	 *                                                expiresAt } }
	 * ```
	 *
	 * Four `GET` shapes were tried first - `contacts/{userId}/state`, `user/{userId}/state`,
	 * `contacts/state` on both versions - and every one is a 404. **The only way to read this state
	 * is the POST**, which upserts the contact as a side effect: a `userId` that does not exist yet is
	 * created rather than reported missing. That is why this operation shares a route with
	 * {@link clientIdentifyUser} and why it is not marked read-only.
	 */
	clientContactsState: z.object({
		workspaceId: WorkspaceId,
		userId: z.string().min(1),
	}),

	/* -------------------------------- storage ------------------------------- */
	/**
	 * File upload. **Both operations are the same route**, differing only by `accessType`:
	 * `POST v1/management/storage` with `accessType: 'public' | 'private'`.
	 *
	 * An earlier version pointed the private operation at `v1/client/{workspaceId}/storage`, on the
	 * assumption that a respondent-facing upload belonged to the client API like the rest of the
	 * respondent surface. That route answers **`400 "Fields are missing or incorrectly formatted"`**
	 * to every body tried, so the operation could not succeed at all. The management route takes both
	 * kinds.
	 *
	 * The response is an S3 **presigned POST** grant - see `FormbricksUploadResult`. This plugin
	 * obtains the grant; transferring the bytes is the caller's own multipart POST, and the 5MB
	 * ceiling the catalog documents is enforced by S3 at that step, not here.
	 */
	storageUploadPublic: z.object({
		workspaceId: WorkspaceId,
		fileName: z.string().min(1),
		fileType: z.string().min(1),
	}),
	storageUploadPrivate: z.object({
		workspaceId: WorkspaceId,
		fileName: z.string().min(1),
		fileType: z.string().min(1),
		/** Which survey the file was attached to. Recorded in the audit; the filename is not. */
		surveyId: z.string().min(1).optional(),
	}),
} as const;

/* -------------------------------------------------------------------------- */
/*                           Output schema registry                           */
/* -------------------------------------------------------------------------- */

export const FormbricksEndpointOutputSchemas = {
	surveysList: listOf(FormbricksSurveyEntity),
	surveysCreate: FormbricksSurveyEntity,
	surveysUpdate: FormbricksSurveyEntity,
	surveysDelete: DeleteResultSchema,

	responsesList: listOf(FormbricksResponse),
	responsesCreate: FormbricksResponse,
	responsesUpdate: FormbricksResponse,
	responsesDelete: DeleteResultSchema,

	actionClassesList: listOf(FormbricksActionClassEntity),
	actionClassesCreate: FormbricksActionClassEntity,

	contactsList: listOf(FormbricksContact),
	/** Same route, same shape as {@link contactsList} - see its input schema for why both exist. */
	contactsListPeople: listOf(FormbricksContact),
	contactsGet: FormbricksContact,
	contactsGetPerson: FormbricksContact,
	/**
	 * Respondent **state**, not a contact record: this operation posts to the client user route,
	 * which is the only thing that sets attribute values, and that route returns state.
	 */
	contactsUpdateAttributes: FormbricksClientUserState,
	contactsCreate: FormbricksContact,
	/**
	 * `{status, message}` - **not** the uploaded contacts. Declaring an array of contacts here, as an
	 * earlier version did, published a shape this route never returns and promised ids the caller
	 * cannot get from it.
	 */
	contactsUploadBulk: FormbricksBulkUploadResult,
	contactsDelete: DeleteResultSchema,

	contactAttributeKeysList: listOf(FormbricksContactAttributeKeyEntity),
	contactAttributeKeysListClasses: listOf(FormbricksContactAttributeKeyEntity),
	contactAttributeKeysGet: FormbricksContactAttributeKeyEntity,
	contactAttributeKeysGetClass: FormbricksContactAttributeKeyEntity,
	contactAttributeKeysCreate: FormbricksContactAttributeKeyEntity,
	contactAttributeKeysUpdate: FormbricksContactAttributeKeyEntity,
	contactAttributeKeysDelete: DeleteResultSchema,

	contactAttributesList: listOf(FormbricksContactAttribute),

	webhooksList: listOf(FormbricksWebhookEntity),
	webhooksGet: FormbricksWebhookEntity,
	webhooksCreate: FormbricksWebhookEntity,
	webhooksUpdate: FormbricksWebhookEntity,
	webhooksDelete: DeleteResultSchema,

	teamsList: listOf(FormbricksTeamEntity),
	teamsDelete: DeleteResultSchema,
	teamsListWorkspaceTeams: listOf(FormbricksWorkspaceTeam),

	rolesList: listOf(FormbricksRole),

	meGet: FormbricksMe,
	meGetManagement: FormbricksManagementMe,
	/** The v1 environment payload, same as {@link meGetManagement} - see the input schema. */
	meGetAccountInfo: FormbricksManagementMe,

	healthCheck: FormbricksHealth,
	healthList: FormbricksHealth,

	clientCreateDisplay: FormbricksDisplay,
	/**
	 * `POST client/{workspaceId}/user` returns respondent **state**, not a contact record - on both
	 * versions, verified. An earlier version declared `FormbricksContact` for these two, which
	 * published an `id` the response has no top-level equivalent of.
	 */
	clientCreateUser: FormbricksClientUserState,
	clientIdentifyUser: FormbricksClientUserState,
	clientEnvironment: FormbricksClientEnvironment,
	clientContactsState: FormbricksClientUserState,

	storageUploadPublic: FormbricksUploadResult,
	storageUploadPrivate: FormbricksUploadResult,
} as const;

export type FormbricksEndpointInputs = {
	[K in keyof typeof FormbricksEndpointInputSchemas]: z.infer<
		(typeof FormbricksEndpointInputSchemas)[K]
	>;
};

export type FormbricksEndpointOutputs = {
	[K in keyof typeof FormbricksEndpointOutputSchemas]: z.infer<
		(typeof FormbricksEndpointOutputSchemas)[K]
	>;
};
