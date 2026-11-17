import type { EndpointMeta } from './common';

export const vercelUserMeta = {
	getUser: {
		riskLevel: 'read',
		description:
			'Get the user the token belongs to: id, username, name, email and default team id.',
	},
} as const satisfies Record<string, EndpointMeta>;
