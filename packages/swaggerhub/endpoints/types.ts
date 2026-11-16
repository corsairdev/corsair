import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────────────────
//
// SwaggerHub shapes come from the registry's own OpenAPI document at
// https://api.swaggerhub.com/openapi.json. Owners, API names and versions are
// **case-sensitive strings** joined as `/apis/{owner}/{api}/{version}`, so every
// id below stays a string and is encoded per segment.

/** An APIs.json property: a `type` plus either a `url` or a `value`. */
const ApisJsonPropertySchema = z
	.object({
		type: z.string(),
		url: z.string().nullish(),
		value: z.string().nullish(),
	})
	.loose();

const ApisJsonApiSchema = z
	.object({
		name: z.string().nullish(),
		description: z.string().nullish(),
		summary: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		properties: z.array(ApisJsonPropertySchema).nullish(),
		totalCount: z
			.object({
				errors: z.number().int().nullish(),
				warnings: z.number().int().nullish(),
				hints: z.number().int().nullish(),
				infos: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
		contractTesting: z.looseObject({}).nullish(),
	})
	.loose();

/** The listing SwaggerHub answers for an owner, or for one owner's API. */
const ApisJsonSchema = z
	.object({
		name: z.string().nullish(),
		description: z.string().nullish(),
		url: z.string().nullish(),
		created: z.string().nullish(),
		modified: z.string().nullish(),
		specificationVersion: z.string().nullish(),
		defaultVersion: z.string().nullish(),
		offset: z.number().int().nullish(),
		totalCount: z.number().int().nullish(),
		blocked: z.boolean().nullish(),
		apis: z.array(ApisJsonApiSchema),
	})
	.loose();

const ApiMetadataSchema = z
	.object({
		defaultVersion: z.string().nullish(),
		categories: z.array(z.string()).nullish(),
		tags: z.array(z.string()).nullish(),
		links: z
			.array(
				z
					.object({ type: z.string().nullish(), url: z.string().nullish() })
					.loose(),
			)
			.nullish(),
		specType: z.string().nullish(),
	})
	.loose();

const CapabilitiesSchema = z
	.object({ canViewStandardizationErrors: z.boolean().nullish() })
	.loose();

const LifecycleSettingsSchema = z
	.object({ published: z.boolean().nullish() })
	.loose();

const VisibilitySettingsSchema = z.object({ private: z.boolean() }).loose();

const DefaultVersionSchema = z
	.object({ version: z.string().nullish() })
	.loose();

const UserSchema = z
	.object({
		id: z.string().nullish(),
		email: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const CommentSchema = z
	.object({
		id: z.string(),
		user: UserSchema,
		created: z.string().nullish(),
		modified: z.string().nullish(),
		body: z.string(),
	})
	.loose();

const RangeSchema = z
	.object({
		startLine: z.number().int().optional(),
		endLine: z.number().int().optional(),
		startColumn: z.number().int().optional(),
		endColumn: z.number().int().optional(),
		startOffset: z.number().int().optional(),
		endOffset: z.number().int().optional(),
	})
	.loose();

const SpecValidationRangeSchema = z
	.object({
		start: z
			.object({
				line: z.number().int().nullish(),
				column: z.number().int().nullish(),
				offset: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
		end: z
			.object({
				line: z.number().int().nullish(),
				column: z.number().int().nullish(),
				offset: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const SpecValidationFindingSchema = z.looseObject({}).and(
	z.object({
		severity: z.string().nullish(),
		message: z.string().nullish(),
		path: z.string().nullish(),
		range: SpecValidationRangeSchema.nullish(),
	}),
);

const SpecValidationResultSchema = z
	.object({
		valid: z.boolean().nullish(),
		recognized: z.boolean().nullish(),
		spec: z
			.object({
				namespace: z.string().nullish(),
				version: z.string().nullish(),
				format: z.string().nullish(),
				mediaType: z.string().nullish(),
			})
			.loose()
			.nullish(),
		summary: z
			.object({
				errors: z.number().int().nullish(),
				warnings: z.number().int().nullish(),
				total: z.number().int().nullish(),
				durationMs: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
		findings: z.array(SpecValidationFindingSchema).nullish(),
	})
	.loose();

const ComparisonPartSchema = z.looseObject({
	description: z.string().nullish(),
	breaking: z.boolean().nullish(),
});

/** A comparison is a **bare array** of differences, not a wrapper. */
const ComparisonSchema = z.object({ changes: z.array(ComparisonPartSchema) });

const ProjectSchema = z
	.object({
		owner: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		apis: z.array(z.string()).nullish(),
		domains: z.array(z.string()).nullish(),
		templates: z.array(z.string()).nullish(),
	})
	.loose();

const ProjectsJsonSchema = z
	.object({
		offset: z.number().int().nullish(),
		totalCount: z.number().int().nullish(),
		projects: z.array(ProjectSchema),
	})
	.loose();

const IntegrationConfigurationSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		pluginIdentifier: z.string().nullish(),
		enabled: z.boolean().nullish(),
	})
	.loose();

const TemplateSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		oas: z.string().nullish(),
	})
	.loose();

const TemplateWrapperSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		specification: z.string().nullish(),
		builtIn: z.boolean().nullish(),
		defaultVersion: z.string().nullish(),
	})
	.loose();

// ── specs ─────────────────────────────────────────────────────────────────

/** The filters the `/specs` listing takes, shared by nothing else. */
const SpecsListInputSchema = z.object({
	specType: z.enum(['API', 'DOMAIN', 'TEMPLATE', 'ANY']).optional(),
	visibility: z.enum(['PUBLIC', 'PRIVATE', 'ANY']).optional(),
	state: z.string().optional(),
	owner: z.string().optional(),
	project: z.string().optional(),
	specification: z.string().optional(),
	oas: z.string().optional(),
	filter: z.enum(['user']).optional(),
	query: z.string().optional(),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	sort: z
		.enum(['NAME', 'UPDATED', 'CREATED', 'OWNER', 'BEST_MATCH', 'TITLE'])
		.optional(),
	order: z.enum(['ASC', 'DESC']).optional(),
	ignoreCount: z.boolean().optional(),
});

export type SpecsListInput = z.input<typeof SpecsListInputSchema>;

/** `GET /specs` answers the APIs.json listing, `{ offset, totalCount, apis }`. */
const SpecsListResponseSchema = ApisJsonSchema;

export type SpecsListResponse = z.infer<typeof SpecsListResponseSchema>;

/**
 * Validating a definition posts the definition text and answers the findings.
 * Nothing is saved: this is the check to run before `apis.save`.
 */
const SpecsValidateInputSchema = z.object({
	/** The OpenAPI or AsyncAPI definition, in YAML or JSON. */
	definition: z.string().min(1),
	/** Caps the number of findings, 1 to 1000. */
	maxProblems: z.number().int().min(1).max(1000).optional(),
	/** A pseudo-URI the parser uses in its messages, e.g. `inmemory://spec.yaml`. */
	uri: z.string().optional(),
});

export type SpecsValidateInput = z.input<typeof SpecsValidateInputSchema>;

const SpecsValidateResponseSchema = SpecValidationResultSchema;

export type SpecsValidateResponse = z.infer<typeof SpecsValidateResponseSchema>;

// ── apis ──────────────────────────────────────────────────────────────────

const ApisListInputSchema = z.object({
	owner: z.string().min(1),
	/** `user` narrows the listing to the token's own specs. */
	filter: z.enum(['user']).optional(),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	sort: z
		.enum(['NAME', 'UPDATED', 'CREATED', 'OWNER', 'BEST_MATCH', 'TITLE'])
		.optional(),
	order: z.enum(['ASC', 'DESC']).optional(),
});

export type ApisListInput = z.input<typeof ApisListInputSchema>;

const ApisListResponseSchema = ApisJsonSchema;

export type ApisListResponse = z.infer<typeof ApisListResponseSchema>;

const ApisListVersionsInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
});

export type ApisListVersionsInput = z.input<typeof ApisListVersionsInputSchema>;

const ApisListVersionsResponseSchema = ApisJsonSchema;

export type ApisListVersionsResponse = z.infer<
	typeof ApisListVersionsResponseSchema
>;

/** The definition comes back as text, whichever media type it was stored as. */
const ApisGetDefinitionInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	version: z.string().min(1),
	/** Resolves `$ref`s. GraphQL definitions cannot be resolved. */
	resolved: z.boolean().optional(),
	/** Lifts inline schemas into named models. GraphQL cannot be flattened. */
	flatten: z.boolean().optional(),
});

export type ApisGetDefinitionInput = z.input<
	typeof ApisGetDefinitionInputSchema
>;

const ApisGetDefinitionResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	version: z.string(),
	/** The definition as text, which is what the route returns. */
	definition: z.string(),
});

