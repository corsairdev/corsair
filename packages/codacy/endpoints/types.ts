import type { CorsairEndpoint } from 'corsair/core';
import { z } from 'zod';
import type { CodacyContext } from '../index';

/**
 * Codacy API v3 uses numeric IDs for most resources.
 */
const Id = z.number().int().positive().describe('Codacy resource ID');

/**
 * Pagination parameters used by list endpoints.
 */
const PaginationInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page (max 100)'),
	sort: z
		.string()
		.optional()
		.describe('Sort field and order (e.g. "name:asc")'),
});

/**
 * Standard pagination envelope returned by list endpoints.
 */
function PaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		total: z.number().int().nonnegative(),
		page: z.number().int().positive(),
		page_size: z.number().int().positive(),
		pages: z.number().int().nonnegative(),
		data: z.array(itemSchema),
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNT
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyAccountSchema = z
	.object({
		id: Id,
		name: z.string(),
		email: z.string().email(),
		avatar_url: z.string().url().nullable(),
		plan: z.string().nullable(),
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
	})
	// any/unknown: Codacy may return extra fields not in our schema; loose parsing allows forward compatibility
	.loose();

export type CodacyAccount = z.infer<typeof CodacyAccountSchema>;

export const AccountGetInputSchema = z.object({});

export const AccountOutputSchema = PaginatedResponseSchema(CodacyAccountSchema);

/**
 * Single account response (Codacy returns the object directly for GET /account)
 */
export const CodacyAccountResponseSchema = CodacyAccountSchema;

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIZATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyOrganizationSchema = z
	.object({
		id: Id,
		name: z.string(),
		display_name: z.string().nullable(),
		avatar_url: z.string().url().nullable(),
		plan: z.string().nullable(),
		is_premium: z.boolean(),
		provider: z.string().nullable(),
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
	})
	// any/unknown: Codacy may return extra fields not in our schema; loose parsing allows forward compatibility
	.loose();

export type CodacyOrganization = z.infer<typeof CodacyOrganizationSchema>;

export const OrganizationGetInputSchema = z.object({
	organization_id: Id.describe('Organization ID'),
});
export const OrganizationListInputSchema = PaginationInputSchema;

export const OrganizationOutputSchema = PaginatedResponseSchema(
	CodacyOrganizationSchema,
);
export const CodacyOrganizationResponseSchema = CodacyOrganizationSchema;

// ─────────────────────────────────────────────────────────────────────────────
// REPOSITORIES
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyRepositorySchema = z
	.object({
		id: Id,
		name: z.string(),
		display_name: z.string().nullable(),
		description: z.string().nullable(),
		clone_url: z.string().url(),
		ssh_url: z.string().nullable(),
		language: z.string().nullable(),
		is_private: z.boolean(),
		is_archived: z.boolean(),
		is_fork: z.boolean(),
		default_branch: z.string().nullable(),
		last_analysis: z
			.object({
				timestamp: z.string().datetime(),
				commit_sha: z.string(),
				status: z.enum(['SUCCESS', 'FAILURE', 'RUNNING', 'PENDING']),
			})
			.nullable(),
		organization_id: Id,
		organization_name: z.string(),
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
	})
	// any/unknown: Codacy may return extra fields not in our schema; loose parsing allows forward compatibility
	.loose();

export type CodacyRepository = z.infer<typeof CodacyRepositorySchema>;

export const RepositoryGetInputSchema = z.object({
	repository_id: Id.describe('Repository ID'),
});
export const RepositoryListInputSchema = PaginationInputSchema.extend({
	organization_id: Id.optional().describe('Filter by organization'),
	language: z.string().optional().describe('Filter by language'),
	is_private: z.boolean().optional().describe('Filter by visibility'),
});

export const RepositoryOutputSchema = PaginatedResponseSchema(
	CodacyRepositorySchema,
);
export const CodacyRepositoryResponseSchema = CodacyRepositorySchema;

