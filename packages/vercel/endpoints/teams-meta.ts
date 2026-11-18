import type { EndpointMeta } from './common';

export const vercelTeamsMeta = {
	getTeams: {
		riskLevel: 'read',
		description:
			'List the teams the token’s user belongs to, with each team’s id, slug, name and the user’s role.',
	},
	getTeam: {
		riskLevel: 'read',
		description:
			'Get a team by id or slug (default: the connected team): name, slug, plan, creation date and the user’s membership.',
	},
	getTeamMembers: {
		riskLevel: 'read',
		description:
			'List a team’s members (default: the connected team) with their role, username and email. Filter by role or search by name, username or email.',
	},
} as const satisfies Record<string, EndpointMeta>;
