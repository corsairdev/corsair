import type { EndpointMeta } from './common';

export const vercelDomainsMeta = {
	getDomains: {
		riskLevel: 'read',
		description:
			'List the domains in the account or team (apex domains, not per-project assignments), newest first, 20 per page by default. For the next page pass pagination.next as until.',
	},
	getDomain: {
		riskLevel: 'read',
		description:
			'Get one account domain by name: whether ownership is verified, current and intended nameservers, whether Vercel serves its DNS (serviceType), and purchase/expiry dates when bought through Vercel.',
	},
	getDomainConfig: {
		riskLevel: 'read',
		description:
			"Check whether a domain's DNS points at Vercel: misconfigured, configuredBy (A, CNAME, http or null) and the recommended A and CNAME values to set at the DNS provider. Pass projectIdOrName for a domain not on a project yet.",
	},
	addDomain: {
		riskLevel: 'write',
		description:
			'Add a domain you already own to the account. No purchase or transfer. It may need ownership verification through DNS before it serves; zone: true creates a Vercel DNS zone (use when its nameservers point at Vercel). To serve it from a project, also call addProjectDomain.',
	},
	deleteDomain: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a domain from the account. Also removes its aliases and every DNS record in its Vercel DNS zone; the records cannot be recovered. Does not cancel a registration held at another registrar.',
	},
	getProjectDomains: {
		riskLevel: 'read',
		description:
			'List the domains assigned to a project (custom domains and *.vercel.app) with their redirect, git branch and verification state. Filters: production, target, gitBranch, verified, redirects, redirect, customEnvironmentId.',
	},
	getProjectDomain: {
		riskLevel: 'read',
		description:
			'Get one domain on a project, including the verification challenge (the DNS record to set) when verified is false.',
	},
	addProjectDomain: {
		riskLevel: 'write',
		description:
			'Assign a domain to a project, optionally as a redirect or tied to a git branch or custom environment. If verified comes back false, set the record listed in verification, then call verifyProjectDomain. Errors if the domain is already on the project.',
	},
	updateProjectDomain: {
		riskLevel: 'write',
		description:
			"Change a project domain's git branch or redirect (target domain and status code). Pass null to clear a field.",
	},
	removeProjectDomain: {
		riskLevel: 'destructive',
		description:
			'Unassign a domain from a project; it stops serving that project immediately. The domain stays in the account and can be added back, though it may need verifying again. removeRedirects: true also removes the project domains that redirect to it.',
	},
	verifyProjectDomain: {
		riskLevel: 'write',
		description:
			"Re-check an unverified project domain's verification challenge and mark it verified once the DNS record is in place. Errors if the challenge isn't satisfied yet.",
	},
} as const satisfies Record<string, EndpointMeta>;
