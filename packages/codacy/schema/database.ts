import { z } from 'zod';

/**
 * Codacy database entities for persistent storage and sync.
 * Only includes resources that are synchronized by the plugin endpoints.
 */

export const CodacyAccount = z
	.object({
		id: z.number().int().positive(),
		name: z.string(),
		email: z.string().email(),
		avatar_url: z.string().url().nullable(),
		plan: z.string().nullable(),
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
	})
	.loose();

export type CodacyAccount = z.infer<typeof CodacyAccount>;

export const CodacyOrganization = z
	.object({
		id: z.number().int().positive(),
		name: z.string(),
		display_name: z.string().nullable(),
		avatar_url: z.string().url().nullable(),
		plan: z.string().nullable(),
		is_premium: z.boolean(),
		provider: z.string().nullable(),
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
	})
	.loose();

export type CodacyOrganization = z.infer<typeof CodacyOrganization>;

export const CodacyRepository = z
	.object({
		id: z.number().int().positive(),
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
		organization_id: z.number().int().positive(),
		organization_name: z.string(),
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
	})
	.loose();

export type CodacyRepository = z.infer<typeof CodacyRepository>;

export const CodacyTool = z
	.object({
		name: z.string(),
		version: z.string(),
		language: z.string(),
		patterns: z.array(
			z.object({
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
			}),
		),
	})
	.loose();

export type CodacyTool = z.infer<typeof CodacyTool>;

export const CodacyCommit = z
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
	.loose();

export type CodacyCommit = z.infer<typeof CodacyCommit>;

export const CodacyIssue = z
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
	.loose();

export type CodacyIssue = z.infer<typeof CodacyIssue>;

export const CodacySchema = {
	accounts: CodacyAccount,
	organizations: CodacyOrganization,
	repositories: CodacyRepository,
	tools: CodacyTool,
	commits: CodacyCommit,
	issues: CodacyIssue,
} as const;

export type CodacySchema = typeof CodacySchema;