export type ApisGetDefinitionResponse = z.infer<
	typeof ApisGetDefinitionResponseSchema
>;

/**
 * Saving takes the **definition itself** as the body. For OpenAPI and AsyncAPI
 * the version is read from `info.version`, so `version` is only needed for
 * GraphQL and MCP. The owner must match the token owner.
 */
const ApisSaveInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	definition: z.string().min(1),
	/** `yaml` or `json`, which decides the content type of the body. */
	format: z.enum(['yaml', 'json']).optional(),
	/** Needed for GraphQL and MCP, where the definition carries no version. */
	version: z.string().optional(),
	isPrivate: z.boolean().optional(),
	/** Overwrites a published version instead of answering 409. */
	force: z.boolean().optional(),
	projectName: z.string().optional(),
	noReconcile: z.boolean().optional(),
});

export type ApisSaveInput = z.input<typeof ApisSaveInputSchema>;

/**
 * The save route answers 200, 201 or 205 with no body, so the plugin reports
 * what it wrote. Core does not pass the status on, so whether the save created
 * the version is not reported.
 */
const ApisSaveResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	version: z.string().nullish(),
	saved: z.literal(true),
});

export type ApisSaveResponse = z.infer<typeof ApisSaveResponseSchema>;

const ApisDeleteInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
});

