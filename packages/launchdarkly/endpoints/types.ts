import { z } from 'zod';

// ============================================================================
// Common & Reusable Schemas
// ============================================================================

export const LinkSchema = z
	.object({
		href: z.string().optional(),
		type: z.string().optional(),
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const LinksSchema = z.record(z.string(), LinkSchema).optional();

export const JSONPatchOperationSchema = z.discriminatedUnion('op', [
	z
		.object({
			op: z.enum(['add', 'replace', 'test']),
			path: z.string(),
			// `unknown` because JSON patch values can be any valid JSON value.
			value: z.unknown(),
		})
		.strict(),
	z.object({ op: z.literal('remove'), path: z.string() }).strict(),
	z
		.object({
			op: z.enum(['move', 'copy']),
			from: z.string(),
			path: z.string(),
		})
		.strict(),
]);

export const JSONPatchSchema = z.array(JSONPatchOperationSchema);

export const PatchWithCommentSchema = z
	.object({
		patch: JSONPatchSchema,
		comment: z.string().optional(),
	})
	.strict();

export const StatementSchema = z
	.object({
		effect: z.enum(['allow', 'deny']),
		resources: z.array(z.string()).optional(),
		notResources: z.array(z.string()).optional(),
		actions: z.array(z.string()).optional(),
		notActions: z.array(z.string()).optional(),
	})
	.strict();

export const VariationSchema = z
	.object({
		_id: z.string().optional(),
		// `unknown` because flag variation values can be boolean, number, string, array, or object in multivariate flags.
		value: z.unknown(),
		name: z.string().optional(),
		description: z.string().optional(),
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const ClientSideAvailabilitySchema = z
	.object({
		usingMobileKey: z.boolean().optional(),
		usingEnvironmentId: z.boolean().optional(),
	})
	.strict();

export const DefaultClientSideAvailabilitySchema = z
	.object({
		usingMobileKey: z.boolean(),
		usingEnvironmentId: z.boolean(),
	})
	.strict();

export const NamingConventionSchema = z
	.object({
		case: z
			.enum([
				'camelCase',
				'upperCamelCase',
				'snakeCase',
				'kebabCase',
				'constantCase',
			])
			.optional(),
		prefix: z.string().optional(),
	})
	.strict();

export const SourceEnvironmentSchema = z
	.object({
		key: z.string().optional(),
		version: z.number().int().optional(),
	})
	.strict();

export const CustomPropertySchema = z
	.object({
		name: z.string(),
		value: z.array(z.string()),
	})
	.strict();

export const PrerequisiteSchema = z
	.object({
		key: z.string(),
		variationId: z.string(),
	})
	.strict();

export const MigrationSettingsSchema = z
	.object({
		contextKind: z.string().optional(),
		stageCount: z.enum(['2', '4', '6']),
	})
	.strict();

export const FlagDefaultsSchema = z
	.object({
		onVariation: z.number().int().optional(),
		offVariation: z.number().int().optional(),
	})
	.strict();

// ============================================================================
// 1. Projects
// ============================================================================

export const EnvironmentSummarySchema = z
	.object({
		_id: z.string().optional(),
		key: z.string(),
		name: z.string(),
		color: z.string().optional(),
		apiKey: z.string().optional(),
		mobileKey: z.string().optional(),
		critical: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const ProjectSchema = z
	.object({
		_id: z.string(),
		key: z.string(),
		name: z.string(),
		includeInSnippetByDefault: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		environments: z.array(EnvironmentSummarySchema).optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const ProjectsListInputSchema = z
	.object({
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
		filter: z.string().optional(),
		sort: z.string().optional(),
		expand: z.string().optional(),
	})
	.strict();

export const ProjectsListOutputSchema = z
	.object({
		items: z.array(ProjectSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const ProjectsGetInputSchema = z
	.object({
		projectKey: z.string(),
		expand: z.string().optional(),
	})
	.strict();

export const ProjectsGetOutputSchema = ProjectSchema;

export const EnvironmentPostInputSchema = z
	.object({
		key: z.string(),
		name: z.string(),
		color: z.string(),
		defaultTtl: z.number().int().optional(),
		secureMode: z.boolean().optional(),
		defaultTrackEvents: z.boolean().optional(),
		confirmChanges: z.boolean().optional(),
		requireComments: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		critical: z.boolean().optional(),
		source: SourceEnvironmentSchema.optional(),
	})
	.strict();

export const ProjectsCreateInputSchema = z
	.object({
		key: z.string(),
		name: z.string(),
		includeInSnippetByDefault: z.boolean().optional(),
		defaultClientSideAvailability:
			DefaultClientSideAvailabilitySchema.optional(),
		tags: z.array(z.string()).optional(),
		environments: z.array(EnvironmentPostInputSchema).optional(),
		namingConvention: NamingConventionSchema.optional(),
	})
	.strict();

export const ProjectsCreateOutputSchema = ProjectSchema;

export const ProjectsUpdateInputSchema = z
	.object({
		projectKey: z.string(),
		patch: JSONPatchSchema,
	})
	.strict();

export const ProjectsUpdateOutputSchema = ProjectSchema;

export const ProjectsDeleteInputSchema = z
	.object({
		projectKey: z.string(),
	})
	.strict();

export const ProjectsDeleteOutputSchema = z.void();

// ============================================================================
// 2. Environments
// ============================================================================

export const EnvironmentSchema = z
	.object({
		_id: z.string(),
		key: z.string(),
		name: z.string(),
		apiKey: z.string().optional(),
		mobileKey: z.string().optional(),
		color: z.string(),
		defaultTtl: z.number().int().optional(),
		secureMode: z.boolean().optional(),
		defaultTrackEvents: z.boolean().optional(),
		requireComments: z.boolean().optional(),
		confirmChanges: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		critical: z.boolean().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const EnvironmentsListInputSchema = z
	.object({
		projectKey: z.string(),
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
		filter: z.string().optional(),
		sort: z.string().optional(),
	})
	.strict();

export const EnvironmentsListOutputSchema = z
	.object({
		items: z.array(EnvironmentSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const EnvironmentsGetInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
	})
	.strict();

export const EnvironmentsGetOutputSchema = EnvironmentSchema;

export const EnvironmentsCreateInputSchema = z
	.object({
		projectKey: z.string(),
		key: z.string(),
		name: z.string(),
		color: z.string(),
		defaultTtl: z.number().int().optional(),
		secureMode: z.boolean().optional(),
		defaultTrackEvents: z.boolean().optional(),
		confirmChanges: z.boolean().optional(),
		requireComments: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		critical: z.boolean().optional(),
	})
	.strict();

export const EnvironmentsCreateOutputSchema = EnvironmentSchema;

export const EnvironmentsUpdateInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		patch: JSONPatchSchema,
	})
	.strict();

export const EnvironmentsUpdateOutputSchema = EnvironmentSchema;

export const EnvironmentsDeleteInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
	})
	.strict();

export const EnvironmentsDeleteOutputSchema = z.void();

export const EnvironmentsResetSdkKeyInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		expiry: z.number().int().optional(),
	})
	.strict();

export const EnvironmentsResetSdkKeyOutputSchema = EnvironmentSchema;

export const EnvironmentsResetMobileKeyInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
	})
	.strict();

export const EnvironmentsResetMobileKeyOutputSchema = EnvironmentSchema;

// ============================================================================
// 3. Feature Flags
// ============================================================================

export const FeatureFlagSchema = z
	.object({
		key: z.string(),
		name: z.string(),
		kind: z.string().optional(),
		description: z.string().optional(),
		creationDate: z.number().optional(),
		archived: z.boolean().optional(),
		temporary: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		variations: z.array(VariationSchema).optional(),
		_version: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const FeatureFlagsListInputSchema = z
	.object({
		projectKey: z.string(),
		env: z.string().optional(),
		tag: z.string().optional(),
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
		archived: z.boolean().optional(),
		summary: z.boolean().optional(),
		filter: z.string().optional(),
		sort: z.string().optional(),
		filterEnv: z.string().optional(),
		expand: z.string().optional(),
	})
	.strict();

export const FeatureFlagsListOutputSchema = z
	.object({
		items: z.array(FeatureFlagSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const FeatureFlagsGetInputSchema = z
	.object({
		projectKey: z.string(),
		featureFlagKey: z.string(),
		env: z.string().optional(),
		expand: z.string().optional(),
	})
	.strict();

export const FeatureFlagsGetOutputSchema = FeatureFlagSchema;

export const VariationInputSchema = z
	.object({
		// `unknown` because flag variation values can be boolean, number, string, array, or object in multivariate flags.
		value: z.unknown(),
		name: z.string().optional(),
		description: z.string().optional(),
	})
	.strict();

export const FeatureFlagsCreateInputSchema = z
	.object({
		projectKey: z.string(),
		clone: z.string().optional(),
		key: z.string(),
		name: z.string(),
		description: z.string().optional(),
		variations: z.array(VariationInputSchema).optional(),
		temporary: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		includeInSnippet: z.boolean().optional(),
		clientSideAvailability: ClientSideAvailabilitySchema.optional(),
		defaults: FlagDefaultsSchema.optional(),
		customProperties: z.record(z.string(), CustomPropertySchema).optional(),
		purpose: z.enum(['migration', 'holdout']).optional(),
		migrationSettings: MigrationSettingsSchema.optional(),
		maintainerId: z.string().optional(),
		maintainerTeamKey: z.string().optional(),
		initialPrerequisites: z.array(PrerequisiteSchema).optional(),
		isFlagOn: z.boolean().optional(),
	})
	.strict();

export const FeatureFlagsCreateOutputSchema = FeatureFlagSchema;

export const FeatureFlagsUpdateInputSchema = z
	.object({
		projectKey: z.string(),
		featureFlagKey: z.string(),
		patch: JSONPatchSchema,
		comment: z.string().optional(),
		ignoreConflicts: z.boolean().optional(),
		dryRun: z.boolean().optional(),
	})
	.strict();

export const FeatureFlagsUpdateOutputSchema = FeatureFlagSchema;

export const FeatureFlagsDeleteInputSchema = z
	.object({
		projectKey: z.string(),
		featureFlagKey: z.string(),
	})
	.strict();

export const FeatureFlagsDeleteOutputSchema = z.void();

export const FlagStatusRepSchema = z
	.object({
		name: z.string().optional(),
		lastRequested: z.string().nullable().optional(),
		// `unknown` because default flag variation values can be arbitrary JSON types.
		default: z.unknown().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const FeatureFlagsGetStatusInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		featureFlagKey: z.string(),
	})
	.strict();

export const FeatureFlagsGetStatusOutputSchema = FlagStatusRepSchema;

export const FeatureFlagsListStatusesInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
	})
	.strict();

export const FeatureFlagsListStatusesOutputSchema = z
	.object({
		items: z.array(FlagStatusRepSchema).optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

// ============================================================================
// 4. Segments
// ============================================================================

export const UserSegmentSchema = z
	.object({
		key: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
		tags: z.array(z.string()).optional(),
		creationDate: z.number().optional(),
		version: z.number().optional(),
		included: z.array(z.string()).optional(),
		excluded: z.array(z.string()).optional(),
		// `unknown` because segment targeting rules contain arbitrary nested conditions.
		rules: z.array(z.unknown()).optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const SegmentsListInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
		sort: z.string().optional(),
		filter: z.string().optional(),
		expand: z.string().optional(),
	})
	.strict();

export const SegmentsListOutputSchema = z
	.object({
		items: z.array(UserSegmentSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const SegmentsGetInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		segmentKey: z.string(),
	})
	.strict();

export const SegmentsGetOutputSchema = UserSegmentSchema;

export const SegmentsCreateInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		key: z.string(),
		name: z.string(),
		description: z.string().optional(),
		tags: z.array(z.string()).optional(),
		unbounded: z.boolean().optional(),
		unboundedContextKind: z.string().optional(),
	})
	.strict();

export const SegmentsCreateOutputSchema = UserSegmentSchema;

export const SegmentsUpdateInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		segmentKey: z.string(),
		patch: JSONPatchSchema,
		comment: z.string().optional(),
	})
	.strict();

export const SegmentsUpdateOutputSchema = UserSegmentSchema;

export const SegmentsDeleteInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		segmentKey: z.string(),
	})
	.strict();

export const SegmentsDeleteOutputSchema = z.void();

// ============================================================================
// 5. Audit Log
// ============================================================================

export const MemberSummarySchema = z
	.object({
		_id: z.string().optional(),
		email: z.string().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const AuditLogEntrySchema = z
	.object({
		_id: z.string(),
		date: z.number(),
		kind: z.string(),
		name: z.string().optional(),
		description: z.string().optional(),
		shortDescription: z.string().optional(),
		comment: z.string().optional(),
		member: MemberSummarySchema.optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const AuditLogListInputSchema = z
	.object({
		before: z.number().int().optional(),
		after: z.number().int().optional(),
		limit: z.number().int().positive().optional(),
		q: z.string().optional(),
		spec: z.string().optional(),
		member: z.string().optional(),
		token: z.string().optional(),
	})
	.strict();

export const AuditLogListOutputSchema = z
	.object({
		items: z.array(AuditLogEntrySchema),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const AuditLogGetInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const AuditLogGetOutputSchema = AuditLogEntrySchema;

// ============================================================================
// 6. Account Members
// ============================================================================

export const MemberSchema = z
	.object({
		_id: z.string(),
		email: z.string(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		role: z.string(),
		customRoles: z.array(z.string()).optional(),
		_pendingInvite: z.boolean().optional(),
		_verified: z.boolean().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const AccountMembersListInputSchema = z
	.object({
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
		sort: z.string().optional(),
		filter: z.string().optional(),
		expand: z.string().optional(),
	})
	.strict();

export const AccountMembersListOutputSchema = z
	.object({
		items: z.array(MemberSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const AccountMembersGetInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const AccountMembersGetOutputSchema = MemberSchema;

export const MemberInviteInputSchema = z
	.object({
		email: z.email(),
		role: z
			.enum(['reader', 'writer', 'admin', 'owner/admin', 'no_access'])
			.optional(),
		customRoles: z.array(z.string()).optional(),
		roleAttributes: z.record(z.string(), z.array(z.string())).optional(),
		teamKeys: z.array(z.string()).optional(),
		password: z.string().optional(),
	})
	.strict()
	.refine(
		(member) => member.role !== undefined || member.customRoles !== undefined,
		{
			message: 'Provide either a base role or custom roles',
		},
	);

export const AccountMembersInviteInputSchema = z
	.object({
		members: z.array(MemberInviteInputSchema).min(1).max(50),
	})
	.strict();

export const AccountMembersInviteOutputSchema = z
	.object({
		items: z.array(MemberSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const AccountMembersUpdateInputSchema = z
	.object({
		id: z.string(),
		patch: JSONPatchSchema,
	})
	.strict();

export const AccountMembersUpdateOutputSchema = MemberSchema;

export const AccountMembersDeleteInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const AccountMembersDeleteOutputSchema = z.void();

// ============================================================================
// 7. Teams
// ============================================================================

export const TeamSchema = z
	.object({
		key: z.string(),
		name: z.string(),
		description: z.string().optional(),
		memberIDs: z.array(z.string()).optional(),
		customRoleKeys: z.array(z.string()).optional(),
		_creationDate: z.string().optional(),
		_version: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const TeamsListInputSchema = z
	.object({
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
		filter: z.string().optional(),
		sort: z.string().optional(),
		expand: z.string().optional(),
	})
	.strict();

export const TeamsListOutputSchema = z
	.object({
		items: z.array(TeamSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const TeamsGetInputSchema = z
	.object({
		teamKey: z.string(),
		expand: z.string().optional(),
	})
	.strict();

export const TeamsGetOutputSchema = TeamSchema;

export const TeamsCreateInputSchema = z
	.object({
		key: z.string(),
		name: z.string(),
		description: z.string().optional(),
		memberIDs: z.array(z.string()).optional(),
		customRoleKeys: z.array(z.string()).optional(),
		expand: z.string().optional(),
	})
	.strict();

export const TeamsCreateOutputSchema = TeamSchema;

export const TeamInstructionInputSchema = z.discriminatedUnion('kind', [
	z
		.object({
			kind: z.enum([
				'addCustomRoles',
				'removeCustomRoles',
				'addMembers',
				'removeMembers',
				'replaceMembers',
			]),
			values: z.array(z.string()),
		})
		.strict(),
	z
		.object({ kind: z.literal('updateDescription'), value: z.string() })
		.strict(),
	z.object({ kind: z.literal('updateName'), value: z.string() }).strict(),
	z
		.object({
			kind: z.literal('addRoleAttribute'),
			key: z.string(),
			values: z.array(z.string()),
		})
		.strict(),
	z
		.object({ kind: z.literal('removeRoleAttribute'), key: z.string() })
		.strict(),
	z
		.object({
			kind: z.literal('updateRoleAttribute'),
			key: z.string(),
			values: z.array(z.string()),
		})
		.strict(),
	z
		.object({
			kind: z.literal('replaceRoleAttributes'),
			value: z.record(z.string(), z.array(z.string())),
		})
		.strict(),
	z
		.object({
			kind: z.enum(['addPermissionGrants', 'removePermissionGrants']),
			memberIDs: z.array(z.string()),
			actionSet: z.string().optional(),
			actions: z.array(z.string()).optional(),
		})
		.strict()
		.refine(
			(instruction) =>
				(instruction.actionSet === undefined) !==
				(instruction.actions === undefined),
			{
				message: 'Provide exactly one of actionSet or actions',
			},
		),
]);

export const TeamsUpdateInputSchema = z
	.object({
		teamKey: z.string(),
		instructions: z.array(TeamInstructionInputSchema),
		comment: z.string().optional(),
		expand: z.string().optional(),
	})
	.strict();

export const TeamsUpdateOutputSchema = TeamSchema;

export const TeamsDeleteInputSchema = z
	.object({
		teamKey: z.string(),
	})
	.strict();

export const TeamsDeleteOutputSchema = z.void();

// ============================================================================
// 8. Custom Roles
// ============================================================================

export const CustomRoleSchema = z
	.object({
		_id: z.string(),
		key: z.string(),
		name: z.string(),
		description: z.string().optional(),
		policy: z.array(StatementSchema).optional(),
		basePermissions: z.string().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const CustomRolesListInputSchema = z
	.object({
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
	})
	.strict();

export const CustomRolesListOutputSchema = z
	.object({
		items: z.array(CustomRoleSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const CustomRolesGetInputSchema = z
	.object({
		customRoleKey: z.string(),
	})
	.strict();

export const CustomRolesGetOutputSchema = CustomRoleSchema;

export const CustomRolesCreateInputSchema = z
	.object({
		key: z.string(),
		name: z.string(),
		description: z.string().optional(),
		policy: z.array(StatementSchema),
		basePermissions: z.enum(['reader', 'no_access']).optional(),
		resourceCategory: z.enum(['organization', 'project', 'any']).optional(),
	})
	.strict();

export const CustomRolesCreateOutputSchema = CustomRoleSchema;

export const CustomRolesUpdateInputSchema = z
	.object({
		customRoleKey: z.string(),
		patch: JSONPatchSchema,
		comment: z.string().optional(),
	})
	.strict();

export const CustomRolesUpdateOutputSchema = CustomRoleSchema;

export const CustomRolesDeleteInputSchema = z
	.object({
		customRoleKey: z.string(),
	})
	.strict();

export const CustomRolesDeleteOutputSchema = z.void();

// ============================================================================
// 9. Contexts
// ============================================================================

export const ContextItemSchema = z
	.object({
		key: z.string(),
		kind: z.string().optional(),
		name: z.string().optional(),
		// `unknown` because context attributes can contain arbitrary user-defined metadata.
		attributes: z.record(z.string(), z.unknown()).optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const ContextsSchema = z
	.object({
		items: z.array(ContextItemSchema),
		totalCount: z.number().optional(),
		continuationToken: z.string().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const ContextsSearchInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		filter: z.string().optional(),
		sort: z.string().optional(),
		limit: z.number().int().positive().optional(),
		continuationToken: z.string().optional(),
		includeTotalCount: z.boolean().optional(),
	})
	.strict();

export const ContextsSearchOutputSchema = ContextsSchema;

export const ContextsGetInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		kind: z.string(),
		key: z.string(),
		limit: z.number().int().positive().optional(),
		continuationToken: z.string().optional(),
		sort: z.string().optional(),
		filter: z.string().optional(),
		includeTotalCount: z.boolean().optional(),
	})
	.strict();

export const ContextsGetOutputSchema = ContextsSchema;

export const ContextKindSchema = z
	.object({
		key: z.string(),
		name: z.string().optional(),
		description: z.string().optional(),
		archived: z.boolean().optional(),
		_version: z.number().optional(),
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const ContextsListKindsInputSchema = z
	.object({
		projectKey: z.string(),
	})
	.strict();

export const ContextsListKindsOutputSchema = z
	.object({
		items: z.array(ContextKindSchema),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

// ============================================================================
// 10. Users
// ============================================================================

export const UserDetailSchema = z
	.object({
		key: z.string(),
		ip: z.string().optional(),
		country: z.string().optional(),
		email: z.string().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		avatar: z.string().optional(),
		name: z.string().optional(),
		anonymous: z.boolean().optional(),
		// `unknown` because custom attributes are arbitrary JSON values defined by LaunchDarkly users.
		custom: z.record(z.string(), z.unknown()).optional(),
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const UserRecordSchema = z
	.object({
		user: UserDetailSchema.optional(),
		environmentId: z.string().optional(),
		lastPing: z.string().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const UsersListInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		limit: z.number().int().positive().optional(),
		searchAfter: z.string().optional(),
	})
	.strict();

export const UsersListOutputSchema = z
	.object({
		items: z.array(UserRecordSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const UsersGetInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		userKey: z.string(),
	})
	.strict();

export const UsersGetOutputSchema = UserRecordSchema;

export const UsersSearchInputSchema = z
	.object({
		projectKey: z.string(),
		environmentKey: z.string(),
		q: z.string().optional(),
		limit: z.number().int().positive().optional(),
		searchAfter: z.string().optional(),
		filter: z.string().optional(),
	})
	.strict();

export const UsersSearchOutputSchema = z
	.object({
		items: z.array(UserRecordSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

// ============================================================================
// 11. Access Tokens
// ============================================================================

export const TokenSchema = z
	.object({
		_id: z.string(),
		name: z.string().optional(),
		description: z.string().optional(),
		role: z.string().optional(),
		customRoleIds: z.array(z.string()).optional(),
		token: z.string().optional(),
		serviceToken: z.boolean().optional(),
		defaultApiVersion: z.number().optional(),
		creationDate: z.number().optional(),
		lastModified: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const AccessTokensListInputSchema = z
	.object({
		showAll: z.boolean().optional(),
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
	})
	.strict();

export const AccessTokensListOutputSchema = z
	.object({
		items: z.array(TokenSchema),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

export const AccessTokensGetInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const AccessTokensGetOutputSchema = TokenSchema;

export const AccessTokensCreateInputSchema = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
		role: z.enum(['reader', 'writer', 'admin']).optional(),
		customRoleIds: z.array(z.string()).optional(),
		serviceToken: z.boolean().optional(),
		defaultApiVersion: z.number().optional(),
		expiry: z.number().int().optional(),
	})
	.strict();

export const AccessTokensCreateOutputSchema = TokenSchema;

export const AccessTokensDeleteInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const AccessTokensDeleteOutputSchema = z.void();

// ============================================================================
// 12. Tags
// ============================================================================

export const TagsListInputSchema = z
	.object({
		kind: z.array(z.string()).optional(),
		pre: z.string().optional(),
		archived: z.boolean().optional(),
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
		asOf: z.string().optional(),
	})
	.strict();

export const TagsListOutputSchema = z
	.object({
		items: z.array(z.string()),
		totalCount: z.number().optional(),
		_links: LinksSchema,
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

// ============================================================================
// 13. Root / Public API
// ============================================================================

export const RootGetInputSchema = z.object({}).strict();

export const RootGetOutputSchema = z
	.object({
		links: z.record(z.string(), LinkSchema),
	})
	// Preserve provider response fields that are documented as expandable or evolving.
	.passthrough();

// ============================================================================
// Endpoint Input/Output Schema Dictionaries
// ============================================================================

export const LaunchDarklyEndpointInputSchemas = {
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,

	environmentsList: EnvironmentsListInputSchema,
	environmentsGet: EnvironmentsGetInputSchema,
	environmentsCreate: EnvironmentsCreateInputSchema,
	environmentsUpdate: EnvironmentsUpdateInputSchema,
	environmentsDelete: EnvironmentsDeleteInputSchema,
	environmentsResetSdkKey: EnvironmentsResetSdkKeyInputSchema,
	environmentsResetMobileKey: EnvironmentsResetMobileKeyInputSchema,

	featureFlagsList: FeatureFlagsListInputSchema,
	featureFlagsGet: FeatureFlagsGetInputSchema,
	featureFlagsCreate: FeatureFlagsCreateInputSchema,
	featureFlagsUpdate: FeatureFlagsUpdateInputSchema,
	featureFlagsDelete: FeatureFlagsDeleteInputSchema,
	featureFlagsGetStatus: FeatureFlagsGetStatusInputSchema,
	featureFlagsListStatuses: FeatureFlagsListStatusesInputSchema,

	segmentsList: SegmentsListInputSchema,
	segmentsGet: SegmentsGetInputSchema,
	segmentsCreate: SegmentsCreateInputSchema,
	segmentsUpdate: SegmentsUpdateInputSchema,
	segmentsDelete: SegmentsDeleteInputSchema,

	auditLogList: AuditLogListInputSchema,
	auditLogGet: AuditLogGetInputSchema,

	accountMembersList: AccountMembersListInputSchema,
	accountMembersGet: AccountMembersGetInputSchema,
	accountMembersInvite: AccountMembersInviteInputSchema,
	accountMembersUpdate: AccountMembersUpdateInputSchema,
	accountMembersDelete: AccountMembersDeleteInputSchema,

	teamsList: TeamsListInputSchema,
	teamsGet: TeamsGetInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsUpdate: TeamsUpdateInputSchema,
	teamsDelete: TeamsDeleteInputSchema,

	customRolesList: CustomRolesListInputSchema,
	customRolesGet: CustomRolesGetInputSchema,
	customRolesCreate: CustomRolesCreateInputSchema,
	customRolesUpdate: CustomRolesUpdateInputSchema,
	customRolesDelete: CustomRolesDeleteInputSchema,

	contextsSearch: ContextsSearchInputSchema,
	contextsGet: ContextsGetInputSchema,
	contextsListKinds: ContextsListKindsInputSchema,

	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	usersSearch: UsersSearchInputSchema,

	accessTokensList: AccessTokensListInputSchema,
	accessTokensGet: AccessTokensGetInputSchema,
	accessTokensCreate: AccessTokensCreateInputSchema,
	accessTokensDelete: AccessTokensDeleteInputSchema,

	tagsList: TagsListInputSchema,

	rootGet: RootGetInputSchema,
} as const;

export const LaunchDarklyEndpointOutputSchemas = {
	projectsList: ProjectsListOutputSchema,
	projectsGet: ProjectsGetOutputSchema,
	projectsCreate: ProjectsCreateOutputSchema,
	projectsUpdate: ProjectsUpdateOutputSchema,
	projectsDelete: ProjectsDeleteOutputSchema,

	environmentsList: EnvironmentsListOutputSchema,
	environmentsGet: EnvironmentsGetOutputSchema,
	environmentsCreate: EnvironmentsCreateOutputSchema,
	environmentsUpdate: EnvironmentsUpdateOutputSchema,
	environmentsDelete: EnvironmentsDeleteOutputSchema,
	environmentsResetSdkKey: EnvironmentsResetSdkKeyOutputSchema,
	environmentsResetMobileKey: EnvironmentsResetMobileKeyOutputSchema,

	featureFlagsList: FeatureFlagsListOutputSchema,
	featureFlagsGet: FeatureFlagsGetOutputSchema,
	featureFlagsCreate: FeatureFlagsCreateOutputSchema,
	featureFlagsUpdate: FeatureFlagsUpdateOutputSchema,
	featureFlagsDelete: FeatureFlagsDeleteOutputSchema,
	featureFlagsGetStatus: FeatureFlagsGetStatusOutputSchema,
	featureFlagsListStatuses: FeatureFlagsListStatusesOutputSchema,

	segmentsList: SegmentsListOutputSchema,
	segmentsGet: SegmentsGetOutputSchema,
	segmentsCreate: SegmentsCreateOutputSchema,
	segmentsUpdate: SegmentsUpdateOutputSchema,
	segmentsDelete: SegmentsDeleteOutputSchema,

	auditLogList: AuditLogListOutputSchema,
	auditLogGet: AuditLogGetOutputSchema,

	accountMembersList: AccountMembersListOutputSchema,
	accountMembersGet: AccountMembersGetOutputSchema,
	accountMembersInvite: AccountMembersInviteOutputSchema,
	accountMembersUpdate: AccountMembersUpdateOutputSchema,
	accountMembersDelete: AccountMembersDeleteOutputSchema,

	teamsList: TeamsListOutputSchema,
	teamsGet: TeamsGetOutputSchema,
	teamsCreate: TeamsCreateOutputSchema,
	teamsUpdate: TeamsUpdateOutputSchema,
	teamsDelete: TeamsDeleteOutputSchema,

	customRolesList: CustomRolesListOutputSchema,
	customRolesGet: CustomRolesGetOutputSchema,
	customRolesCreate: CustomRolesCreateOutputSchema,
	customRolesUpdate: CustomRolesUpdateOutputSchema,
	customRolesDelete: CustomRolesDeleteOutputSchema,

	contextsSearch: ContextsSearchOutputSchema,
	contextsGet: ContextsGetOutputSchema,
	contextsListKinds: ContextsListKindsOutputSchema,

	usersList: UsersListOutputSchema,
	usersGet: UsersGetOutputSchema,
	usersSearch: UsersSearchOutputSchema,

	accessTokensList: AccessTokensListOutputSchema,
	accessTokensGet: AccessTokensGetOutputSchema,
	accessTokensCreate: AccessTokensCreateOutputSchema,
	accessTokensDelete: AccessTokensDeleteOutputSchema,

	tagsList: TagsListOutputSchema,

	rootGet: RootGetOutputSchema,
} as const;

// Types
export type LaunchDarklyEndpointInputs = {
	[K in keyof typeof LaunchDarklyEndpointInputSchemas]: z.infer<
		(typeof LaunchDarklyEndpointInputSchemas)[K]
	>;
};

export type LaunchDarklyEndpointOutputs = {
	[K in keyof typeof LaunchDarklyEndpointOutputSchemas]: z.infer<
		(typeof LaunchDarklyEndpointOutputSchemas)[K]
	>;
};