// ─────────────────────────────────────────────────────────────────────────────
// REPOSITORY LANGUAGES
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyLanguageSchema = z
	.object({
		name: z.string(),
		files: z.number().int().nonnegative(),
		lines: z.number().int().nonnegative(),
		bytes: z.number().int().nonnegative(),
		percentage: z.number().min(0).max(100),
	})
	// any/unknown: Codacy may return extra fields not in our schema; loose parsing allows forward compatibility
	.loose();

export type CodacyLanguage = z.infer<typeof CodacyLanguageSchema>;

export const RepositoryLanguagesInputSchema = z.object({
	repository_id: Id.describe('Repository ID'),
});

export const RepositoryLanguagesOutputSchema = z.object({
	languages: z.array(CodacyLanguageSchema),
});

// ─────────────────────────────────────────────────────────────────────────────
// ANALYSIS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyPatternSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable(),
		category: z.enum([
			'Error',
			'Warning',
			'Info',
			'Style',
			'Security',
			'Performance',
		]),
		language: z.string(),
		enabled: z.boolean(),
		parameters: z.record(z.string(), z.unknown()).optional(),
	})
	// any/unknown: Codacy may return extra fields not in our schema; loose parsing allows forward compatibility
	.loose();

export type CodacyPattern = z.infer<typeof CodacyPatternSchema>;

export const CodacyToolSchema = z
	.object({
		name: z.string(),
		version: z.string(),
		language: z.string(),
		patterns: z.array(CodacyPatternSchema),
	})
	// any/unknown: Codacy may return extra fields not in our schema; loose parsing allows forward compatibility
	.loose();

export type CodacyTool = z.infer<typeof CodacyToolSchema>;

export const CodacyAnalysisConfigSchema = z
	.object({
		tools: z.array(CodacyToolSchema),
		patterns: z.array(CodacyPatternSchema),
		excluded_paths: z.array(z.string()).optional(),
		included_paths: z.array(z.string()).optional(),
	})
	// any/unknown: Codacy may return extra fields not in our schema; loose parsing allows forward compatibility
	.loose();

export type CodacyAnalysisConfig = z.infer<typeof CodacyAnalysisConfigSchema>;

export const AnalysisConfigGetInputSchema = z.object({
	repository_id: Id.describe('Repository ID'),
});

export const AnalysisConfigOutputSchema = CodacyAnalysisConfigSchema;

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS & PATTERNS
// ─────────────────────────────────────────────────────────────────────────────

export const ToolListInputSchema = z.object({
	language: z.string().optional().describe('Filter by language'),
});

export const ToolOutputSchema = z.array(CodacyToolSchema);

export const PatternListInputSchema = z.object({
	tool: z.string().optional().describe('Filter by tool name'),
	language: z.string().optional().describe('Filter by language'),
	category: z.string().optional().describe('Filter by category'),
});

export const PatternOutputSchema = z.array(CodacyPatternSchema);

// ─────────────────────────────────────────────────────────────────────────────
// COMMITS & ANALYSES
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyCommitSchema = z
	.object({
		sha: z.string(),
		author: z.string(),
		message: z.string(),
		timestamp: z.string().datetime(),
		branch: z.string().nullable(),
		analysis: z
			.object({
				status: z.enum(['SUCCESS', 'FAILURE', 'RUNNING', 'PENDING']),
				timestamp: z.string().datetime().nullable(),
				issues_count: z.number().int().nonnegative().nullable(),
				issues_diff: z.number().int().nullable(),
			})
			.nullable(),
	})
	// any/unknown: Codacy may return extra fields not in our schema; loose parsing allows forward compatibility
	.loose();

export type CodacyCommit = z.infer<typeof CodacyCommitSchema>;

export const CommitListInputSchema = z
	.object({
		repository_id: Id.describe('Repository ID'),
		branch: z.string().optional().describe('Filter by branch'),
	})
	.merge(PaginationInputSchema);

export const CommitOutputSchema = PaginatedResponseSchema(CodacyCommitSchema);

// ─────────────────────────────────────────────────────────────────────────────
// ISSUES
// ─────────────────────────────────────────────────────────────────────────────