export type ApisDeleteInput = z.input<typeof ApisDeleteInputSchema>;

const ApisDeleteResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	deleted: z.literal(true),
});

export type ApisDeleteResponse = z.infer<typeof ApisDeleteResponseSchema>;

const ApisDeleteVersionInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	version: z.string().min(1),
});

export type ApisDeleteVersionInput = z.input<
	typeof ApisDeleteVersionInputSchema
>;

const ApisDeleteVersionResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	version: z.string(),
	deleted: z.literal(true),
});

export type ApisDeleteVersionResponse = z.infer<
	typeof ApisDeleteVersionResponseSchema
>;

/** Cloning adds a version that starts as a copy of an existing one. */
const ApisCloneVersionInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	version: z.string().min(1),
	/** The name of the new version. */
	newVersion: z.string().min(1),
	private: z.boolean().optional(),
});

export type ApisCloneVersionInput = z.input<typeof ApisCloneVersionInputSchema>;

const ApisCloneVersionResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	sourceVersion: z.string(),
	version: z.string(),
	created: z.literal(true),
});

export type ApisCloneVersionResponse = z.infer<
	typeof ApisCloneVersionResponseSchema
>;

/** A fork writes the version into another owner, including another organisation. */
const ApisForkVersionInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	version: z.string().min(1),
	targetOwner: z.string().min(3),
	targetName: z.string().min(3).max(60),
	targetVersion: z.string().min(1).max(128),
	project: z.string().optional(),
	/** Defaults to the source version's setting. */
	private: z.boolean().optional(),
});

export type ApisForkVersionInput = z.input<typeof ApisForkVersionInputSchema>;

const ApisForkVersionResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	targetOwner: z.string(),
	targetName: z.string(),
	targetVersion: z.string(),
	forked: z.literal(true),
});

export type ApisForkVersionResponse = z.infer<
	typeof ApisForkVersionResponseSchema
>;

/**
 * A comparison posts another definition and answers the differences between it
 * and the stored version, as a **bare array**.
 */
const ApisCompareInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	version: z.string().min(1),
	/** The definition to compare against the stored one. */
	definition: z.string().min(1),
	format: z.enum(['yaml', 'json']).optional(),
	/**
	 * The comparison method, a required query parameter: `FULL`, `LOGICAL` or
	 * `STRUCTURAL`. Defaults to `FULL`.
	 */
	method: z.enum(['FULL', 'LOGICAL', 'STRUCTURAL']).default('FULL'),
});

export type ApisCompareInput = z.input<typeof ApisCompareInputSchema>;

const ApisCompareResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	version: z.string(),
	changes: z.array(ComparisonPartSchema),
});

export type ApisCompareResponse = z.infer<typeof ApisCompareResponseSchema>;

const ApisGetCapabilitiesInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	version: z.string().min(1),
});

export type ApisGetCapabilitiesInput = z.input<
	typeof ApisGetCapabilitiesInputSchema
>;

const ApisGetCapabilitiesResponseSchema = CapabilitiesSchema;

export type ApisGetCapabilitiesResponse = z.infer<
	typeof ApisGetCapabilitiesResponseSchema
>;

const ApisGetDefaultVersionInputSchema = ApisDeleteInputSchema;

export type ApisGetDefaultVersionInput = z.input<
	typeof ApisGetDefaultVersionInputSchema
>;

const ApisGetDefaultVersionResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	/** Null when the API has no default version set. */
	version: z.string().nullish(),
});

export type ApisGetDefaultVersionResponse = z.infer<
	typeof ApisGetDefaultVersionResponseSchema
>;

const ApisSetDefaultVersionInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	version: z.string().min(1),
});

export type ApisSetDefaultVersionInput = z.input<
	typeof ApisSetDefaultVersionInputSchema
>;

const ApisSetDefaultVersionResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	version: z.string(),
});

export type ApisSetDefaultVersionResponse = z.infer<
	typeof ApisSetDefaultVersionResponseSchema
>;

const ApisRenameInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	newName: z.string().min(1),
});

export type ApisRenameInput = z.input<typeof ApisRenameInputSchema>;

const ApisRenameResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	newName: z.string(),
	renamed: z.literal(true),
});

export type ApisRenameResponse = z.infer<typeof ApisRenameResponseSchema>;

const ApisGetNotificationsInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	/** `USER` for the caller's own setting, `ALL` for every user. Defaults to `USER`. */
	scope: z.enum(['USER', 'ALL']).default('USER'),
	version: z.string().optional(),
});

export type ApisGetNotificationsInput = z.input<
	typeof ApisGetNotificationsInputSchema
>;

const ApisGetNotificationsResponseSchema = z
	.object({ enabled: z.array(z.string()).nullish() })
	.loose();

export type ApisGetNotificationsResponse = z.infer<
	typeof ApisGetNotificationsResponseSchema
>;

const ApisSetNotificationsInputSchema = z.object({
	owner: z.string().min(1),
	api: z.string().min(1),
	/**
	 * The notification scopes to turn on. The route takes the body as the bare
	 * list of scopes rather than a wrapped object.
	 */
	enabled: z.array(z.string()).min(1),
});

export type ApisSetNotificationsInput = z.input<
	typeof ApisSetNotificationsInputSchema
>;

const ApisSetNotificationsResponseSchema = ApisGetNotificationsResponseSchema;

export type ApisSetNotificationsResponse = z.infer<
	typeof ApisSetNotificationsResponseSchema
>;

const ApisDisableNotificationsInputSchema = ApisDeleteInputSchema;

export type ApisDisableNotificationsInput = z.input<
	typeof ApisDisableNotificationsInputSchema
>;

const ApisDisableNotificationsResponseSchema =
	ApisGetNotificationsResponseSchema;

export type ApisDisableNotificationsResponse = z.infer<
	typeof ApisDisableNotificationsResponseSchema
>;

// ── api settings ──────────────────────────────────────────────────────────

const ApiVersionPath = {
	owner: z.string().min(1),
	api: z.string().min(1),
	version: z.string().min(1),
};

const ApiSettingsGetLifecycleInputSchema = z.object(ApiVersionPath);
export type ApiSettingsGetLifecycleInput = z.input<
	typeof ApiSettingsGetLifecycleInputSchema
>;

const ApiSettingsGetLifecycleResponseSchema = LifecycleSettingsSchema;
export type ApiSettingsGetLifecycleResponse = z.infer<
	typeof ApiSettingsGetLifecycleResponseSchema
>;

const ApiSettingsSetLifecycleInputSchema = z.object({
	...ApiVersionPath,
	published: z.boolean(),
	force: z.boolean().optional(),
});
export type ApiSettingsSetLifecycleInput = z.input<
	typeof ApiSettingsSetLifecycleInputSchema
>;

const ApiSettingsSetLifecycleResponseSchema = LifecycleSettingsSchema;
export type ApiSettingsSetLifecycleResponse = z.infer<
	typeof ApiSettingsSetLifecycleResponseSchema
>;

const ApiSettingsGetVisibilityInputSchema = z.object(ApiVersionPath);
export type ApiSettingsGetVisibilityInput = z.input<
	typeof ApiSettingsGetVisibilityInputSchema
>;

const ApiSettingsGetVisibilityResponseSchema = VisibilitySettingsSchema;
export type ApiSettingsGetVisibilityResponse = z.infer<
	typeof ApiSettingsGetVisibilityResponseSchema
>;

const ApiSettingsSetVisibilityInputSchema = z.object({
	...ApiVersionPath,
	private: z.boolean(),
});
export type ApiSettingsSetVisibilityInput = z.input<
	typeof ApiSettingsSetVisibilityInputSchema
>;

const ApiSettingsSetVisibilityResponseSchema = VisibilitySettingsSchema;
export type ApiSettingsSetVisibilityResponse = z.infer<
	typeof ApiSettingsSetVisibilityResponseSchema
>;

// ── comments ──────────────────────────────────────────────────────────────

const CommentsListInputSchema = z.object(ApiVersionPath);
export type CommentsListInput = z.input<typeof CommentsListInputSchema>;

const CommentsListResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	version: z.string(),
	comments: z.array(CommentSchema),
	/** True when the route answered 204, which means no comments exist. */
	empty: z.boolean().optional(),
});

export type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;

const CommentsCreateInputSchema = z.object({
	...ApiVersionPath,
	body: z.string().min(1),
	range: RangeSchema.optional(),
});
export type CommentsCreateInput = z.input<typeof CommentsCreateInputSchema>;

/** The create route answers a `ClosableComment`, which adds replies and status. */
const ClosableCommentSchema = CommentSchema.extend({
	status: z.enum(['OPEN', 'RESOLVED']).nullish(),
	replies: z.array(CommentSchema).nullish(),
	range: RangeSchema.nullish(),
});

const CommentsCreateResponseSchema = ClosableCommentSchema;

export type CommentsCreateResponse = z.infer<
	typeof CommentsCreateResponseSchema
>;

