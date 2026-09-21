import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared inputs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Git provider hosting the organization (e.g. gh for GitHub, gl for
 * GitLab, bb for Bitbucket). Kept as a string because Codacy supports
 * additional self-hosted provider identifiers beyond the cloud ones.
 */
export const ProviderSchema = z
	.string()
	.min(1)
	.describe('Git provider (e.g. gh, gl, bb)');

export const OrganizationNameSchema = z
	.string()
	.min(1)
	.describe('Organization name on the Git provider');

export const RepositoryNameSchema = z
	.string()
	.min(1)
	.describe('Repository name on the Git provider');

/**
 * Cursor-based pagination inputs shared by list endpoints.
 * See https://docs.codacy.com/codacy-api/using-the-codacy-api/#using-pagination
 */
export const CursorPaginationInputSchema = z.object({
	cursor: z
		.string()
		.optional()
		.describe('Pagination cursor from a previous response'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Results per page (max 1000, default 100)'),
});

/**
 * Cursor-based pagination envelope returned by list endpoints. The
 * `pagination` object (and its `cursor`) is absent on the last page.
 */
export const PaginationInfoSchema = z.object({
	cursor: z.string().optional(),
	limit: z.number().int().optional(),
	total: z.number().int().optional(),
});

function PaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		data: z.array(itemSchema),
		pagination: PaginationInfoSchema.optional(),
	});
}

function SingleResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		data: itemSchema,
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNT — GET /user
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyUserSchema = z
	.object({
		id: z.number().int(),
		name: z.string().optional(),
		mainEmail: z.string(),
		otherEmails: z.array(z.string()),
		isAdmin: z.boolean(),
		isActive: z.boolean(),
		created: z.string(),
		intercomHash: z.string().optional(),
		zendeskHash: z.string().optional(),
		pylonHash: z.string().optional(),
		shouldDoClientQualification: z.boolean().optional(),
	})
	// any/unknown: Codacy may return extra account fields not modeled
	// here; loose parsing keeps them instead of rejecting the response.
	.loose();

export type CodacyUser = z.infer<typeof CodacyUserSchema>;

export const AccountGetInputSchema = z.object({});

export const AccountGetOutputSchema = SingleResponseSchema(CodacyUserSchema);

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIZATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyOrganizationSchema = z
	.object({
		identifier: z.number().int().optional(),
		remoteIdentifier: z.string(),
		name: z.string(),
		avatar: z.string().optional(),
		created: z.string().optional(),
		provider: z.string(),
		joinMode: z.string().optional(),
		type: z.string().optional(),
		joinStatus: z.string().optional(),
		singleProviderLogin: z.boolean(),
		hasDastAccess: z.boolean(),
		hasScaEnabled: z.boolean(),
		imageSbomEnabled: z.boolean(),
		hasAiInventoryEnabled: z.boolean().optional(),
		hasFalsePositiveAccess: z.boolean().optional(),
		hasSilentFalsePositiveDetection: z.boolean().optional(),
	})
	// any/unknown: Codacy may return extra organization fields not modeled
	// here; loose parsing keeps them instead of rejecting the response.
	.loose();

export type CodacyOrganization = z.infer<typeof CodacyOrganizationSchema>;

/**
 * Organization details with metadata (GET
 * /organizations/{provider}/{remoteOrganizationName}). Modeled with the
 * organization schema: loose parsing preserves the extra metadata fields
 * Codacy returns alongside the organization record.
 */
export const CodacyOrganizationWithMetaSchema = CodacyOrganizationSchema;

export type CodacyOrganizationWithMeta = z.infer<
	typeof CodacyOrganizationWithMetaSchema
>;

export const OrganizationListInputSchema = z
	.object({
		provider: ProviderSchema.optional().describe(
			'Restrict to a single Git provider (e.g. gh). Omit to list across providers.',
		),
	})
	.merge(CursorPaginationInputSchema);

