import {
	NeonApiKey,
	NeonBranch,
	NeonComputeEndpoint,
	NeonDatabase,
	NeonOrganization,
	NeonProject,
	NeonRole,
	NeonSnapshot,
} from './database';

export const NeonSchema = {
	version: '1.0.0',
	entities: {
		projects: NeonProject,
		branches: NeonBranch,
		databases: NeonDatabase,
		roles: NeonRole,
		computeEndpoints: NeonComputeEndpoint,
		organizations: NeonOrganization,
		snapshots: NeonSnapshot,
		apiKeys: NeonApiKey,
	},
} as const;