const CommentsUpdateInputSchema = z.object({
	...ApiVersionPath,
	comment: z.string().min(1),
	body: z.string().min(1),
});
export type CommentsUpdateInput = z.input<typeof CommentsUpdateInputSchema>;

const CommentsUpdateResponseSchema = ClosableCommentSchema;

export type CommentsUpdateResponse = z.infer<
	typeof CommentsUpdateResponseSchema
>;

const CommentsDeleteInputSchema = z.object({
	...ApiVersionPath,
	comment: z.string().min(1),
});
export type CommentsDeleteInput = z.input<typeof CommentsDeleteInputSchema>;

const CommentsDeleteResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	version: z.string(),
	comment: z.string(),
	deleted: z.literal(true),
});

export type CommentsDeleteResponse = z.infer<
	typeof CommentsDeleteResponseSchema
>;

const CommentsReplyInputSchema = z.object({
	...ApiVersionPath,
	comment: z.string().min(1),
	body: z.string().min(1),
});
export type CommentsReplyInput = z.input<typeof CommentsReplyInputSchema>;

const CommentsReplyResponseSchema = CommentSchema;

export type CommentsReplyResponse = z.infer<typeof CommentsReplyResponseSchema>;

// ── domains ───────────────────────────────────────────────────────────────

const DomainsListInputSchema = z.object({
	owner: z.string().min(1),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	sort: z
		.enum(['NAME', 'UPDATED', 'CREATED', 'OWNER', 'BEST_MATCH', 'TITLE'])
		.optional(),
	order: z.enum(['ASC', 'DESC']).optional(),
});

export type DomainsListInput = z.input<typeof DomainsListInputSchema>;

const DomainsListResponseSchema = ApisJsonSchema;

export type DomainsListResponse = z.infer<typeof DomainsListResponseSchema>;

const DomainsGetVersionsInputSchema = z.object({
	owner: z.string().min(1),
	domain: z.string().min(1),
});

export type DomainsGetVersionsInput = z.input<
	typeof DomainsGetVersionsInputSchema
>;

const DomainsGetVersionsResponseSchema = ApisJsonSchema;

export type DomainsGetVersionsResponse = z.infer<
	typeof DomainsGetVersionsResponseSchema
>;

const DomainsGetDefinitionInputSchema = z.object({
	owner: z.string().min(1),
	domain: z.string().min(1),
	version: z.string().min(1),
});

export type DomainsGetDefinitionInput = z.input<
	typeof DomainsGetDefinitionInputSchema
>;

const DomainsGetDefinitionResponseSchema = z.object({
	owner: z.string(),
	domain: z.string(),
	version: z.string(),
	definition: z.string(),
});

export type DomainsGetDefinitionResponse = z.infer<
	typeof DomainsGetDefinitionResponseSchema
>;

const DomainsSaveInputSchema = z.object({
	owner: z.string().min(1),
	domain: z.string().min(1),
	definition: z.string().min(1),
	format: z.enum(['yaml', 'json']).optional(),
	version: z.string().optional(),
	isPrivate: z.boolean().optional(),
	force: z.boolean().optional(),
	projectName: z.string().optional(),
});

export type DomainsSaveInput = z.input<typeof DomainsSaveInputSchema>;

const DomainsSaveResponseSchema = z.object({
	owner: z.string(),
	domain: z.string(),
	version: z.string().nullish(),
	saved: z.literal(true),
});

export type DomainsSaveResponse = z.infer<typeof DomainsSaveResponseSchema>;

const DomainsDeleteInputSchema = z.object({
	owner: z.string().min(1),
	domain: z.string().min(1),
	force: z.boolean().optional(),
});

export type DomainsDeleteInput = z.input<typeof DomainsDeleteInputSchema>;

const DomainsDeleteResponseSchema = z.object({
	owner: z.string(),
	domain: z.string(),
	deleted: z.literal(true),
});

export type DomainsDeleteResponse = z.infer<typeof DomainsDeleteResponseSchema>;

const DomainsDeleteVersionInputSchema = z.object({
	owner: z.string().min(1),
	domain: z.string().min(1),
	version: z.string().min(1),
	force: z.boolean().optional(),
});

export type DomainsDeleteVersionInput = z.input<
	typeof DomainsDeleteVersionInputSchema
>;

const DomainsDeleteVersionResponseSchema = z.object({
	owner: z.string(),
	domain: z.string(),
	version: z.string(),
	deleted: z.literal(true),
});

export type DomainsDeleteVersionResponse = z.infer<
	typeof DomainsDeleteVersionResponseSchema
>;

// ── templates ─────────────────────────────────────────────────────────────

const TemplatesListInputSchema = z.object({
	/** Narrows the catalog to one owner's templates. */
	owner: z.string().optional(),
});

export type TemplatesListInput = z.input<typeof TemplatesListInputSchema>;

