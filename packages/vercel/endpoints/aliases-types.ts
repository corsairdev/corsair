import { z } from 'zod';
import {
	optNum,
	optStr,
	PaginationSchema,
	paginationInput,
	teamIdInput,
} from './common';

const deploymentIdOrUrl = z
	.string()
	.min(1)
	.describe('Deployment id (dpl_…) or deployment hostname.');

// Responses: `uid` identifies an alias; the rest is tolerant of nulls and
// absence (deletedAt, redirect and redirectStatusCode come back null live),
// with new fields passed through. `created` is an ISO date string, `createdAt`
// the same moment in ms.
export const AliasSchema = z
	.object({
		uid: z.string(),
		alias: optStr(),
		created: optStr(),
		createdAt: optNum(),
		updatedAt: optNum(),
		deletedAt: optNum(),
		deploymentId: optStr(),
		projectId: optStr(),
		redirect: optStr(),
		redirectStatusCode: optNum(),
		creator: z
			.object({ uid: optStr(), username: optStr(), email: optStr() })
			.passthrough()
			.nullable()
			.optional(),
		deployment: z
			.object({ id: optStr(), url: optStr() })
			.passthrough()
			.nullable()
			.optional(),
		protectionBypass: z.record(z.string(), z.unknown()).nullable().optional(),
		microfrontends: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.passthrough();

export const VercelAliasesInputSchemas = {
	getAliases: z.object({
		teamId: teamIdInput,
		...paginationInput,
		domain: z
			.union([z.string().min(1), z.array(z.string().min(1)).min(1).max(20)])
			.optional()
			.describe(
				'Only aliases on this domain, or on any of these domains (up to 20).',
			),
		projectId: z
			.string()
			.min(1)
			.optional()
			.describe('Only aliases of this project.'),
		rollbackDeploymentId: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Only the aliases that would move if production rolled back to this deployment.',
			),
	}),
	getAlias: z.object({
		teamId: teamIdInput,
		idOrAlias: z
			.string()
			.min(1)
			.describe('Alias id (uid) or alias hostname, e.g. www.example.com.'),
		projectId: z
			.string()
			.min(1)
			.optional()
			.describe('Return the alias only if it belongs to this project.'),
		since: paginationInput.since,
		until: paginationInput.until,
	}),
	getDeploymentAliases: z.object({
		teamId: teamIdInput,
		deploymentId: z.string().min(1).describe('Deployment id (dpl_…).'),
	}),
	assignAlias: z.object({
		teamId: teamIdInput,
		deploymentId: deploymentIdOrUrl.describe(
			'Deployment to point the alias at: id (dpl_…) or hostname. An alias id or hostname also works and resolves to its current deployment.',
		),
		alias: z
			.string()
			.min(1)
			.describe(
				'Hostname to assign, e.g. www.example.com or my-app.vercel.app. If another deployment holds it, it moves to this one.',
			),
		redirect: z
			.string()
			.min(1)
			.nullable()
			.optional()
			.describe(
				'Hostname to 307-redirect the alias to instead of serving the deployment.',
			),
	}),
	deleteAlias: z.object({
		teamId: teamIdInput,
		aliasId: z
			.string()
			.min(1)
			.describe('Alias id (uid) or alias hostname to remove.'),
	}),
} as const;

export const VercelAliasesOutputSchemas = {
	getAliases: z
		.object({
			aliases: z.array(AliasSchema),
			pagination: PaginationSchema.nullable().optional(),
		})
		.passthrough(),
	getAlias: AliasSchema,
	getDeploymentAliases: z
		.object({ aliases: z.array(AliasSchema) })
		.passthrough(),
	assignAlias: z
		.object({
			uid: z.string(),
			alias: optStr(),
			created: optStr(),
			oldDeploymentId: optStr(),
		})
		.passthrough(),
	deleteAlias: z.object({
		deleted: z.boolean(),
		aliasId: z.string(),
		status: optStr(),
	}),
} as const;

export type VercelAliasesInputs = {
	[K in keyof typeof VercelAliasesInputSchemas]: z.input<
		(typeof VercelAliasesInputSchemas)[K]
	>;
};
export type VercelAliasesOutputs = {
	[K in keyof typeof VercelAliasesOutputSchemas]: z.infer<
		(typeof VercelAliasesOutputSchemas)[K]
	>;
};
