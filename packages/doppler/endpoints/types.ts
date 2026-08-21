import { z } from 'zod';
import {
	DopplerConfigEntity,
	DopplerEnvironmentEntity,
	DopplerProjectEntity,
	DopplerWebhookEntity,
	DopplerWorkplaceEntity,
} from '../schema/database';

/**
 * Input and output schemas for every Doppler operation.
 *
 * Every operation on this plugin goes through one of two REST bases -
 * `/v3` (the documented, current API) or `/v1/share` (Doppler Share, an
 * older-versioned surface on the same host) - both under the same Bearer
 * auth. See `client.ts`.
 *
 * Route method/path/params for every operation here were confirmed from
 * `docs.doppler.com/reference/<slug>.md`'s own embedded OpenAPI 3.1
 * fragment, cross-checked against `DopplerHQ/cli`'s Go source where the CLI
 * also calls the same route. See `DOPPLER-PLAN.md` and `doppler-mapping.json`
 * in the session scratchpad for the full per-operation source trail.
 *
 * Outputs for entities this plugin mirrors (projects, environments, configs,
 * webhooks, workplace) reuse the entity definitions in `schema/database.ts`
 * directly, so the mirrored shape and the returned shape cannot drift.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/** For a payload this plugin does not model field by field. */
const OpaqueObject = z.record(z.string(), z.unknown());

/** An operation whose response carries nothing the caller needs back. */
const EmptyResult = z.object({ success: z.boolean().optional() }).loose();

/** A page envelope: `{items: [...], page, success}` - confirmed on every v3 list route this plugin calls. */
/**
 * `key` is typed as a generic `K extends string`, not plain `string` - a
 * computed property built from an untyped `string` collapses to a bare
 * index signature (`{ [x: string]: T[] | number }`), which erases which
 * field is the list and which is `page` for every caller that dot-accesses
 * a specific key (every endpoint file in this plugin does). Keeping `K`
 * generic, and passing it explicitly wherever a literal string argument
 * can't be inferred (the `Outputs` registry below, which only supplies the
 * item schema), preserves the real key name in the type.
 */
const PagedList = <T extends z.ZodTypeAny, K extends string>(item: T, key: K) =>
	z
		.object({ [key]: z.array(item), page: N } as { [P in K]: z.ZodArray<T> } & {
			page: typeof N;
		})
		.loose();

/* -------------------------------------------------------------------------- */
/*                                  Workplace                                 */
/* -------------------------------------------------------------------------- */

const WorkplaceGetInputSchema = z.object({});
export type WorkplaceGetInput = z.infer<typeof WorkplaceGetInputSchema>;

/**
 * All three fields optional at the schema level - the spec's own body has no
 * `required` array - but the endpoint itself enforces at least one, matching
 * the catalog's own description ("At least one field must be provided").
 */
const WorkplaceUpdateInputSchema = z
	.object({
		name: z.string().optional(),
		billingEmail: z.string().optional(),
		securityEmail: z.string().optional(),
	})
	.refine(
		(input) =>
			input.name !== undefined ||
			input.billingEmail !== undefined ||
			input.securityEmail !== undefined,
		{
			message: 'At least one of name, billingEmail, securityEmail is required',
		},
	);
export type WorkplaceUpdateInput = z.infer<typeof WorkplaceUpdateInputSchema>;

/* -------------------------------------------------------------------------- */
/*                              Workplace users                               */
/* -------------------------------------------------------------------------- */

const WorkplaceUsersListInputSchema = z.object({
	page: z.number().optional(),
	email: z.string().optional(),
});
export type WorkplaceUsersListInput = z.infer<
	typeof WorkplaceUsersListInputSchema
>;

const WorkplaceUsersGetInputSchema = z.object({ slug: z.string() });
export type WorkplaceUsersGetInput = z.infer<
	typeof WorkplaceUsersGetInputSchema
>;

/**
 * Confirmed live: the response key is `workplace_users`, not `users` - not
 * the plural of the resource name a first guess would reach for.
 *
 * Carries the account's real name and email per entry (confirmed live) -
 * never logged, never mirrored. See `endpoints/logging.ts`.
 */
