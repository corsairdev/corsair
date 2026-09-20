import {
	BuildkiteAccessToken,
	BuildkiteAgent,
	BuildkiteMeta,
	BuildkiteOrganization,
	BuildkiteUser,
} from './database';

export const BuildkiteSchema = {
	version: '1.0.0',
	entities: {
		accessTokens: BuildkiteAccessToken,
		meta: BuildkiteMeta,
		users: BuildkiteUser,
		organizations: BuildkiteOrganization,
		agents: BuildkiteAgent,
	},
} as const;

export {
	BuildkiteAccessToken,
	BuildkiteAgent,
	BuildkiteAgentCreator,
	BuildkiteAgentJob,
	BuildkiteMeta,
	BuildkiteOrganization,
	BuildkiteUser,
} from './database';