export const OrganizationListOutputSchema = PaginatedResponseSchema(
	CodacyOrganizationSchema,
);

export const OrganizationGetInputSchema = z.object({
	provider: ProviderSchema,
	organization_name: OrganizationNameSchema,
});

export const OrganizationGetOutputSchema = SingleResponseSchema(
	CodacyOrganizationWithMetaSchema,
);

// ─────────────────────────────────────────────────────────────────────────────
// REPOSITORIES
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyRepositorySchema = z
	.object({
		repositoryId: z.number().int().optional(),
		provider: z.string(),
		owner: z.string(),
		name: z.string(),
		fullPath: z.string().optional(),
		visibility: z.string().optional(),
		remoteIdentifier: z.string().optional(),
		lastUpdated: z.string().optional(),
		permission: z.string().optional(),
		languages: z.array(z.string()).optional(),
	})
	// any/unknown: Codacy returns nested objects (default branch, badges,
	// standards, problems, stack) whose shapes vary; loose parsing keeps
	// them instead of rejecting the response.
	.loose();

export type CodacyRepository = z.infer<typeof CodacyRepositorySchema>;

export const RepositoryListInputSchema = z
	.object({
		provider: ProviderSchema,
		organization_name: OrganizationNameSchema,
		search: z.string().optional().describe('Filter repositories by name'),
	})
	.merge(CursorPaginationInputSchema);

export const RepositoryListOutputSchema = PaginatedResponseSchema(
	CodacyRepositorySchema,
);

export const RepositoryGetInputSchema = z.object({
	provider: ProviderSchema,
	organization_name: OrganizationNameSchema,
	repository_name: RepositoryNameSchema,
});

export const RepositoryGetOutputSchema = SingleResponseSchema(
	CodacyRepositorySchema,
);

// ─────────────────────────────────────────────────────────────────────────────
// REPOSITORY LANGUAGES — GET .../settings/languages
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyRepositoryLanguageSchema = z
	.object({
		name: z.string(),
		codacyDefaults: z.array(z.string()),
		extensions: z.array(z.string()),
		defaultFiles: z.array(z.string()),
		enabled: z.boolean(),
		detected: z.boolean(),
	})
	// any/unknown: Codacy may return extra language fields not modeled
	// here; loose parsing keeps them instead of rejecting the response.
	.loose();

export type CodacyRepositoryLanguage = z.infer<
	typeof CodacyRepositoryLanguageSchema
>;

export const RepositoryLanguagesInputSchema = z.object({
	provider: ProviderSchema,
	organization_name: OrganizationNameSchema,
	repository_name: RepositoryNameSchema,
});

export const RepositoryLanguagesOutputSchema = z.object({
	languages: z.array(CodacyRepositoryLanguageSchema),
});

// ─────────────────────────────────────────────────────────────────────────────
// ANALYSIS CONFIGURATION — GET /analysis/.../tools
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyAnalysisToolSchema = z
	.object({
		uuid: z.string(),
		name: z.string(),
		isClientSide: z.boolean(),
		// any/unknown: tool settings are a free-form object whose shape
		// varies per tool; callers narrow it themselves.
		settings: z.unknown().optional(),
	})
	// any/unknown: Codacy may return extra tool-setting fields not modeled
	// here; loose parsing keeps them instead of rejecting the response.
	.loose();

export type CodacyAnalysisTool = z.infer<typeof CodacyAnalysisToolSchema>;

export const AnalysisConfigGetInputSchema = z.object({
	provider: ProviderSchema,
	organization_name: OrganizationNameSchema,
	repository_name: RepositoryNameSchema,
});

export const AnalysisConfigGetOutputSchema = z.object({
	data: z.array(CodacyAnalysisToolSchema),
});

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS — GET /tools
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyToolSchema = z
	.object({
		uuid: z.string(),
		name: z.string(),
		version: z.string().optional(),
		shortName: z.string().optional(),
		documentationUrl: z.string().optional(),
		sourceCodeUrl: z.string().optional(),
		prefix: z.string().optional(),
		needsCompilation: z.boolean().optional(),
		configurationFilenames: z.array(z.string()).optional(),
		description: z.string().optional(),
		dockerImage: z.string().optional(),
		languages: z.array(z.string()).optional(),
	})
	// any/unknown: Codacy may return extra tool fields not modeled here;
	// loose parsing keeps them instead of rejecting the response.
	.loose();