const WorkplaceUserSchema = z
	.object({
		access: S,
		created_at: S,
		user: z
			.object({ id: S, email: S, name: S, username: S })
			.loose()
			.nullable()
			.optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                              Workplace roles                               */
/* -------------------------------------------------------------------------- */

const WorkplaceRolesListInputSchema = z.object({});
export type WorkplaceRolesListInput = z.infer<
	typeof WorkplaceRolesListInputSchema
>;

const WorkplaceRolesGetInputSchema = z.object({ role: z.string() });
export type WorkplaceRolesGetInput = z.infer<
	typeof WorkplaceRolesGetInputSchema
>;

const WorkplaceRolesListPermissionsInputSchema = z.object({});
export type WorkplaceRolesListPermissionsInput = z.infer<
	typeof WorkplaceRolesListPermissionsInputSchema
>;

const WorkplaceRoleSchema = z
	.object({ name: S, permissions: z.array(z.string()).nullable().optional() })
	.loose();

/* -------------------------------------------------------------------------- */
/*                                Activity logs                               */
/* -------------------------------------------------------------------------- */

const ActivityLogsListInputSchema = z.object({
	page: z.string().optional(),
	perPage: z.number().optional(),
});
export type ActivityLogsListInput = z.infer<typeof ActivityLogsListInputSchema>;

const ActivityLogsRetrieveInputSchema = z.object({ log: z.string() });
export type ActivityLogsRetrieveInput = z.infer<
	typeof ActivityLogsRetrieveInputSchema
>;

/**
 * Carries the acting user's real name and email in `user` (confirmed live -
 * this is the exact field the CircleCI/Habitica-style secret-scanner needle
 * check was written for this session). Never logged, never mirrored.
 */
const ActivityLogSchema = z
	.object({
		id: S,
		text: S,
		html: S,
		created_at: S,
		/** Official list schema. CLI still emits the `enclave_*` names below. */
		config: S,
		environment: S,
		project: S,
		enclave_project: S,
		enclave_environment: S,
		enclave_config: S,
		user: OpaqueObject.nullable().optional(),
		diff: OpaqueObject.nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                   Projects                                 */
/* -------------------------------------------------------------------------- */

const ProjectsListInputSchema = z.object({
	page: z.number().optional(),
	perPage: z.number().optional(),
});
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectsCreateInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
});
export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

const ProjectsGetInputSchema = z.object({ project: z.string() });
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const ProjectsUpdateInputSchema = z.object({
	project: z.string(),
	name: z.string(),
	description: z.string().optional(),
});
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

const ProjectsDeleteInputSchema = z.object({ project: z.string() });
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                Project roles                               */
/* -------------------------------------------------------------------------- */

const ProjectRolesListInputSchema = z.object({});
export type ProjectRolesListInput = z.infer<typeof ProjectRolesListInputSchema>;

const ProjectRolesGetInputSchema = z.object({ role: z.string() });
export type ProjectRolesGetInput = z.infer<typeof ProjectRolesGetInputSchema>;

const ProjectPermissionsListInputSchema = z.object({});
export type ProjectPermissionsListInput = z.infer<
	typeof ProjectPermissionsListInputSchema
>;

const ProjectRoleSchema = z
	.object({
		identifier: S,
		name: S,
		permissions: z.array(z.string()).nullable().optional(),
		created_at: S,
		is_custom_role: B,
	})
	.loose();

const PermissionSchema = z.string();

/* -------------------------------------------------------------------------- */
/*                               Project members                              */
/* -------------------------------------------------------------------------- */

/** `type` is one of `workplace_user`/`group`/`invite`/`service_account`, confirmed from the catalog's own description. */
const ProjectMemberType = z.enum([
	'workplace_user',
	'group',
	'invite',
	'service_account',
]);

const ProjectMembersListInputSchema = z.object({
	project: z.string(),
	page: z.number().optional(),
	perPage: z.number().optional(),
});
export type ProjectMembersListInput = z.infer<
	typeof ProjectMembersListInputSchema
>;

const ProjectMembersGetInputSchema = z.object({
	project: z.string(),
	type: ProjectMemberType,
	slug: z.string(),
});
export type ProjectMembersGetInput = z.infer<
	typeof ProjectMembersGetInputSchema
>;

const ProjectMembersDeleteInputSchema = z.object({
	project: z.string(),
	type: ProjectMemberType,
	slug: z.string(),
});
export type ProjectMembersDeleteInput = z.infer<
	typeof ProjectMembersDeleteInputSchema
>;

const ProjectMemberSchema = z
	.object({
		type: S,
		slug: S,
		role: OpaqueObject.nullable().optional(),
		environments: z.array(z.unknown()).nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                 Environments                               */
/* -------------------------------------------------------------------------- */

const EnvironmentsListInputSchema = z.object({ project: z.string() });
export type EnvironmentsListInput = z.infer<typeof EnvironmentsListInputSchema>;

const EnvironmentsCreateInputSchema = z.object({
	project: z.string(),
	name: z.string(),
	slug: z.string(),
	/** Defaults to `false` per the spec's own body schema - omitted rather than forced, so that default still applies. */
	personalConfigs: z.boolean().optional(),
});
export type EnvironmentsCreateInput = z.infer<
	typeof EnvironmentsCreateInputSchema
>;

const EnvironmentsGetInputSchema = z.object({
	project: z.string(),
	environment: z.string(),
});
export type EnvironmentsGetInput = z.infer<typeof EnvironmentsGetInputSchema>;

const EnvironmentsDeleteInputSchema = z.object({
	project: z.string(),
	environment: z.string(),
});
export type EnvironmentsDeleteInput = z.infer<
	typeof EnvironmentsDeleteInputSchema
>;

/** Renames the display name, the slug, and/or toggles personal configs - all three are optional in the spec's own body, but the endpoint requires at least one. */
const EnvironmentsRenameInputSchema = z
	.object({
		project: z.string(),
		environment: z.string(),
		name: z.string().optional(),
		slug: z.string().optional(),
		personalConfigs: z.boolean().optional(),
	})
	.refine(
		(input) =>
			input.name !== undefined ||
			input.slug !== undefined ||
			input.personalConfigs !== undefined,
		{ message: 'At least one of name, slug, personalConfigs is required' },
	);
export type EnvironmentsRenameInput = z.infer<
	typeof EnvironmentsRenameInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                    Configs                                 */
/* -------------------------------------------------------------------------- */

const ConfigsListInputSchema = z.object({
	project: z.string(),
	environment: z.string().optional(),
	page: z.number().optional(),
	perPage: z.number().optional(),
});
export type ConfigsListInput = z.infer<typeof ConfigsListInputSchema>;

/**
 * The catalog's own description states the name-format rule explicitly: it
 * MUST start with the environment identifier followed by an underscore
 * (e.g. `dev_feature`) - encoded here as a `.refine()` rather than left to
 * the API to reject, since the API's own rejection message is a plain 400
 * with no field-level detail (confirmed live).
 */
const ConfigsCreateInputSchema = z
	.object({
		project: z.string(),
		environment: z.string(),
		name: z.string(),
	})
	.refine((input) => input.name.startsWith(`${input.environment}_`), {
		message: 'Config name must start with "<environment>_"',
		path: ['name'],
	});
export type ConfigsCreateInput = z.infer<typeof ConfigsCreateInputSchema>;

const ConfigsGetInputSchema = z.object({
	project: z.string(),
	config: z.string(),
});
export type ConfigsGetInput = z.infer<typeof ConfigsGetInputSchema>;

const ConfigsUpdateInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	name: z.string(),
});
export type ConfigsUpdateInput = z.infer<typeof ConfigsUpdateInputSchema>;

const ConfigsDeleteInputSchema = z.object({
	project: z.string(),
	config: z.string(),
});
export type ConfigsDeleteInput = z.infer<typeof ConfigsDeleteInputSchema>;

const ConfigsCloneInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	name: z.string(),
});
export type ConfigsCloneInput = z.infer<typeof ConfigsCloneInputSchema>;

