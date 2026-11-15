import { z } from 'zod';
import {
	optBool,
	optNum,
	optStr,
	PaginationSchema,
	paginationInput,
	teamIdInput,
} from './common';

const domain = z.string().min(1).describe('Domain name, e.g. example.com.');
const idOrName = z
	.string()
	.min(1)
	.describe('Project id (prj_…) or project name.');
const projectDomain = z
	.string()
	.min(1)
	.describe('Domain on the project, e.g. www.example.com.');

const redirectStatusCode = z
	.union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)])
	.nullable()
	.optional()
	.describe(
		'HTTP status for the redirect: 301, 302, 307 or 308. null clears it.',
	);

const projectDomainSettings = {
	gitBranch: z
		.string()
		.max(250)
		.nullable()
		.optional()
		.describe(
			'Git branch whose latest preview deployment this domain serves. null clears it.',
		),
	redirect: z
		.string()
		.nullable()
		.optional()
		.describe('Domain to redirect to, e.g. example.com. null clears it.'),
	redirectStatusCode,
};

const stringList = () => z.array(z.string()).nullable().optional();

// Responses: the documented fields, all tolerant of nulls and absence (live
// responses send null for fields the spec marks required, and add fields the
// spec doesn't list), the rest passed through.

/** A domain in the account or team (GET /v5/domains). */
export const DomainSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		boughtAt: optNum(),
		createdAt: optNum(),
		expiresAt: optNum(),
		transferredAt: optNum(),
		transferStartedAt: optNum(),
		creator: z
			.object({
				id: optStr(),
				username: optStr(),
				email: optStr(),
				customerId: optStr(),
				isDomainReseller: optBool(),
			})
			.passthrough()
			.nullable()
			.optional(),
		customNameservers: stringList(),
		intendedNameservers: stringList(),
		nameservers: stringList(),
		echMode: optStr(),
		renew: optBool(),
		serviceType: optStr(),
		suffix: optBool(),
		teamId: optStr(),
		userId: optStr(),
		verified: optBool(),
		cdnEnabled: optBool(),
		zone: optBool(),
	})
	.passthrough();

/** A domain assigned to a project (GET /v9/projects/{idOrName}/domains). */
export const ProjectDomainSchema = z
	.object({
		name: z.string(),
		apexName: optStr(),
		projectId: optStr(),
		redirect: optStr(),
		redirectStatusCode: optNum(),
		gitBranch: optStr(),
		customEnvironmentId: optStr(),
		createdAt: optNum(),
		updatedAt: optNum(),
		verified: optBool(),
		verification: z
			.array(
				z
					.object({
						type: optStr(),
						domain: optStr(),
						value: optStr(),
						reason: optStr(),
					})
					.passthrough(),
			)
			.nullable()
			.optional(),
	})
	.passthrough();

/** How a domain's DNS resolves today (GET /v6/domains/{domain}/config). */
export const DomainConfigSchema = z
	.object({
		misconfigured: z.boolean(),
		configuredBy: optStr(),
		acceptedChallenges: stringList(),
		recommendedCNAME: z
			.array(z.object({ rank: optNum(), value: optStr() }).passthrough())
			.nullable()
			.optional(),
		recommendedIPv4: z
			.array(z.object({ rank: optNum(), value: stringList() }).passthrough())
			.nullable()
			.optional(),
		nameservers: stringList(),
		serviceType: optStr(),
		cnames: stringList(),
		aValues: stringList(),
		conflicts: z.array(z.unknown()).nullable().optional(),
		ipStatus: optStr(),
	})
	.passthrough();