export type CodacyTool = z.infer<typeof CodacyToolSchema>;

export const ToolListInputSchema = CursorPaginationInputSchema;

export const ToolListOutputSchema = PaginatedResponseSchema(CodacyToolSchema);

// ─────────────────────────────────────────────────────────────────────────────
// PATTERNS — GET /tools/{toolUuid}/patterns[/{patternId}]
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyPatternSchema = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		category: z.string(),
		subCategory: z.string().optional(),
		level: z.string(),
		// any/unknown: severity level representation varies across API
		// versions; accepted as-is so new shapes don't break validation.
		severityLevel: z.unknown(),
		description: z.string().optional(),
		explanation: z.string().optional(),
		enabled: z.boolean().optional(),
		languages: z.array(z.string()).optional(),
		timeToFix: z.number().int().optional(),
		// any/unknown: pattern parameters are a free-form object whose
		// shape varies per pattern; callers narrow it themselves.
		parameters: z.unknown().optional(),
		rationale: z.string().optional(),
		solution: z.string().optional(),
		goodExamples: z.array(z.string()).optional(),
		badExamples: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
	})
	// any/unknown: Codacy may return extra pattern fields not modeled
	// here; loose parsing keeps them instead of rejecting the response.
	.loose();

export type CodacyPattern = z.infer<typeof CodacyPatternSchema>;

export const PatternListInputSchema = z
	.object({
		tool_uuid: z.string().min(1).describe('Tool UUID'),
		enabled: z.boolean().optional().describe('Filter by enabled status'),
		search: z.string().optional().describe('Filter patterns by search text'),
	})
	.merge(CursorPaginationInputSchema);

export const PatternListOutputSchema =
	PaginatedResponseSchema(CodacyPatternSchema);

export const PatternGetInputSchema = z.object({
	tool_uuid: z.string().min(1).describe('Tool UUID'),
	pattern_id: z.string().min(1).describe('Pattern ID (unique per tool)'),
});

export const PatternGetOutputSchema = SingleResponseSchema(CodacyPatternSchema);

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT INPUT / OUTPUT MAPS
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	organizationList: OrganizationListInputSchema,
	organizationGet: OrganizationGetInputSchema,
	repositoryList: RepositoryListInputSchema,
	repositoryGet: RepositoryGetInputSchema,
	repositoryLanguages: RepositoryLanguagesInputSchema,
	analysisConfigGet: AnalysisConfigGetInputSchema,
	toolList: ToolListInputSchema,
	patternList: PatternListInputSchema,
	patternGet: PatternGetInputSchema,
} as const;

export const CodacyEndpointOutputSchemas = {
	accountGet: AccountGetOutputSchema,
	organizationList: OrganizationListOutputSchema,
	organizationGet: OrganizationGetOutputSchema,
	repositoryList: RepositoryListOutputSchema,
	repositoryGet: RepositoryGetOutputSchema,
	repositoryLanguages: RepositoryLanguagesOutputSchema,
	analysisConfigGet: AnalysisConfigGetOutputSchema,
	toolList: ToolListOutputSchema,
	patternList: PatternListOutputSchema,
	patternGet: PatternGetOutputSchema,
} as const;

export type CodacyEndpointInputs = {
	[K in keyof typeof CodacyEndpointInputSchemas]: z.infer<
		(typeof CodacyEndpointInputSchemas)[K]
	>;
};

export type CodacyEndpointOutputs = {
	[K in keyof typeof CodacyEndpointOutputSchemas]: z.infer<
		(typeof CodacyEndpointOutputSchemas)[K]
	>;
};