/** The route answers a **bare array** of template wrappers, not a catalog object. */
const TemplatesListResponseSchema = z.object({
	templates: z.array(TemplateWrapperSchema),
});

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

const TemplatesGetInputSchema = z.object({
	owner: z.string().min(1),
	templateId: z.string().min(1),
	version: z.string().min(1),
	flatten: z.boolean().optional(),
	/** Reads a built-in template instead of one on the account. */
	builtin: z.boolean().optional(),
});

export type TemplatesGetInput = z.input<typeof TemplatesGetInputSchema>;

const TemplatesGetResponseSchema = z.object({
	owner: z.string(),
	templateId: z.string(),
	version: z.string(),
	definition: z.string(),
});

export type TemplatesGetResponse = z.infer<typeof TemplatesGetResponseSchema>;

const TemplatesSaveInputSchema = z.object({
	owner: z.string().min(1),
	templateId: z.string().min(1),
	definition: z.string().min(1),
	format: z.enum(['yaml', 'json']).optional(),
	version: z.string().optional(),
	isPrivate: z.boolean().optional(),
	force: z.boolean().optional(),
});

export type TemplatesSaveInput = z.input<typeof TemplatesSaveInputSchema>;

const TemplatesSaveResponseSchema = z.object({
	owner: z.string(),
	templateId: z.string(),
	version: z.string().nullish(),
	saved: z.literal(true),
});

export type TemplatesSaveResponse = z.infer<typeof TemplatesSaveResponseSchema>;

const TemplatesDeleteInputSchema = z.object({
	owner: z.string().min(1),
	templateId: z.string().min(1),
	version: z.string().min(1),
});

export type TemplatesDeleteInput = z.input<typeof TemplatesDeleteInputSchema>;

const TemplatesDeleteResponseSchema = z.object({
	owner: z.string(),
	templateId: z.string(),
	version: z.string(),
	deleted: z.literal(true),
});

export type TemplatesDeleteResponse = z.infer<
	typeof TemplatesDeleteResponseSchema
>;

// ── projects ──────────────────────────────────────────────────────────────

const projectFields = {
	name: z.string().min(1),
	description: z.string().optional(),
	apis: z.array(z.string()).optional(),
	domains: z.array(z.string()).optional(),
	templates: z.array(z.string()).optional(),
};

const ProjectsListInputSchema = z.object({
	owner: z.string().min(1),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).optional(),
	order: z.enum(['ASC', 'DESC']).optional(),
});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

const ProjectsListResponseSchema = ProjectsJsonSchema;

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

const ProjectsGetInputSchema = z.object({
	owner: z.string().min(1),
	projectId: z.string().min(1),
});

export type ProjectsGetInput = z.input<typeof ProjectsGetInputSchema>;

const ProjectsGetResponseSchema = ProjectSchema;

export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

const ProjectsCreateInputSchema = z.object({
	owner: z.string().min(1),
	...projectFields,
});

export type ProjectsCreateInput = z.input<typeof ProjectsCreateInputSchema>;

const ProjectsCreateResponseSchema = ProjectSchema;

export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;

const ProjectsUpdateInputSchema = z.object({
	owner: z.string().min(1),
	projectId: z.string().min(1),
	name: z.string().optional(),
	description: z.string().optional(),
	apis: z.array(z.string()).optional(),
	domains: z.array(z.string()).optional(),
	templates: z.array(z.string()).optional(),
});

export type ProjectsUpdateInput = z.input<typeof ProjectsUpdateInputSchema>;

const ProjectsUpdateResponseSchema = ProjectSchema;

export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;

const ProjectsDeleteInputSchema = ProjectsGetInputSchema;

export type ProjectsDeleteInput = z.input<typeof ProjectsDeleteInputSchema>;

const ProjectsDeleteResponseSchema = z.object({
	owner: z.string(),
	projectId: z.string(),
	deleted: z.literal(true),
});

export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;

// ── integrations ──────────────────────────────────────────────────────────

const IntegrationsListInputSchema = z.object(ApiVersionPath);
export type IntegrationsListInput = z.input<typeof IntegrationsListInputSchema>;

const IntegrationsListResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	version: z.string(),
	integrations: z.array(IntegrationConfigurationSchema),
});

export type IntegrationsListResponse = z.infer<
	typeof IntegrationsListResponseSchema
>;

/**
 * Running an integration pushes the stored definition to a target, so it is a
 * write even though it takes no body.
 */
const IntegrationsExecuteInputSchema = z.object({
	...ApiVersionPath,
	integrationId: z.string().min(1),
	commitMessage: z.string().optional(),
});

export type IntegrationsExecuteInput = z.input<
	typeof IntegrationsExecuteInputSchema
>;

const IntegrationsExecuteResponseSchema = z.object({
	owner: z.string(),
	api: z.string(),
	version: z.string(),
	integrationId: z.string(),
	executed: z.literal(true),
});