export const VercelDomainsInputSchemas = {
	getDomains: z.object({
		teamId: teamIdInput,
		...paginationInput,
	}),
	getDomain: z.object({
		teamId: teamIdInput,
		domain,
	}),
	getDomainConfig: z.object({
		teamId: teamIdInput,
		domain,
		projectIdOrName: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Project the domain will be used on. Pass it when the domain is not on a project yet.',
			),
		strict: z
			.boolean()
			.optional()
			.describe(
				"true: report only nameservers set on this exact domain. false (default): fall back to the parent zone's nameservers.",
			),
	}),
	addDomain: z.object({
		teamId: teamIdInput,
		name: z
			.string()
			.min(1)
			.describe('Apex domain you already own, e.g. example.com.'),
		cdnEnabled: z
			.boolean()
			.optional()
			.describe('Whether the Vercel CDN is enabled for the domain.'),
		zone: z
			.boolean()
			.optional()
			.describe(
				'Create a Vercel DNS zone for the domain. Set true when its nameservers point at Vercel.',
			),
	}),
	deleteDomain: z.object({
		teamId: teamIdInput,
		domain,
	}),
	getProjectDomains: z.object({
		teamId: teamIdInput,
		idOrName,
		...paginationInput,
		production: z
			.boolean()
			.optional()
			.describe('true: only production domains.'),
		target: z
			.enum(['production', 'preview'])
			.optional()
			.describe('Only domains for this target.'),
		customEnvironmentId: z
			.string()
			.min(1)
			.optional()
			.describe('Only domains of this custom environment.'),
		gitBranch: z
			.string()
			.min(1)
			.optional()
			.describe('Only domains linked to this git branch.'),
		redirects: z
			.boolean()
			.optional()
			.describe('false: leave out domains that redirect. Default true.'),
		redirect: z
			.string()
			.min(1)
			.optional()
			.describe('Only domains that redirect to this domain.'),
		verified: z
			.boolean()
			.optional()
			.describe('Only verified (true) or unverified (false) domains.'),
		order: z
			.enum(['ASC', 'DESC'])
			.optional()
			.describe('Sort by creation time.'),
	}),
	getProjectDomain: z.object({
		teamId: teamIdInput,
		idOrName,
		domain: projectDomain,
	}),
	addProjectDomain: z.object({
		teamId: teamIdInput,
		idOrName,
		name: z
			.string()
			.min(1)
			.describe('Domain to add to the project, e.g. www.example.com.'),
		customEnvironmentId: z
			.string()
			.min(1)
			.optional()
			.describe('Custom environment the domain serves.'),
		...projectDomainSettings,
	}),
	updateProjectDomain: z
		.object({
			teamId: teamIdInput,
			idOrName,
			domain: projectDomain,
			...projectDomainSettings,
		})
		.refine(
			(input) =>
				input.gitBranch !== undefined ||
				input.redirect !== undefined ||
				input.redirectStatusCode !== undefined,
			{ message: 'Pass gitBranch, redirect or redirectStatusCode to change.' },
		),
	removeProjectDomain: z.object({
		teamId: teamIdInput,
		idOrName,
		domain: projectDomain,
		removeRedirects: z
			.boolean()
			.optional()
			.describe(
				"true: also remove this project's domains that redirect to the removed domain.",
			),
	}),
	verifyProjectDomain: z.object({
		teamId: teamIdInput,
		idOrName,
		domain: projectDomain,
	}),
} as const;

export const VercelDomainsOutputSchemas = {
	getDomains: z
		.object({
			domains: z.array(DomainSchema),
			pagination: PaginationSchema.nullable().optional(),
		})
		.passthrough(),
	getDomain: z.object({ domain: DomainSchema }).passthrough(),
	getDomainConfig: DomainConfigSchema,
	addDomain: z.object({ domain: DomainSchema }).passthrough(),
	deleteDomain: z.object({
		deleted: z.boolean(),
		domain: z.string(),
		uid: optStr(),
	}),
	getProjectDomains: z
		.object({
			domains: z.array(ProjectDomainSchema),
			pagination: PaginationSchema.nullable().optional(),
		})
		.passthrough(),
	getProjectDomain: ProjectDomainSchema,
	addProjectDomain: ProjectDomainSchema,
	updateProjectDomain: ProjectDomainSchema,
	removeProjectDomain: z.object({
		removed: z.boolean(),
		idOrName: z.string(),
		domain: z.string(),
	}),
	verifyProjectDomain: ProjectDomainSchema,
} as const;

export type VercelDomainsInputs = {
	[K in keyof typeof VercelDomainsInputSchemas]: z.input<
		(typeof VercelDomainsInputSchemas)[K]
	>;
};
export type VercelDomainsOutputs = {
	[K in keyof typeof VercelDomainsOutputSchemas]: z.infer<
		(typeof VercelDomainsOutputSchemas)[K]
	>;
};