export const CodacyIssueSchema = z
	.object({
		id: z.string(),
		pattern_id: z.string(),
		pattern_name: z.string(),
		category: z.enum([
			'Error',
			'Warning',
			'Info',
			'Style',
			'Security',
			'Performance',
		]),
		level: z.enum(['error', 'warning', 'info']),
		file_path: z.string(),
		line: z.number().int().positive(),
		column: z.number().int().nonnegative().optional(),
		message: z.string(),
		effort: z.number().int().nonnegative().nullable(),
		status: z.enum(['new', 'fixed', 'removed', 'ignored']),
		commit_sha: z.string(),
		tool_name: z.string(),
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
	})
	// any/unknown: Codacy may return extra fields not in our schema; loose parsing allows forward compatibility
	.loose();

export type CodacyIssue = z.infer<typeof CodacyIssueSchema>;

export const IssueListInputSchema = z
	.object({
		repository_id: Id.describe('Repository ID'),
		commit_sha: z.string().optional().describe('Filter by commit'),
		pattern_id: z.string().optional().describe('Filter by pattern'),
		category: z.string().optional().describe('Filter by category'),
		level: z.string().optional().describe('Filter by level'),
		file_path: z.string().optional().describe('Filter by file path'),
		status: z.string().optional().describe('Filter by status'),
	})
	.merge(PaginationInputSchema);

export const IssueOutputSchema = PaginatedResponseSchema(CodacyIssueSchema);

// ─────────────────────────────────────────────────────────────────────────────
// SHARED RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const DeleteSuccess = z.object({
	success: z.literal(true),
	id: Id,
});

export type CodacyDeleteResponse = z.infer<typeof DeleteSuccess>;

export const WebhookEventSchema = z
	.object({
		event: z.string(),
		timestamp: z.string().datetime(),
		// any/unknown: webhook payload varies by event type; Codacy does not document a fixed shape
		payload: z.unknown(),
	})
	.loose();

export type CodacyWebhookEvent = z.infer<typeof WebhookEventSchema>;

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
	commitList: CommitListInputSchema,
	issueList: IssueListInputSchema,
} as const;

export const CodacyEndpointOutputSchemas = {
	accountGet: CodacyAccountResponseSchema,
	organizationList: OrganizationOutputSchema,
	organizationGet: CodacyOrganizationResponseSchema,
	repositoryList: RepositoryOutputSchema,
	repositoryGet: CodacyRepositoryResponseSchema,
	repositoryLanguages: RepositoryLanguagesOutputSchema,
	analysisConfigGet: AnalysisConfigOutputSchema,
	toolList: ToolOutputSchema,
	patternList: PatternOutputSchema,
	commitList: CommitOutputSchema,
	issueList: IssueOutputSchema,
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

/**
 * Endpoint type for Codacy API - maps to CorsairEndpoint with proper context/input/output types.
 */
export type CodacyEndpoint<K extends keyof CodacyEndpointOutputs> =
	CorsairEndpoint<
		CodacyContext,
		CodacyEndpointInputs[K],
		CodacyEndpointOutputs[K]
	>;

/**
 * Endpoint type map - each key maps to a CorsairEndpoint function type.
 * This allows endpoint functions to be typed as CodacyEndpoints['methodName'].
 */
export type CodacyEndpoints = {
	accountGet: CodacyEndpoint<'accountGet'>;
	organizationList: CodacyEndpoint<'organizationList'>;
	organizationGet: CodacyEndpoint<'organizationGet'>;
	repositoryList: CodacyEndpoint<'repositoryList'>;
	repositoryGet: CodacyEndpoint<'repositoryGet'>;
	repositoryLanguages: CodacyEndpoint<'repositoryLanguages'>;
	analysisConfigGet: CodacyEndpoint<'analysisConfigGet'>;
	toolList: CodacyEndpoint<'toolList'>;
	patternList: CodacyEndpoint<'patternList'>;
	commitList: CodacyEndpoint<'commitList'>;
	issueList: CodacyEndpoint<'issueList'>;
};

export { codacyEndpointsNested } from './tree';
