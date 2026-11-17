import type { EndpointMeta } from './common';

export const vercelAliasesMeta = {
	getAliases: {
		riskLevel: 'read',
		description:
			'List aliases (hostnames pointing at deployments), newest first, filtered by domain or project. Page with until = pagination.next.',
	},
	getAlias: {
		riskLevel: 'read',
		description:
			'Get one alias by id or hostname: the deployment and project it points at, redirect settings and creator.',
	},
	getDeploymentAliases: {
		riskLevel: 'read',
		description:
			'List the aliases (hostnames) currently pointing at a deployment.',
	},
	assignAlias: {
		riskLevel: 'write',
		description:
			'Point a hostname at a deployment. If the hostname already serves another deployment it moves, so live traffic switches; the response names the old deployment so it can be moved back.',
	},
	deleteAlias: {
		riskLevel: 'destructive',
		description:
			'Remove an alias by id or hostname. The hostname stops serving the deployment until it is assigned again, and share links on it are lost.',
	},
} as const satisfies Record<string, EndpointMeta>;