export type IntegrationsExecuteResponse = z.infer<
	typeof IntegrationsExecuteResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SwaggerhubEndpointInputs = {
	specsList: SpecsListInput;
	specsValidate: SpecsValidateInput;
	apisList: ApisListInput;
	apisListVersions: ApisListVersionsInput;
	apisGetDefinition: ApisGetDefinitionInput;
	apisSave: ApisSaveInput;
	apisDelete: ApisDeleteInput;
	apisDeleteVersion: ApisDeleteVersionInput;
	apisCloneVersion: ApisCloneVersionInput;
	apisForkVersion: ApisForkVersionInput;
	apisCompare: ApisCompareInput;
	apisGetCapabilities: ApisGetCapabilitiesInput;
	apisGetDefaultVersion: ApisGetDefaultVersionInput;
	apisSetDefaultVersion: ApisSetDefaultVersionInput;
	apisRename: ApisRenameInput;
	apisGetNotifications: ApisGetNotificationsInput;
	apisSetNotifications: ApisSetNotificationsInput;
	apisDisableNotifications: ApisDisableNotificationsInput;
	apiSettingsGetLifecycle: ApiSettingsGetLifecycleInput;
	apiSettingsSetLifecycle: ApiSettingsSetLifecycleInput;
	apiSettingsGetVisibility: ApiSettingsGetVisibilityInput;
	apiSettingsSetVisibility: ApiSettingsSetVisibilityInput;
	commentsList: CommentsListInput;
	commentsCreate: CommentsCreateInput;
	commentsUpdate: CommentsUpdateInput;
	commentsDelete: CommentsDeleteInput;
	commentsReply: CommentsReplyInput;
	domainsList: DomainsListInput;
	domainsGetVersions: DomainsGetVersionsInput;
	domainsGetDefinition: DomainsGetDefinitionInput;
	domainsSave: DomainsSaveInput;
	domainsDelete: DomainsDeleteInput;
	domainsDeleteVersion: DomainsDeleteVersionInput;
	templatesList: TemplatesListInput;
	templatesGet: TemplatesGetInput;
	templatesSave: TemplatesSaveInput;
	templatesDelete: TemplatesDeleteInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	integrationsList: IntegrationsListInput;
	integrationsExecute: IntegrationsExecuteInput;
};

export type SwaggerhubEndpointOutputs = {
	specsList: SpecsListResponse;
	specsValidate: SpecsValidateResponse;
	apisList: ApisListResponse;
	apisListVersions: ApisListVersionsResponse;
	apisGetDefinition: ApisGetDefinitionResponse;
	apisSave: ApisSaveResponse;
	apisDelete: ApisDeleteResponse;
	apisDeleteVersion: ApisDeleteVersionResponse;
	apisCloneVersion: ApisCloneVersionResponse;
	apisForkVersion: ApisForkVersionResponse;
	apisCompare: ApisCompareResponse;
	apisGetCapabilities: ApisGetCapabilitiesResponse;
	apisGetDefaultVersion: ApisGetDefaultVersionResponse;
	apisSetDefaultVersion: ApisSetDefaultVersionResponse;
	apisRename: ApisRenameResponse;
	apisGetNotifications: ApisGetNotificationsResponse;
	apisSetNotifications: ApisSetNotificationsResponse;
	apisDisableNotifications: ApisDisableNotificationsResponse;
	apiSettingsGetLifecycle: ApiSettingsGetLifecycleResponse;
	apiSettingsSetLifecycle: ApiSettingsSetLifecycleResponse;
	apiSettingsGetVisibility: ApiSettingsGetVisibilityResponse;
	apiSettingsSetVisibility: ApiSettingsSetVisibilityResponse;
	commentsList: CommentsListResponse;
	commentsCreate: CommentsCreateResponse;
	commentsUpdate: CommentsUpdateResponse;
	commentsDelete: CommentsDeleteResponse;
	commentsReply: CommentsReplyResponse;
	domainsList: DomainsListResponse;
	domainsGetVersions: DomainsGetVersionsResponse;
	domainsGetDefinition: DomainsGetDefinitionResponse;
	domainsSave: DomainsSaveResponse;
	domainsDelete: DomainsDeleteResponse;
	domainsDeleteVersion: DomainsDeleteVersionResponse;
	templatesList: TemplatesListResponse;
	templatesGet: TemplatesGetResponse;
	templatesSave: TemplatesSaveResponse;
	templatesDelete: TemplatesDeleteResponse;
	projectsList: ProjectsListResponse;
	projectsGet: ProjectsGetResponse;
	projectsCreate: ProjectsCreateResponse;
	projectsUpdate: ProjectsUpdateResponse;
	projectsDelete: ProjectsDeleteResponse;
	integrationsList: IntegrationsListResponse;
	integrationsExecute: IntegrationsExecuteResponse;
};