const ConfigsLockInputSchema = z.object({
	project: z.string(),
	config: z.string(),
});
export type ConfigsLockInput = z.infer<typeof ConfigsLockInputSchema>;

const ConfigsUnlockInputSchema = z.object({
	project: z.string(),
	config: z.string(),
});
export type ConfigsUnlockInput = z.infer<typeof ConfigsUnlockInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                 Config logs                                */
/* -------------------------------------------------------------------------- */

const ConfigLogsListInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	page: z.number().optional(),
	perPage: z.number().optional(),
});
export type ConfigLogsListInput = z.infer<typeof ConfigLogsListInputSchema>;

const ConfigLogsGetInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	log: z.string(),
});
export type ConfigLogsGetInput = z.infer<typeof ConfigLogsGetInputSchema>;

const ConfigLogsRollbackInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	log: z.string(),
});
export type ConfigLogsRollbackInput = z.infer<
	typeof ConfigLogsRollbackInputSchema
>;

/** Confirmed live: the same envelope shape as an activity log, plus a diff of what the rollback (or the change being logged) touched. */
const ConfigLogSchema = z
	.object({
		id: S,
		text: S,
		html: S,
		created_at: S,
		user: OpaqueObject.nullable().optional(),
		diff: OpaqueObject.nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                   Secrets                                  */
/* -------------------------------------------------------------------------- */

/**
 * Never mirrored, never logged - see `schema/database.ts`'s header comment.
 * `raw`/`computed` are the actual live secret value, confirmed live (not a
 * masked fragment the way CircleCI's env vars are).
 */
const SecretValueSchema = z
	.object({
		raw: S,
		computed: S,
		note: S,
		rawVisibility: S,
		computedVisibility: S,
		rawValueType: OpaqueObject.nullable().optional(),
		computedValueType: OpaqueObject.nullable().optional(),
	})
	.loose();

const SecretsListInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	includeDynamicSecrets: z.boolean().optional(),
	includeManagedSecrets: z.boolean().optional(),
});
export type SecretsListInput = z.infer<typeof SecretsListInputSchema>;

const SecretsGetInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	name: z.string(),
});
export type SecretsGetInput = z.infer<typeof SecretsGetInputSchema>;

const SecretsDeleteInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	name: z.string(),
});
export type SecretsDeleteInput = z.infer<typeof SecretsDeleteInputSchema>;

/**
 * `secrets` is a flat `{name: value}` map where `value` may be a string
 * (set) or `null` (delete via the bulk route) - confirmed from the spec.
 * The value itself is never logged; see `endpoints/logging.ts`.
 *
 * The spec also accepts a `change_requests` array as a mutually-exclusive
 * alternative body (conditional writes keyed on an expected prior value,
 * per-field `should*` flags, `valueType` validation) - deliberately not
 * exposed here. The catalog's own description for this operation ("update
 * secrets in a Doppler config") only asks for the plain map; conditional
 * writes are a materially different, considerably larger surface that no
 * catalog operation calls for.
 */
const SecretsUpdateInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	secrets: z.record(z.string(), z.string().nullable()),
});
export type SecretsUpdateInput = z.infer<typeof SecretsUpdateInputSchema>;

const SecretsDownloadInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	format: z.enum(['json', 'env', 'yaml', 'docker', 'env-no-quotes']).optional(),
	nameTransformer: z.string().optional(),
	includeDynamicSecrets: z.boolean().optional(),
	dynamicSecretsTtlSec: z.number().optional(),
	secrets: z.array(z.string()).optional(),
});
export type SecretsDownloadInput = z.infer<typeof SecretsDownloadInputSchema>;

const SecretsNamesInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	includeDynamicSecrets: z.boolean().optional(),
	includeManagedSecrets: z.boolean().optional(),
});
export type SecretsNamesInput = z.infer<typeof SecretsNamesInputSchema>;

/**
 * `DOPPLER_UPDATE_SECRET_NOTE` in the catalog. The current, publicly
 * documented route - `POST /v3/projects/project/note`, no `config` needed.
 * See `endpoints/secrets.ts` for why this and `updateNoteViaConfig` below
 * are two genuinely different routes, not a duplicate.
 */
const SecretsUpdateNoteInputSchema = z.object({
	project: z.string(),
	secret: z.string(),
	note: z.string(),
});
export type SecretsUpdateNoteInput = z.infer<
	typeof SecretsUpdateNoteInputSchema
>;

/**
 * `DOPPLER_SECRETS_UPDATE_NOTE` in the catalog. The CLI-only, undocumented
 * (in the current public reference) route - `POST
 * /v3/configs/config/secrets/note` - which the CLI's own source calls
 * deprecated in favour of the route above, but which is still live,
 * confirmed this session.
 */
const SecretsUpdateNoteViaConfigInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	secret: z.string(),
	note: z.string(),
});
export type SecretsUpdateNoteViaConfigInput = z.infer<
	typeof SecretsUpdateNoteViaConfigInputSchema
>;

const SecretNoteSchema = z.object({ secret: S, note: S }).loose();

/* -------------------------------------------------------------------------- */
/*                                Dynamic secrets                             */
/* -------------------------------------------------------------------------- */

const DynamicSecretsRevokeLeaseInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	dynamicSecret: z.string(),
	slug: z.string(),
});
export type DynamicSecretsRevokeLeaseInput = z.infer<
	typeof DynamicSecretsRevokeLeaseInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                Service tokens                              */
/* -------------------------------------------------------------------------- */

const ServiceTokensListInputSchema = z.object({
	project: z.string(),
	config: z.string(),
});
export type ServiceTokensListInput = z.infer<
	typeof ServiceTokensListInputSchema
>;

const ServiceTokensCreateInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	name: z.string(),
	access: z.enum(['read', 'read/write']).optional(),
	expireAt: z.string().optional(),
});
export type ServiceTokensCreateInput = z.infer<
	typeof ServiceTokensCreateInputSchema
>;

const ServiceTokensDeleteInputSchema = z.object({
	project: z.string(),
	config: z.string(),
	slug: z.string(),
});
export type ServiceTokensDeleteInput = z.infer<
	typeof ServiceTokensDeleteInputSchema
>;

/**
 * `key` is the full, plaintext, usable token - confirmed live, returned
 * exactly once at creation and never again. Declared here because the
 * caller genuinely needs it (there is no other way to retrieve a token
 * that was just created), but never logged and never mirrored - see
 * `schema/database.ts` and `endpoints/service-tokens.ts`.
 */