export const SwaggerhubEndpointInputSchemas = {
	specsList: SpecsListInputSchema,
	specsValidate: SpecsValidateInputSchema,
	apisList: ApisListInputSchema,
	apisListVersions: ApisListVersionsInputSchema,
	apisGetDefinition: ApisGetDefinitionInputSchema,
	apisSave: ApisSaveInputSchema,
	apisDelete: ApisDeleteInputSchema,
	apisDeleteVersion: ApisDeleteVersionInputSchema,
	apisCloneVersion: ApisCloneVersionInputSchema,
	apisForkVersion: ApisForkVersionInputSchema,
	apisCompare: ApisCompareInputSchema,
	apisGetCapabilities: ApisGetCapabilitiesInputSchema,
	apisGetDefaultVersion: ApisGetDefaultVersionInputSchema,
	apisSetDefaultVersion: ApisSetDefaultVersionInputSchema,
	apisRename: ApisRenameInputSchema,
	apisGetNotifications: ApisGetNotificationsInputSchema,
	apisSetNotifications: ApisSetNotificationsInputSchema,
	apisDisableNotifications: ApisDisableNotificationsInputSchema,
	apiSettingsGetLifecycle: ApiSettingsGetLifecycleInputSchema,
	apiSettingsSetLifecycle: ApiSettingsSetLifecycleInputSchema,
	apiSettingsGetVisibility: ApiSettingsGetVisibilityInputSchema,
	apiSettingsSetVisibility: ApiSettingsSetVisibilityInputSchema,
	commentsList: CommentsListInputSchema,
	commentsCreate: CommentsCreateInputSchema,
	commentsUpdate: CommentsUpdateInputSchema,
	commentsDelete: CommentsDeleteInputSchema,
	commentsReply: CommentsReplyInputSchema,
	domainsList: DomainsListInputSchema,
	domainsGetVersions: DomainsGetVersionsInputSchema,
	domainsGetDefinition: DomainsGetDefinitionInputSchema,
	domainsSave: DomainsSaveInputSchema,
	domainsDelete: DomainsDeleteInputSchema,
	domainsDeleteVersion: DomainsDeleteVersionInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesSave: TemplatesSaveInputSchema,
	templatesDelete: TemplatesDeleteInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	integrationsList: IntegrationsListInputSchema,
	integrationsExecute: IntegrationsExecuteInputSchema,
} as const;

export const SwaggerhubEndpointOutputSchemas = {
	specsList: SpecsListResponseSchema,
	specsValidate: SpecsValidateResponseSchema,
	apisList: ApisListResponseSchema,
	apisListVersions: ApisListVersionsResponseSchema,
	apisGetDefinition: ApisGetDefinitionResponseSchema,
	apisSave: ApisSaveResponseSchema,
	apisDelete: ApisDeleteResponseSchema,
	apisDeleteVersion: ApisDeleteVersionResponseSchema,
	apisCloneVersion: ApisCloneVersionResponseSchema,
	apisForkVersion: ApisForkVersionResponseSchema,
	apisCompare: ApisCompareResponseSchema,
	apisGetCapabilities: ApisGetCapabilitiesResponseSchema,
	apisGetDefaultVersion: ApisGetDefaultVersionResponseSchema,
	apisSetDefaultVersion: ApisSetDefaultVersionResponseSchema,
	apisRename: ApisRenameResponseSchema,
	apisGetNotifications: ApisGetNotificationsResponseSchema,
	apisSetNotifications: ApisSetNotificationsResponseSchema,
	apisDisableNotifications: ApisDisableNotificationsResponseSchema,
	apiSettingsGetLifecycle: ApiSettingsGetLifecycleResponseSchema,
	apiSettingsSetLifecycle: ApiSettingsSetLifecycleResponseSchema,
	apiSettingsGetVisibility: ApiSettingsGetVisibilityResponseSchema,
	apiSettingsSetVisibility: ApiSettingsSetVisibilityResponseSchema,
	commentsList: CommentsListResponseSchema,
	commentsCreate: CommentsCreateResponseSchema,
	commentsUpdate: CommentsUpdateResponseSchema,
	commentsDelete: CommentsDeleteResponseSchema,
	commentsReply: CommentsReplyResponseSchema,
	domainsList: DomainsListResponseSchema,
	domainsGetVersions: DomainsGetVersionsResponseSchema,
	domainsGetDefinition: DomainsGetDefinitionResponseSchema,
	domainsSave: DomainsSaveResponseSchema,
	domainsDelete: DomainsDeleteResponseSchema,
	domainsDeleteVersion: DomainsDeleteVersionResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	templatesSave: TemplatesSaveResponseSchema,
	templatesDelete: TemplatesDeleteResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
	integrationsList: IntegrationsListResponseSchema,
	integrationsExecute: IntegrationsExecuteResponseSchema,
} as const;