const ServiceTokenSchema = z
	.object({
		name: S,
		slug: S,
		access: S,
		created_at: S,
		key: S,
		project: S,
		environment: S,
		config: S,
		expires_at: S,
		last_seen_at: S,
		token_preview: S,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                 Integrations                               */
/* -------------------------------------------------------------------------- */

const IntegrationsListInputSchema = z.object({});
export type IntegrationsListInput = z.infer<typeof IntegrationsListInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                    Invites                                 */
/* -------------------------------------------------------------------------- */

const InvitesListInputSchema = z.object({
	page: z.number().optional(),
	perPage: z.number().optional(),
});
export type InvitesListInput = z.infer<typeof InvitesListInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                    Groups                                  */
/* -------------------------------------------------------------------------- */

/**
 * The only group operation the catalog claims. `GET /v3/workplace/groups`
 * itself answers 403 "You do not have access to groups." on this
 * development account (Team+/Enterprise-gated), confirmed live - this
 * operation is implemented and tested against a mock, matching the
 * catalog's own `LIST_CHANGE_REQUESTS` treatment.
 */
const GroupsDeleteMemberInputSchema = z.object({
	group: z.string(),
	type: ProjectMemberType,
	memberSlug: z.string(),
});
export type GroupsDeleteMemberInput = z.infer<
	typeof GroupsDeleteMemberInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                   Webhooks                                 */
/* -------------------------------------------------------------------------- */

const WebhooksListInputSchema = z.object({ project: z.string().optional() });
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

/** `token` is used for `type: 'Bearer'`; `username`/`password` for `type: 'Basic'` - per the spec's own body schema. */
const WebhookAuthenticationSchema = z
	.object({
		type: z.enum(['None', 'Bearer', 'Basic']),
		token: z.string().optional(),
		username: z.string().optional(),
		password: z.string().optional(),
	})
	.loose();

const WebhooksAddInputSchema = z.object({
	project: z.string().optional(),
	url: z.string(),
	name: z.string().optional(),
	secret: z.string().optional(),
	authentication: WebhookAuthenticationSchema.optional(),
	payload: z.string().optional(),
	enableConfigs: z.array(z.string()).optional(),
});
export type WebhooksAddInput = z.infer<typeof WebhooksAddInputSchema>;

const WebhooksGetInputSchema = z.object({
	project: z.string().optional(),
	slug: z.string(),
});
export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;

const WebhooksUpdateInputSchema = z.object({
	project: z.string().optional(),
	slug: z.string(),
	url: z.string().optional(),
	name: z.string().optional(),
	secret: z.string().optional(),
	authentication: WebhookAuthenticationSchema.optional(),
	payload: z.string().optional(),
	enableConfigs: z.array(z.string()).optional(),
	disableConfigs: z.array(z.string()).optional(),
});
export type WebhooksUpdateInput = z.infer<typeof WebhooksUpdateInputSchema>;

const WebhooksDeleteInputSchema = z.object({
	project: z.string().optional(),
	slug: z.string(),
});
export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;

const WebhooksEnableInputSchema = z.object({
	project: z.string().optional(),
	slug: z.string(),
});
export type WebhooksEnableInput = z.infer<typeof WebhooksEnableInputSchema>;

const WebhooksDisableInputSchema = z.object({
	project: z.string().optional(),
	slug: z.string(),
});
export type WebhooksDisableInput = z.infer<typeof WebhooksDisableInputSchema>;

/* -------------------------------------------------------------------------- */
/*                               Change requests                              */
/* -------------------------------------------------------------------------- */

/**
 * The catalog's own description states this plainly: "requires a Team or
 * Enterprise plan. Attempting to use this endpoint with a Free or Starter
 * plan will result in a 403 Forbidden error." Confirmed live on this
 * Developer-plan account. Implemented and tested against a mock.
 *
 * The response is a bare JSON array, not the `{change_requests: [...],
 * page}` envelope every other paginated `v3` list route uses - confirmed
 * from the spec fragment's own response schema (`"type": "array"` at the
 * top level), not assumed by analogy. `page`/`per_page` are still accepted
 * as query params even though the response carries no `page` back.
 */
const ChangeRequestsListInputSchema = z.object({
	page: z.number().optional(),
	perPage: z.number().optional(),
	status: z.array(z.string()).optional(),
	title: z.string().optional(),
});
export type ChangeRequestsListInput = z.infer<
	typeof ChangeRequestsListInputSchema
>;

const ChangeRequestSchema = OpaqueObject;

/* -------------------------------------------------------------------------- */
/*                                    Share                                   */
/* -------------------------------------------------------------------------- */

/**
 * `DOPPLER_CREATE_PLAIN`. The plugin sends the secret as-is; Doppler's own
 * description is explicit that this path is not end-to-end encrypted for
 * the send half - "the secret is not stored in plain text by Doppler," but
 * it is transmitted in plain text to create the link.
 */
const ShareCreatePlainInputSchema = z.object({
	secret: z.string(),
	expireViews: z.number().int().min(1).max(50).or(z.literal(-1)).optional(),
	expireDays: z.number().int().min(1).max(90).optional(),
});
export type ShareCreatePlainInput = z.infer<typeof ShareCreatePlainInputSchema>;

/**
 * `DOPPLER_CREATE_ENCRYPTED`. The caller must supply an already-encrypted
 * payload - AES-256-GCM, PBKDF2-SHA256 key derivation, 1,000,000 salt
 * rounds - confirmed from the spec's own field descriptions. This plugin
 * does not perform that encryption on the caller's behalf; the input here
 * is the ciphertext and its accompanying metadata, not a plaintext secret.
 */
const ShareCreateEncryptedInputSchema = z.object({
	encryptedSecret: z.string(),
	hashedPassword: z.string(),
	encryptionKdf: z.literal('pbkdf2').optional(),
	encryptionSaltRounds: z.literal(1_000_000).optional(),
	expireViews: z.number().int().min(1).max(50).or(z.literal(-1)).optional(),
	expireDays: z.number().int().min(1).max(90).optional(),
});
export type ShareCreateEncryptedInput = z.infer<
	typeof ShareCreateEncryptedInputSchema
>;

/**
 * `password` is the link's decryption key, in plaintext, in the response -
 * confirmed live. The single most sensitive value this plugin ever returns;
 * never logged, never mirrored. See `endpoints/share.ts`.
 */
const ShareLinkSchema = z
	.object({
		url: S,
		authenticated_url: S,
		password: S,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */

const AuthMeInputSchema = z.object({});
export type AuthMeInput = z.infer<typeof AuthMeInputSchema>;

const ActorInfoSchema = z
	.object({
		slug: S,
		name: S,
		created_at: S,
		last_seen_at: S,
		type: S,
		token_preview: S,
		workplace: z.object({ slug: S, name: S }).loose().nullable().optional(),
		principal: z.object({ type: S, slug: S }).loose().nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                  Registries                                */
/* -------------------------------------------------------------------------- */

export type DopplerEndpointInputs = {
	workplaceGet: WorkplaceGetInput;
	workplaceUpdate: WorkplaceUpdateInput;

	workplaceUsersList: WorkplaceUsersListInput;
	workplaceUsersGet: WorkplaceUsersGetInput;

	workplaceRolesList: WorkplaceRolesListInput;
	workplaceRolesGet: WorkplaceRolesGetInput;
	workplaceRolesListPermissions: WorkplaceRolesListPermissionsInput;

	activityLogsList: ActivityLogsListInput;
	activityLogsRetrieve: ActivityLogsRetrieveInput;

	projectsList: ProjectsListInput;
	projectsCreate: ProjectsCreateInput;
	projectsGet: ProjectsGetInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;

	projectRolesList: ProjectRolesListInput;
	projectRolesGet: ProjectRolesGetInput;
	projectRolesListPermissions: ProjectPermissionsListInput;

	projectMembersList: ProjectMembersListInput;
	projectMembersGet: ProjectMembersGetInput;
	projectMembersDelete: ProjectMembersDeleteInput;

	environmentsList: EnvironmentsListInput;
	environmentsCreate: EnvironmentsCreateInput;
	environmentsGet: EnvironmentsGetInput;
	environmentsDelete: EnvironmentsDeleteInput;
	environmentsRename: EnvironmentsRenameInput;

	configsList: ConfigsListInput;
	configsCreate: ConfigsCreateInput;
	configsGet: ConfigsGetInput;
	configsUpdate: ConfigsUpdateInput;
	configsDelete: ConfigsDeleteInput;
	configsClone: ConfigsCloneInput;
	configsLock: ConfigsLockInput;
	configsUnlock: ConfigsUnlockInput;

	configLogsList: ConfigLogsListInput;
	configLogsGet: ConfigLogsGetInput;
	configLogsRollback: ConfigLogsRollbackInput;

	secretsList: SecretsListInput;
	secretsGet: SecretsGetInput;
	secretsDelete: SecretsDeleteInput;
	secretsUpdate: SecretsUpdateInput;
	secretsDownload: SecretsDownloadInput;
	secretsNames: SecretsNamesInput;
	secretsUpdateNote: SecretsUpdateNoteInput;
	secretsUpdateNoteViaConfig: SecretsUpdateNoteViaConfigInput;

	dynamicSecretsRevokeLease: DynamicSecretsRevokeLeaseInput;

	serviceTokensList: ServiceTokensListInput;
	serviceTokensCreate: ServiceTokensCreateInput;
	serviceTokensDelete: ServiceTokensDeleteInput;

	integrationsList: IntegrationsListInput;

	invitesList: InvitesListInput;

	groupsDeleteMember: GroupsDeleteMemberInput;

	webhooksList: WebhooksListInput;
	webhooksAdd: WebhooksAddInput;
	webhooksGet: WebhooksGetInput;
	webhooksUpdate: WebhooksUpdateInput;
	webhooksDelete: WebhooksDeleteInput;
	webhooksEnable: WebhooksEnableInput;
	webhooksDisable: WebhooksDisableInput;

	changeRequestsList: ChangeRequestsListInput;

	shareCreatePlain: ShareCreatePlainInput;
	shareCreateEncrypted: ShareCreateEncryptedInput;

	authMe: AuthMeInput;
};

export type DopplerEndpointOutputs = {
	workplaceGet: z.infer<typeof DopplerWorkplaceEntity>;
	workplaceUpdate: z.infer<typeof DopplerWorkplaceEntity>;

	workplaceUsersList: z.infer<
		ReturnType<typeof PagedList<typeof WorkplaceUserSchema, 'workplace_users'>>
	>;
	workplaceUsersGet: z.infer<typeof WorkplaceUserSchema>;

	workplaceRolesList: z.infer<typeof WorkplaceRoleSchema>[];
	workplaceRolesGet: z.infer<typeof WorkplaceRoleSchema>;
	workplaceRolesListPermissions: z.infer<typeof PermissionSchema>[];

	activityLogsList: z.infer<
		ReturnType<typeof PagedList<typeof ActivityLogSchema, 'logs'>>
	>;
	activityLogsRetrieve: z.infer<typeof ActivityLogSchema>;

	projectsList: z.infer<
		ReturnType<typeof PagedList<typeof DopplerProjectEntity, 'projects'>>
	>;
	projectsCreate: z.infer<typeof DopplerProjectEntity>;
	projectsGet: z.infer<typeof DopplerProjectEntity>;
	projectsUpdate: z.infer<typeof DopplerProjectEntity>;
	projectsDelete: z.infer<typeof EmptyResult>;

	projectRolesList: z.infer<typeof ProjectRoleSchema>[];
	projectRolesGet: z.infer<typeof ProjectRoleSchema>;
	projectRolesListPermissions: z.infer<typeof PermissionSchema>[];

	projectMembersList: z.infer<
		ReturnType<typeof PagedList<typeof ProjectMemberSchema, 'members'>>
	>;
	projectMembersGet: z.infer<typeof ProjectMemberSchema>;
	projectMembersDelete: z.infer<typeof EmptyResult>;

	environmentsList: z.infer<typeof DopplerEnvironmentEntity>[];
	environmentsCreate: z.infer<typeof DopplerEnvironmentEntity>;
	environmentsGet: z.infer<typeof DopplerEnvironmentEntity>;
	environmentsDelete: z.infer<typeof EmptyResult>;
	environmentsRename: z.infer<typeof DopplerEnvironmentEntity>;

	configsList: z.infer<
		ReturnType<typeof PagedList<typeof DopplerConfigEntity, 'configs'>>
	>;
	configsCreate: z.infer<typeof DopplerConfigEntity>;
	configsGet: z.infer<typeof DopplerConfigEntity>;
	configsUpdate: z.infer<typeof DopplerConfigEntity>;
	configsDelete: z.infer<typeof EmptyResult>;
	configsClone: z.infer<typeof DopplerConfigEntity>;
	configsLock: z.infer<typeof DopplerConfigEntity>;
	configsUnlock: z.infer<typeof DopplerConfigEntity>;

	configLogsList: z.infer<
		ReturnType<typeof PagedList<typeof ConfigLogSchema, 'logs'>>
	>;
	configLogsGet: z.infer<typeof ConfigLogSchema>;
	configLogsRollback: z.infer<typeof ConfigLogSchema>;

	secretsList: Record<string, z.infer<typeof SecretValueSchema>>;
	secretsGet: z.infer<typeof SecretValueSchema> & { name: string };
	secretsDelete: z.infer<typeof EmptyResult>;
	secretsUpdate: Record<string, z.infer<typeof SecretValueSchema>>;
	secretsDownload: z.infer<typeof OpaqueObject>;
	secretsNames: string[];
	secretsUpdateNote: z.infer<typeof SecretNoteSchema>;
	secretsUpdateNoteViaConfig: z.infer<typeof SecretNoteSchema>;

	dynamicSecretsRevokeLease: z.infer<typeof EmptyResult>;

	serviceTokensList: z.infer<typeof ServiceTokenSchema>[];
	serviceTokensCreate: z.infer<typeof ServiceTokenSchema>;
	serviceTokensDelete: z.infer<typeof EmptyResult>;

	integrationsList: z.infer<typeof OpaqueObject>[];

	invitesList: z.infer<
		ReturnType<typeof PagedList<typeof OpaqueObject, 'invites'>>
	>;

	groupsDeleteMember: z.infer<typeof EmptyResult>;

	webhooksList: z.infer<typeof DopplerWebhookEntity>[];
	webhooksAdd: z.infer<typeof DopplerWebhookEntity>;
	webhooksGet: z.infer<typeof DopplerWebhookEntity>;
	webhooksUpdate: z.infer<typeof DopplerWebhookEntity>;
	webhooksDelete: z.infer<typeof EmptyResult>;
	webhooksEnable: z.infer<typeof DopplerWebhookEntity>;
	webhooksDisable: z.infer<typeof DopplerWebhookEntity>;

	changeRequestsList: z.infer<typeof ChangeRequestSchema>[];

	shareCreatePlain: z.infer<typeof ShareLinkSchema>;
	shareCreateEncrypted: z.infer<typeof ShareLinkSchema>;

	authMe: z.infer<typeof ActorInfoSchema>;
};

export const DopplerEndpointInputSchemas = {
	workplaceGet: WorkplaceGetInputSchema,
	workplaceUpdate: WorkplaceUpdateInputSchema,

	workplaceUsersList: WorkplaceUsersListInputSchema,
	workplaceUsersGet: WorkplaceUsersGetInputSchema,

	workplaceRolesList: WorkplaceRolesListInputSchema,
	workplaceRolesGet: WorkplaceRolesGetInputSchema,
	workplaceRolesListPermissions: WorkplaceRolesListPermissionsInputSchema,

	activityLogsList: ActivityLogsListInputSchema,
	activityLogsRetrieve: ActivityLogsRetrieveInputSchema,

	projectsList: ProjectsListInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,

	projectRolesList: ProjectRolesListInputSchema,
	projectRolesGet: ProjectRolesGetInputSchema,
	projectRolesListPermissions: ProjectPermissionsListInputSchema,

	projectMembersList: ProjectMembersListInputSchema,
	projectMembersGet: ProjectMembersGetInputSchema,
	projectMembersDelete: ProjectMembersDeleteInputSchema,

	environmentsList: EnvironmentsListInputSchema,
	environmentsCreate: EnvironmentsCreateInputSchema,
	environmentsGet: EnvironmentsGetInputSchema,
	environmentsDelete: EnvironmentsDeleteInputSchema,
	environmentsRename: EnvironmentsRenameInputSchema,

	configsList: ConfigsListInputSchema,
	configsCreate: ConfigsCreateInputSchema,
	configsGet: ConfigsGetInputSchema,
	configsUpdate: ConfigsUpdateInputSchema,
	configsDelete: ConfigsDeleteInputSchema,
	configsClone: ConfigsCloneInputSchema,
	configsLock: ConfigsLockInputSchema,
	configsUnlock: ConfigsUnlockInputSchema,

	configLogsList: ConfigLogsListInputSchema,
	configLogsGet: ConfigLogsGetInputSchema,
	configLogsRollback: ConfigLogsRollbackInputSchema,

	secretsList: SecretsListInputSchema,
	secretsGet: SecretsGetInputSchema,
	secretsDelete: SecretsDeleteInputSchema,
	secretsUpdate: SecretsUpdateInputSchema,
	secretsDownload: SecretsDownloadInputSchema,
	secretsNames: SecretsNamesInputSchema,
	secretsUpdateNote: SecretsUpdateNoteInputSchema,
	secretsUpdateNoteViaConfig: SecretsUpdateNoteViaConfigInputSchema,

	dynamicSecretsRevokeLease: DynamicSecretsRevokeLeaseInputSchema,

	serviceTokensList: ServiceTokensListInputSchema,
	serviceTokensCreate: ServiceTokensCreateInputSchema,
	serviceTokensDelete: ServiceTokensDeleteInputSchema,

	integrationsList: IntegrationsListInputSchema,

	invitesList: InvitesListInputSchema,

	groupsDeleteMember: GroupsDeleteMemberInputSchema,

	webhooksList: WebhooksListInputSchema,
	webhooksAdd: WebhooksAddInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	webhooksEnable: WebhooksEnableInputSchema,
	webhooksDisable: WebhooksDisableInputSchema,

	changeRequestsList: ChangeRequestsListInputSchema,

	shareCreatePlain: ShareCreatePlainInputSchema,
	shareCreateEncrypted: ShareCreateEncryptedInputSchema,

	authMe: AuthMeInputSchema,
} as const;

export const DopplerEndpointOutputSchemas = {
	workplaceGet: DopplerWorkplaceEntity,
	workplaceUpdate: DopplerWorkplaceEntity,

	workplaceUsersList: PagedList(WorkplaceUserSchema, 'workplace_users'),
	workplaceUsersGet: WorkplaceUserSchema,

	workplaceRolesList: z.array(WorkplaceRoleSchema),
	workplaceRolesGet: WorkplaceRoleSchema,
	workplaceRolesListPermissions: z.array(PermissionSchema),

	activityLogsList: PagedList(ActivityLogSchema, 'logs'),
	activityLogsRetrieve: ActivityLogSchema,

	projectsList: PagedList(DopplerProjectEntity, 'projects'),
	projectsCreate: DopplerProjectEntity,
	projectsGet: DopplerProjectEntity,
	projectsUpdate: DopplerProjectEntity,
	projectsDelete: EmptyResult,

	projectRolesList: z.array(ProjectRoleSchema),
	projectRolesGet: ProjectRoleSchema,
	projectRolesListPermissions: z.array(PermissionSchema),

	projectMembersList: PagedList(ProjectMemberSchema, 'members'),
	projectMembersGet: ProjectMemberSchema,
	projectMembersDelete: EmptyResult,

	environmentsList: z.array(DopplerEnvironmentEntity),
	environmentsCreate: DopplerEnvironmentEntity,
	environmentsGet: DopplerEnvironmentEntity,
	environmentsDelete: EmptyResult,
	environmentsRename: DopplerEnvironmentEntity,

	configsList: PagedList(DopplerConfigEntity, 'configs'),
	configsCreate: DopplerConfigEntity,
	configsGet: DopplerConfigEntity,
	configsUpdate: DopplerConfigEntity,
	configsDelete: EmptyResult,
	configsClone: DopplerConfigEntity,
	configsLock: DopplerConfigEntity,
	configsUnlock: DopplerConfigEntity,

	configLogsList: PagedList(ConfigLogSchema, 'logs'),
	configLogsGet: ConfigLogSchema,
	configLogsRollback: ConfigLogSchema,

	secretsList: z.record(z.string(), SecretValueSchema),
	secretsGet: SecretValueSchema.extend({ name: z.string() }),
	secretsDelete: EmptyResult,
	secretsUpdate: z.record(z.string(), SecretValueSchema),
	secretsDownload: OpaqueObject,
	secretsNames: z.array(z.string()),
	secretsUpdateNote: SecretNoteSchema,
	secretsUpdateNoteViaConfig: SecretNoteSchema,

	dynamicSecretsRevokeLease: EmptyResult,

	serviceTokensList: z.array(ServiceTokenSchema),
	serviceTokensCreate: ServiceTokenSchema,
	serviceTokensDelete: EmptyResult,

	integrationsList: z.array(OpaqueObject),

	invitesList: PagedList(OpaqueObject, 'invites'),

	groupsDeleteMember: EmptyResult,

	webhooksList: z.array(DopplerWebhookEntity),
	webhooksAdd: DopplerWebhookEntity,
	webhooksGet: DopplerWebhookEntity,
	webhooksUpdate: DopplerWebhookEntity,
	webhooksDelete: EmptyResult,
	webhooksEnable: DopplerWebhookEntity,
	webhooksDisable: DopplerWebhookEntity,

	changeRequestsList: z.array(ChangeRequestSchema),

	shareCreatePlain: ShareLinkSchema,
	shareCreateEncrypted: ShareLinkSchema,

	authMe: ActorInfoSchema,
} as const;
